import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html", host: "localhost" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the portfolio and social metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /Fabian Fernández/);
  assert.match(html, /Senior Software Engineer/);
  assert.match(html, /HUMAN-IN-THE-LOOP/);
  assert.match(html, /I turn ambiguous problems into clear products/);
  assert.match(html, /aria-label="Language selector"/);
  assert.match(html, /aria-pressed="true"[^>]*>EN<\/button>/i);
  assert.match(html, /data-reveal="true"/);
  assert.match(html, /class="stack-icon stack-icon--typescript"/);
  assert.match(html, /class="stack-icon-set stack-icon-set--layered"/);
  assert.match(html, /class="stack-icon stack-icon--openai"/);
  assert.match(html, /class="stack-icon stack-icon--claude"/);
  assert.match(html, />TypeScript<\/h3>/);
  assert.match(html, />Express<\/h3>/);
  assert.match(html, />NestJS<\/h3>/);
  assert.match(html, />PostgreSQL<\/h3>/);
  assert.match(html, />MongoDB<\/h3>/);
  assert.match(html, />GenAI<\/h3>/);
  assert.match(html, />LangChain<\/h3>/);
  assert.match(html, />LangGraph<\/h3>/);
  assert.ok(html.indexOf(">GenAI</h3>") < html.indexOf(">TypeScript</h3>"));
  assert.match(html, /property="og:image" content="http:\/\/localhost\/og\.png"/i);
  assert.match(html, /rel="icon" href="\/favicon\.svg\?v=2" type="image\/svg\+xml"/i);
  assert.match(html, /rel="apple-touch-icon" href="\/apple-touch-icon\.png\?v=2" type="image\/png" sizes="180x180"/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps composition, translations, styles, and metadata in focused modules", async () => {
  const [page, portfolioPage, english, spanish, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/portfolio/components/PortfolioPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/i18n/locales/en.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/i18n/locales/es.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(page, /<PortfolioPage/);
  assert.match(portfolioPage, /<SiteHeader/);
  assert.match(portfolioPage, /<ContactFooter/);
  assert.doesNotMatch(page, /Senior Software Engineer|HUMAN-IN-THE-LOOP|EXPERIENCIA/);
  assert.match(english, /I turn ambiguous problems into clear products/);
  assert.match(spanish, /Convierto problemas ambiguos en productos claros/);
  assert.match(layout, /buildPortfolioMetadata/);
  assert.match(layout, /DEFAULT_LANGUAGE/);
  await access(new URL("../app/styles/tokens.css", import.meta.url));
  await access(new URL("../app/styles/responsive.css", import.meta.url));
  await access(new URL("../app/styles/animations.css", import.meta.url));
  await access(new URL("../app/portfolio/hooks/useScrollReveal.ts", import.meta.url));
  await access(new URL("../public/og.png", import.meta.url));
});

test("keeps unused starter capabilities out of the product", async () => {
  const packageJson = await readFile(
    new URL("../package.json", import.meta.url),
    "utf8",
  );
  const removedPaths = [
    "../db/index.ts",
    "../drizzle.config.ts",
    "../examples/d1/app/api/notes/route.ts",
    "../examples/d1/db/schema.ts",
    "../postcss.config.mjs",
  ];

  assert.doesNotMatch(packageJson, /drizzle|tailwind|db:generate/);
  await Promise.all(
    removedPaths.map((path) =>
      assert.rejects(access(new URL(path, import.meta.url))),
    ),
  );
});
