# E1 — Labs PoC directory

## Goal

Visitors can discover independent proofs of concept through an accessible Labs
navigation control and a `/labs` catalog, then reach each PoC's own
deployment on an approved `fabianfdz.dev` subdomain — with the portfolio
acting only as a directory: it never hosts, embeds, proxies, or shares
runtime state with a PoC.

## Scope

- A Labs navigation control, reachable from the site's main navigation, that
  is keyboard, pointer, and touch operable; is not hover-dependent; announces
  its expanded state to assistive technology; closes on `Escape` and outside
  interaction without trapping focus; and whose first action opens `/labs`.
- A `/labs` catalog page listing every published PoC by its localized display
  name, linking straight to that PoC's own deployment.
- One source of truth for each PoC's identifier, localized display name,
  publication state, and destination URL, maintained by the owner directly in
  this repository (no runtime admin interface, no authentication surface) —
  the nav control and the catalog both read from it rather than keeping a
  second hand-maintained list.
- Publication gating: only PoCs marked published are discoverable; with zero
  published PoCs the Labs control does not appear and `/labs` shows an
  intentional empty state.
- Destination validation: a PoC is publishable only with an HTTPS URL,
  without embedded credentials, and only when it resolves to a genuine
  subdomain of `fabianfdz.dev` — lookalike hosts, preview URLs, localhost,
  and repository URLs are rejected.
- External navigation from the nav control and catalog opens the PoC in a new
  tab, is announced to assistive technology, prevents opener access back into
  the PoC, and never forwards the portfolio's URL parameters or client-side
  state to the destination.
- Long or localized PoC names remain usable on mobile and desktop; switching
  language while the Labs control is open relabels it in place without
  losing focus or changing its target.
- A PoC deployment going down does not affect the portfolio's availability;
  keeping a PoC up remains the responsibility of its own repository.
- Each PoC's source lives in its own repository, kept out of the portfolio's
  Git history, build inputs, and deployment pipeline.

## Depends on

—

## Priority

must-have
