export const AFGHAN_WEEK = [6, 0, 1, 2, 3, 4, 5] as const;
export const DEFAULT_WORK_DAYS = [6, 0, 1, 2, 3, 4];

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function normalizeWorkDays(days: number[]): number[] {
  const set = new Set(days.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6));
  return AFGHAN_WEEK.filter((day) => set.has(day));
}

export function utcDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1));
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, amount: number): string {
  const date = utcDate(iso);
  date.setUTCDate(date.getUTCDate() + amount);
  return isoDate(date);
}

/** Calendar date in Afghanistan (UTC+4:30, no daylight saving). */
export function kabulToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kabul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function weekStartFor(iso: string, workDays: number[]): string {
  const days = workDays.length ? workDays : DEFAULT_WORK_DAYS;
  const first = days[0] ?? 6;
  const date = utcDate(iso);
  const delta = (date.getUTCDay() - first + 7) % 7;
  date.setUTCDate(date.getUTCDate() - delta);
  return isoDate(date);
}

export function weekDates(weekStart: string, workDays: number[]): string[] {
  const days = new Set(workDays.length ? workDays : DEFAULT_WORK_DAYS);
  const dates: string[] = [];
  for (let i = 0; i < 7; i += 1) {
    const iso = addDays(weekStart, i);
    if (days.has(utcDate(iso).getUTCDay())) dates.push(iso);
  }
  return dates;
}

export function weekdayName(iso: string): string {
  return DAY_LABELS[utcDate(iso).getUTCDay()] ?? "";
}

export function dayLabel(dayIndex: number): string {
  return DAY_LABELS[dayIndex] ?? "";
}

export function formatDayShort(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(utcDate(iso));
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate(iso));
}

export function formatWeekRange(dates: string[]): string {
  if (!dates.length) return "";
  const start = formatDayShort(dates[0]);
  const end = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate(dates[dates.length - 1]!));
  return `${start} – ${end}`;
}

export function workDaySentence(workDays: number[]): string {
  const labels = workDays.map((day) => DAY_LABELS[day]).filter(Boolean);
  if (labels.length === 0) return "No working days are set.";
  if (labels.length === 1) return `The work week is ${labels[0]} only.`;
  return `The work week starts on ${labels[0]} and runs ${labels.join(", ")}.`;
}

export function monthEnd(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${yearMonth}-${String(last).padStart(2, "0")}`;
}

export function parseWindow(windowText: string): { start: string | null; end: string | null } {
  const range = windowText.match(/(\d{4}-\d{2})\s+to\s+(\d{4}-\d{2})/);
  if (range) return { start: `${range[1]}-01`, end: monthEnd(range[2]!) };
  const from = windowText.match(/From\s+(\d{4}-\d{2})/i);
  if (from) return { start: `${from[1]}-01`, end: null };
  return { start: null, end: null };
}

export function monthsBetween(start: string, end: string): string[] {
  let [year, month] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  if (!year || !month || !endYear || !endMonth) return [];
  const months: string[] = [];
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month === 13) {
      month = 1;
      year += 1;
    }
    if (months.length > 48) break;
  }
  return months;
}

export function formatMonthTick(yearMonth: string, forceYear = false): string {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: forceYear || month === 1 ? "2-digit" : undefined,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function canEditWeek(dates: string[], today: string, isAdmin: boolean): boolean {
  if (isAdmin) return true;
  const last = dates[dates.length - 1];
  return Boolean(last && last >= today);
}
