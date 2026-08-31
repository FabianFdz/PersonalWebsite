import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the Vercel deployment contract explicit and reproducible", async () => {
  const [
    packageSource,
    pnpmLock,
    pnpmWorkspace,
    vercelSource,
    viteSource,
    gitignore,
  ] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../pnpm-lock.yaml", import.meta.url), "utf8"),
    readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8"),
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
  assert.equal(packageJson.packageManager, "pnpm@11.21.0");
  assert.match(pnpmLock, /^lockfileVersion: '9\.0'$/m);
  assert.doesNotMatch(pnpmWorkspace, /^packages:/m);
  assert.match(pnpmWorkspace, /^ {2}esbuild: true$/m);
  assert.match(pnpmWorkspace, /^ {2}sharp: true$/m);
  assert.match(pnpmWorkspace, /^ {2}workerd: true$/m);
  await assert.rejects(
    access(new URL("../package-lock.json", import.meta.url)),
    { code: "ENOENT" },
  );
  assert.equal(vercelConfig.buildCommand, "pnpm run build:vercel");
  assert.equal(vercelConfig.outputDirectory, undefined);
  assert.match(viteSource, /return nitro\(\{ preset: "vercel" \}\)/);
  assert.match(viteSource, /process\.env\.VERCEL === "1"/);
  assert.match(gitignore, /^\.vercel$/m);
});
