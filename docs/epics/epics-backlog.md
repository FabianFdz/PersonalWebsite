# Epic backlog — intents for `/epic-creator`

This repository no longer keeps its own agentic harness. Epics, tickets, and sprint
state are now produced by the `FabianFdz/dev-setup` plugin (`sprint-runner`).

The entries below are the outcome-level intents preserved from the previous epic
catalog. They are **inputs**, not epics: run `/epic-creator` with one intent at a
time so the skill can challenge it and write the real
`docs/epics/E{n}-<kebab-title>.md` plus its row in `docs/epics/epic-status.md`.

```
/epic-creator <paste one intent below>
```

Delete an intent from this file once its epic exists.

---

## Intent 1 — External PoC Labs directory

Visitors can discover independent proofs of concept from an accessible `Labs`
navigation control and a `/labs` catalog, then go straight to each PoC's own
deployment on an approved `fabianfdz.dev` subdomain. The portfolio is only a
directory: it never hosts, embeds, proxies, or shares runtime state with a PoC.

Boundaries and cases worth settling with the skill:

- One source of truth owns each PoC's identifier, localized display name,
  publication state, and destination URL; the menu and the catalog never keep a
  second hand-maintained list.
- Only published PoCs are discoverable. With zero published PoCs the Labs control
  disappears and `/labs` shows an intentional empty state.
- A destination is publishable only over HTTPS, without embedded credentials, and
  only from a real subdomain of `fabianfdz.dev` — a lookalike host such as
  `fabianfdz.dev.example.com` is rejected, as are preview, localhost, and
  repository URLs.
- The Labs control is keyboard, pointer, and touch operable, is not hover
  dependent, announces its expanded state, closes on `Escape` and outside
  interaction without trapping focus, and its first action opens `/labs`.
- External navigation is announced to assistive technology, follows one documented
  same-tab or new-tab policy, prevents opener access, and never forwards the
  portfolio's URL parameters or client state.
- Long or localized names stay usable on mobile and desktop; changing language
  while the menu is open relabels it without losing focus or changing the target.
- A deployment that goes down does not break the portfolio shell; availability
  stays the owning PoC repository's responsibility.
- Each PoC lives in its own repository, checked out locally under `pocs/<slug>/`
  and excluded from the portfolio's Git boundary, build inputs, and deployment.

Out of scope: building the first PoC, creating repositories, provisioning DNS,
deploying, monorepo/submodule consolidation, iframes or module federation, shared
authentication, and uptime monitoring.

---

## Intent 2 — Costa Rica take-home salary calculator

Salaried employees in Costa Rica can estimate what actually reaches their bank
account from a monthly base salary plus overtime, after employee income tax, the
employee CCSS contribution, and an optional asociación solidarista deduction. The
estimate is reproducible, offered in Spanish and English, and expressed in CRC or
USD. It needs no account and stores no compensation data.

Boundaries and cases worth settling with the skill:

- The result itemizes base pay, overtime pay, total gross, each employee
  deduction, and the estimated net deposit, and the arithmetic reconciles under a
  disclosed rounding policy.
- Income tax uses the progressive employee brackets of one explicitly supported
  rule period, with no spouse or child credits; CCSS shows only the employee's
  deducted contribution; every deduction exposes its basis.
- The calculator names its jurisdiction, effective rule period, authoritative
  source, and last rule update, and never silently applies rules from outside that
  period.
- Asociación solidarista participation is off by default; when enabled the user
  sets the employee savings percentage within the legal range, sees it as its own
  line, and turning it off leaves no stale deduction. Employer contributions are
  never subtracted from take-home pay.
- Salary can be entered in CRC or USD. A USD salary converts for statutory
  calculation using the current BCCR reference purchase rate, with rate and date
  shown; the user may override it with an employer rate that stays visibly marked
  as custom. If no rate can be obtained, conversion is unavailable rather than
  stale or invented.
- Overtime distinguishes the schedules and day types in current MTSS guidance —
  ordinary workdays, rest days, paid holidays — and states the multiplier, the
  ordinary hourly-rate basis, and the applicable limit. Hours beyond the supported
  guidance are rejected or clearly marked, never estimated with a default.
- A visible ES/EN chip control switches every label, instruction, validation
  message, and disclaimer without changing inputs, currency, or the result;
  language and currency are independent choices.
- Invalid, partial, non-numeric, negative, or out-of-range input never yields a
  plausible-looking result; errors say what to fix, in the active language, tied
  to the offending input.
- Repeating a calculation under the same rules and rate gives the same answer, and
  changing an input replaces any stale result rather than leaving an old one on
  screen. The initial and reset states show no misleading default result.
- Values exactly on a bracket threshold, and overtime that crosses one, apply the
  progressive brackets rather than taxing everything at the top rate. Repeated
  CRC↔USD display changes must not accumulate rounding drift. Locale decimal
  separators are normalized visibly or rejected, never silently misread.
- Compensation inputs stay out of URLs, analytics, and logs.
- The calculator is developed in its own repository, checked out under
  `pocs/salary-calculator`, separate from the portfolio.

Out of scope: portfolio navigation and Labs publication (Intent 1), bonuses,
commissions, benefits in kind, garnishments, other voluntary deductions, employer
payroll costs, spouse/child tax credits, sector- or employer-specific deductions,
self-employment, pensions, payroll processing or filing, authoritative tax or
legal advice, other jurisdictions, historical comparisons, saved scenarios, and
any durable personal-data storage.
