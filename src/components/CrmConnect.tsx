"use client";

// Admin → Jobsites → Connect your CRM (migration 0054): make a key, see where the CRM sends a job's ID and address,
// copy a test call, revoke keys. The key is shown once; the app never stores it. Rules: src/core/crm.ts.
import { useCallback, useEffect, useState } from "react";
import { apiKeyNameProblem, crmBody, crmCurl, crmEndpoint, sortKeys, type ApiKeyRow } from "@/core/crm";
import { createApiKey, listApiKeys, revokeApiKey } from "@/lib/data/apiKeys";
import { Button, ConfirmButton, Field, GroupHeading, Notice, inputClass } from "./ui";
import { toast } from "./toast";

const err = (e: unknown) => toast(e instanceof Error ? e.message : String(e), { tone: "error" });
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "");

export function CrmConnect({ companyId }: { companyId: string }) {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [name, setName] = useState("");
  const [fresh, setFresh] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const endpoint = crmEndpoint(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "<publishable key>";
  const load = useCallback(() => { listApiKeys(companyId).then(setKeys).catch(() => setKeys([])); }, [companyId]);
  useEffect(() => { if (open) load(); }, [open, load]);

  const make = async () => {
    const p = apiKeyNameProblem(name); if (p) { toast(p, { tone: "error" }); return; }
    setBusy(true);
    try { setFresh(await createApiKey(companyId, name)); setName(""); load(); } catch (e) { err(e); }
    setBusy(false);
  };
  const copy = async (text: string, what: string) => {
    try { await navigator.clipboard.writeText(text); toast(`${what} copied.`); } catch { toast("Select the text and copy it.", { tone: "error" }); }
  };
  const live = keys.filter((k) => !k.revoked_at);

  return (
    <section aria-label="Connect your CRM" className="mt-6">
      <GroupHeading aside={live.length ? `${live.length} key${live.length === 1 ? "" : "s"}` : undefined}>Connect your CRM</GroupHeading>
      <p className="mt-1 text-sm text-muted">Have your CRM send each job&apos;s ID and address here, and the jobsite shows up ready for talks. The same job ID updates it; &quot;active&quot;: false closes it.</p>
      {!open ? <div className="mt-2"><Button size="sm" variant="soft" onClick={() => setOpen(true)}>Set up the connection</Button></div> : (
        <div className="mt-3 flex flex-col gap-3">
          {fresh && (
            <div className="rounded-xl border border-brand bg-brand/5 p-3 text-sm">
              <b>Your new key. Copy it now: it won&apos;t be shown again.</b>
              <p className="mt-2 break-all rounded-lg bg-surface p-2 font-mono" aria-label="New API key">{fresh}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="soft" onClick={() => copy(fresh, "Key")}>Copy key</Button>
                {endpoint && <Button size="sm" variant="ghost" onClick={() => copy(crmCurl(endpoint, publishable, fresh), "Test call")}>Copy a test call</Button>}
                <Button size="sm" variant="ghost" onClick={() => setFresh(null)}>Done</Button>
              </div>
            </div>
          )}
          <div className="rounded-xl bg-surface p-3 text-sm shadow-card">
            <b>What your CRM sends</b>
            {endpoint ? (
              <dl className="mt-2 grid gap-1.5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Method and address</dt>
                <dd className="break-all font-mono text-xs">POST {endpoint}</dd>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Headers</dt>
                <dd className="break-all font-mono text-xs">apikey: {publishable}<br />Content-Type: application/json</dd>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Body (JSON)</dt>
                <dd><pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-bg p-2 font-mono text-xs">{JSON.stringify(crmBody("your key"), null, 2)}</pre></dd>
              </dl>
            ) : <Notice tone="caution">The address appears once the app is connected to its database.</Notice>}
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-xs text-muted">
              <li><b>key</b> and <b>job_id</b> are required. A new job also needs an <b>address</b> or a <b>name</b> (the address is used as the name when there&apos;s none).</li>
              <li>A changed address clears the jobsite&apos;s map pin, so re-pin it at the site.</li>
              <li>The &quot;apikey&quot; header is the app&apos;s public key, the same for every company. Your company key goes in the body and only works for your company.</li>
              <li>Up to 600 calls an hour per key. The reply says &quot;created&quot; or &quot;updated&quot;, or why it was refused.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Field label="Name this connection" id="api-name"><input id="api-name" className={inputClass} maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: Our CRM" /></Field>
            <div><Button size="sm" disabled={busy} onClick={make}>Make a key</Button></div>
          </div>
          {keys.length > 0 && (
            <ul aria-label="API keys" className="flex flex-col gap-2">
              {sortKeys(keys).map((k) => (
                <li key={k.id} className={`flex flex-wrap items-center gap-2 rounded-lg p-3 text-sm ${k.revoked_at ? "border border-line opacity-60" : "bg-surface shadow-card"}`}>
                  <span className="min-w-0 flex-1"><b>{k.name}</b> <span className="font-mono text-xs text-muted">{k.key_prefix}…</span>
                    <small className="block text-muted">{k.revoked_at ? `Revoked ${day(k.revoked_at)}` : k.last_used_at ? `Last used ${day(k.last_used_at)} · ${k.uses} call${k.uses === 1 ? "" : "s"}` : `Made ${day(k.created_at)} · not used yet`}</small></span>
                  {!k.revoked_at && <ConfirmButton label="Revoke" confirmLabel="Tap again to revoke" onConfirm={() => void revokeApiKey(companyId, k.id).then(() => { load(); toast("Revoked. Calls with that key stop now."); }).catch(err)} />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
