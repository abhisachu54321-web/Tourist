// Liveness check. The website has no database dependency, so this simply confirms
// that the server is up and able to respond.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
