import { applyAgentOutput, createInitialStatus, decideApproval } from "./workflow.mjs";
import { presentStatus, presentValidation } from "./presenter.mjs";

function assertEpicId(epicId) {
  if (!/^EPIC-[0-9]{3}$/.test(epicId || "")) {
    throw new Error("Usage: npm run harness -- init EPIC-001");
  }
}

function assertDecisionArguments(decision, approvalId, decidedBy) {
  if (!approvalId || !decidedBy) {
    throw new Error(
      `Usage: npm run harness -- ${decision} APPROVAL-ID "Human name" [note]`,
    );
  }
}

export function createHarnessCommands({
  projectId,
  statusRepository,
  epicCatalog,
  validateAgentOutput,
  validateControlPlane,
  clock,
  createRunId,
  output,
}) {
  return {
    async init(epicId) {
      assertEpicId(epicId);
      if (!await epicCatalog.contains(epicId)) {
        throw new Error(`Unknown epic ${epicId}`);
      }

      const timestamp = clock();
      const initialStatus = createInitialStatus({
        projectId,
        epicId,
        runId: createRunId(timestamp),
        timestamp,
      });
      await statusRepository.save(initialStatus);
      output(`Initialized ${epicId}. Next: Planner.`);
    },

    async ingest(file) {
      if (!file) {
        throw new Error("Usage: npm run harness -- ingest <agent-output.json>");
      }
      const agentOutput = await validateAgentOutput(file);
      const currentStatus = await statusRepository.read();
      const nextStatus = applyAgentOutput(
        currentStatus,
        agentOutput,
        file,
        clock(),
      );
      const persistedStatus = await statusRepository.save(nextStatus);
      output(`Ingested ${file}. ${persistedStatus.checkpoint.resume_from}`);
    },

    async decide(decision, approvalId, decidedBy, note = null) {
      assertDecisionArguments(decision, approvalId, decidedBy);
      const currentStatus = await statusRepository.read();
      const nextStatus = decideApproval(currentStatus, {
        decision,
        approvalId,
        decidedBy,
        note,
        timestamp: clock(),
      });
      const persistedStatus = await statusRepository.save(nextStatus);
      const approval = persistedStatus.approvals.find(
        (candidate) => candidate.id === approvalId,
      );
      output(
        `${approvalId} ${approval.status}. ${persistedStatus.checkpoint.resume_from}`,
      );
    },

    async status({ resumeOnly = false } = {}) {
      const status = await statusRepository.read();
      output(resumeOnly ? status.checkpoint.resume_from : presentStatus(status));
    },

    async validate(file) {
      const summary = await validateControlPlane(file);
      output(presentValidation(summary));
    },
  };
}
