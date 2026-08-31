# EPIC-006 — External PoC Labs directory

## Outcome

Visitors can discover independent proofs of concept from an accessible Labs menu and `/labs` catalog, then navigate directly to each PoC's deployment on an approved `fabianfdz.dev` subdomain. The portfolio acts only as a directory; it does not host or execute PoC runtimes.

## Existing foundation

- `pocs/<slug>/` is the ignored local workspace convention for separate PoC repositories; only `pocs/.gitkeep` belongs to the portfolio repository.
- The portfolio's root harness remains the shared control plane, while each PoC retains its own Git history, dependencies, checks, and deployment configuration.

## Scope

- One validated registry owns each PoC's stable identifier, localized display metadata, publication state, and absolute deployment URL.
- Every PoC is developed in a separate repository and deployed independently to its own approved HTTPS subdomain under `fabianfdz.dev`.
- A local checkout uses `pocs/<slug>/` and remains excluded from the portfolio's source control, build inputs, and deployment artifacts.
- A `Labs` navigation control lists published PoC names as links and includes a `View all Labs` destination without duplicating registry entries in UI code.
- `/labs` provides a responsive catalog generated from the same registry and links to the same external deployments.
- The portfolio does not embed PoCs, proxy their routes, load their bundles, or share runtime state, authentication, storage, or secrets with them.
- Empty and unavailable-catalog states preserve global navigation and provide a clear next action.
- Registry validation, URL trust boundaries, navigation behavior, accessibility, and absence of embedded PoC runtime receive deterministic automated coverage.

## Acceptance criteria

1. A single registry determines the published PoCs shown in the Labs dropdown and `/labs` catalog; these surfaces contain no separately maintained PoC names or deployment URLs.
2. Only `published` PoCs appear in public discovery. With zero published PoCs, the Labs navigation control is absent and `/labs` renders an intentional accessible empty state.
3. Deterministic URL validation accepts a public PoC only when its destination uses HTTPS, has no embedded credentials, and its parsed hostname is a real subdomain of `fabianfdz.dev`; apex, lookalike, duplicate, malformed, and disallowed destinations fail before build publication.
4. The Labs control is a button with an explicit expanded state and works with keyboard, pointer, and touch. Focus order is predictable; `Escape`, outside interaction, and selecting an item close it without trapping or losing focus.
5. The menu is not hover-dependent, its first action opens `/labs`, and long or localized PoC names remain usable without page overflow on supported mobile and desktop widths.
6. Each published PoC name is a real link to its registered subdomain. The portfolio does not substitute an internal detail route, iframe, runtime remote, or client-side proxy for that destination.
7. External navigation is clearly communicated to assistive technology and follows one documented same-tab or new-tab policy. If a new context is used, the link announces it and prevents opener access.
8. Opening the portfolio, Labs dropdown, or `/labs` does not download or execute code from a PoC repository or deployment.
9. Registry entries and generated links contain no secrets, access tokens, session material, or user-specific query data; the portfolio does not depend on shared parent-domain cookies or cross-subdomain authentication.
10. Navigation and catalog transitions respect reduced-motion preferences and preserve semantic headings, visible focus, keyboard operation, and existing portfolio navigation on supported mobile and desktop widths.
11. Deterministic validation rejects duplicate identifiers or destinations, missing default-language metadata, unsupported publication states, and invalid subdomain URLs before a production build can publish the registry.
12. Automated checks prove registry-to-UI consistency, published-state filtering, URL allowlisting, keyboard behavior, empty states, safe external-link behavior, and absence of embedded or eagerly loaded PoC code while all existing portfolio and harness checks continue to pass.
13. Adding a valid nested repository under `pocs/<slug>/` does not change the parent Git status, enter the portfolio build, or alter another PoC's repository; its own Git status and deterministic checks remain independently usable.

## Edge cases and failure boundaries

- Draft, disabled, or malformed entries never leak into public navigation or page metadata.
- With many published PoCs, the dropdown remains bounded and routes users to `/labs` for the complete catalog.
- Missing optional secondary-language metadata falls back to the required default language consistently; it never exposes an empty menu label.
- Changing language while the menu is open updates its labels without resetting focus or opening a different PoC.
- A hostname merely ending in the same text, such as `fabianfdz.dev.example.com`, is not treated as an allowed subdomain.
- A PoC without a provisioned production subdomain remains draft or disabled rather than publishing a dead placeholder link.
- A deployment may become unavailable after publication; that does not break the portfolio shell or other links, and availability remains the owning PoC repository's responsibility.
- Preview, localhost, provider-generated, and repository URLs are not published as production PoC destinations.
- PoC links never forward the portfolio's current URL parameters, credentials, or client state.
- A missing or non-repository `pocs/<slug>` target blocks harness work for that PoC rather than being silently initialized, replaced, or treated as part of the parent repository.

## Non-goals

- Building the first domain-specific PoC as part of this epic.
- Creating PoC repositories, provisioning DNS, or deploying the PoCs themselves.
- Converting independent PoC repositories into a monorepo, Git submodules, or committed nested source inside the portfolio.
- Embedding PoCs through iframes, Module Federation, runtime remotes, or shared bundles.
- Shared authentication, cross-PoC state synchronization, or a PoC data backend.
- Uptime monitoring or runtime health checks for independent PoC deployments.

## Dependencies

None.
