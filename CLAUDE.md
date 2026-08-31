# Claude Code entrypoint

Follow `AGENTS.md` and `harness/config.json`. Use the project subagents in `.claude/agents/` and the canonical role prompts in `harness/agents/`.

Before delegating, run `pnpm run harness:validate` and `pnpm run harness -- status`. Delegate only the role returned by `pnpm run harness -- next`. Do not bypass a pending human approval or accept unvalidated JSON.
