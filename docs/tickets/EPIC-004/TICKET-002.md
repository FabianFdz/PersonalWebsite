# TICKET-002 — Enforce live artifact integrity and safe paths

## User value

Operators can trust that validation and ingest accept only the exact repository files declared by a handoff and reject unsafe or stale evidence before workflow state changes.

## Description

Apply byte-level artifact verification and repository-containment rules during explicit handoff validation and again immediately before ingest changes durable workflow state.

## Dependencies

- TICKET-001

## Acceptance criteria

1. A live handoff passes only when every declared artifact resolves inside the repository to an allowed, readable regular file and its tool-computed SHA-256 equals the declared value byte-for-byte.
2. Missing or unreadable artifacts, directories, duplicate artifact paths, the handoff referencing itself, repository-escaping paths, and symlinks escaping the repository are rejected with an error that identifies the artifact and reason.
3. Repository containment is decided from resolved filesystem locations rather than path-string prefixes.
4. Encoding or line-ending changes are treated as byte changes even when rendered content appears equivalent.
5. Ingest repeats integrity verification immediately before persistence; an artifact or handoff changed after standalone validation cannot advance the run or epic lifecycle.
6. Any verification or comparison failure leaves `harness/status.json` and `harness/epic-status.json` unchanged and reports a deterministic recovery action.
7. Automated tests cover the valid path, one-byte mutation, every rejected path class, mutation between validation and ingest, and unchanged-state guarantees.

## Validation notes

- Use filesystem fixtures for regular files, directories, missing paths, duplicates, traversal, and internal and escaping symlinks.
- Capture control-plane files before each failing ingest and compare their bytes afterward.
- Run targeted validation and workflow tests, then `pnpm run harness:validate`, `pnpm test`, and `pnpm run lint`.

## Estimated complexity

Large.
