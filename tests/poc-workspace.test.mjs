import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

test("keeps independent PoC repositories outside the parent Git boundary", async () => {
  await access(path.join(projectRoot, "pocs", ".gitkeep"));

  const nestedRepositoryFile = spawnSync(
    "git",
    ["check-ignore", "--quiet", "pocs/example-poc/.git/config"],
    { cwd: projectRoot },
  );
  const trackedAnchor = spawnSync(
    "git",
    ["check-ignore", "--quiet", "pocs/.gitkeep"],
    { cwd: projectRoot },
  );

  assert.equal(nestedRepositoryFile.status, 0);
  assert.equal(trackedAnchor.status, 1);
});
