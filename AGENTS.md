# Portfolio — agent guide

This repository is a personal portfolio. It no longer carries its own delivery
harness: planning and sprint execution come from the `FabianFdz/dev-setup`
plugin (`sprint-runner`), which owns the role prompts, handoff schemas, and
sprint state.

## Source of truth

1. `docs/epics/` — product intent and acceptance criteria, authored by
   `/epic-creator` and indexed in `docs/epics/epic-status.md`.
2. `docs/epics/epics-backlog.md` — intents preserved from the previous catalog
   that have not been turned into epics yet.
3. `docs/architecture/` — repository boundaries and change rules.

Use `/epic-creator` to add an epic and `/sprint` to plan and build one. Do not
reintroduce a repository-local control plane, role prompt, or handoff schema;
fix the plugin instead.

## Human-in-the-loop boundaries

- Stop and ask when a material ambiguity affects scope, security, data handling,
  or public behavior and cannot be resolved from the epic and repository
  evidence. Return a structured blocker rather than guessing.
- Sprint completion means the work is ready for PR review, not approved for
  merge. Never approve or merge your own PR.
- Create a PR only when the active ticket or the user asks for it. Deployment,
  publication, and release always require separate authority.

## PoC workspaces

- `pocs/<slug>/` contains local checkouts of independently versioned PoC
  repositories. The parent repository ignores their contents except
  `pocs/.gitkeep`.
- An epic or ticket targeting a PoC must name its exact `pocs/<slug>` workspace
  before anything edits it.
- Confirm the target contains its own `.git` boundary, and run its build, tests,
  lint, and Git operations from that child repository.
- Never stage, commit, or report a PoC's source as part of the portfolio
  repository. Parent and child changes need separate commits and evidence.
- Do not create, clone, replace, or delete a PoC repository unless the user or
  the active ticket explicitly requests it.
- Keep child-repository secrets and environment files out of portfolio
  artifacts.

## Product standards

- Preserve accessibility, responsive behavior, semantic HTML, and reduced-motion
  support.
- Do not invent claims, employers, dates, contact details, or metrics for the
  portfolio.
- Keep secrets out of source and generated artifacts.
- Prefer small, reviewable changes and deterministic tests.
- Verify with `pnpm run lint` and `pnpm test`.
