import { groupByProgramme } from "@/lib/labels";
import type { Project } from "@/lib/types";

export function ProjectChecks({
  projects,
  selected,
  valueFor,
}: {
  projects: Project[];
  selected: Set<string>;
  valueFor: (project: Project) => string;
}) {
  const groups = groupByProgramme(projects);
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <fieldset key={group.programme}>
          <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.programme}
          </legend>
          <div className="mt-1 grid gap-1 sm:grid-cols-2">
            {group.items.map((project) => (
              <label key={project.id} className="flex items-start gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-accent">
                <input
                  type="checkbox"
                  name="project"
                  value={valueFor(project)}
                  defaultChecked={selected.has(project.id)}
                  className="mt-0.5 size-5 shrink-0 accent-primary"
                />
                <span>
                  <span className="font-medium">{project.shortName}</span>
                  <span className="block text-xs text-muted-foreground">{project.provinces.join(", ")}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
