import Link from "next/link";
import { Suspense } from "react";
import { Banner } from "@/components/banner";
import { ProjectChecks } from "@/components/project-checks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fieldClass } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveWeek } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { addDays, canEditWeek, formatDayShort, formatWeekRange, kabulToday, weekDates, weekStartFor } from "@/lib/dates";
import { ACTIVITIES, PROVINCES, activityLabel } from "@/lib/labels";
import { getWorkDays, listProjects, listStaff, plansBetween } from "@/lib/queries";
import { one } from "@/lib/utils";

export const metadata = { title: "My week" };

export default function PlanPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading the week…</p>}>
      <PlanForm searchParams={searchParams} />
    </Suspense>
  );
}

async function PlanForm({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const workDays = await getWorkDays();
  const today = kabulToday();
  const weekStart = weekStartFor(one(params.week) || today, workDays);
  const dates = weekDates(weekStart, workDays);
  const staff = await listStaff();
  const viewed = staff.find((person) => person.id === one(params.staff)) ?? user;
  const own = viewed.id === user.id;
  const editable = own && canEditWeek(dates, today, user.isAdmin);
  const [projects, plans] = await Promise.all([
    listProjects(),
    plansBetween(dates[0] ?? weekStart, dates[dates.length - 1] ?? weekStart),
  ]);
  const active = projects.filter((project) => project.active);
  const byDay = new Map(plans.filter((day) => day.staffId === viewed.id).map((day) => [day.day, day]));
  const picker = [...active];
  for (const day of byDay.values()) {
    for (const project of day.projects) {
      if (!picker.some((item) => item.id === project.id)) {
        const full = projects.find((item) => item.id === project.id);
        if (full) picker.push(full);
      }
    }
  }

  return (
    <form action={saveWeek} className="space-y-4">
      <input type="hidden" name="weekStart" value={weekStart} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">{own ? "My week" : viewed.fullName}</h1>
          <p className="text-sm text-muted-foreground">{formatWeekRange(dates)}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/plan?week=${addDays(weekStart, -7)}${own ? "" : `&staff=${viewed.id}`}`}>Previous</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/plan${own ? "" : `?staff=${viewed.id}`}`}>This week</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/plan?week=${addDays(weekStart, 7)}${own ? "" : `&staff=${viewed.id}`}`}>Next</Link>
          </Button>
        </div>
      </div>
      <Banner notice={one(params.notice)} error={one(params.error)} />
      <p className="text-sm leading-6 text-muted-foreground">
        Tick every project you will work on that day. A day can have more than one. District, activity, and note are optional.
      </p>
      {!own ? (
        <p className="rounded-md bg-slate-100 px-3 py-2 text-sm">You are reading {viewed.fullName}&apos;s week.</p>
      ) : null}
      {!editable && own ? (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950">
          This week is closed. The current week and later weeks can still be edited.
        </p>
      ) : null}
      <fieldset disabled={!editable} className="space-y-3">
        {dates.map((day) => {
          const entry = byDay.get(day);
          const selected = new Set(entry?.projects.map((project) => project.id) ?? []);
          const summary = [
            selected.size ? `${selected.size} project${selected.size === 1 ? "" : "s"}` : "No projects",
            entry?.activity ? activityLabel(entry.activity) : "",
            entry?.province ?? "",
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <Card key={day} className="overflow-hidden">
              <details open={day === today || selected.size > 0 || Boolean(entry?.note)}>
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3">
                  <span>
                    <span className="font-semibold text-navy">{formatDayShort(day)}</span>
                    {day === today ? <span className="ml-2 text-xs font-medium text-primary">Today</span> : null}
                    <span className="mt-0.5 block text-xs text-muted-foreground">{summary}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">Edit</span>
                </summary>
                <div className="space-y-4 border-t border-border px-4 py-4">
                  <ProjectChecks projects={picker} selected={selected} valueFor={(project) => `${day}|${project.id}`} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                      <span className="mb-1 block font-medium">Activity</span>
                      <select className={fieldClass} name={`activity_${day}`} defaultValue={entry?.activity ?? ""}>
                        <option value="">Not set</option>
                        {ACTIVITIES.map((activity) => (
                          <option key={activity.id} value={activity.id}>
                            {activity.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block font-medium">Province</span>
                      <select className={fieldClass} name={`province_${day}`} defaultValue={entry?.province ?? ""}>
                        <option value="">Not set</option>
                        {PROVINCES.map((province) => (
                          <option key={province}>{province}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm sm:col-span-2">
                      <span className="mb-1 block font-medium">District / location</span>
                      <input
                        className={fieldClass}
                        name={`location_${day}`}
                        defaultValue={entry?.location ?? ""}
                        maxLength={200}
                        placeholder="e.g. Yousuf Khail"
                      />
                    </label>
                    <label className="text-sm sm:col-span-2">
                      <span className="mb-1 block font-medium">Note</span>
                      <Textarea name={`note_${day}`} defaultValue={entry?.note ?? ""} maxLength={1000} />
                    </label>
                  </div>
                </div>
              </details>
            </Card>
          );
        })}
      </fieldset>
      {editable ? (
        <div className="sticky bottom-0 -mx-4 border-t border-border bg-white/95 px-4 py-3">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Save week
          </Button>
        </div>
      ) : null}
    </form>
  );
}
