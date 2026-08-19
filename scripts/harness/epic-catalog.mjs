import fs from "node:fs/promises";

export class FileEpicCatalog {
  constructor(epicsDirectory) {
    this.epicsDirectory = epicsDirectory;
  }

  async contains(epicId) {
    const filenames = await fs.readdir(this.epicsDirectory);
    return filenames.some((filename) => filename.startsWith(`${epicId}-`));
  }
}
