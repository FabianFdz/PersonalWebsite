export function presentStatus(status) {
  return JSON.stringify(
    {
      run_id: status.run_id,
      epic_id: status.epic_id,
      state: status.state,
      phase: status.phase,
      ticket: status.current_ticket,
      next: status.checkpoint.resume_from,
    },
    null,
    2,
  );
}

export function presentValidation(summary) {
  return `Harness valid: ${summary.schemas} schemas, ${summary.memories} memories, ${summary.examples} examples.`;
}
