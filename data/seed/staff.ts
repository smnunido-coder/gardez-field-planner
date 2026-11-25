export type SeedStaff = {
  id: string;
  fullName: string;
  role: string;
  isAdmin: boolean;
};

export const STAFF: SeedStaff[] = [
  { id: "STF-01", fullName: "Mohammad Hasan Halimzai", role: "", isAdmin: false },
  { id: "STF-02", fullName: "Abdullah Durani", role: "Field Engineer", isAdmin: false },
  { id: "STF-03", fullName: "Muhammad Shafiq", role: "", isAdmin: false },
  { id: "STF-04", fullName: "Obaidullah Sadat", role: "", isAdmin: false },
  { id: "STF-05", fullName: "Jahanzeb Yarghal", role: "Livelihood Officer", isAdmin: false },
  { id: "STF-06", fullName: "Sayed Samoon Ahmadi", role: "Community Mobilizer", isAdmin: false },
  { id: "STF-07", fullName: "Mohammad Hamid Omer", role: "", isAdmin: false },
  { id: "STF-08", fullName: "Khalid Ahmad Attaee", role: "", isAdmin: false },
  { id: "STF-09", fullName: "Liaqat Srak", role: "", isAdmin: false },
  { id: "STF-10", fullName: "Zabiullah Danish", role: "", isAdmin: false },
  { id: "STF-11", fullName: "Dad Mohammad Samoon", role: "Livelihood Field Officer", isAdmin: true },
  { id: "STF-12", fullName: "Saif ur Rehman Ludin", role: "M&E Officer", isAdmin: false },
];
