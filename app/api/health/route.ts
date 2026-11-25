import { connection } from "next/server";

export async function GET() {
  await connection();
  const url = process.env.TURSO_DATABASE_URL ?? "";
  return Response.json({
    hasDatabaseUrl: url.length > 0,
    databaseUrlLooksRight: url.startsWith("libsql://") || url.startsWith("https://"),
    hasToken: Boolean(process.env.TURSO_AUTH_TOKEN),
    hasSessionSecret: Boolean(process.env.SESSION_SECRET),
  });
}
