import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateAgentOutput as validateOutput } from "./validation/agent-output-validator.mjs";
import { validateControlPlane } from "./validation/control-plane-validator.mjs";
import { createSchemaRegistry } from "./validation/schema-registry.mjs";

export { createSchemaRegistry };

export async function validateAgentOutput(file, registry) {
  const activeRegistry = registry ?? await createSchemaRegistry();
  return validateOutput(file, activeRegistry);
}

export async function validateAll(extraFile) {
  const { summary } = await validateControlPlane(extraFile);
  return summary;
}

function isDirectExecution() {
  return path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url);
}

if (isDirectExecution()) {
  try {
    const result = await validateAll(process.argv[2]);
    console.log(
      `Harness valid: ${result.schemas} schemas, ${result.memories} memories, ${result.examples} examples.`,
    );
  } catch (error) {
    console.error(`Harness validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
