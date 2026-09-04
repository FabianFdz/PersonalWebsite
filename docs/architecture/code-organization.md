# Code organization

The repository follows small, explicit responsibility boundaries. Prefer extending an existing boundary over adding logic to a route or entry point.

## Portfolio

| Responsibility | Owner |
| --- | --- |
| Translation contract and language registry | `app/i18n/types.ts` and `app/i18n/index.ts` |
| Verified professional copy, collections, links, and SEO values | `app/i18n/locales/*` |
| Request-origin resolution and framework metadata construction | `app/portfolio/metadata.ts` |
| Route entry point | `app/page.tsx` |
| Language state and page composition | `app/portfolio/components/PortfolioPage.tsx` |
| One visual/semantic section | `app/portfolio/components/*` |
| Design tokens | `app/styles/tokens.css` |
| Document-wide defaults and shared micro typography | `app/styles/base.css` |
| Header and first viewport | `app/styles/header-and-hero.css` |
| Portfolio sections | `app/styles/portfolio-sections.css` |
| Breakpoint adaptations | `app/styles/responsive.css` |

Translation modules do not depend on presentation. Both language catalogs must satisfy the same `PortfolioContent` contract. Section components receive narrow typed inputs, while `PortfolioPage` owns language selection and composition. The route contains no professional copy or section markup.

## Change rules

- Add visible professional copy to both files under `app/i18n/locales/`; do not duplicate it in a component or metadata function.
- Extend `PortfolioContent` before adding a new translated field so incomplete catalogs fail at compile time.
- Give a new page section its own component when it has independent markup or change reasons.
- Share a presentation primitive only after two real consumers need the same behavior.
- Avoid speculative interfaces, factories, dependency-injection frameworks, or “utility” collections without a cohesive purpose.
