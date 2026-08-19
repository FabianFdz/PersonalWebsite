# ADR-0003 — Generalized rules instead of decision logs

- Status: Accepted
- Date: 2026-08-19

## Context

Raw logs grow indefinitely, repeat sensitive details, and do not reliably prevent recurrence of a class of error.

## Decision

Each role owns a compact, schema-validated set of generalized rules. A rule states an actionable behavior, rationale, applicability condition, provenance type, and confidence. Duplicate and incident-specific entries are rejected during review.

## Alternatives

- Append-only error log: high volume with low reusable signal.
- Shared memory for all roles: encourages responsibility leakage and irrelevant context.

## Consequences

Memory remains concise and portable. Humans may edit or remove low-quality rules during review.

## Verification

All files in `harness/memory/` validate against `memory.schema.json`; agent prompts require reading only the current role's file.
