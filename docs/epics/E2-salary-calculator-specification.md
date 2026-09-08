# E2 — Costa Rica take-home salary calculator specification

## Goal

This repository produces a complete, reviewable specification for a Costa
Rica take-home salary calculator, so the calculator itself can be built in
its own separate repository from that spec alone — this repository does not
build, test, or deploy the calculator.

## Scope

- A written specification, kept under `pocs/salary-calculator/` in this
  repository, that captures every input, calculation, deduction,
  currency/rate behavior, overtime rule, language behavior, validation
  behavior, and privacy constraint needed to build the calculator — detailed
  enough that a developer working in the separate repository can implement
  it without further product decisions.
- The spec itemizes base pay, overtime pay, total gross, each employee
  deduction (income tax, CCSS, optional asociación solidarista), and the
  estimated net deposit, with a disclosed rounding policy under which the
  arithmetic reconciles.
- The spec names the one explicitly supported rule period — jurisdiction,
  progressive income tax brackets, CCSS employee contribution, effective
  dates, and authoritative source — and states that rules outside that
  period are never silently applied. Spouse and child tax credits are out of
  scope; CCSS is shown only as the employee's deducted contribution.
- The spec defines asociación solidarista participation as off by default,
  with the employee savings percentage constrained to the legal range when
  enabled and shown as its own line, and states that employer contributions
  are never subtracted from take-home pay.
- The spec defines salary entry in CRC or USD, with the BCCR reference
  purchase rate as the statutory conversion source (rate and date shown),
  an employer-rate override that stays visibly marked as custom, and the
  required behavior when no rate can be obtained (conversion unavailable,
  never stale or invented).
- The spec defines overtime by the schedules and day types in current MTSS
  guidance — ordinary workdays, rest days, paid holidays — including each
  multiplier, the ordinary hourly-rate basis, the applicable limit, and the
  required handling of hours beyond supported guidance (rejected or clearly
  marked, never estimated with a default).
- The spec defines bilingual behavior: a visible ES/EN control that switches
  every label, instruction, validation message, and disclaimer without
  changing inputs, currency, or the result, with language and currency
  treated as independent choices.
- The spec defines input validation: invalid, partial, non-numeric,
  negative, or out-of-range input never yields a plausible-looking result;
  errors state what to fix, in the active language, tied to the offending
  input.
- The spec defines reproducibility: the same inputs under the same rules and
  rate give the same answer; changing an input replaces any stale result;
  the initial and reset states show no misleading default result.
- The spec defines edge-case correctness requirements: values exactly on a
  bracket threshold and overtime that crosses one apply the progressive
  brackets rather than the top rate; repeated CRC/USD display changes must
  not accumulate rounding drift; locale decimal separators are normalized
  visibly or rejected, never silently misread.
- The spec states the calculator needs no account, stores no compensation
  data, and keeps compensation inputs out of URLs, analytics, and logs.

## Depends on

—

## Priority

must-have
