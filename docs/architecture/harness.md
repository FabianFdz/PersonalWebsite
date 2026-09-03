# Harness architecture

## Control flow

```text
First pending epic → Planner → Architect → Coder → Reviewer ─changes requested→ Coder
                                                   └approved→ Documentation Specialist
                                                                → Complete or next ticket
                                                                     ↓
                                                           [human PR review] → merge
```

At each arrow the producing role writes a JSON envelope and role-specific payload. Validation is a transaction boundary: only a valid artifact may update `harness/status.json`.

The role pipeline has no routine manual gates. Human decisions remain outside automatic transitions: unresolved material ambiguity blocks the current role, and a completed sprint requires human review before any PR is approved or merged.

## Surfaces

- **Product plane:** app code, tests, `docs/epics`, tickets, ADRs, and user documentation.
- **Control plane:** `harness/config.json`, `harness/status.json`, schemas, run artifacts, and the CLI.
- **Epic catalog:** `harness/epic-status.json` owns ordered lifecycle and hard dependencies; Markdown epic files own product intent.
- **Provider adapters:** `.claude/agents` and `harness/adapters/codex`; neither owns business rules.
- **Memory:** one compact JSON rule set per role. Rules are generalized instructions, not event history.

## Implementation boundaries

- `scripts/harness.mjs` is only the composition root and CLI router.
- `scripts/harness/commands.mjs` coordinates use cases without owning persistence or transition rules.
- `scripts/harness/workflow.mjs` contains pure state-transition policy and has no filesystem dependency.
- `scripts/harness/status-repository.mjs` owns validated, atomic status persistence.
- `scripts/harness/epic-catalog.mjs` owns epic discovery and atomically persists epic lifecycle transitions.
- `scripts/validation/schema-registry.mjs` owns JSON Schema compilation.
- `scripts/validation/*-policy.mjs` each own one family of cross-field domain invariants; `semantic-policies.mjs` is their stable public facade.
- `scripts/validation/agent-output-validator.mjs` routes envelopes to role contracts.
- `scripts/validation/control-plane-validator.mjs` coordinates repository-wide validation.

High-level commands receive these collaborators explicitly. This keeps workflow policy testable without touching the production status file and prevents validation or filesystem details from leaking into CLI routing.

## Resume model

`status.json` is a materialized state machine. `checkpoint.resume_from` contains a human-readable next action; `last_validated_artifact` names the last trustworthy boundary. On restart, validate the full repository control plane before reading the checkpoint. Persisted state always takes precedence over chat history.

## Sprint selection and recovery

`pnpm run harness sprint` starts the first `pending` epic in catalog order when no run is active, or prints the checkpoint for the active run. A selected epic must have only `completed` hard dependencies. Draft epics are never eligible.

Run initialization persists `harness/status.json` before marking the epic `in_progress`. If interruption occurs between those writes, the next sprint invocation reconciles the pending catalog entry to the active run. When the run reaches `complete`, the next invocation marks the epic `completed` and stops; a later invocation may start another epic. This preserves one-epic-per-sprint intent and makes the two-file transition recoverable.

## Artifact convention

```text
harness/runs/RUN-<id>/ROUND-001/TICKET-001/
  planner.output.json
  architect.output.json
  coder.output.json
  reviewer.output.json
  documentation-specialist.output.json
```

Every listed artifact has a SHA-256 digest in the producing envelope. Mutating a prior artifact invalidates downstream evidence; corrections are new attempts, not overwrites.

## Security boundaries

- Model output is untrusted until schema validation succeeds.
- A role advances the state only through a successful handoff that passes structural and semantic validation.
- Material ambiguities are escalated to the user as structured blockers rather than guessed.
- Agents never approve or merge their own pull requests; internal completion is only a PR-review boundary.
- Status is validated before atomic persistence; invalid transitions never replace the last valid file.
- Reviewer does not edit implementation.
- No secrets belong in prompts, state, memory, or handoffs.
- `additionalProperties: false` rejects accidental or adversarial fields.
