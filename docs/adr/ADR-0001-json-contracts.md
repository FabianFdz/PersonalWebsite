# ADR-0001 — JSON as the control-plane contract

- Status: Accepted
- Date: 2026-08-19

## Context

Free-form agent handoffs are ambiguous and cannot deterministically prove that required fields or allowed values are present.

## Decision

All machine-to-machine handoffs use a versioned JSON envelope plus a role-specific payload validated with JSON Schema Draft 2020-12. Human-facing epics, tickets, ADRs, and documentation remain Markdown.

## Alternatives

- Markdown-only handoffs: easy to read but nondeterministic.
- Provider-specific structured output: locks the harness to one runtime.

## Consequences

Schemas must evolve compatibly or receive a new version. Validation failures stop the workflow before state advances.

## Verification

`npm run harness:validate` validates schemas, state, memory, and example handoffs and rejects unknown properties.
