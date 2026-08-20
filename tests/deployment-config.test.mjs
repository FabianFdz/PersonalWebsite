import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the Vercel deployment contract explicit and reproducible", async () => {
  const [packageSource, vercelSource, viteSource, gitignore] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);
  const vercelConfig = JSON.parse(vercelSource);

  assert.equal(
    packageJson.scripts["build:vercel"],
    "NITRO_PRESET=vercel vite build",
  );
  assert.match(packageJson.devDependencies.nitro, /^\^3\./);
  assert.equal(vercelConfig.buildCommand, "npm run build:vercel");
  assert.equal(vercelConfig.outputDirectory, undefined);
  assert.match(viteSource, /return nitro\(\{ preset: "vercel" \}\)/);
  assert.match(viteSource, /process\.env\.VERCEL === "1"/);
  assert.match(gitignore, /^\.vercel$/m);
});
