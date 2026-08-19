export function assertPlannerPolicy(payload) {
  const ticketIds = payload.tickets.map((ticket) => ticket.id);
  const uniqueTicketIds = new Set(ticketIds);

  if (uniqueTicketIds.size !== ticketIds.length) {
    throw new Error("Planner payload: ticket IDs must be unique");
  }
  if (
    new Set(payload.dependency_order).size !== ticketIds.length ||
    ticketIds.some((ticketId) => !payload.dependency_order.includes(ticketId))
  ) {
    throw new Error(
      "Planner payload: dependency_order must contain every ticket exactly once",
    );
  }

  for (const ticket of payload.tickets) {
    for (const dependency of ticket.dependencies) {
      if (!uniqueTicketIds.has(dependency)) {
        throw new Error(
          `Planner payload: ${ticket.id} references unknown dependency ${dependency}`,
        );
      }
      if (dependency === ticket.id) {
        throw new Error(`Planner payload: ${ticket.id} cannot depend on itself`);
      }
      if (
        payload.dependency_order.indexOf(dependency) >
        payload.dependency_order.indexOf(ticket.id)
      ) {
        throw new Error(
          `Planner payload: dependency ${dependency} must precede ${ticket.id}`,
        );
      }
    }
  }
}
