function assertLifecycleFields(epic) {
  const untouched = epic.run_id === null && epic.started_at === null && epic.completed_at === null;
  const started = epic.run_id !== null && epic.started_at !== null && epic.completed_at === null;
  const completed = epic.run_id !== null && epic.started_at !== null && epic.completed_at !== null;

  if (["draft", "pending"].includes(epic.status) && !untouched) {
    throw new Error(`Epic status: ${epic.id} ${epic.status} must not have run timestamps`);
  }
  if (epic.status === "in_progress" && !started) {
    throw new Error(`Epic status: ${epic.id} in_progress requires run_id and started_at`);
  }
  if (epic.status === "completed" && !completed) {
    throw new Error(`Epic status: ${epic.id} completed requires run_id and both timestamps`);
  }
}

function assertAcyclic(epicsById) {
  const visiting = new Set();
  const visited = new Set();

  function visit(epicId) {
    if (visiting.has(epicId)) {
      throw new Error(`Epic status: dependency cycle includes ${epicId}`);
    }
    if (visited.has(epicId)) return;

    visiting.add(epicId);
    for (const dependency of epicsById.get(epicId).dependencies) visit(dependency);
    visiting.delete(epicId);
    visited.add(epicId);
  }

  for (const epicId of epicsById.keys()) visit(epicId);
}

export function assertEpicStatusPolicy(catalog) {
  const epicsById = new Map();
  const files = new Set();

  for (const epic of catalog.epics) {
    if (epicsById.has(epic.id)) throw new Error(`Epic status: duplicate id ${epic.id}`);
    if (files.has(epic.file)) throw new Error(`Epic status: duplicate file ${epic.file}`);
    if (!epic.file.includes(`${epic.id}-`)) {
      throw new Error(`Epic status: ${epic.id} file must contain its id`);
    }
    epicsById.set(epic.id, epic);
    files.add(epic.file);
    assertLifecycleFields(epic);
  }

  for (const epic of catalog.epics) {
    for (const dependency of epic.dependencies) {
      if (dependency === epic.id) throw new Error(`Epic status: ${epic.id} cannot depend on itself`);
      if (!epicsById.has(dependency)) {
        throw new Error(`Epic status: ${epic.id} has unknown dependency ${dependency}`);
      }
      if (["in_progress", "completed"].includes(epic.status) && epicsById.get(dependency).status !== "completed") {
        throw new Error(`Epic status: ${epic.id} ${epic.status} requires completed dependency ${dependency}`);
      }
    }
  }

  assertAcyclic(epicsById);

  const active = catalog.epics.filter((epic) => epic.status === "in_progress");
  if (active.length > 1) throw new Error("Epic status: at most one epic may be in_progress");

  const highestEpicNumber = catalog.epics.reduce(
    (highest, epic) => Math.max(highest, Number(epic.id.slice(5))),
    0,
  );
  if (catalog.next_epic_number <= highestEpicNumber) {
    throw new Error(
      "Epic status: next_epic_number must be greater than every registered epic id",
    );
  }
}
