import Link from "next/link";
import { Suspense } from "react";
import { BarList } from "@/components/bars";
import { Banner } from "@/components/banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fieldClass } from "@/components/ui/input";
import { addDays, formatDate, formatDayShort, formatWeekRange, kabulToday, weekDates, weekStartFor } from "@/lib/dates";
import { hrefWith, matchingDays, visibleStaff, type WeekFilters } from "@/lib/filters";
import { activityLabel, chipClass, isFieldActivity, statusClass } from "@/lib/labels";
import { byLastName } from "@/lib/names";
import { getCurrentUser } from "@/lib/auth";
import { getWorkDays, listProjects, listStaff, listWeekStarts, missionsCovering, plansBetween } from "@/lib/queries";
import { one } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading this week…</p>}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const workDays = await getWorkDays();
  const today = kabulToday();
  const requested = one(params.on) || one(params.week) || today;
  const weekStart = weekStartFor(requested, workDays);
  const dates = weekDates(weekStart, workDays);
  const filters: WeekFilters = {
    staffId: one(params.staff),
    projectId: one(params.project),
    programme: one(params.programme),
    province: one(params.province),
  };
  const [staff, projects, weekPlans, todayPlans, missions, history] = await Promise.all([
    listStaff(),
    listProjects(),
    plansBetween(dates[0] ?? weekStart, dates[dates.length - 1] ?? weekStart),
    plansBetween(today, today),
    missionsCovering(today),
    listWeekStarts(),
  ]);
  const ordered = byLastName(staff);
  const matched = matchingDays(weekPlans, filters);
  const rows = visibleStaff(ordered, matched, filters, weekPlans);
  const byStaffDay = new Map(matched.map((day) => [`${day.staffId}:${day.day}`, day]));
  const filed = new Set(matched.map((day) => day.staffId));
  const projectCounts = new Map<string, { label: string; value: number }>();
  const provinceCounts = new Map<string, number>();
  for (const day of matched) {
    const province = day.province || "Not set";
    provinceCounts.set(province, (provinceCounts.get(province) ?? 0) + 1);
    for (const project of day.projects) {
      const current = projectCounts.get(project.id) ?? { label: project.shortName, value: 0 };
      current.value += 1;
      projectCounts.set(project.id, current);
    }
  }
  const fieldToday = matchingDays(todayPlans, filters).filter((day) => isFieldActivity(day.activity));
  const programmes = [...new Set(projects.map((project) => project.programme))];
  const provinces = [...new Set(projects.flatMap((project) => project.provinces))].sort();
  const query = {
    week: weekStart,
    staff: filters.staffId,
    project: filters.projectId,
    programme: filters.programme,
    province: filters.province,
  };
  const mine = weekPlans.some((day) => day.staffId === user.id);
  const showGap = !filters.projectId && !filters.programme && !filters.province && dates.includes(today);
  const missing = showGap ? ordered.filter((person) => person.active && !weekPlans.some((day) => day.staffId === person.id)) : [];
  const staffById = new Map(staff.map((person) => [person.id, person]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">This week</h1>
          <p className="text-sm text-muted-foreground">{formatWeekRange(dates)}</p>
        </div>
        <div className="no-print flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={hrefWith("/", { ...query, week: addDays(weekStart, -7) })}>Previous</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/">This week</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={hrefWith("/", { ...query, week: addDays(weekStart, 7) })}>Next</Link>
          </Button>
        </div>
      </div>

      {!mine && dates[dates.length - 1]! >= today ? (
        <p className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm">
          You have not filed a plan for this week.{" "}
          <Link href={`/plan?week=${weekStart}`} className="font-medium text-primary underline">
            Open My week
          </Link>
        </p>
      ) : null}

      <Card className="no-print p-3">
        <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Week of</span>
            <input className={fieldClass} type="date" name="on" defaultValue={weekStart} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Staff</span>
            <select className={fieldClass} name="staff" defaultValue={filters.staffId}>
              <option value="">Everyone</option>
              {ordered.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.fullName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Project</span>
            <select className={fieldClass} name="project" defaultValue={filters.projectId}>
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.shortName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Programme</span>
            <select className={fieldClass} name="programme" defaultValue={filters.programme}>
              <option value="">All programmes</option>
              {programmes.map((programme) => (
                <option key={programme}>{programme}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Province</span>
            <select className={fieldClass} name="province" defaultValue={filters.province}>
              <option value="">All provinces</option>
              {provinces.map((province) => (
                <option key={province}>{province}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <Button type="submit">Apply</Button>
            <Button asChild variant="outline">
              <Link href="/">Clear</Link>
            </Button>
          </div>
        </form>
        <div className="mt-3 flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={hrefWith("/api/export", { ...query, format: "csv" })}>CSV</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={hrefWith("/api/export", { ...query, format: "xls" })}>Excel</a>
          </Button>
        </div>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Plans filed" value={`${filed.size} of ${rows.length || ordered.filter((p) => p.active).length}`} />
        <Metric label="Staff-days" value={String(matched.length)} />
        <Metric label="In the field today" value={String(fieldToday.length)} />
        <Metric label="Projects touched" value={String(projectCounts.size)} />
      </section>

      <Card className="p-4">
        <h2 className="font-semibold text-navy">In the field today · {formatDate(today)}</h2>
        <p className="mt-1 text-xs text-muted-foreground">Site visits, monitoring, and travel. Office days are not listed.</p>
        {fieldToday.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No field movement is marked for today.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {fieldToday.map((day) => (
              <li key={day.id} className="py-2 text-sm">
                <span className="font-medium">{staffById.get(day.staffId)?.fullName}</span>
                <span className="text-muted-foreground"> · {activityLabel(day.activity)}</span>
                <span className="block text-muted-foreground">
                  {[day.province, day.location].filter(Boolean).join(" · ") || "Location not set"}
                  {" · "}
                  {day.projects.map((project) => project.shortName).join(", ") || "No project"}
                </span>
              </li>
            ))}
          </ul>
        )}
        {missions.length > 0 ? (
          <div className="mt-4 border-t border-border pt-3">
            <h3 className="text-sm font-medium">Missions covering today</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {missions.map((mission) => (
                <li key={mission.id}>
                  <Link href={`/missions/${mission.id}`} className="font-medium text-primary hover:underline">
                    {mission.title}
                  </Link>
                  <Badge className={`ml-2 ${statusClass(mission.status)}`}>{mission.status}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky top-0 left-0 z-20 border-b border-r border-border bg-white p-2 text-left">Staff</th>
                {dates.map((day) => (
                  <th
                    key={day}
                    className={`sticky top-0 z-10 border-b border-border p-2 text-left font-medium ${day === today ? "bg-sky-50" : "bg-white"}`}
                  >
                    {formatDayShort(day)}
                    {day === today ? <span className="mt-0.5 block text-[11px] font-normal text-primary">Today</span> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((person) => (
                <tr key={person.id}>
                  <th className="sticky left-0 z-10 min-w-36 border-r border-b border-border bg-white p-2 text-left font-medium">
                    <Link href={`/plan?staff=${person.id}&week=${weekStart}`} className="hover:underline">
                      {person.fullName}
                    </Link>
                    {person.role ? <span className="block text-[11px] font-normal text-muted-foreground">{person.role}</span> : null}
                  </th>
                  {dates.map((day) => {
                    const entry = byStaffDay.get(`${person.id}:${day}`);
                    return (
                      <td key={day} className={`min-w-36 border-b border-border p-1.5 align-top ${day === today ? "bg-sky-50/70" : ""}`}>
                        {entry && entry.projects.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {entry.projects.map((project) => (
                              <Link
                                key={project.id}
                                href={hrefWith("/", { ...query, project: project.id })}
                                title={project.name}
                                className={`rounded px-1.5 py-0.5 text-[11px] font-medium leading-4 ${chipClass(project.programme)}`}
                              >
                                {project.shortName}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                        {entry?.activity ? <p className="mt-1 text-[11px] text-muted-foreground">{activityLabel(entry.activity)}</p> : null}
                        {entry && (entry.province || entry.location) ? (
                          <p className="text-[11px] text-muted-foreground">{[entry.province, entry.location].filter(Boolean).join(" · ")}</p>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? <p className="p-4 text-sm text-muted-foreground">No plans match these filters.</p> : null}
      </Card>

      {missing.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          Still to file: {missing.map((person) => person.fullName).join(", ")}.
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="font-semibold text-navy">Staff-days by project</h2>
          <p className="mb-3 mt-1 text-xs text-muted-foreground">One person selecting a project on one day counts as one.</p>
          <BarList
            rows={[...projectCounts.values()].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))}
            empty="No project days in this view."
          />
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold text-navy">Staff-days by province</h2>
          <p className="mb-3 mt-1 text-xs text-muted-foreground">One person on one day, using the province on that day.</p>
          <BarList
            rows={[...provinceCounts.entries()]
              .map(([label, value]) => ({ label, value }))
              .sort((a, b) => b.value - a.value)}
            empty="No province days in this view."
          />
        </Card>
      </section>

      <Card className="p-4">
        <h2 className="font-semibold text-navy">Earlier weeks</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No earlier plans yet.</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {history.map((start) => (
              <li key={start}>
                <Link
                  href={hrefWith("/", { ...query, week: start })}
                  className={`inline-block rounded-full border px-3 py-1 text-sm ${start === weekStart ? "border-primary bg-accent" : "border-border bg-white"}`}
                >
                  {formatWeekRange(weekDates(start, workDays))}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Banner notice={one(params.notice)} error={one(params.error)} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-navy">{value}</p>
    </Card>
  );
}
