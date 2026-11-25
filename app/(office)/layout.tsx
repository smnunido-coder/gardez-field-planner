import { Suspense } from "react";
import { Loading, Shell } from "@/components/shell";
import { getCurrentUser } from "@/lib/auth";
import { getWorkDays } from "@/lib/queries";

export const instant = false;

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading label="Opening the Gardez planner…" />}>
      <OfficeFrame>{children}</OfficeFrame>
    </Suspense>
  );
}

async function OfficeFrame({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const workDays = await getWorkDays();
  return (
    <Shell user={user} workDays={workDays}>
      {children}
    </Shell>
  );
}
