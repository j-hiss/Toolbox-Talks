// Server function: draft a company version of a library talk with AI (approved by Joe, 2026-10-10).
// Runs on Supabase Edge Functions (Deno). The only server code in the app; it never saves anything except the usage
// log row, and only for owners and admins (the database checks, with the caller's own token).
//
// Secrets (set with `supabase secrets set`, never in the app or the repo):
//   ANTHROPIC_API_KEY   the AI key
//   AI_MODEL            optional, defaults to claude-sonnet-5-5
// The app hides the button unless NEXT_PUBLIC_AI_TAILORING=on.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { SYSTEM_PROMPT, checkTailored, tailorPrompt, type TailorRequest } from "../../../src/core/aiTailor.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply(405, { error: "POST only." });
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return reply(503, { error: "AI drafting isn't set up yet." });

  let r: TailorRequest;
  try { r = await req.json(); } catch { return reply(400, { error: "Bad request." }); }
  if (!r?.companyId || !r?.talk || !Array.isArray(r.sources)) return reply(400, { error: "Bad request." });
  if (JSON.stringify(r).length > 40_000) return reply(413, { error: "That talk is too long to tailor." });

  // The caller's own token: the database checks they're an owner or admin and logs the request (20 a day).
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    auth: { persistSession: false },
  });
  const start = await sb.rpc("ai_tailor_start", { co: r.companyId, base: r.baseId });
  if (start.error) return reply(start.error.code === "54000" ? 429 : 403, { error: start.error.message });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("AI_MODEL") ?? "claude-sonnet-5-5",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: tailorPrompt(r) }],
    }),
  });
  if (!res.ok) return reply(502, { error: "The AI service didn't answer. Try again in a minute." });
  const data = await res.json();
  const text = (data?.content ?? []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("");
  const checked = checkTailored(text, r.talk, r.sources);
  if ("problem" in checked) return reply(422, { error: checked.problem });
  return reply(200, { talk: checked.talk });
});
