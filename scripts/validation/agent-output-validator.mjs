import path from "node:path";
import { readJson } from "../core/json-file.mjs";
import { projectRoot } from "../core/project-paths.mjs";
import { rolePayloadSchemaIds, schemaIds } from "./schema-catalog.mjs";
import { assertSchema } from "./schema-registry.mjs";
import { assertPlannerPolicy, assertReviewerPolicy } from "./semantic-policies.mjs";

const semanticPoliciesByRole = {
  planner: assertPlannerPolicy,
  reviewer: assertReviewerPolicy,
};

export async function validateAgentOutput(file, registry) {
  const absoluteFile = path.resolve(projectRoot, file);
  const output = await readJson(absoluteFile);

  assertSchema(registry, schemaIds.agentOutput, output, file);

  const payloadSchemaId = rolePayloadSchemaIds[output.role];
  if (!payloadSchemaId) {
    throw new Error(`${file}: unsupported role ${output.role}`);
  }
  assertSchema(registry, payloadSchemaId, output.payload, `${file} payload`);

  semanticPoliciesByRole[output.role]?.(output.payload);
  return output;
}
