import { ERRORS, NOTICES } from "@/lib/messages";

export function Banner({ notice, error }: { notice?: string; error?: string }) {
  const message = (notice && NOTICES[notice]) || (error && ERRORS[error]);
  if (!message) return null;
  const bad = Boolean(error && ERRORS[error]);
  return (
    <p
      role="status"
      className={
        bad
          ? "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
          : "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950"
      }
    >
      {message}
    </p>
  );
}
