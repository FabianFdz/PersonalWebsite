# TICKET-005 — Align fixtures and operating guidance with the integrity boundary

## User value

Harness contributors can safely distinguish illustrative schemas from ingestible evidence and follow documented validation, tamper detection, and recovery procedures.

## Description

Bring example handoffs, end-to-end regression coverage, and operator documentation into agreement with the completed integrity model without weakening automatic workflow validation.

## Dependencies

- TICKET-001
- TICKET-002
- TICKET-003
- TICKET-004

## Acceptance criteria

1. Every example handoff either references real deterministic fixtures with verified checksums or is explicitly processed in a schema-only mode that cannot be mistaken for or used as live ingest evidence.
2. Documentation explains the repository trust boundary, byte-level comparison, canonical evidence, accepted-version preservation, attempt identity, tamper failures, and deterministic recovery actions.
3. Documentation never presents textual or visual comparison, agent-authored hashes, merge, or deployment as an integrity substitute.
4. End-to-end automated coverage exercises repeatability, one-byte mutations, safe-path failures, revalidation at ingest, accepted-evidence tampering, retries, interruption, and legitimate later live-file changes.
5. All existing workflow, resume, validation, lint, and production-build checks continue to pass.

## Validation notes

- Prove schema-only examples are rejected from live ingest or cannot enter that path.
- Follow each documented recovery action against a corresponding automated scenario.
- Run `pnpm run harness:validate`, `pnpm test`, `pnpm run lint`, and `pnpm run build`.

## Estimated complexity

Medium.
