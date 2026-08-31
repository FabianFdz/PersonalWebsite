---
name: create-epic
description: Challenge, refine, create, or update concise sprint-ready epics for this repository, including material edge cases and dependencies on the existing epic catalog. Use when shaping product intent before sprint planning; do not decompose an approved epic into tickets or make architecture decisions.
---

# Create Epic

Produce a decision-dense epic, not a long specification. Challenge weak assumptions and missing boundaries until a Planner can decompose the epic without inventing product intent.

## Ground the proposal

Read `AGENTS.md`, `harness/epic-status.json`, and `docs/epics/README.md`. Read an existing epic document only when it is a plausible dependency, overlap, or conflict; do not load every epic by default.

Clarify the smallest useful outcome:

- who benefits and what becomes observably different;
- why this needs an epic rather than a ticket or an unrelated collection of changes;
- what is explicitly in and out of scope;
- which constraints are product requirements, not premature implementation choices;
- how a reviewer can prove the outcome.

Do not invent portfolio claims, people, dates, metrics, integrations, or technical constraints.

## Challenge before polishing

Act as a constructive skeptic. Test the proposal against:

- happy path, empty/first-use state, partial data, invalid input, duplicate or repeated actions;
- interruption, retry, idempotency, and recovery when the epic changes durable state;
- permissions, privacy, secrets, destructive actions, and human approvals;
- accessibility, responsive behavior, reduced motion, performance, and compatibility when applicable;
- observable failure behavior and what must remain unchanged;
- scope creep, bundled outcomes, contradictions, and acceptance criteria that merely restate implementation tasks.

Surface only material edge cases. Convert resolved cases into a boundary, acceptance criterion, or explicit non-goal instead of adding a decorative wall of text.

Ask at most three high-impact questions at a time when answers would materially change scope, acceptance, or dependencies. State safe assumptions for smaller gaps. If a material question remains, keep the epic as `draft`; do not make it sprint-eligible.

## Identify dependencies

Compare the proposed outcome with the ordered catalog. For each plausible relationship, distinguish:

- **hard dependency:** the epic cannot deliver or be verified first;
- **overlap/conflict:** scope should be moved, merged, or explicitly separated;
- **related only:** useful context that should not block scheduling.

Register only hard dependencies in `dependencies`. Explain overlap or sequencing recommendations to the user. Never create a dependency merely because another epic touches the same files, and never introduce a cycle.

## Write the epic

Allocate the ID from `next_epic_number` in `harness/epic-status.json`, then increment that counter when registering the epic. Never derive the next ID from the remaining files or reuse an ID deleted from the catalog. Use a concise slug and this structure when each section adds information:

```markdown
# EPIC-NNN — Outcome-oriented title

## Outcome

## Scope

## Acceptance criteria

## Edge cases and failure boundaries

## Non-goals

## Dependencies
```

Acceptance criteria must be observable, independently decidable, and cover the outcome rather than prescribe an architecture. Merge repetitive criteria. Omit an empty prose section except `Dependencies`, which should say `None` when applicable.

Create or update all three catalog surfaces together:

1. `docs/epics/EPIC-NNN-<slug>.md`;
2. the ordered table in `docs/epics/README.md`;
3. the matching entry in `harness/epic-status.json`.

Use `draft` while material questions remain. Promote to `pending` only when the epic has a single coherent outcome, explicit boundaries, testable acceptance criteria, material edge cases, no unresolved dependency conflict, and no open question that would change planning. New `draft` or `pending` entries have null run and timestamp fields. Do not reorder existing entries unless the user explicitly changes priority.

Run `pnpm run harness:validate` after every catalog write. Finish with a compact challenge summary: decisions made, edge cases incorporated, hard dependencies, assumptions, and whether the epic is `draft` or sprint-ready `pending`.
