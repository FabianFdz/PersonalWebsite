# EPIC-005 — Claude Code and Codex agent adapters

## Outcome

Planner, Architect, Coder, Reviewer, and Documentation Specialist behave consistently in Claude Code and Codex.

## Scope

- One canonical prompt per role.
- Claude Code subagent definitions.
- Codex repository instructions and role launch prompts.
- Shared schemas, state, gates, and generalized memory.

## Acceptance criteria

1. Both platforms point to the same canonical role responsibilities and contracts.
2. Each role reads only its own memory and performs only its assigned responsibility.
3. Reviewer is independent from Coder and cannot silently edit implementation.
4. Human approval gates behave identically on both platforms.
5. The usage guide includes start, pause, approve, reject, and resume flows.

## Non-goals

- Guaranteeing byte-identical natural-language output across model providers.
- Provider-specific orchestration logic in the shared control plane.

## Dependencies

- EPIC-004.
