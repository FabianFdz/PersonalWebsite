export const roleByPhase = {
  planning: "planner",
  architecture: "architect",
  implementation: "coder",
  review: "reviewer",
  documentation: "documentation-specialist",
};

const gateLabels = {
  plan_approval: "PLAN",
  architecture_approval: "ARCHITECTURE",
  scope_change_approval: "SCOPE",
  merge_approval: "MERGE",
};

const emptyStage = () => ({ status: "not_started", attempts: 0, artifact: null });

export function createInitialStatus({ projectId, epicId, runId, timestamp }) {
  return {
    schema_version: "1.0",
    project_id: projectId,
    run_id: runId,
    epic_id: epicId,
    state: "running",
    phase: "planning",
    current_round: "ROUND-001",
    current_ticket: null,
    rounds: [{ round_id: "ROUND-001", status: "in_progress", tickets: [] }],
    checkpoint: {
      resume_from: "Run the Planner using harness/adapters/<provider>/planner.md",
      last_validated_artifact: null,
      last_completed_phase: null,
      saved_at: timestamp,
    },
    approvals: [],
    errors: [],
    updated_at: timestamp,
  };
}

export function activeRound(status) {
  const round = status.rounds.find(
    (candidate) => candidate.round_id === status.current_round,
  );
  if (!round) {
    throw new Error(`No active round ${status.current_round}`);
  }
  return round;
}

export function activeTicket(status) {
  const ticket = activeRound(status).tickets.find(
    (candidate) => candidate.ticket_id === status.current_ticket,
  );
  if (!ticket) {
    throw new Error(`No active ticket ${status.current_ticket}`);
  }
  return ticket;
}

export function markStage(status, stageName, stageStatus, artifact) {
  const stage = activeTicket(status)[stageName];
  Object.assign(stage, {
    status: stageStatus,
    attempts: stage.attempts + 1,
    artifact,
  });
}

function approvalId(status, gate) {
  const subject = status.current_ticket ?? status.epic_id;
  const sequence = String(status.approvals.length + 1).padStart(3, "0");
  return `APPROVAL-${gateLabels[gate]}-${subject}-${sequence}`;
}

export function requestApproval(status, gate, question, timestamp) {
  const approval = {
    id: approvalId(status, gate),
    gate,
    status: "pending",
    question,
    requested_at: timestamp,
    decided_at: null,
    decided_by: null,
    decision_note: null,
  };

  status.approvals.push(approval);
  status.phase = gate;
  status.state = "waiting_for_human";
  status.checkpoint.resume_from = `Human must approve or reject ${approval.id}`;
}

export function createPlannedTicket(ticket, artifact) {
  return {
    ticket_id: ticket.id,
    dependencies: ticket.dependencies,
    planning: { status: "passed", attempts: 1, artifact },
    architecture: emptyStage(),
    implementation: emptyStage(),
    review: emptyStage(),
    tests: emptyStage(),
    documentation: emptyStage(),
    merge: emptyStage(),
  };
}

export function nextRunnableTicket(status) {
  const tickets = status.rounds.flatMap((round) => round.tickets);
  return tickets.find(
    (ticket) =>
      ticket.merge.status !== "passed" &&
      ticket.dependencies.every(
        (dependency) =>
          tickets.find((candidate) => candidate.ticket_id === dependency)?.merge
            .status === "passed",
      ),
  );
}
