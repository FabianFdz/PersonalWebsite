import {
  activeRound,
  markStage,
  nextRunnableTicket,
} from "./workflow-state.mjs";

const rejectedGatePhases = {
  plan_approval: "planning",
  architecture_approval: "architecture",
  scope_change_approval: "implementation",
  merge_approval: "documentation",
};

function continueWithArchitecture(status) {
  status.state = "running";
  status.phase = "architecture";
  status.checkpoint.resume_from = `Run Architect for ${status.current_ticket}`;
}

function continueWithImplementation(status) {
  status.state = "running";
  status.phase = "implementation";
  status.checkpoint.resume_from = `Run Coder for ${status.current_ticket}`;
}

function completeMergeApproval(status) {
  markStage(
    status,
    "merge",
    "passed",
    status.checkpoint.last_validated_artifact,
  );
  const nextTicket = nextRunnableTicket(status);

  if (nextTicket) {
    status.current_ticket = nextTicket.ticket_id;
    continueWithArchitecture(status);
    return;
  }

  status.current_ticket = null;
  status.state = "complete";
  status.phase = "complete";
  activeRound(status).status = "complete";
  status.checkpoint.resume_from = "Run complete";
}

const approvedGateTransitions = {
  plan_approval: continueWithArchitecture,
  architecture_approval: continueWithImplementation,
  scope_change_approval: continueWithImplementation,
  merge_approval: completeMergeApproval,
};

function recordDecision(approval, decision, decidedBy, note, timestamp) {
  approval.status = decision === "approve" ? "approved" : "rejected";
  approval.decided_at = timestamp;
  approval.decided_by = decidedBy;
  approval.decision_note = note;
}

export function decideApproval(
  currentStatus,
  { decision, approvalId, decidedBy, note, timestamp },
) {
  if (!["approve", "reject"].includes(decision)) {
    throw new Error(`Unsupported approval decision ${decision}`);
  }

  const status = structuredClone(currentStatus);
  const approval = status.approvals.find(
    (candidate) =>
      candidate.id === approvalId && candidate.status === "pending",
  );
  if (!approval) {
    throw new Error(`No pending approval ${approvalId}`);
  }

  recordDecision(approval, decision, decidedBy, note, timestamp);

  if (decision === "reject") {
    status.state = "blocked";
    status.phase = rejectedGatePhases[approval.gate];
    status.checkpoint.resume_from =
      `Resolve rejected gate ${approvalId}: ${note || "no note provided"}`;
    return status;
  }

  approvedGateTransitions[approval.gate](status);
  return status;
}
