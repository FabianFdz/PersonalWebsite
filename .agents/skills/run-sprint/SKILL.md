---
name: run-sprint
description: Run or resume one repository sprint by selecting the first pending epic, dispatching harness roles sequentially, validating every handoff, and continuing until completion or a human-required ambiguity or PR review. Use for executing or continuing the next epic through the resumable agentic harness; do not use to author or refine epics.
---

# Run Sprint

Run exactly one epic at a time. The sprint is resumable across conversations and continues automatically after every valid successful handoff. It remains human-in-the-loop for material ambiguities and PR approval. Completion does not authorize deployment, publication, external release, or merging a PR.

## Establish the safe checkpoint

1. Work from the repository root and read `AGENTS.md` plus `harness/status.json`.
2. Run `pnpm run harness:validate`. Do not continue from invalid control-plane state.
3. Run `pnpm run harness sprint`.
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
4. Run `pnpm run harness:validate <handoff.json>` and then `pnpm run harness ingest <handoff.json>`.
5. If validation fails, return a structured failure with the validator output to the same role for a new attempt. Respect `max_retries_per_phase` from `harness/config.json`; stop as blocked after the limit.
6. Re-read status and dispatch the next role only when the persisted phase permits it. The Reviewer-to-Coder correction loop uses the same rule.

## Stopping conditions

Also stop when:

- the run or a role is blocked or failed and safe retries are exhausted;
- the catalog has no pending epics;
- `pnpm run harness sprint` records the active epic as completed.

Do not pause between successful roles. If a role reports a material ambiguity, required scope change, or missing authority, preserve it as a structured blocker and ask the user the smallest concrete question needed to proceed. After the user resolves it, re-read persisted state, give that answer to the same role as a new attempt, and continue; never infer the answer from convenience or prior unrelated approval.

When internal work reaches `complete`, report the review evidence and PR status. If creating a PR is within the active ticket or the user's request, it may be created, but the agent must stop for human PR review and must never approve or merge its own PR. If PR creation was not authorized, report the work as PR-ready without creating one.

Do not deploy, publish, merge externally, or broaden scope merely because the internal sprint reached `complete`.

Before reporting progress or completion, run `pnpm run harness:validate` once more. Summarize the epic, current phase, last validated artifact, and any blocker or safe next action.
