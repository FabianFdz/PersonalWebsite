# Fabián Fernández — Portfolio + Agentic Harness

A production-ready personal portfolio and a provider-neutral, resumable, human-in-the-loop harness for developing it with Claude Code or Codex.

## Included

- Editorial, responsive portfolio inspired by the pacing of tanvir.io, with original styling.
- English-first interface with an accessible English/Spanish language switcher.
- CV-grounded positioning around Senior Software Engineering, GenAI, React/Next.js, TypeScript, cloud, and agentic systems.
- Five canonical roles: Planner, Architect, Coder, Reviewer, and Documentation Specialist.
- Claude Code subagents in `.claude/agents/` and Codex launch prompts in `harness/adapters/codex/`.
- Strict JSON Schemas, semantic validation, resumable `status.json`, independent review, focused human ambiguity handling, and human PR approval.
- Product epics, ADRs, example handoffs, tests, and an orchestration CLI.

## Quick start

Requires Node.js 22.13 or newer and pnpm 11.21.0. Corepack can select the pinned pnpm version from `package.json`.

```bash
pnpm install
pnpm run dev
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
pnpm run build:vercel
```

Nitro generates Vercel's deployment artifact under `.vercel/output/`. The entire `.vercel/` directory is ignored by Git and must not be committed.

## Harness quick start

```bash
pnpm run harness:validate
pnpm run harness sprint
pnpm run harness next
```

Run the named role in Claude Code or Codex. Validate and ingest its handoff:

```bash
pnpm run harness ingest harness/runs/RUN-.../ROUND-001/planner.output.json
pnpm run harness status
```

The sprint skill continues automatically after every successful validated handoff. It pauses only for material ambiguities and for human review of a resulting PR; agents never approve or merge their own PRs.

See [docs/usage.md](docs/usage.md) for the complete workflow and [docs/architecture/harness.md](docs/architecture/harness.md) for architecture.

## Local PoC repositories

Place each independently versioned PoC checkout under `pocs/<slug>/`. The parent repository ignores everything in `pocs/` except `.gitkeep`, so every child keeps its own Git history, dependencies, tests, and deployment configuration.

Use pnpm in each child repository. Separate lockfiles preserve independent releases while pnpm's shared content-addressable store avoids keeping a full physical copy of the same package version for every PoC.

```text
pocs/
  my-first-poc/   # separate repository with its own .git
  another-poc/    # separate repository with its own .git
```

Run harness commands from the portfolio root. When a ticket targets a PoC, it must name the exact child workspace; run product commands and Git operations inside that child repository. The portfolio build must never import or publish files from `pocs/`.

## Useful commands

| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Start the portfolio locally |
| `pnpm run build` | Create a production build |
| `pnpm run build:vercel` | Create the Nitro artifact consumed by Vercel |
| `pnpm test` | Build and run automated checks |
| `pnpm run lint` | Run source linting |
| `pnpm run harness:validate` | Validate schemas, state, memories, and examples |
| `pnpm run harness status` | Show the active checkpoint |
| `pnpm run harness resume` | Print the exact safe resume action |

## Project map

```text
app/page.tsx            Route entry point
app/i18n/               Typed language contract and catalog
app/i18n/locales/       English and Spanish professional content
app/portfolio/components Cohesive page sections and primitives
app/portfolio/metadata.ts Metadata construction
app/styles/             Tokens, base, section, and responsive styles
pocs/                   Ignored local checkouts of independent PoC repositories
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
