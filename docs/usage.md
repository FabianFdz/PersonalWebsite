# Using the agentic harness

## 1. Validate the repository

```bash
npm install
npm run harness:validate
```

Validation compiles every schema, validates `status.json`, validates all five memory files and example handoffs, checks Planner dependency semantics, prevents Reviewer approval when criteria or blocking findings remain unresolved, and rejects any agent that tries to decide a human gate.

## 2. Start one epic

```bash
npm run harness -- init EPIC-001
npm run harness -- next
```

Only one epic and one round are active at a time. Initialization writes a new run ID and a durable checkpoint.

## 3. Run the requested role

### Codex

Open the repository in Codex and ask it to follow `AGENTS.md` plus the prompt named by `npm run harness -- next`. The role launch prompts are under `harness/adapters/codex/`.

Example request:

```text
Follow AGENTS.md. Act as Planner using harness/adapters/codex/planner.md for the active run. Stop at the human gate.
```

### Claude Code

Open the repository in Claude Code. `CLAUDE.md` routes the session to the five subagents under `.claude/agents/`. Ask Claude Code to use the role printed by `npm run harness -- next`.

Example request:

```text
Use the planner subagent for the active run. Validate its output and stop at the human gate.
```

## 4. Validate and ingest a handoff

Agents save artifacts under the active run/round/ticket directory. The Planner uses the round directory because no ticket is active yet.

```bash
npm run harness:validate -- harness/runs/RUN-.../ROUND-001/planner.output.json
npm run harness -- ingest harness/runs/RUN-.../ROUND-001/planner.output.json
```

`ingest` validates the envelope and role payload again before changing state. It rejects a role that does not match the active phase or an output for another run.

## 5. Human approval

After Planner, Architect, and Documentation Specialist outputs, the state changes to `waiting_for_human` and contains exactly one pending approval.

Inspect it:

```bash
npm run harness -- status
```

Approve:

```bash
npm run harness -- approve <APPROVAL-ID> "<human name>" "<decision note>"
```

Reject:

```bash
npm run harness -- reject <APPROVAL-ID> "<human name>" "<required change>"
```

Agents must never execute these two commands on a human's behalf.

## 6. Resume after interruption

```bash
npm run harness:validate
npm run harness -- resume
```

The command prints the safe next action from the last validated checkpoint. A pending human decision always wins over provider chat history.

## 7. Review loop

The Reviewer maps every acceptance criterion to evidence and checks security. `changes_requested` returns the same ticket to Coder. Only `approved` advances to Documentation Specialist. A merge approval either selects the next dependency-ready ticket or completes the round.

## 8. Teach an agent a reusable lesson

Edit only that role's file in `harness/memory/`, then validate. Good rules are generalized, actionable, and conditional. Do not paste an incident transcript or secret.

```json
{
  "id": "RULE-CODE-002",
  "rule": "Normalize external identifiers before comparing or persisting them.",
  "rationale": "Equivalent identifiers with different casing previously created duplicates.",
  "applies_when": "Handling identifiers received across a system boundary",
  "source_type": "incident",
  "confidence": "high",
  "created_at": "2026-08-19T00:00:00.000Z",
  "last_updated_at": "2026-08-19T00:00:00.000Z"
}
```

## State recovery rules

- Never hand-edit a stage to `passed`; ingest a validated role output.
- Never reuse a handoff from another run or round.
- Keep failed attempts as evidence and increment attempts in state.
- If `status.json` is invalid, restore the last committed valid copy before resuming.
- If an accepted ADR changes, create a superseding ADR and request architecture approval again.
