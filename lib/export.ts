import { activityLabel } from "@/lib/labels";
import { weekdayName } from "@/lib/dates";
import type { PlanDay, Staff } from "@/lib/types";

export type ExportRow = {
  Staff: string;
  Role: string;
  Date: string;
  Weekday: string;
  Province: string;
  District: string;
  Activity: string;
  Project: string;
  Programme: string;
  Partner: string;
  Note: string;
};

function excelSafe(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

export function planRows(days: PlanDay[], staffById: Map<string, Staff>): ExportRow[] {
  const rows: ExportRow[] = [];
  for (const day of days) {
    const person = staffById.get(day.staffId);
    const base = {
      Staff: person?.fullName ?? day.staffId,
      Role: person?.role ?? "",
      Date: day.day,
      Weekday: weekdayName(day.day),
      Province: day.province,
      District: day.location,
      Activity: activityLabel(day.activity),
      Note: day.note,
    };
    if (!day.projects.length) {
      rows.push({ ...base, Project: "", Programme: "", Partner: "" });
      continue;
    }
    for (const project of day.projects) {
      rows.push({
        ...base,
        Project: project.name,
        Programme: project.programme,
        Partner: project.partner,
      });
    }
  }
  return rows;
}

export function toCsv(rows: ExportRow[]): string {
  const headers = Object.keys(rows[0] ?? {
    Staff: "",
    Role: "",
    Date: "",
    Weekday: "",
    Province: "",
    District: "",
    Activity: "",
    Project: "",
    Programme: "",
    Partner: "",
    Note: "",
  }) as (keyof ExportRow)[];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers
        .map((header) => {
          const value = excelSafe(row[header] ?? "");
          return /[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
        })
        .join(","),
    );
  }
  return `\uFEFF${lines.join("\r\n")}`;
}

function xml(value: string): string {
  return excelSafe(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function toExcelXml(rows: ExportRow[]): string {
  const headers = [
    "Staff",
    "Role",
    "Date",
    "Weekday",
    "Province",
    "District",
    "Activity",
    "Project",
    "Programme",
    "Partner",
    "Note",
  ] as const;
  const head = headers.map((header) => `<Cell><Data ss:Type="String">${xml(header)}</Data></Cell>`).join("");
  const body = rows
    .map(
      (row) =>
        `<Row>${headers
          .map((header) => `<Cell><Data ss:Type="String">${xml(row[header] ?? "")}</Data></Cell>`)
          .join("")}</Row>`,
    )
    .join("");
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Plans"><Table><Row>${head}</Row>${body}</Table></Worksheet>
</Workbook>`;
}
