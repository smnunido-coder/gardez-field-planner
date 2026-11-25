"use client";

export default function OfficeError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-10">
      <h1 className="text-xl font-semibold text-navy">The planner could not load this page</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 h-11 rounded-md bg-primary px-4 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
