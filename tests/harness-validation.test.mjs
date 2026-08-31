import test from "node:test";
import assert from "node:assert/strict";
import { validateAll } from "../scripts/validate-harness.mjs";

test("control-plane schemas, state, memory, and examples are valid", async () => {
  const result = await validateAll();
  assert.equal(result.epics, 1);
  assert.equal(result.memories, 5);
  assert.equal(result.examples, 5);
  assert.ok(result.schemas >= 8);
});
