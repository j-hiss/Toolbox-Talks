// Server function: the weekly email to the office (approved by Joe, 2026-10-12). Runs on Supabase Edge Functions
// (Deno), started by a weekly schedule (README). For each company that isn't paused or closed: build last week's
// summary with the app's own code (_shared/digest.js, from src/lib/digest.ts), send it to owners, admins and office
// who haven't turned it off, and log the send once per company per week (migration 0056).
//
// Secrets (set with `supabase secrets set`, never in the app or the repo):
//   DIGEST_SECRET       a long random string; the schedule sends it, so no one else can start a run
//   RESEND_API_KEY      the email service key (resend.com). Without it, runs are dry: nothing is sent or logged.
//   DIGEST_FROM         who it's from, like "Safety summary <summary@yourdomain.com>" (a domain verified with Resend)
//   APP_URL             the app's web address, for the "Open the app" button
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase. The service key stays here, on the server.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { loadDigest } from "../_shared/digest.js";

const reply = (status: number, body: unknown) => new Response(JSON.stringify(body, null, 2), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return reply(405, { error: "POST only." });
  const secret = Deno.env.get("DIGEST_SECRET");
  if (!secret || req.headers.get("x-digest-secret") !== secret) return reply(401, { error: "Not allowed." });
  const url = new URL(req.url);
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("DIGEST_FROM");
  const dry = url.searchParams.get("dry") === "1" || !resendKey || !from;
  const only = url.searchParams.get("company");   // run for one company (testing)
  const appUrl = Deno.env.get("APP_URL") ?? null;
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  let q = sb.from("companies").select("id, name, zip, industry, program_start, makeup_weeks, company_accounts(paused_at, closure_requested_at)");
  if (only) q = q.eq("id", only);
  const { data: companies, error } = await q;
  if (error) return reply(500, { error: error.message });

  const today = new Date();
  const results: unknown[] = [];
  for (const co of companies ?? []) {
    const acct = Array.isArray(co.company_accounts) ? co.company_accounts[0] : co.company_accounts;
    if (acct?.paused_at || acct?.closure_requested_at) { results.push({ company: co.id, status: "skipped", why: "paused or closing" }); continue; }
    try {
      const digest = await loadDigest(sb, co, appUrl, today);
      if (!digest.weekKey) { results.push({ company: co.id, status: "skipped", why: "no finished week yet" }); continue; }
      const { data: to, error: rErr } = await sb.rpc("digest_recipients", { co: co.id });
      if (rErr) throw new Error(rErr.message);
      const emails = (to ?? []).map((r: { email: string }) => r.email);
      if (dry) { results.push({ company: co.id, status: "dry run", recipients: emails.length, subject: digest.subject, text: digest.text }); continue; }
      if (!emails.length) { await sb.from("digest_log").insert({ company_id: co.id, week_key: digest.weekKey, recipients: 0, status: "skipped", detail: "No one to send to." }); continue; }
      // Claim the week first: a second run the same week stops here instead of sending again.
      const claim = await sb.from("digest_log").insert({ company_id: co.id, week_key: digest.weekKey, recipients: emails.length, status: "sent" }).select("id").single();
      if (claim.error) { results.push({ company: co.id, status: "already sent" }); continue; }
      // One email per person, so no one sees the others' addresses.
      let failed = 0, lastError = "";
      for (const email of emails) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from, to: [email], subject: digest.subject, html: digest.html, text: digest.text }),
        });
        if (!res.ok) { failed++; lastError = `${res.status} ${(await res.text()).slice(0, 200)}`; }
      }
      if (failed) await sb.from("digest_log").update({ status: failed === emails.length ? "failed" : "sent", detail: `${failed} of ${emails.length} not sent: ${lastError}`.slice(0, 500) }).eq("id", claim.data.id);
      results.push({ company: co.id, status: failed === emails.length ? "failed" : "sent", recipients: emails.length - failed });
    } catch (e) {
      results.push({ company: co.id, status: "failed", why: e instanceof Error ? e.message : String(e) });
    }
  }
  return reply(200, { dry, companies: results.length, results });
});
