import assert from "node:assert/strict";
import test from "node:test";
import {
  applyAgentOutput,
  createInitialStatus,
  decideApproval,
} from "../scripts/harness/workflow.mjs";

const timestamp = "2026-08-19T00:00:00.000Z";

function initialStatus() {
  return createInitialStatus({
    projectId: "test-project",
    epicId: "EPIC-001",
    runId: "RUN-TEST",
    timestamp,
  });
}

function output(role, payload, ticketId = "TICKET-001", status = "success") {
  return {
    run_id: "RUN-TEST",
    round_id: "ROUND-001",
    ticket_id: role === "planner" ? null : ticketId,
    role,
    status,
    payload,
  };
}

function plannedStatus() {
  return applyAgentOutput(
    initialStatus(),
    output("planner", {
      tickets: [{ id: "TICKET-001", dependencies: [] }],
      dependency_order: ["TICKET-001"],
    }),
    "planner.output.json",
    timestamp,
  );
}

function approveLatest(status, note = "Approved") {
  return decideApproval(status, {
    decision: "approve",
    approvalId: status.approvals.at(-1).id,
    decidedBy: "Human",
    note,
    timestamp,
  });
}

function implementationReadyStatus() {
  let status = approveLatest(plannedStatus());
  status = applyAgentOutput(
    status,
    output("architect", {}),
    "architect.output.json",
    timestamp,
  );
  return approveLatest(status);
}

test("workflow advances through human gates and returns review changes to Coder", () => {
  let status = plannedStatus();
  assert.equal(status.state, "waiting_for_human");
  assert.equal(status.phase, "plan_approval");

  status = approveLatest(status);
  assert.equal(status.phase, "architecture");

  status = applyAgentOutput(
    status,
    output("architect", {}),
    "architect.output.json",
    timestamp,
  );
  status = approveLatest(status);
  assert.equal(status.phase, "implementation");

  status = applyAgentOutput(
    status,
    output("coder", { checks: [{ result: "passed" }] }),
    "coder.output.json",
    timestamp,
  );
  assert.equal(status.phase, "review");

  status = applyAgentOutput(
    status,
    output("reviewer", { verdict: "changes_requested" }),
    "reviewer.output.json",
    timestamp,
  );
  assert.equal(status.phase, "implementation");
  assert.match(status.checkpoint.resume_from, /Return findings to Coder/);
});

test("rejected approvals leave no pending decision and return to a resolvable phase", () => {
  const waitingStatus = plannedStatus();
  const rejectedStatus = decideApproval(waitingStatus, {
    decision: "reject",
    approvalId: waitingStatus.approvals.at(-1).id,
    decidedBy: "Human",
    note: "Split the first ticket",
    timestamp,
  });

  assert.equal(rejectedStatus.state, "blocked");
  assert.equal(rejectedStatus.phase, "planning");
  assert.equal(
    rejectedStatus.approvals.filter((approval) => approval.status === "pending").length,
    0,
  );
});

test("workflow rejects outputs for another ticket", () => {
  const status = approveLatest(plannedStatus());

  assert.throws(
    () => applyAgentOutput(
      status,
      output("architect", {}, "TICKET-999"),
      "architect.output.json",
      timestamp,
    ),
    /does not match/,
  );
});

test("Coder scope changes stop at a dedicated human gate", () => {
  const status = applyAgentOutput(
    implementationReadyStatus(),
    output(
      "coder",
      {
        scope_change_request: {
          question: "Approve a required scope change?",
        },
      },
      "TICKET-001",
      "needs_human",
    ),
    "coder.output.json",
    timestamp,
  );

  assert.equal(status.state, "waiting_for_human");
  assert.equal(status.phase, "scope_change_approval");
  assert.equal(status.approvals.at(-1).gate, "scope_change_approval");
  assert.equal(
    status.rounds[0].tickets[0].implementation.status,
    "not_started",
  );
});
