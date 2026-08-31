---
name: run-sprint
description: Run or resume one repository sprint by selecting the first pending epic, dispatching the harness roles, validating every handoff, and stopping at required human gates. Use for executing the next epic through the resumable agentic harness; do not use to author or refine epics.
---

# Run Sprint

Run exactly one epic at a time. The sprint is resumable across conversations and human approvals; completion does not authorize bypassing a gate, merging, or releasing.

## Establish the safe checkpoint

1. Work from the repository root and read `AGENTS.md` plus `harness/status.json`.
2. Run `pnpm run harness:validate`. Do not continue from invalid control-plane state.
3. Run `pnpm run harness -- sprint`.
   - With no active run, this selects the first `pending` entry in array order from `harness/epic-status.json`, verifies its dependencies are `completed`, initializes its run, and marks it `in_progress`.
   - With an active run, it returns the durable resume checkpoint and reconciles a safe interrupted start.
   - After a run reaches `complete`, it marks that epic `completed` and stops. A later skill invocation may select the next epic.
4. Read `harness/status.json` again. Files, not chat history, decide the next action.

If the selected epic is dependency-blocked, report the exact dependencies and stop. Do not silently skip to a later epic.

## Dispatch roles

Map the active phase to one canonical role:

| Phase | Role prompt |
| --- | --- |
| `planning` | `harness/adapters/codex/planner.md` |
| `architecture` | `harness/adapters/codex/architect.md` |
| `implementation` | `harness/adapters/codex/coder.md` |
| `review` | `harness/adapters/codex/reviewer.md` |
| `documentation` | `harness/adapters/codex/documentation-specialist.md` |

For an agent phase:

1. Spawn exactly one role agent. Give it the active run, the canonical adapter prompt, and the checkpoint; each agent execution owns only that role.
2. Wait for it to finish. Do not run delivery roles concurrently and do not edit a role's output on its behalf.
3. Require its Markdown/code work and JSON handoff under the active `harness/runs/<run>/<round>/<ticket>/` path.
4. Run `pnpm run harness:validate -- <handoff.json>` and then `pnpm run harness -- ingest <handoff.json>`.
5. If validation fails, return a structured failure with the validator output to the same role for a new attempt. Respect `max_retries_per_phase` from `harness/config.json`; stop as blocked after the limit.
6. Re-read status and dispatch the next role only when the persisted phase permits it. The Reviewer-to-Coder correction loop uses the same rule.

## Human gates and stopping conditions

Stop and hand control to the user whenever status is `waiting_for_human`, including plan, architecture, scope-change, and merge approvals. Show the pending approval ID, question, relevant artifacts, and the exact approve/reject commands. Never execute those commands or represent a human decision.

Also stop when:

- the run or a role is blocked or failed and safe retries are exhausted;
- the catalog has no pending epics;
- `pnpm run harness -- sprint` records the active epic as completed.

Before reporting progress or completion, run `pnpm run harness:validate` once more. Summarize the epic, current phase, last validated artifact, and next required actor.
