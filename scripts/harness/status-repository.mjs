import { readJson, writeJsonAtomically } from "../core/json-file.mjs";

export class FileStatusRepository {
  constructor({ statusFile, validateStatus, clock }) {
    this.statusFile = statusFile;
    this.validateStatus = validateStatus;
    this.clock = clock;
  }

  async read() {
    const status = await readJson(this.statusFile);
    this.validateStatus(status);
    return status;
  }

  async save(status) {
    const timestamp = this.clock();
    const statusToPersist = structuredClone(status);
    statusToPersist.updated_at = timestamp;
    statusToPersist.checkpoint.saved_at = timestamp;

    this.validateStatus(statusToPersist);
    await writeJsonAtomically(this.statusFile, statusToPersist);
    return statusToPersist;
  }
}
