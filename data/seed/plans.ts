export type SeedPlan = {
  id: string;
  staffId: string;
  day: string;
  weekStart: string;
  province: string;
  location: string;
  activity: string;
  note: string;
  projectIds: string[];
};

/** Filed from the mission log: Samoon is in Ghazni on 25 Nov 2026 for the EWSSO RNA. */
export const PLANS: SeedPlan[] = [
  {
    id: "PLAN-SEED-2026-11-25-STF-11",
    staffId: "STF-11",
    day: "2026-11-25",
    weekStart: "2026-11-21",
    province: "Ghazni",
    location: "Ghazni",
    activity: "site_visit",
    note: "REVIVE MSME rapid needs assessment with EWSSO. Review RNA readiness and consult the regional team.",
    projectIds: ["REV2-EWSSO"],
  },
];
