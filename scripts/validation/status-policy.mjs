export function assertStatusPolicy(status) {
  const isApprovalPhase = status.phase.endsWith("_approval");
  const pendingApprovals = status.approvals.filter(
    (approval) => approval.status === "pending",
  );

  if (isApprovalPhase && status.state !== "waiting_for_human") {
    throw new Error(
      "Status: approval phases require waiting_for_human state",
    );
  }
  if (status.state === "waiting_for_human" && pendingApprovals.length !== 1) {
    throw new Error(
      "Status: waiting_for_human requires exactly one pending approval",
    );
  }
  if (status.state !== "waiting_for_human" && pendingApprovals.length > 0) {
    throw new Error(
      "Status: pending approvals require waiting_for_human state",
    );
  }

  const tickets = status.rounds.flatMap((round) => round.tickets);
  if (
    status.current_ticket &&
    !tickets.some((ticket) => ticket.ticket_id === status.current_ticket)
  ) {
    throw new Error("Status: current_ticket must exist in rounds");
  }
  if (
    status.current_round &&
    !status.rounds.some((round) => round.round_id === status.current_round)
  ) {
    throw new Error("Status: current_round must exist in rounds");
  }
}
