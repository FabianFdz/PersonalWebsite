import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { validateAgentOutput } from "../scripts/validation/agent-output-validator.mjs";
import { createSchemaRegistry } from "../scripts/validation/schema-registry.mjs";

test("agents cannot grant their own human approval", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "personalweb-validation-"));
  const fixturePath = path.join(directory, "planner-approved.output.json");

  try {
    const fixture = JSON.parse(
      await readFile(
        new URL("../harness/examples/planner.output.json", import.meta.url),
        "utf8",
      ),
    );
    fixture.payload.approval_request.status = "approved";
    fixture.payload.approval_request.decided_at = timestampForDecision();
    fixture.payload.approval_request.decided_by = "planner";
    fixture.payload.approval_request.decision_note = "Self-approved";
    await writeFile(fixturePath, JSON.stringify(fixture));

    const registry = await createSchemaRegistry();
    await assert.rejects(
      validateAgentOutput(fixturePath, registry),
      /agents may request approvals but cannot decide them/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

function timestampForDecision() {
  return "2026-08-19T00:01:00.000Z";
}
