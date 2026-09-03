export function assertStatusPolicy(status) {
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
