import type { PlanDay, Staff } from "@/lib/types";

export type WeekFilters = {
  staffId: string;
  projectId: string;
  programme: string;
  province: string;
};

export function matchingDays(days: PlanDay[], filters: WeekFilters): PlanDay[] {
  return days
    .filter((day) => {
      if (filters.staffId && day.staffId !== filters.staffId) return false;
      if (filters.province) {
        const tagged = day.province
          ? day.province === filters.province
          : day.projects.some((project) => project.provinces.includes(filters.province));
        if (!tagged) return false;
      }
      if (filters.projectId && !day.projects.some((project) => project.id === filters.projectId)) return false;
      if (filters.programme && !day.projects.some((project) => project.programme === filters.programme)) return false;
      return true;
    })
    .map((day) => {
      let projects = day.projects;
      if (filters.projectId) projects = projects.filter((project) => project.id === filters.projectId);
      else if (filters.programme) projects = projects.filter((project) => project.programme === filters.programme);
      return { ...day, projects };
    });
}

export function visibleStaff(staff: Staff[], matched: PlanDay[], filters: WeekFilters, weekDays: PlanDay[]): Staff[] {
  const narrow = Boolean(filters.projectId || filters.programme || filters.province);
  if (!narrow && filters.staffId) return staff.filter((person) => person.id === filters.staffId);
  if (!narrow) {
    const present = new Set(weekDays.map((day) => day.staffId));
    return staff.filter((person) => person.active || present.has(person.id));
  }
  const present = new Set(matched.map((day) => day.staffId));
  return staff.filter((person) => present.has(person.id));
}

export function hrefWith(path: string, values: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
