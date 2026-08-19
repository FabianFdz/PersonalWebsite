import fs from "node:fs/promises";
import path from "node:path";
import { readJson } from "../core/json-file.mjs";
import { harnessPaths, projectRoot } from "../core/project-paths.mjs";
import { validateAgentOutput } from "./agent-output-validator.mjs";
import { schemaIds } from "./schema-catalog.mjs";
import { assertSchema, createSchemaRegistry } from "./schema-registry.mjs";
import {
  assertMemoryPolicy,
  assertStatusPolicy,
} from "./semantic-policies.mjs";

function relativeProjectPath(file) {
  return path.relative(projectRoot, file);
}

export function validateStatus(status, registry, label = "harness/status.json") {
  assertSchema(registry, schemaIds.status, status, label);
  assertStatusPolicy(status);
}

async function validateMemories(registry) {
  const memoryFiles = (await fs.readdir(harnessPaths.memory))
    .filter((name) => name.endsWith(".json"))
    .sort();

  for (const memoryFile of memoryFiles) {
    const absoluteFile = path.join(harnessPaths.memory, memoryFile);
    const label = relativeProjectPath(absoluteFile);
    const memory = await readJson(absoluteFile);
    assertSchema(registry, schemaIds.memory, memory, label);
    assertMemoryPolicy(memory, label);
  }

  return memoryFiles.length;
}

async function validateExamples(registry) {
  const exampleFiles = (await fs.readdir(harnessPaths.examples))
    .filter((name) => name.endsWith(".output.json"))
    .sort();

  for (const exampleFile of exampleFiles) {
    await validateAgentOutput(
      relativeProjectPath(path.join(harnessPaths.examples, exampleFile)),
      registry,
    );
  }

  return exampleFiles.length;
}

export async function validateControlPlane(extraFile, existingRegistry) {
  const registry = existingRegistry ?? await createSchemaRegistry();
  const status = await readJson(harnessPaths.status);

  validateStatus(status, registry);
  const memories = await validateMemories(registry);
  const examples = await validateExamples(registry);

  if (extraFile) {
    await validateAgentOutput(extraFile, registry);
  }

  return {
    registry,
    summary: {
      schemas: Object.keys(registry.schemas).length,
      memories,
      examples,
    },
  };
}
