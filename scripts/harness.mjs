import { harnessPaths } from "./core/project-paths.mjs";
import { createHarnessCommands } from "./harness/commands.mjs";
import { FileEpicCatalog } from "./harness/epic-catalog.mjs";
import { FileStatusRepository } from "./harness/status-repository.mjs";
import { validateAgentOutput } from "./validation/agent-output-validator.mjs";
import {
  validateControlPlane,
  validateEpicStatus,
  validateStatus,
} from "./validation/control-plane-validator.mjs";
import { createSchemaRegistry } from "./validation/schema-registry.mjs";

const commandName = process.argv[2] || "status";
const commandArguments = process.argv.slice(3);
const clock = () => new Date().toISOString();
const createRunId = (timestamp) =>
  `RUN-${timestamp.replaceAll(/[-:.TZ]/g, "").slice(0, 14)}`;

async function createApplication() {
  const schemaRegistry = await createSchemaRegistry();
  const statusRepository = new FileStatusRepository({
    statusFile: harnessPaths.status,
    validateStatus: (status) => validateStatus(status, schemaRegistry),
    clock,
  });
  const epicCatalog = new FileEpicCatalog({
    epicsDirectory: harnessPaths.epics,
    statusFile: harnessPaths.epicStatus,
    validateEpicStatus: (epicStatus) =>
      validateEpicStatus(epicStatus, schemaRegistry),
  });

  return createHarnessCommands({
    projectId: "fabian-portfolio",
    statusRepository,
    epicCatalog,
    validateAgentOutput: (file) =>
      validateAgentOutput(file, schemaRegistry),
    validateControlPlane: async (file) =>
      (await validateControlPlane(file, schemaRegistry)).summary,
    clock,
    createRunId,
    output: console.log,
  });
}

async function run() {
  const commands = await createApplication();

  switch (commandName) {
    case "init":
      return commands.init(commandArguments[0]);
    case "sprint":
      return commands.sprint();
    case "ingest":
      return commands.ingest(commandArguments[0]);
    case "approve":
    case "reject":
      return commands.decide(
        commandName,
        commandArguments[0],
        commandArguments[1],
        commandArguments.slice(2).join(" ") || null,
      );
    case "resume":
    case "next":
      return commands.status({ resumeOnly: true });
    case "validate":
      return commands.validate(commandArguments[0]);
    case "status":
      return commands.status();
    default:
      throw new Error(
        "Commands: sprint, init, ingest, validate, status, next, resume, approve, reject",
      );
  }
}

try {
  await run();
} catch (error) {
  console.error(`Harness error: ${error.message}`);
  process.exitCode = 1;
}
