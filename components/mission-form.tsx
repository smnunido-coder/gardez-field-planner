import { saveMissionAction, deleteMissionAction } from "@/lib/actions";
import { MISSION_STATUSES, PROVINCES, groupByProgramme } from "@/lib/labels";
import type { Mission, Project, Staff } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MissionForm({
  mission,
  projects,
  staff,
}: {
  mission?: Mission;
  projects: Project[];
  staff: Staff[];
}) {
  const selectedProjects = new Set(mission?.projectIds ?? []);
  const selectedStaff = new Set(mission?.staffIds ?? []);
  const selectedProvinces = new Set(mission?.provinces ?? []);
  const groups = groupByProgramme(projects.filter((project) => project.active || selectedProjects.has(project.id)));

  return (
    <div className="space-y-4">
    <form action={saveMissionAction} className="space-y-4">
      {mission ? <input type="hidden" name="id" value={mission.id} /> : null}
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Title</span>
        <input className={fieldClass} name="title" required maxLength={180} defaultValue={mission?.title ?? ""} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Start</span>
          <input className={fieldClass} type="date" name="startDate" required defaultValue={mission?.startDate ?? ""} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">End</span>
          <input className={fieldClass} type="date" name="endDate" required defaultValue={mission?.endDate ?? ""} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select className={fieldClass} name="status" defaultValue={mission?.status ?? "Planned"}>
            {MISSION_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">BTOR done</span>
          <select className={fieldClass} name="btor" defaultValue={mission?.btorDone ? "yes" : "no"}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Location</span>
        <input className={fieldClass} name="location" maxLength={200} defaultValue={mission?.location ?? ""} />
      </label>
      <fieldset>
        <legend className="text-sm font-medium">Provinces</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROVINCES.map((province) => (
            <label key={province} className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-sm">
              <input type="checkbox" name="province" value={province} defaultChecked={selectedProvinces.has(province)} className="size-4 accent-primary" />
              {province}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-medium">Travellers</legend>
        <div className="mt-2 grid gap-1 sm:grid-cols-2">
          {staff.filter((person) => person.active || selectedStaff.has(person.id)).map((person) => (
            <label key={person.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="traveller" value={person.id} defaultChecked={selectedStaff.has(person.id)} className="size-5 accent-primary" />
              {person.fullName}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-medium">Projects</legend>
        <div className="mt-2 space-y-3">
          {groups.map((group) => (
            <div key={group.programme}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.programme}</p>
              <div className="mt-1 grid gap-1 sm:grid-cols-2">
                {group.items.map((project) => (
                  <label key={project.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="missionProject"
                      value={project.id}
                      defaultChecked={selectedProjects.has(project.id)}
                      className="mt-0.5 size-5 accent-primary"
                    />
                    {project.shortName}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Purpose</span>
        <Textarea name="purpose" required maxLength={2000} defaultValue={mission?.purpose ?? ""} />
      </label>
      <Button type="submit" size="lg">
        Save mission
      </Button>
    </form>
      {mission ? (
        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium">Remove this mission</p>
          <form action={deleteMissionAction} className="mt-2 space-y-2">
            <input type="hidden" name="id" value={mission.id} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="confirm" value="yes" required className="size-5 accent-primary" />
              Yes, delete this mission
            </label>
            <Button type="submit" variant="destructive" size="sm">
              Delete
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
