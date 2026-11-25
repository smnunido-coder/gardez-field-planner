import { getOptionalUser } from "@/lib/auth";
import { kabulToday, weekDates, weekStartFor } from "@/lib/dates";
import { planRows, toCsv, toExcelXml } from "@/lib/export";
import { matchingDays, type WeekFilters } from "@/lib/filters";
import { getWorkDays, listStaff, plansBetween } from "@/lib/queries";

export async function GET(request: Request) {
  const user = await getOptionalUser();
  if (!user) return new Response("Sign in required", { status: 401 });

  const url = new URL(request.url);
  const workDays = await getWorkDays();
  const weekStart = weekStartFor(url.searchParams.get("week") || url.searchParams.get("on") || kabulToday(), workDays);
  const dates = weekDates(weekStart, workDays);
  const filters: WeekFilters = {
    staffId: url.searchParams.get("staff") ?? "",
    projectId: url.searchParams.get("project") ?? "",
    programme: url.searchParams.get("programme") ?? "",
    province: url.searchParams.get("province") ?? "",
  };
  const [staff, plans] = await Promise.all([
    listStaff(),
    plansBetween(dates[0] ?? weekStart, dates[dates.length - 1] ?? weekStart),
  ]);
  const rows = planRows(matchingDays(plans, filters), new Map(staff.map((person) => [person.id, person])));
  const format = url.searchParams.get("format") === "xls" ? "xls" : "csv";
  if (format === "xls") {
    return new Response(toExcelXml(rows), {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="gardez-plans-${weekStart}.xls"`,
        "Cache-Control": "no-store",
      },
    });
  }
  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gardez-plans-${weekStart}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
