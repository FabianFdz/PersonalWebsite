import fs from "node:fs/promises";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readJson } from "../core/json-file.mjs";
import { harnessPaths } from "../core/project-paths.mjs";

export async function createSchemaRegistry() {
  const registry = new Ajv2020({ allErrors: true, strict: true });
  addFormats(registry);

  const schemaFiles = (await fs.readdir(harnessPaths.schemas))
    .filter((name) => name.endsWith(".schema.json"))
    .sort();

  for (const schemaFile of schemaFiles) {
    const schema = await readJson(path.join(harnessPaths.schemas, schemaFile));
    registry.addSchema(schema);
  }

  return registry;
}

export function assertSchema(registry, schemaId, data, label) {
  const validate = registry.getSchema(schemaId);
  if (!validate) {
    throw new Error(`${label}: schema not registered (${schemaId})`);
  }
  if (validate(data)) {
    return;
  }

  const details = validate.errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
  throw new Error(`${label}: ${details}`);
}
