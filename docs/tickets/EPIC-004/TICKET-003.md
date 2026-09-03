# TICKET-003 — Preserve tamper-evident accepted evidence

## User value

A validated handoff remains independently auditable even after later work changes the live product files it originally referenced.

## Description

Preserve durable integrity evidence for each successfully ingested handoff and the exact accepted versions of its artifacts, and include that evidence in full validation and resume trust checks.

## Dependencies

- TICKET-002

## Acceptance criteria

1. Successful ingest durably records integrity evidence for the ingested handoff and the exact artifact bytes verified immediately before the state transition.
2. Repeated preservation of the same ordered inputs and bytes produces byte-identical canonical evidence.
3. A later full `harness:validate` or sprint resume detects modification, replacement, absence, or corruption of accepted handoff evidence and identifies the affected record.
4. A later validated role can legitimately modify a live product file without invalidating the preserved evidence for its earlier accepted version.
5. Partial or failed evidence persistence is never treated as accepted and leaves the last trustworthy checkpoint and epic lifecycle unchanged.
6. Automated tests cover successful preservation, tampering and replacement, missing evidence, later legitimate live-file changes, and interrupted persistence.

## Validation notes

- Verify preserved bytes independently of the current working-tree version of the source artifact.
- Simulate interruption before acceptance and confirm resume returns to the prior trustworthy checkpoint.
- Run targeted validation, status, and resume tests, then `pnpm run harness:validate`, `pnpm test`, and `pnpm run lint`.

## Estimated complexity

Large.
