# Fabián Fernández — Portfolio + Agentic Harness

A production-ready personal portfolio and a provider-neutral, human-in-the-loop harness for developing it with Claude Code or Codex.

## Included

- Editorial, responsive portfolio inspired by the pacing of tanvir.io, with original styling.
- English-first interface with an accessible English/Spanish language switcher.
- CV-grounded positioning around Senior Software Engineering, GenAI, React/Next.js, TypeScript, cloud, and agentic systems.
- Five canonical roles: Planner, Architect, Coder, Reviewer, and Documentation Specialist.
- Claude Code subagents in `.claude/agents/` and Codex launch prompts in `harness/adapters/codex/`.
- Strict JSON Schemas, semantic validation, resumable `status.json`, human approval gates, and generalized per-agent memory.
- Product epics, ADRs, example handoffs, tests, and an orchestration CLI.

## Quick start

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Before publishing, replace the GitHub and LinkedIn placeholders in both files under `app/i18n/locales/` with verified URLs. Keep the English and Spanish professional copy aligned when the source CV changes.

## Deploy to Vercel from GitHub

The project keeps its existing local and Sites/Cloudflare workflow while using Nitro for Vercel builds.

1. Push the repository to GitHub.
2. In Vercel, create a project and import `FabianFdz/PersonalWebsite`.
3. Keep the repository root as the Root Directory. `vercel.json` supplies the build command; leave Vercel's Output Directory override empty because Nitro generates the native Build Output API structure. No environment variables are required for the current portfolio.
4. Deploy the `main` branch.
5. Under **Project → Settings → Domains**, add `fabianfdz.dev` and `www.fabianfdz.dev`. Make `fabianfdz.dev` canonical and redirect `www` to it.
6. Add the exact DNS records shown by Vercel at the domain registrar. Vercel provisions HTTPS after DNS verification.

Validate the Vercel artifact locally with:

```bash
npm run build:vercel
```

Nitro generates Vercel's deployment artifact under `.vercel/output/`. The entire `.vercel/` directory is ignored by Git and must not be committed.

## Harness quick start

```bash
npm run harness:validate
npm run harness -- sprint
npm run harness -- next
```

Run the named role in Claude Code or Codex. Validate and ingest its handoff:

```bash
npm run harness -- ingest harness/runs/RUN-.../ROUND-001/planner.output.json
npm run harness -- status
```

Only a human approves a pending gate:

```bash
npm run harness -- approve <APPROVAL-ID> "Fabián Fernández" "Scope approved"
```

See [docs/usage.md](docs/usage.md) for the complete workflow and [docs/architecture/harness.md](docs/architecture/harness.md) for architecture.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the portfolio locally |
| `npm run build` | Create a production build |
| `npm run build:vercel` | Create the Nitro artifact consumed by Vercel |
| `npm test` | Build and run automated checks |
| `npm run lint` | Run source linting |
| `npm run harness:validate` | Validate schemas, state, memories, and examples |
| `npm run harness -- status` | Show the active checkpoint |
| `npm run harness -- resume` | Print the exact safe resume action |

## Project map

```text
app/page.tsx            Route entry point
app/i18n/               Typed language contract and catalog
app/i18n/locales/       English and Spanish professional content
app/portfolio/components Cohesive page sections and primitives
app/portfolio/metadata.ts Metadata construction
app/styles/             Tokens, base, section, and responsive styles
docs/epics/             Product and harness epics
docs/adr/               Accepted architecture decisions
.claude/agents/         Claude Code role adapters
harness/agents/         Canonical provider-neutral role prompts
harness/adapters/codex/ Codex launch prompts
harness/schemas/        Deterministic JSON contracts
harness/memory/         Generalized per-role lessons
harness/epic-status.json Ordered epic lifecycle and hard dependencies
harness/status.json     Resumable materialized state
scripts/core/           Filesystem paths and JSON infrastructure
scripts/harness/        Workflow policy, persistence, commands, presentation
scripts/validation/     Schema registry and semantic policies
scripts/harness.mjs     CLI composition root
```

## Content note

The referenced conversation exposed the CV's professional summary and technical focus, but not the original file bytes or complete contact/employer fields. This scaffold deliberately leaves external links as placeholders instead of inventing personal data.

See [docs/architecture/code-organization.md](docs/architecture/code-organization.md) before extending the product or control plane.
