import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { connection } from "next/server";

export async function GET() {
  await connection();
  const bytes = await readFile(join(process.cwd(), "public", "Gardez-field-planner-netlify.zip"));
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="Gardez-field-planner-netlify.zip"',
      "Cache-Control": "no-store",
    },
  });
}
