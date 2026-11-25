async function main() {
  const { listMissions, listProjects, listStaff, listWorkplans } = await import("../lib/queries");
  const [staff, projects, missions, workplans] = await Promise.all([
    listStaff(),
    listProjects(),
    listMissions(),
    listWorkplans(),
  ]);
  console.log(
    `Database ready. ${staff.length} staff, ${projects.length} projects, ${missions.length} missions, ${workplans.length} workplan rows.`,
  );
}

main();
