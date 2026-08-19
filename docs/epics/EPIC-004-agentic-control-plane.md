# EPIC-004 — Deterministic, resumable agentic control plane

## Outcome

An interrupted delivery round resumes from its last validated checkpoint, and no agent can advance the workflow with malformed output.

## Scope

- Versioned JSON Schemas for state, approvals, memory, envelopes, and all role payloads.
- Status with per-ticket planning, architecture, implementation, review, test, documentation, and merge stages.
- CLI commands for initialization, validation, status, next action, approvals, and resume.
- Immutable run artifacts with checksums.

## Acceptance criteria

1. Every example and live control-plane JSON file validates deterministically.
2. Invalid or additional fields cause validation failure with a useful path.
3. State records the active run, round, ticket, phase, attempts, approvals, errors, and resume checkpoint.
4. Agents cannot grant human approvals.
5. A fresh process can determine the exact next action from files in the repository alone.

## Non-goals

- Calling paid model APIs from the scaffold.
- Autonomous production deployment or merging.

## Dependencies

None.
