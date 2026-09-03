# TICKET-004 — Preserve distinct retry evidence and deterministic recovery

## User value

Operators can inspect every delivery attempt and resume an interrupted retry without losing, overwriting, or confusing prior evidence.

## Description

Make evidence identity attempt-specific, immutable after acceptance, and recoverable across interruptions while retaining every earlier attempt as inspectable history.

## Dependencies

- TICKET-003

## Acceptance criteria

1. Every retry creates evidence with an identity distinct from all prior attempts for that role, round, and ticket.
2. Reusing a prior evidence path or overwriting accepted attempt evidence is rejected before workflow state or epic lifecycle changes.
3. Evidence from every earlier attempt remains inspectable and integrity-verifiable after a later retry succeeds.
4. An interruption at any evidence-generation, verification, or persistence boundary resumes without accepting partial evidence, duplicating an accepted transition, or losing the last trustworthy checkpoint.
5. Repeating recovery from the same repository state produces the same next action and actionable error information.
6. Automated tests cover multiple retries, identity collisions, overwrite attempts, preservation of failed and successful attempts, repeated recovery, and interruptions at each durable boundary.

## Validation notes

- Exercise at least two attempts for the same role/ticket and verify distinct, preserved evidence.
- Interrupt each durable boundary and invoke sprint resume repeatedly to prove idempotent recovery.
- Run targeted workflow and status tests, then `pnpm run harness:validate`, `pnpm test`, and `pnpm run lint`.

## Estimated complexity

Large.
