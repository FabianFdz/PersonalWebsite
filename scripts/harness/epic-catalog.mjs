import fs from "node:fs/promises";
import path from "node:path";
import { readJson, writeJsonAtomically } from "../core/json-file.mjs";

export class FileEpicCatalog {
  constructor({ epicsDirectory, statusFile, validateEpicStatus }) {
    this.epicsDirectory = epicsDirectory;
    this.statusFile = statusFile;
    this.validateEpicStatus = validateEpicStatus;
  }

  async read() {
    const catalog = await readJson(this.statusFile);
    this.validateEpicStatus(catalog);
    return catalog;
  }

  async save(catalog) {
    this.validateEpicStatus(catalog);
    await writeJsonAtomically(this.statusFile, catalog);
    return catalog;
  }

  async contains(epicId) {
    const catalog = await this.read();
    const epic = catalog.epics.find((candidate) => candidate.id === epicId);
    if (!epic) return false;

    const filenames = await fs.readdir(this.epicsDirectory);
    return filenames.includes(path.basename(epic.file));
  }

  async get(epicId) {
    const catalog = await this.read();
    return catalog.epics.find((candidate) => candidate.id === epicId) ?? null;
  }

  async firstPending() {
    const catalog = await this.read();
    return catalog.epics.find((epic) => epic.status === "pending") ?? null;
  }

  async inProgress() {
    const catalog = await this.read();
    return catalog.epics.find((epic) => epic.status === "in_progress") ?? null;
  }

  async assertReady(epicId) {
    const catalog = await this.read();
    const epic = catalog.epics.find((candidate) => candidate.id === epicId);
    if (!epic) throw new Error(`Unknown epic ${epicId}`);
    if (epic.status !== "pending") {
      throw new Error(`${epicId} is ${epic.status}, not pending`);
    }

    const incomplete = epic.dependencies.filter(
      (dependencyId) =>
        catalog.epics.find((candidate) => candidate.id === dependencyId)
          ?.status !== "completed",
    );
    if (incomplete.length > 0) {
      throw new Error(`${epicId} is blocked by ${incomplete.join(", ")}`);
    }
    return epic;
  }

  async markInProgress(epicId, runId, timestamp) {
    const catalog = await this.read();
    const epic = catalog.epics.find((candidate) => candidate.id === epicId);
    if (!epic) throw new Error(`Unknown epic ${epicId}`);
    if (epic.status === "in_progress" && epic.run_id === runId) return catalog;
    if (epic.status !== "pending") {
      throw new Error(`${epicId} cannot start from ${epic.status}`);
    }

    Object.assign(epic, {
      status: "in_progress",
      run_id: runId,
      started_at: timestamp,
      completed_at: null,
    });
    return this.save(catalog);
  }

  async markCompleted(epicId, runId, timestamp) {
    const catalog = await this.read();
    const epic = catalog.epics.find((candidate) => candidate.id === epicId);
    if (!epic) throw new Error(`Unknown epic ${epicId}`);
    if (epic.status === "completed" && epic.run_id === runId) return catalog;
    if (epic.status !== "in_progress" || epic.run_id !== runId) {
      throw new Error(`${epicId} is not in_progress for ${runId}`);
    }

    epic.status = "completed";
    epic.completed_at = timestamp;
    return this.save(catalog);
  }
}
