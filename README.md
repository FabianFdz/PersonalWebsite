# Fabián Fernández — Portfolio

A production-ready personal portfolio built with React Server Components, Vite,
and Nitro, deployed to Vercel.

## Included

- Editorial, responsive portfolio inspired by the pacing of tanvir.io, with
  original styling.
- English-first interface with an accessible English/Spanish language switcher.
- CV-grounded positioning around Senior Software Engineering, GenAI,
  React/Next.js, TypeScript, cloud, and agentic systems.
- Deterministic tests for the deployment contract, the rendered HTML, and the
  PoC workspace boundary.

## Quick start

Requires Node.js 22.13 or newer and pnpm 11.21.0. Corepack can select the pinned
pnpm version from `package.json`.

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

## Planning and delivery

Epics, tickets, and sprint execution come from the `FabianFdz/dev-setup` plugin
(`sprint-runner`), not from this repository:

- `/epic-creator` authors a new epic under `docs/epics/` and indexes it in
  `docs/epics/epic-status.md`.
- `/sprint` plans an epic into tickets and drives the build.

[docs/epics/epics-backlog.md](docs/epics/epics-backlog.md) holds the outcome-level
intents preserved from the previous repository-local harness; run
`/epic-creator` with one of them to turn it into a real epic.

## Local PoC repositories

Place each independently versioned PoC checkout under `pocs/<slug>/`. The parent repository ignores everything in `pocs/` except `.gitkeep`, so every child keeps its own Git history, dependencies, tests, and deployment configuration.

Use pnpm in each child repository. Separate lockfiles preserve independent releases while pnpm's shared content-addressable store avoids keeping a full physical copy of the same package version for every PoC.

```text
pocs/
  my-first-poc/   # separate repository with its own .git
  another-poc/    # separate repository with its own .git
```

When a ticket targets a PoC, it must name the exact child workspace; run product commands and Git operations inside that child repository. The portfolio build must never import or publish files from `pocs/`.

## Useful commands

| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Start the portfolio locally |
| `pnpm run build` | Create a production build |
| `pnpm run build:vercel` | Create the Nitro artifact consumed by Vercel |
| `pnpm test` | Build and run automated checks |
| `pnpm run lint` | Run source linting |

## Project map

```text
app/page.tsx            Route entry point
app/i18n/               Typed language contract and catalog
app/i18n/locales/       English and Spanish professional content
app/portfolio/components Cohesive page sections and primitives
app/portfolio/metadata.ts Metadata construction
app/styles/             Tokens, base, section, and responsive styles
pocs/                   Ignored local checkouts of independent PoC repositories
docs/epics/             Product epics and the pending epic backlog
docs/architecture/      Repository boundaries and change rules
tests/                  Deployment, rendering, and workspace checks
worker/                 Cloudflare worker entry point
```

## Content note

The referenced conversation exposed the CV's professional summary and technical focus, but not the original file bytes or complete contact/employer fields. This scaffold deliberately leaves external links as placeholders instead of inventing personal data.

See [docs/architecture/code-organization.md](docs/architecture/code-organization.md) before extending the product.
