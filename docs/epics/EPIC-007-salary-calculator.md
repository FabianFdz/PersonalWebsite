# EPIC-007 — Costa Rica take-home salary calculator

## Outcome

Salaried employees in Costa Rica can estimate how much of their base salary and overtime will reach their bank account after employee income tax, CCSS contributions, and an optional asociación solidarista deduction. The estimate is reproducible, available in Spanish and English, and clearly expressed in CRC or USD.

## Scope

- A monthly gross base-salary input for a standard salaried employee and the schedule, day-type, and hours inputs required to apply current MTSS overtime guidance.
- An itemized estimate covering base pay, overtime pay, employee income tax, employee CCSS contributions, an optional employee asociación solidarista deduction, and net pay expected in the employee's account.
- Costa Rican salaried employment only, using one explicitly supported rule period and authoritative rules from Ministerio de Hacienda, CCSS, Ministerio de Trabajo y Seguridad Social, and the Ley de Asociaciones Solidaristas.
- CRC and USD salary entry and results, with the calculation currency, conversion basis, exchange rate, rate date, intermediate precision, and final rounding visible wherever conversion occurs.
- A visible chip-style language control for Spanish and English. Language and currency are independent choices.
- Predictable recalculation when any salary, overtime, association, currency, or rule-dependent input changes, without retaining stale or contradictory results.
- Accessible, responsive use across supported mobile and desktop widths, including keyboard-only operation and reduced-motion preferences.
- Calculations require no account and do not store or transmit a person's compensation inputs.
- The PoC lives only in the independently versioned `pocs/salary-calculator` workspace; its source, dependencies, checks, and deployment remain separate from the portfolio repository.

## Acceptance criteria

1. For every supported valid input, the calculator shows base gross pay, overtime gross pay, total gross pay, each employee deduction, and estimated net deposit; their arithmetic reconciles to the displayed net amount within the disclosed rounding policy.
2. Income tax uses the progressive employee brackets for the supported Costa Rican rule period without spouse or child tax credits. CCSS shows only the employee contribution deducted from pay. Each deduction exposes its basis rather than presenting one unexplained total.
3. Asociación solidarista participation is off by default. When enabled, the user can enter the applicable employee savings percentage within the supported legal range, see that deduction separately, and turn participation off without leaving a stale deduction in the result. Employer contributions are not subtracted from take-home pay.
4. The calculator identifies the jurisdiction, effective rule period, authoritative source, and last rule update for tax, CCSS, association, and overtime assumptions. It does not silently apply a rule set outside its declared period.
5. Users can enter salary in CRC or USD and obtain a result with every amount visibly labeled. A USD salary defaults to the current BCCR reference purchase rate for statutory CRC calculations and discloses the rate and effective date. The user can replace it with the employer's rate, which is visibly identified as a custom override throughout the result; changing currency never reinterprets an existing numeric amount silently.
6. A visible ES/EN chip-style control switches all user-facing labels, instructions, validation messages, deduction names, assumptions, and disclaimers without changing the current inputs, currency, or numeric result.
7. Overtime calculations distinguish the ordinary schedules and day types required by current MTSS guidance, including applicable ordinary workdays, rest days, and paid holidays. The calculator states the selected schedule/day type, applied multiplier, ordinary hourly-rate basis, and relevant limit; it rejects or clearly marks hours outside the supported guidance instead of estimating them with a convenient default.
8. Required, partial, malformed, non-numeric, negative, unsupported, and out-of-range input states do not produce a plausible-looking result. Errors explain what must be corrected in the active language and are programmatically associated with the relevant input.
9. Repeating the same calculation under the same disclosed rule set and exchange rate produces the same result. Changing an input replaces any stale result with one derived solely from the current valid inputs.
10. The initial and reset states explain what information is needed without showing a misleading default result. Resetting clears user-entered compensation data while preserving only the documented language and currency preference behavior.
11. Labels, instructions, errors, and results are semantically associated and usable with keyboard and assistive technology; visible focus, zoom, narrow layouts, and reduced-motion preferences remain supported.
12. Compensation inputs do not appear in URLs, analytics payloads, logs, or another repository, and the calculator works without authentication or durable personal-data storage.
13. Deterministic automated checks cover official rule examples and boundaries, deduction reconciliation, overtime calculations, both currencies, conversion and rounding, both languages, invalid and partial input, repeated recalculation, reset behavior, and accessible result/error presentation.
14. No implementation role edits `pocs/salary-calculator` until the target is confirmed as its own Git repository; the parent portfolio Git state and other PoC workspaces remain unchanged by its development.

## Edge cases and failure boundaries

- Values exactly on each tax threshold, and overtime that moves total compensation across a threshold, apply the progressive brackets without taxing the entire salary at the highest applicable rate.
- Switching association participation off removes only the employee's association deduction; it does not alter gross pay, tax, CCSS, or overtime.
- Currency conversion uses one documented order of operations so repeated CRC-to-USD display changes do not accumulate rounding drift.
- Language or currency changes preserve valid inputs and never leave mixed-language labels, mixed-currency totals, or a result calculated under hidden prior assumptions.
- A missing, expired, or invalid rule set produces an explicit unavailable estimate. If the current BCCR rate cannot be obtained, automatic conversion is unavailable but the user may supply an explicitly labeled custom rate; the calculator never silently falls back to a stale or invented rate.
- Overtime that exceeds the supported schedule or legal daily limit is not presented as an ordinary valid payroll estimate.
- A failed or interrupted calculation leaves inputs recoverable and does not present an older result as current.
- Decimal entry follows the active locale's documented separators; ambiguous values are rejected or normalized visibly rather than silently misread.

## Non-goals

- Portfolio navigation, Labs publication, DNS provisioning, deployment, or changes to EPIC-006.
- Creating or replacing the `pocs/salary-calculator` repository as part of this epic definition.
- Bonuses, commissions, benefits in kind, expense reimbursements, garnishments, loans, other voluntary deductions, or employer payroll costs.
- Spouse or child income-tax credits and sector-, employer-, or collective-agreement-specific deductions.
- Self-employment, pensions, payroll processing, filing, payment initiation, employer integrations, or authoritative payroll, tax, or legal advice.
- Jurisdictions other than Costa Rica, historical comparisons, or multiple concurrent statutory rule periods.
- Accounts, saved salary scenarios, sharing, exports, or durable personal-data storage.

## Dependencies

None.
