import assert from "node:assert/strict";
import test from "node:test";
import {
  applyAgentOutput,
  createInitialStatus,
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

function plannedStatus(tickets = [{ id: "TICKET-001", dependencies: [] }]) {
  return applyAgentOutput(
    initialStatus(),
    output("planner", {
      tickets,
      dependency_order: tickets.map((ticket) => ticket.id),
    }),
    "planner.output.json",
    timestamp,
  );
}

function implementationReadyStatus() {
  return applyAgentOutput(
    plannedStatus(),
    output("architect", {}),
    "architect.output.json",
    timestamp,
  );
}

function documentationReadyStatus(status = implementationReadyStatus()) {
  const reviewedStatus = applyAgentOutput(
    status,
    output("coder", { checks: [{ result: "passed" }] }),
    "coder.output.json",
    timestamp,
  );
  return applyAgentOutput(
    reviewedStatus,
    output("reviewer", { verdict: "approved" }),
    "reviewer.output.json",
    timestamp,
  );
}

test("workflow advances automatically and returns review changes to Coder", () => {
  let status = plannedStatus();
  assert.equal(status.state, "running");
  assert.equal(status.phase, "architecture");

  status = applyAgentOutput(
    status,
    output("architect", {}),
    "architect.output.json",
    timestamp,
  );
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

test("successful documentation completes a one-ticket run", () => {
  const status = applyAgentOutput(
    documentationReadyStatus(),
    output("documentation-specialist", {}),
    "documentation-specialist.output.json",
    timestamp,
  );

  assert.equal(status.state, "complete");
  assert.equal(status.phase, "complete");
  assert.equal(status.current_ticket, null);
  assert.equal(status.rounds[0].status, "complete");
  assert.equal(status.rounds[0].tickets[0].merge.status, "passed");
});

test("successful documentation selects the next dependency-ready ticket", () => {
  const planned = plannedStatus([
    { id: "TICKET-001", dependencies: [] },
    { id: "TICKET-002", dependencies: ["TICKET-001"] },
  ]);
  const architecture = applyAgentOutput(
    planned,
    output("architect", {}),
    "architect.output.json",
    timestamp,
  );
  const status = applyAgentOutput(
    documentationReadyStatus(architecture),
    output("documentation-specialist", {}),
    "documentation-specialist.output.json",
    timestamp,
  );

  assert.equal(status.state, "running");
  assert.equal(status.phase, "architecture");
  assert.equal(status.current_ticket, "TICKET-002");
  assert.equal(status.rounds[0].tickets[0].merge.status, "passed");
});

test("workflow rejects outputs for another ticket", () => {
  assert.throws(
    () => applyAgentOutput(
      plannedStatus(),
      output("architect", {}, "TICKET-999"),
      "architect.output.json",
      timestamp,
    ),
    /does not match/,
  );
});

test("blocked role output cannot advance workflow state", () => {
  const status = implementationReadyStatus();

  assert.throws(
    () => applyAgentOutput(
      status,
      output("coder", {}, "TICKET-001", "blocked"),
      "coder.output.json",
      timestamp,
    ),
    /Cannot ingest output with status blocked/,
  );
  assert.equal(status.phase, "implementation");
  assert.equal(status.rounds[0].tickets[0].implementation.status, "not_started");
});
