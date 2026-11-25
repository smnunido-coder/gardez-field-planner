import { Suspense } from "react";
import { Banner } from "@/components/banner";
import { MissionForm } from "@/components/mission-form";
import { byLastName } from "@/lib/names";
import { listProjects, listStaff } from "@/lib/queries";
import { one } from "@/lib/utils";

export const metadata = { title: "Add mission" };

export default function NewMissionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading the form…</p>}>
      <NewMission searchParams={searchParams} />
    </Suspense>
  );
}

async function NewMission({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [staff, projects] = await Promise.all([listStaff(), listProjects()]);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold text-navy">Add a mission</h1>
      <Banner error={one(params.error)} />
      <MissionForm staff={byLastName(staff)} projects={projects} />
    </div>
  );
}
