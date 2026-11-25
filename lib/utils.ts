import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function cleanLine(value: FormDataEntryValue | null, max: number): string {
  const raw = typeof value === "string" ? value : "";
  return raw.replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanNote(value: FormDataEntryValue | null, max: number): string {
  const raw = typeof value === "string" ? value : "";
  return raw.replace(/\r\n/g, "\n").trim().slice(0, max);
}
