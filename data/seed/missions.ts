export type SeedMission = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  provinces: string[];
  location: string;
  projectIds: string[];
  staffIds: string[];
  purpose: string;
  btor: "On file" | "Pending";
};

export const MISSIONS: SeedMission[] = [
  {
    id: "MIS-2026-1004",
    title: "CfW Contractor Practical Documentation Training",
    startDate: "2026-10-04",
    endDate: "2026-10-04",
    status: "Completed",
    provinces: ["Paktya"],
    location: "UNDP SER Gardez Sub-Office",
    projectIds: ["JICA-ALCC", "REEP-DTC-SOLAR"],
    staffIds: ["STF-11", "STF-05", "STF-06", "STF-12"],
    purpose:
      "Hands-on training on Cash-for-Work documentation compliance, attendance sheets, and corrective reporting.",
    btor: "On file",
  },
  {
    id: "MIS-2026-1008",
    title: "Logar UNRT Coordination Meeting",
    startDate: "2026-10-08",
    endDate: "2026-10-08",
    status: "Completed",
    provinces: ["Logar"],
    location: "Pul-e-Alam, Logar Province",
    projectIds: ["REEP-ORD"],
    staffIds: ["STF-11"],
    purpose:
      "Represent UNDP SER at Logar UNRT meeting on returnee response, partner coordination, and 3Ws alignment.",
    btor: "On file",
  },
  {
    id: "MIS-2026-1018",
    title: "Paktika CfW Monitoring Visit – Yousuf Khail (4 Villages)",
    startDate: "2026-10-18",
    endDate: "2026-10-20",
    status: "Completed",
    provinces: ["Paktika"],
    location: "Zmarai Kot, Abdih, Chor Khaka, Mulakh",
    projectIds: ["JICA-ALCC"],
    staffIds: ["STF-06"],
    purpose:
      "Field monitoring of 4 JICA WE-ACT-II CfW water infrastructure sites and community committee verification.",
    btor: "On file",
  },
  {
    id: "MIS-2026-1025",
    title: "Follow-up Field Monitoring & CfW Compliance Review – ALCC Sites",
    startDate: "2026-10-22",
    endDate: "2026-10-26",
    status: "Completed (Verification Pending)",
    provinces: ["Paktika"],
    location: "Malakha and other ALCC CfW sites",
    projectIds: ["JICA-ALCC"],
    staffIds: ["STF-02", "STF-05", "STF-06", "STF-01"],
    purpose:
      "Verify CfW labour documentation, safety/compliance, and site progress; issue urgent corrective action notice.",
    btor: "Pending",
  },
  {
    id: "MIS-2026-1026",
    title: "UNODC Mission to SER & Meeting with UNDP Gardez Team",
    startDate: "2026-10-26",
    endDate: "2026-10-26",
    status: "Completed",
    provinces: ["Paktya"],
    location: "UNDP Gardez Regional Office",
    projectIds: ["REEP-ORD", "REEP-OMEED"],
    staffIds: ["STF-11"],
    purpose:
      "Coordination meeting with visiting UNODC mission regarding drug recovery and REEP complementarity.",
    btor: "Pending",
  },
  {
    id: "MIS-2026-1027",
    title: "Ghazni Coordination Meetings & Site Visits (REVIVE-II & REEP)",
    startDate: "2026-10-27",
    endDate: "2026-10-29",
    status: "Completed",
    provinces: ["Ghazni"],
    location: "Ghazni Directorates, Women DTC, partner sites",
    projectIds: ["REV2-EWSSO", "REV2-OHAD", "REV2-EPTDO", "REV2-HAS", "REEP-OMEED", "REEP-DTC-SOLAR"],
    staffIds: ["STF-11"],
    purpose:
      "Introduce REVIVE-II and REEP partners to Ghazni directorates, resolve MoU bottlenecks, and inspect the Women DTC.",
    btor: "Pending",
  },
  {
    id: "MIS-2026-1101",
    title: "Technical Support Visit to Ghazni – OMEED (REEP)",
    startDate: "2026-11-01",
    endDate: "2026-11-01",
    status: "Completed",
    provinces: ["Ghazni"],
    location: "Ghazni Province (OMEED REEP office/sites)",
    projectIds: ["REEP-OMEED"],
    staffIds: ["STF-05"],
    purpose:
      "Follow-up technical support on OMEED REEP beneficiary selection, TVET curricula, and MSME mapping.",
    btor: "Pending",
  },
  {
    id: "MIS-2026-1108",
    title: "RR Visit Beneficiary Verification & Follow-up (SER 5 Provinces)",
    startDate: "2026-11-28",
    endDate: "2026-11-28",
    status: "Planned",
    provinces: ["Ghazni", "Logar", "Paktya", "Paktika", "Khost"],
    location: "11 candidate beneficiary sites",
    projectIds: ["REEP-ORD", "REEP-OMEED", "REV2-EWSSO", "REV2-OHAD"],
    staffIds: ["STF-05"],
    purpose:
      "Validate beneficiary profiles, impact figures, quotes, and missing photos for the RR visit one-pagers.",
    btor: "Pending",
  },
  {
    id: "MIS-2026-1117",
    title: "EPTDO Tree Plantation Site Verification (Ghazni & Paktya)",
    startDate: "2026-11-17",
    endDate: "2026-11-17",
    status: "Planned",
    provinces: ["Ghazni", "Paktya"],
    location: "Tree plantation candidate sites with DAIL",
    projectIds: ["REV2-EPTDO"],
    staffIds: ["STF-05", "STF-11"],
    purpose:
      "Joint UNDP site assessment and verification following the EPTDO/DAIL initial visit, before mid-December 2026.",
    btor: "Pending",
  },
  {
    id: "MIS-2026-1125",
    title: "REVIVE MSMEs / Rapid Needs Assessment Mission to Ghazni",
    startDate: "2026-11-25",
    endDate: "2026-11-25",
    status: "Ongoing",
    provinces: ["Ghazni"],
    location: "Ghazni Province",
    projectIds: ["REV2-EWSSO"],
    staffIds: ["STF-11"],
    purpose:
      "Review EWSSO Rapid Needs Assessment readiness, validate MSME findings, and consult regional teams.",
    btor: "Pending",
  },
  {
    id: "MIS-2027-0124",
    title: "REVIVE-II Output 2 Mission to SER (Paktya & Ghazni)",
    startDate: "2027-01-24",
    endDate: "2027-01-27",
    status: "Planned",
    provinces: ["Paktya", "Ghazni"],
    location: "Paktya and Ghazni REVIVE-II Output 2 sites",
    projectIds: ["REV2-EWSSO", "REV2-WAHO", "REV2-OHAD", "REV2-EPTDO"],
    staffIds: ["STF-11", "STF-05", "STF-12"],
    purpose:
      "Monitor Output 2 progress (tree plantation, greenhouses, MSME support), give technical support, and record bottlenecks.",
    btor: "Pending",
  },
];
