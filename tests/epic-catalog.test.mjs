import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createHarnessCommands } from "../scripts/harness/commands.mjs";
import { FileEpicCatalog } from "../scripts/harness/epic-catalog.mjs";
import { assertEpicStatusPolicy } from "../scripts/validation/epic-status-policy.mjs";

const startedAt = "2026-08-31T12:00:00.000Z";
const completedAt = "2026-08-31T13:00:00.000Z";

function entry(id, file, dependencies = []) {
  return {
    id,
    title: `Outcome for ${id}`,
    file,
    status: "pending",
    dependencies,
    run_id: null,
    started_at: null,
    completed_at: null,
  };
}

test("epic catalog selects in array order and persists lifecycle transitions", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "personalweb-epics-"));
  const epicsDirectory = path.join(directory, "docs", "epics");
  const statusFile = path.join(directory, "epic-status.json");
  const firstFile = "docs/epics/EPIC-001-first.md";
  const secondFile = "docs/epics/EPIC-002-second.md";

  try {
    await mkdir(epicsDirectory, { recursive: true });
    await writeFile(path.join(directory, firstFile), "# First\n");
    await writeFile(path.join(directory, secondFile), "# Second\n");
    await writeFile(statusFile, `${JSON.stringify({
      schema_version: "1.0",
      epics: [
        entry("EPIC-001", firstFile),
        entry("EPIC-002", secondFile, ["EPIC-001"]),
      ],
    }, null, 2)}\n`);

    const catalog = new FileEpicCatalog({
      epicsDirectory,
      statusFile,
      validateEpicStatus: assertEpicStatusPolicy,
    });

    assert.equal((await catalog.firstPending()).id, "EPIC-001");
    await catalog.markInProgress("EPIC-001", "RUN-TEST", startedAt);
    await assert.rejects(catalog.assertReady("EPIC-002"), /blocked by EPIC-001/);
    await catalog.markCompleted("EPIC-001", "RUN-TEST", completedAt);
    assert.equal((await catalog.firstPending()).id, "EPIC-002");
    assert.equal((await catalog.assertReady("EPIC-002")).id, "EPIC-002");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("epic policy rejects dependency cycles and multiple active epics", () => {
  const first = entry("EPIC-001", "docs/epics/EPIC-001-first.md", ["EPIC-002"]);
  const second = entry("EPIC-002", "docs/epics/EPIC-002-second.md", ["EPIC-001"]);

  assert.throws(
    () => assertEpicStatusPolicy({ schema_version: "1.0", epics: [first, second] }),
    /dependency cycle/,
  );

  first.dependencies = [];
  second.dependencies = [];
  for (const epic of [first, second]) {
    epic.status = "in_progress";
    epic.run_id = `RUN-${epic.id}`;
    epic.started_at = startedAt;
  }
  assert.throws(
    () => assertEpicStatusPolicy({ schema_version: "1.0", epics: [first, second] }),
    /at most one epic/,
  );
});

test("sprint command starts, resumes, finalizes, and only then selects the next epic", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "personalweb-sprint-"));
  const epicsDirectory = path.join(directory, "docs", "epics");
  const statusFile = path.join(directory, "epic-status.json");
  const firstFile = "docs/epics/EPIC-001-first.md";
  const secondFile = "docs/epics/EPIC-002-second.md";
  const messages = [];
  const times = [
    "2026-08-31T12:00:00.000Z",
    "2026-08-31T13:00:00.000Z",
    "2026-08-31T14:00:00.000Z",
  ];
  let timeIndex = 0;
  let status = {
    state: "not_started",
    epic_id: null,
    run_id: null,
  };

  try {
    await mkdir(epicsDirectory, { recursive: true });
    await writeFile(path.join(directory, firstFile), "# First\n");
    await writeFile(path.join(directory, secondFile), "# Second\n");
    await writeFile(statusFile, `${JSON.stringify({
      schema_version: "1.0",
      epics: [
        entry("EPIC-001", firstFile),
        entry("EPIC-002", secondFile, ["EPIC-001"]),
      ],
    }, null, 2)}\n`);

    const epicCatalog = new FileEpicCatalog({
      epicsDirectory,
      statusFile,
      validateEpicStatus: assertEpicStatusPolicy,
    });
    const commands = createHarnessCommands({
      projectId: "test-project",
      epicCatalog,
      statusRepository: {
        async read() {
          return structuredClone(status);
        },
        async save(nextStatus) {
          status = structuredClone(nextStatus);
          return structuredClone(status);
        },
      },
      validateAgentOutput() {},
      validateControlPlane() {},
      clock: () => times[Math.min(timeIndex++, times.length - 1)],
      createRunId: (timestamp) => `RUN-${timestamp.slice(11, 13)}`,
      output: (message) => messages.push(message),
    });

    await commands.sprint();
    assert.equal(status.epic_id, "EPIC-001");
    assert.equal((await epicCatalog.inProgress()).id, "EPIC-001");

    await commands.sprint();
    assert.match(messages.at(-1), /Run the Planner/);

    status.state = "complete";
    status.phase = "complete";
    status.checkpoint.resume_from = "Run complete";
    await commands.sprint();
    assert.equal((await epicCatalog.get("EPIC-001")).status, "completed");
    assert.equal(status.epic_id, "EPIC-001");

    await commands.sprint();
    assert.equal(status.epic_id, "EPIC-002");
    assert.equal((await epicCatalog.inProgress()).id, "EPIC-002");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
