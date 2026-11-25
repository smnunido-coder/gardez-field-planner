import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fieldClass } from "@/components/ui/input";
import { formatMonthTick, kabulToday, monthsBetween } from "@/lib/dates";
import { statusClass, statusColor } from "@/lib/labels";
import { listWorkplans } from "@/lib/queries";
import { one } from "@/lib/utils";

export const metadata = { title: "Workplans" };

export default function WorkplansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading workplans…</p>}>
      <Workplans searchParams={searchParams} />
    </Suspense>
  );
}

async function Workplans({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const partner = one(params.partner);
  const status = one(params.status);
  const items = await listWorkplans(partner, status);
  const all = partner || status ? await listWorkplans() : items;
  const partners = [...new Set(all.map((item) => item.partner))];
  const statuses = [...new Set(all.map((item) => item.status))];
  const currentMonth = kabulToday().slice(0, 7);
  const span = items.reduce(
    (range, item) => ({
      start: !range.start || item.startMonth < range.start ? item.startMonth : range.start,
      end: !range.end || item.endMonth > range.end ? item.endMonth : range.end,
    }),
    { start: currentMonth, end: currentMonth },
  );
  const months = monthsBetween(span.start, span.end);
  const template = {
    gridTemplateColumns: `minmax(180px, 280px) repeat(${Math.max(months.length, 1)}, minmax(36px, 1fr))`,
  };
  const rows: React.ReactNode[] = [];
  let lastGroup = "";
  for (const item of items) {
    const group = `${item.partner} · ${item.project}`;
    const showGroup = group !== lastGroup;
    lastGroup = group;
    const start = Math.max(0, months.indexOf(item.startMonth));
    const end = Math.max(start, months.indexOf(item.endMonth));
    rows.push(
      <div key={item.id}>
        {showGroup ? (
          <div className="sticky left-0 border-b border-border bg-slate-50 px-2 py-1.5 text-xs font-semibold text-navy">
            {group}
          </div>
        ) : null}
        <div className="grid border-b border-border" style={template}>
          <div className="sticky left-0 z-10 bg-white px-2 py-1.5" title={`${item.activity} — ${item.progress} — ${item.source}`}>
            <p className="line-clamp-2 text-xs leading-4">{item.activity}</p>
            <Badge className={`mt-1 ${statusClass(item.status)}`}>{item.status}</Badge>
          </div>
          <div
            className="mx-0.5 h-2.5 self-center rounded"
            style={{
              gridColumn: `${start + 2} / ${end + 3}`,
              gridRow: 1,
              background: statusColor(item.status),
            }}
            title={`${item.startMonth} to ${item.endMonth} · ${item.progress}`}
          />
        </div>
      </div>,
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Partner workplans</h1>
        <p className="text-sm text-muted-foreground">Monthly bars from partner proposals and the latest biweekly reports.</p>
      </div>
      <Card className="p-3">
        <form className="grid gap-3 sm:grid-cols-3">
          <select className={fieldClass} name="partner" defaultValue={partner} aria-label="Partner">
            <option value="">All partners</option>
            {partners.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select className={fieldClass} name="status" defaultValue={status} aria-label="Status">
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Button type="submit">Filter</Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {["Completed", "In Progress", "Planned", "Not Started", "At Risk"].map((item) => (
            <span key={item} className="inline-flex items-center gap-1">
              <span className="inline-block size-2.5 rounded-sm" style={{ background: statusColor(item) }} />
              {item}
            </span>
          ))}
        </div>
      </Card>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activities match.</p>
      ) : (
        <Card className="overflow-hidden">
          <div className="max-h-[75vh] overflow-auto">
            <div className="min-w-[860px]">
              <div className="sticky top-0 z-20 grid border-b border-border bg-white" style={template}>
                <div className="sticky left-0 bg-white px-2 py-2 text-xs font-medium">Activity</div>
                {months.map((month, index) => (
                  <div
                    key={month}
                    className={`px-1 py-2 text-center text-[11px] ${month === currentMonth ? "bg-sky-50 font-semibold text-primary" : "text-muted-foreground"}`}
                  >
                    {formatMonthTick(month, index === 0)}
                  </div>
                ))}
              </div>
              {rows}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
