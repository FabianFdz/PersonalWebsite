import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { FileStatusRepository } from "../scripts/harness/status-repository.mjs";
import { createInitialStatus } from "../scripts/harness/workflow.mjs";

const timestamp = "2026-08-19T00:00:00.000Z";

test("status repository validates before replacing the last valid file", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "personalweb-status-"));
  const statusFile = path.join(directory, "status.json");
  const validStatus = createInitialStatus({
    projectId: "test-project",
    epicId: "EPIC-001",
    runId: "RUN-TEST",
    timestamp,
  });
  await writeFile(statusFile, `${JSON.stringify(validStatus, null, 2)}\n`);

  const repository = new FileStatusRepository({
    statusFile,
    validateStatus(status) {
      if (status.state === "invalid") throw new Error("invalid state");
    },
    clock: () => timestamp,
  });

  try {
    const invalidStatus = { ...validStatus, state: "invalid" };
    await assert.rejects(repository.save(invalidStatus), /invalid state/);
    assert.deepEqual(
      JSON.parse(await readFile(statusFile, "utf8")),
      validStatus,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
