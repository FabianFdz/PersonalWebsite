import fs from "node:fs/promises";
import path from "node:path";
import { projectRoot } from "./project-paths.mjs";

function displayPath(file) {
  const relativePath = path.relative(projectRoot, file);
  return relativePath.startsWith("..") ? file : relativePath;
}

export async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    throw new Error(`${displayPath(file)}: ${error.message}`, { cause: error });
  }
}

export async function writeJsonAtomically(file, value) {
  const temporaryFile = `${file}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(value, null, 2)}\n`);
  await fs.rename(temporaryFile, file);
}
