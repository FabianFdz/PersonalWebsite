import {
  activeRound,
  createPlannedTicket,
  markStage,
  nextRunnableTicket,
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
  if (output.status !== "success") {
    throw new Error(`Cannot ingest output with status ${output.status}`);
  }
  if (output.role !== "planner" && output.ticket_id !== status.current_ticket) {
    throw new Error(
      `Output ticket_id ${output.ticket_id} does not match ${status.current_ticket}`,
    );
  }
}

function ingestPlanner(status, output, artifact) {
  activeRound(status).tickets = output.payload.tickets.map((ticket) =>
    createPlannedTicket(ticket, artifact),
  );
  status.current_ticket = output.payload.dependency_order[0];
  status.phase = "architecture";
  status.state = "running";
  status.checkpoint.resume_from = `Run Architect for ${status.current_ticket}`;
}

function ingestArchitect(status, _output, artifact) {
  markStage(status, "architecture", "passed", artifact);
  status.phase = "implementation";
  status.state = "running";
  status.checkpoint.resume_from = `Run Coder for ${status.current_ticket}`;
}

function ingestCoder(status, output, artifact) {
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

function ingestDocumentation(status, _output, artifact) {
  markStage(status, "documentation", "passed", artifact);
  markStage(
    status,
    "merge",
    "passed",
    artifact,
  );
  const nextTicket = nextRunnableTicket(status);

  if (nextTicket) {
    status.current_ticket = nextTicket.ticket_id;
    status.phase = "architecture";
    status.state = "running";
    status.checkpoint.resume_from = `Run Architect for ${status.current_ticket}`;
    return;
  }

  status.current_ticket = null;
  status.state = "complete";
  status.phase = "complete";
  activeRound(status).status = "complete";
  status.checkpoint.resume_from = "Run complete";
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
