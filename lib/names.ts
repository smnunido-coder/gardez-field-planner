export function normalizeNameInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/g, "")
    .trim();
}

/** Last word of a name, lowercased. "Saif ur Rehman Ludin" → "ludin". */
export function loginKey(input: string): string {
  const cleaned = normalizeNameInput(input).toLocaleLowerCase("en-US");
  if (!cleaned) return "";
  const parts = cleaned.split(" ");
  return parts[parts.length - 1] ?? "";
}

export function displayLastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] || fullName;
}

type Named = { fullName: string; active: boolean };

/**
 * Match a typed last name. A full name that matches exactly wins.
 * Otherwise the last word is compared, case-insensitively.
 */
export function matchStaff<T extends Named>(
  staff: T[],
  input: string,
  options?: { includeInactive?: boolean },
): T[] {
  const cleaned = normalizeNameInput(input);
  if (!cleaned) return [];
  const pool = options?.includeInactive ? staff : staff.filter((person) => person.active);
  const needle = cleaned.toLocaleLowerCase("en-US");
  const exact = pool.filter((person) => person.fullName.toLocaleLowerCase("en-US") === needle);
  if (exact.length > 0) return exact;
  const key = loginKey(cleaned);
  if (!key) return [];
  return pool.filter((person) => loginKey(person.fullName) === key);
}

export function byLastName<T extends { fullName: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      loginKey(a.fullName).localeCompare(loginKey(b.fullName), "en") ||
      a.fullName.localeCompare(b.fullName, "en"),
  );
}
