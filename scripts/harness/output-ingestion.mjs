import {
  activeRound,
  createPlannedTicket,
  markStage,
  requestApproval,
  roleByPhase,
} from "./workflow-state.mjs";

function assertIngestContext(status, output) {
  if (output.run_id !== status.run_id || output.round_id !== status.current_round) {
    throw new Error("Output run_id or round_id does not match active status");
  }
  const expectedRole = roleByPhase[status.phase];
  if (output.role !== expectedRole) {
    throw new Error(
      `Phase ${status.phase} requires ${expectedRole}, received ${output.role}`,
    );
  }
  if (!["success", "needs_human"].includes(output.status)) {
    throw new Error(`Cannot ingest output with status ${output.status}`);
  }
  if (output.role !== "planner" && output.ticket_id !== status.current_ticket) {
    throw new Error(
      `Output ticket_id ${output.ticket_id} does not match ${status.current_ticket}`,
    );
  }
}

function ingestPlanner(status, output, artifact, timestamp) {
  activeRound(status).tickets = output.payload.tickets.map((ticket) =>
    createPlannedTicket(ticket, artifact),
  );
  status.current_ticket = output.payload.dependency_order[0];
  requestApproval(
    status,
    "plan_approval",
    `Approve the ticket plan for ${status.epic_id}?`,
    timestamp,
  );
}

function ingestArchitect(status, _output, artifact, timestamp) {
  markStage(status, "architecture", "passed", artifact);
  requestApproval(
    status,
    "architecture_approval",
    `Approve architecture for ${status.current_ticket}?`,
    timestamp,
  );
}

function ingestCoder(status, output, artifact, timestamp) {
  if (output.status === "needs_human") {
    const scopeChangeRequest = output.payload.scope_change_request;
    if (!scopeChangeRequest) {
      throw new Error(
        "Coder needs_human output requires a scope_change_request",
      );
    }
    requestApproval(
      status,
      "scope_change_approval",
      scopeChangeRequest.question,
      timestamp,
    );
    return;
  }

  const checksPassed = output.payload.checks.every(
    (check) => check.result === "passed",
  );
  if (!checksPassed) {
    throw new Error("Coder checks must all pass before review");
  }

  markStage(status, "implementation", "passed", artifact);
  markStage(status, "tests", "passed", artifact);
  status.phase = "review";
  status.state = "running";
  status.checkpoint.resume_from = `Run Reviewer for ${status.current_ticket}`;
}

function ingestReviewer(status, output, artifact) {
  const approved = output.payload.verdict === "approved";
  markStage(status, "review", approved ? "passed" : "failed", artifact);
  status.phase = approved ? "documentation" : "implementation";
  status.state = "running";
  status.checkpoint.resume_from = approved
    ? `Run Documentation Specialist for ${status.current_ticket}`
    : `Return findings to Coder for ${status.current_ticket}`;
}

function ingestDocumentation(status, _output, artifact, timestamp) {
  markStage(status, "documentation", "passed", artifact);
  requestApproval(
    status,
    "merge_approval",
    `Approve completion of ${status.current_ticket}?`,
    timestamp,
  );
}

const ingestorsByRole = {
  planner: ingestPlanner,
  architect: ingestArchitect,
  coder: ingestCoder,
  reviewer: ingestReviewer,
  "documentation-specialist": ingestDocumentation,
};

export function applyAgentOutput(currentStatus, output, artifact, timestamp) {
  assertIngestContext(currentStatus, output);
  const status = structuredClone(currentStatus);

  status.checkpoint.last_validated_artifact = artifact;
  status.checkpoint.last_completed_phase = status.phase;
  ingestorsByRole[output.role](status, output, artifact, timestamp);

  return status;
}
