# Epics

These epics are ordered by delivery priority. `harness/epic-status.json` is the machine-readable source for lifecycle and hard dependencies. The sprint runner selects the first `pending` entry in that array and never skips a dependency-blocked epic silently.

An epic remains `draft` while material product questions are open. It becomes `pending` only when it is concise, challenged, and ready for the Planner to turn into tickets; an epic is never used directly by the Coder.

| Epic | Outcome | Depends on |
| --- | --- | --- |
| [EPIC-001](EPIC-001-portfolio-foundation.md) | Credible portfolio identity and CV-backed content model | — |
| [EPIC-002](EPIC-002-editorial-experience.md) | Responsive editorial portfolio experience | EPIC-001 |
| [EPIC-003](EPIC-003-projects-contact-quality.md) | Projects, contact, accessibility, performance, metadata | EPIC-002 |
| [EPIC-004](EPIC-004-agentic-control-plane.md) | Deterministic resumable control plane | — |
| [EPIC-005](EPIC-005-agent-adapters.md) | Equivalent Claude Code and Codex agents | EPIC-004 |
