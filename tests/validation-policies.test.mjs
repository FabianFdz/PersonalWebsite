import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { validateAgentOutput } from "../scripts/validation/agent-output-validator.mjs";
import { createSchemaRegistry } from "../scripts/validation/schema-registry.mjs";

test("removed approval payloads are rejected by role contracts", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "personalweb-validation-"));
  const fixturePath = path.join(directory, "planner-with-approval.output.json");

  try {
    const fixture = JSON.parse(
      await readFile(
        new URL("../harness/examples/planner.output.json", import.meta.url),
        "utf8",
      ),
    );
    fixture.payload.approval_request = { status: "pending" };
    await writeFile(fixturePath, JSON.stringify(fixture));

    const registry = await createSchemaRegistry();
    await assert.rejects(
      validateAgentOutput(fixturePath, registry),
      /must NOT have additional properties/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("needs_human is no longer a valid handoff status", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "personalweb-validation-"));
  const fixturePath = path.join(directory, "planner-needs-human.output.json");

  try {
    const fixture = JSON.parse(
      await readFile(
        new URL("../harness/examples/planner.output.json", import.meta.url),
        "utf8",
      ),
    );
    fixture.status = "needs_human";
    await writeFile(fixturePath, JSON.stringify(fixture));

    const registry = await createSchemaRegistry();
    await assert.rejects(
      validateAgentOutput(fixturePath, registry),
      /must be equal to one of the allowed values/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
