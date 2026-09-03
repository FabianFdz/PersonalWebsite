export const roleByPhase = {
  planning: "planner",
  architecture: "architect",
  implementation: "coder",
  review: "reviewer",
  documentation: "documentation-specialist",
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
