export function assertMemoryPolicy(memory, label) {
  const normalizedRules = memory.rules.map((item) =>
    item.rule.toLocaleLowerCase("en").replaceAll(/[^\p{L}\p{N}]/gu, ""),
  );
  if (new Set(normalizedRules).size !== normalizedRules.length) {
    throw new Error(`${label}: duplicate generalized rules`);
  }
}
