import { applyAgentOutput, createInitialStatus, decideApproval } from "./workflow.mjs";
import { presentStatus, presentValidation } from "./presenter.mjs";

function assertEpicId(epicId) {
  if (!/^EPIC-[0-9]{3}$/.test(epicId || "")) {
    throw new Error("Usage: pnpm run harness -- init EPIC-NNN");
  }
}

function assertDecisionArguments(decision, approvalId, decidedBy) {
  if (!approvalId || !decidedBy) {
    throw new Error(
      `Usage: pnpm run harness -- ${decision} APPROVAL-ID "Human name" [note]`,
    );
  }
}

function isActiveRun(status) {
  return !["not_started", "complete"].includes(status.state);
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
  async function initializeEpic(epicId) {
    const timestamp = clock();
    const runId = createRunId(timestamp);
    const initialStatus = createInitialStatus({
      projectId,
      epicId,
      runId,
      timestamp,
    });
    await statusRepository.save(initialStatus);
    await epicCatalog.markInProgress(epicId, runId, timestamp);
    return initialStatus;
  }

  return {
    async init(epicId) {
      assertEpicId(epicId);
      if (!await epicCatalog.contains(epicId)) {
        throw new Error(`Unknown epic ${epicId}`);
      }
      const currentStatus = await statusRepository.read();
      if (isActiveRun(currentStatus)) {
        throw new Error(
          `Cannot initialize ${epicId}; ${currentStatus.epic_id} is still active`,
        );
      }
      const activeEpic = await epicCatalog.inProgress();
      if (activeEpic) {
        throw new Error(
          `Cannot initialize ${epicId}; reconcile completed run for ${activeEpic.id} with the sprint command`,
        );
      }
      await epicCatalog.assertReady(epicId);

      await initializeEpic(epicId);
      output(`Initialized ${epicId}. Next: Planner.`);
    },

    async sprint() {
      const currentStatus = await statusRepository.read();

      if (isActiveRun(currentStatus)) {
        const epic = await epicCatalog.get(currentStatus.epic_id);
        if (!epic) throw new Error(`Unknown active epic ${currentStatus.epic_id}`);
        if (epic.status === "pending") {
          await epicCatalog.markInProgress(
            currentStatus.epic_id,
            currentStatus.run_id,
            currentStatus.checkpoint.saved_at,
          );
        } else if (
          epic.status !== "in_progress" ||
          epic.run_id !== currentStatus.run_id
        ) {
          throw new Error(
            `Epic catalog conflicts with active run ${currentStatus.run_id}`,
          );
        }
        output(currentStatus.checkpoint.resume_from);
        return;
      }

      if (currentStatus.state === "complete" && currentStatus.epic_id) {
        const finishedEpic = await epicCatalog.get(currentStatus.epic_id);
        if (finishedEpic?.status === "in_progress") {
          await epicCatalog.markCompleted(
            currentStatus.epic_id,
            currentStatus.run_id,
            clock(),
          );
          output(
            `Completed ${currentStatus.epic_id}. Run the sprint skill again to start the next pending epic.`,
          );
          return;
        }
      }

      const activeEpic = await epicCatalog.inProgress();
      if (activeEpic) {
        throw new Error(
          `Epic catalog has active ${activeEpic.id} without an active harness run`,
        );
      }

      const epic = await epicCatalog.firstPending();
      if (!epic) {
        output(
          "No pending epics. Create and challenge an epic before starting another sprint.",
        );
        return;
      }
      await epicCatalog.assertReady(epic.id);
      await initializeEpic(epic.id);
      output(`Initialized ${epic.id}. Next: Planner.`);
    },

    async ingest(file) {
      if (!file) {
        throw new Error("Usage: pnpm run harness -- ingest <agent-output.json>");
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
