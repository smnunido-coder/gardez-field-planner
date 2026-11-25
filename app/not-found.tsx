import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <p className="text-sm font-medium text-primary">UNDP Gardez</p>
      <h1 className="mt-2 text-2xl font-semibold text-navy">That page is not in the planner</h1>
      <p className="mt-3 text-sm text-muted-foreground">The link may be old, or the mission was removed.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary underline">
        Back to the dashboard
      </Link>
    </main>
  );
}
