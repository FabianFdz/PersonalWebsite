# ADR-0002 — File-backed resumable state machine

- Status: Accepted
- Date: 2026-08-19

## Context

Runs may be interrupted between roles or while awaiting human input. Chat history alone is not a reliable checkpoint.

## Decision

Persist one validated `harness/status.json` with granular stages per ticket, retry/error records, and a resume checkpoint. Successful validated handoffs advance directly to the next role. Run outputs remain immutable evidence under `harness/runs/`.

## Alternatives

- Chat-history recovery: incomplete and provider-specific.
- Database-backed orchestration: unnecessary infrastructure for a repository scaffold.

## Consequences

The repository is self-contained and easy to inspect. Concurrent writers are out of scope; one orchestrator owns state mutations at a time.

## Verification

A new process can run `pnpm run harness resume` and receive the next safe action without previous conversation context.
