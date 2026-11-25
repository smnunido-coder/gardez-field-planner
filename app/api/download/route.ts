import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { connection } from "next/server";

export async function GET() {
  await connection();
  const bytes = await readFile(join(process.cwd(), "Gardez-field-planner.xlsx"));
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="Gardez-field-planner.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
