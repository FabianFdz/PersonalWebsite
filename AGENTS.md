# Portfolio Agentic Harness

This repository contains a personal portfolio and a resumable, human-in-the-loop software-delivery harness. Treat `harness/` as the control plane and the rest of the repository as the product.

## Source of truth

1. `harness/status.json` — current run, round, ticket, checkpoint, and approvals.
2. `harness/epic-status.json` — ordered epic lifecycle and hard dependencies.
3. `docs/epics/` — product intent and acceptance criteria.
4. `docs/tickets/` and `docs/adr/` — planned work and technical decisions.
5. `harness/memory/<agent>.json` — generalized rules learned by each role.
6. `harness/schemas/` — mandatory machine contracts.

Never advance a phase from an output that has not passed `pnpm run harness:validate`. Never edit another role's output to make it pass; return a structured failure to that role.

## Roles

Use exactly one role per execution. The canonical prompts are in `harness/agents/`:

- Planner: `harness/agents/planner.md`
- Architect: `harness/agents/architect.md`
- Coder: `harness/agents/coder.md`
- Reviewer: `harness/agents/reviewer.md`
- Documentation Specialist: `harness/agents/documentation-specialist.md`

Codex launch prompts live in `harness/adapters/codex/`. Claude Code subagents live in `.claude/agents/`. Both adapters must follow the same canonical prompt and schemas.

## Execution protocol

1. Read `harness/status.json`; resume from `checkpoint.resume_from`.
2. Read only the active epic/ticket, applicable ADRs, project standards, and your own memory file.
3. Validate every JSON input before using it.
4. Perform only the active role's responsibility.
5. Write the human artifact (Markdown/code/docs) and a JSON handoff under `harness/runs/<run_id>/<round_id>/<ticket_id>/`.
6. Validate the handoff with `pnpm run harness:validate -- <handoff.json>`.
7. Stop at a pending human approval. A human must run the explicit approval command.
8. Add a memory rule only when it is reusable, actionable, and not already covered. Memory is not a chronological log.

## Human gates

Approval is mandatory after planning, after architecture, when implementation changes scope/security/data handling, and before merge/release. Agents may create approval requests but must never approve them.

## PoC workspaces

- `pocs/<slug>/` contains local checkouts of independently versioned PoC repositories. The parent repository ignores their contents except for `pocs/.gitkeep`.
- The portfolio harness remains the control plane. An epic or ticket targeting a PoC must name its exact `pocs/<slug>` workspace before a role edits it.
- Confirm the target contains its own `.git` boundary and run its build, tests, lint, and Git operations from that child repository.
- Never stage, commit, or report a PoC's source as part of the portfolio repository. Parent and child changes require separate review evidence and commits.
- Do not create, clone, replace, or delete a PoC repository unless the user or active approved ticket explicitly requests it.
- Keep child-repository secrets and environment files out of harness state, prompts, handoffs, and portfolio artifacts.

## Product standards

- Preserve accessibility, responsive behavior, semantic HTML, and reduced-motion support.
- Do not invent claims, employers, dates, contact details, or metrics for the portfolio.
- Keep secrets out of source and generated artifacts.
- Prefer small, reviewable changes and deterministic tests.
