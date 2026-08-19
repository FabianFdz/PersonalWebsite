export function assertReviewerPolicy(payload) {
  if (payload.verdict !== "approved") {
    return;
  }
  if (payload.criteria.some((criterion) => criterion.status !== "met")) {
    throw new Error(
      "Reviewer payload: approved verdict requires every criterion to be met",
    );
  }
  if (payload.findings.some((finding) => finding.blocking)) {
    throw new Error(
      "Reviewer payload: approved verdict cannot include blocking findings",
    );
  }
}
