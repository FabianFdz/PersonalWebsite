# EPIC-004 — Deterministic, resumable agentic control plane

## Objective

Complete the control plane's integrity boundary so every ingested handoff proves the exact artifact bytes it claims, prior attempts remain tamper-evident, and an interrupted sprint can resume exclusively from trustworthy repository evidence.

## Current state

### Done

- Versioned JSON Schemas validate status, approvals, epic lifecycle, agent memory, envelopes, and every role payload with unknown fields rejected.
- Semantic policies enforce ticket dependency rules, Reviewer evidence, role-specific approval gates, and the rule that agents cannot decide human approvals.
- `harness/status.json` persists run, round, ticket, phase, attempts, errors, approvals, and the last validated checkpoint through atomic writes.
- CLI commands cover sprint selection, initialization, validation, ingest, status, next action, approval decisions, and resume.
- Workflow tests cover human gates, rejected approvals, scope-change escalation, role/ticket mismatches, dependency-aware ticket selection, sprint recovery, and invalid status persistence.
- Handoff artifact entries already require a repository path, artifact kind, and a syntactically valid 64-character SHA-256 value.

### Remaining

- Recompute each declared artifact's SHA-256 from its real bytes and reject mismatches; the current validator checks only the checksum's format.
- Provide deterministic tooling that generates and updates checksum fields, manifests, and preserved evidence from filesystem bytes so agents never author derived integrity data manually.
- Reject missing, unreadable, non-file, duplicate, self-referential, repository-escaping, and symlink-escaping artifact paths with actionable errors.
- Anchor the ingested handoff itself with durable integrity evidence so later edits to accepted run evidence are detected during full validation and resume.
- Preserve every retry as distinct evidence and prevent a later attempt from overwriting or reusing a prior attempt's artifact identity.
- Keep historical evidence valid when a later approved role legitimately changes a live product file; integrity must describe the accepted version, not assume the working-tree path never changes.
- Replace placeholder example checksums with verifiable fixtures, or explicitly separate schema-only examples from live integrity verification.

## Scope for this sprint

- Artifact path and content-integrity validation at both explicit handoff validation and ingest.
- Deterministic creation, canonical serialization, atomic editing, and byte-level comparison of all checksum-derived evidence.
- Durable, tamper-evident records for accepted handoffs and attempt-specific evidence.
- Repository-wide validation of evidence referenced by the active or completed run.
- Deterministic tests for valid artifacts, tampering, unsafe paths, retries, interruption, and legitimate later product changes.
- Documentation of the integrity model and recovery behavior.

## Deterministic integrity rule

- Executable repository code must generate, edit, canonicalize, and compare checksums, manifests, snapshots, and other derived integrity evidence from real bytes.
- Agents may select inputs and invoke the deterministic operation, but must not invent hashes, transcribe them manually, infer equality from text or visual inspection, or declare a comparison successful from model reasoning.
- The same ordered inputs and bytes must produce byte-identical evidence on repeated runs. Canonical ordering, encoding, and line endings must be defined wherever the harness writes integrity data.
- If deterministic tooling is unavailable, ambiguous, or fails, the workflow stops with an actionable error; it never falls back to an agent-authored or visual comparison.

## Acceptance criteria

1. Repository tooling can populate or update a handoff's checksum-derived fields from the referenced files without an agent calculating or transcribing any hash.
2. Given identical ordered inputs and file bytes, repeated generation or editing produces byte-identical canonical integrity evidence; a one-byte artifact change produces a deterministic mismatch.
3. A live handoff passes validation only when every declared artifact resolves to an allowed regular file and its tool-computed SHA-256 exactly matches the declared value. Agent reasoning, textual inspection, and visual comparison are never accepted as evidence.
4. Missing or unreadable artifacts, directories, duplicate paths, the handoff referencing itself, paths outside the repository, and symlinks escaping the repository fail with an error that identifies the artifact and reason.
5. `ingest` performs integrity validation again immediately before changing state; a handoff or artifact changed after a prior standalone validation cannot advance the workflow.
6. Successful ingest stores durable integrity evidence for the handoff and its accepted artifact versions. A later `harness:validate` or resume detects modification or replacement of that accepted evidence.
7. Each retry produces distinct attempt evidence. Reusing a prior evidence path or overwriting an accepted attempt is rejected, while all earlier attempts remain inspectable.
8. A later approved role may legitimately change a live product file without invalidating the preserved evidence for the earlier accepted version.
9. Any integrity-tool or comparison failure leaves `harness/status.json` and the epic lifecycle unchanged, reports a deterministic recovery action, and cannot fall back to agent-authored evidence.
10. Example handoffs either reference real deterministic fixtures with correct hashes or are explicitly validated in a schema-only mode that cannot be mistaken for live ingest evidence.
11. Automated tests cover repeatability, canonical output, one-byte mutations, the happy path, and every failure boundary above, while all existing workflow, gate, resume, lint, and production-build checks continue to pass.

## Edge cases and failure boundaries

- Hash comparison is byte-for-byte; line-ending or encoding changes count as a different artifact.
- A visually identical rendering or text representation is not proof of byte equality.
- Generated evidence uses a stable ordering and canonical serialization rather than object or filesystem iteration order.
- Repository containment must use resolved filesystem paths, not string-prefix comparison.
- Validation must not follow a symlink to evidence outside the repository trust boundary.
- A crash between integrity verification and state persistence must resume without treating partial evidence as accepted.
- Integrity validation does not authorize an agent to approve a gate, merge, deploy, or modify another role's handoff.

## Non-goals

- Calling paid model APIs from the scaffold.
- Autonomous production deployment or merging.
- Signing artifacts with an external key-management or transparency service.
- Preventing an authorized repository owner from intentionally rewriting Git history.

## Dependencies

None.
