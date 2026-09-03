import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateAll } from "../scripts/validate-harness.mjs";

test("control-plane schemas, state, memory, and examples are valid", async () => {
  const [result, epicStatusSource] = await Promise.all([
    validateAll(),
    readFile(new URL("../harness/epic-status.json", import.meta.url), "utf8"),
  ]);
  const epicStatus = JSON.parse(epicStatusSource);

  assert.equal(result.epics, epicStatus.epics.length);
  assert.equal(result.memories, 5);
  assert.equal(result.examples, 5);
  assert.ok(result.schemas >= 8);
});
