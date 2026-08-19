import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export function projectPath(...segments) {
  return path.join(projectRoot, ...segments);
}

export const harnessPaths = {
  schemas: projectPath("harness", "schemas"),
  status: projectPath("harness", "status.json"),
  memory: projectPath("harness", "memory"),
  examples: projectPath("harness", "examples"),
  epics: projectPath("docs", "epics"),
};
