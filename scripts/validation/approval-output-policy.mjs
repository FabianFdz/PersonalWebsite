const expectedGateByRole = {
  planner: "plan_approval",
  architect: "architecture_approval",
  coder: "scope_change_approval",
  "documentation-specialist": "merge_approval",
};

function approvalRequestFor(role, payload) {
  return role === "coder"
    ? payload.scope_change_request
    : payload.approval_request;
}

export function assertAgentApprovalPolicy(role, payload) {
  const approvalRequest = approvalRequestFor(role, payload);

  if (approvalRequest && approvalRequest.status !== "pending") {
    throw new Error(
      `${role} payload: agents may request approvals but cannot decide them`,
    );
  }
  if (approvalRequest && approvalRequest.gate !== expectedGateByRole[role]) {
    throw new Error(
      `${role} payload: expected ${expectedGateByRole[role]} gate, received ${approvalRequest.gate}`,
    );
  }
}

export function assertOutputStatusPolicy(output) {
  const alwaysHumanGatedRoles = [
    "planner",
    "architect",
    "documentation-specialist",
  ];
  if (
    alwaysHumanGatedRoles.includes(output.role) &&
    output.status !== "needs_human"
  ) {
    throw new Error(`${output.role} output: role must stop at its human gate`);
  }
  if (output.role !== "coder") {
    return;
  }

  const scopeChange = output.payload.scope_change_request;
  if (output.status === "needs_human" && !scopeChange) {
    throw new Error(
      "coder output: needs_human requires a scope_change_request",
    );
  }
  if (output.status === "success" && scopeChange) {
    throw new Error(
      "coder output: successful implementation cannot include a pending scope change",
    );
  }
}
