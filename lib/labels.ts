export const ACTIVITIES = [
  { id: "site_visit", label: "Site visit", field: true },
  { id: "monitoring", label: "Monitoring", field: true },
  { id: "meeting", label: "Meeting", field: false },
  { id: "office", label: "Office work", field: false },
  { id: "travel", label: "Travel", field: true },
] as const;

export type ActivityId = (typeof ACTIVITIES)[number]["id"];

export const PROVINCES = [
  "Ghazni",
  "Paktya",
  "Paktika",
  "Khost",
  "Logar",
  "Kabul",
  "Kunar",
  "Nangarhar",
] as const;

export const PROJECT_STATUSES = [
  "Ongoing",
  "Planned",
  "Under Procurement",
  "Closing / Extension Pending",
  "Ongoing (Verify)",
];

export const MISSION_STATUSES = [
  "Planned",
  "Ongoing",
  "Completed",
  "Completed (Verification Pending)",
];

export function activityLabel(id: string): string {
  return ACTIVITIES.find((item) => item.id === id)?.label ?? "";
}

export function isFieldActivity(id: string): boolean {
  return ACTIVITIES.some((item) => item.id === id && item.field);
}

export function chipClass(programme: string): string {
  switch (programme) {
    case "REVIVE-II":
      return "bg-sky-100 text-sky-950";
    case "JICA WE-ACT-II / ABADEI":
      return "bg-emerald-100 text-emerald-950";
    case "ABADEI-II":
      return "bg-teal-100 text-teal-950";
    case "REEP":
      return "bg-violet-100 text-violet-950";
    case "SESEHA Phase I":
      return "bg-amber-100 text-amber-950";
    case "ABADEI / STFA-2nd Tranche":
      return "bg-orange-100 text-orange-950";
    case "RoK REVIVE-I":
      return "bg-rose-100 text-rose-950";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export function statusClass(status: string): string {
  const value = status.toLowerCase();
  if (value.includes("complete")) return "bg-emerald-100 text-emerald-950";
  if (value.includes("risk") || value.includes("closing")) return "bg-amber-100 text-amber-950";
  if (value.includes("progress") || value.includes("ongoing")) return "bg-sky-100 text-sky-950";
  if (value.includes("procure") || value.includes("planned")) return "bg-slate-100 text-slate-700";
  if (value.includes("not started")) return "bg-slate-100 text-slate-500";
  return "bg-slate-100 text-slate-700";
}

export function statusColor(status: string): string {
  const value = status.toLowerCase();
  if (value.includes("complete")) return "#0f7b4c";
  if (value.includes("risk") || value.includes("closing")) return "#b45309";
  if (value.includes("progress") || value.includes("ongoing")) return "#0468b1";
  if (value.includes("planned")) return "#5b8eb8";
  if (value.includes("not started")) return "#b7c3ce";
  return "#8aa0b3";
}

export function progressPercent(value: string): number | null {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (!match) return null;
  const number = Number(match[1]);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, number));
}

export function groupByProgramme<T extends { programme: string }>(projects: T[]) {
  const groups: { programme: string; items: T[] }[] = [];
  for (const project of projects) {
    const current = groups[groups.length - 1];
    if (current && current.programme === project.programme) current.items.push(project);
    else groups.push({ programme: project.programme, items: [project] });
  }
  return groups;
}
