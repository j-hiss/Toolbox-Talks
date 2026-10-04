"use client";

// Company info form, shared by first-time setup and the Admin "Company" tab. Everything here prints on the PDF.
import { useState } from "react";
import { INDUSTRIES, type IndustryId } from "@/core/industries";
import { climateFor } from "@/core/climate";
import { isoDay, mondayOf, parseDay } from "@/core/weeks";
import type { Company } from "@/lib/data/types";
import { Button, Field, Notice, inputClass } from "./ui";

export type CompanyDraft = Omit<Company, "id">;

export const blankCompany = (): CompanyDraft => ({
  name: "",
  licenses: "",
  address: "",
  phone: "",
  email: "",
  industry: "con",
  zip: "",
  program_start: isoDay(mondayOf(new Date())),
  default_jobsite: "",
});

export function CompanyForm({ initial, submitLabel, onSubmit }: { initial: CompanyDraft; submitLabel: string; onSubmit: (c: CompanyDraft) => Promise<void> }) {
  const [c, setC] = useState<CompanyDraft>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const set = <K extends keyof CompanyDraft>(k: K, v: CompanyDraft[K]) => { setC({ ...c, [k]: v }); setSaved(null); };
  const zipInfo = c.zip ? climateFor(c.zip) : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!c.name.trim()) return setError("Enter the company name.");
    if (c.zip && !/^\d{5}$/.test(c.zip)) return setError("ZIP code is 5 digits.");
    if (c.zip && !climateFor(c.zip).state) return setError("We don't recognize that ZIP code.");
    const start = isoDay(mondayOf(parseDay(c.program_start)));
    setBusy(true);
    try {
      await onSubmit({ ...c, name: c.name.trim(), zip: c.zip || null, program_start: start });
      setC({ ...c, program_start: start });
      setSaved(`Saved. Week 1 starts the week of ${parseDay(start).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Field label="Company name" id="co-name">
        <input id="co-name" autoComplete="organization" className={inputClass} value={c.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field label="Industry" id="co-industry" hint="Picks which talks you get">
        <select id="co-industry" className={inputClass} value={c.industry} onChange={(e) => set("industry", e.target.value as IndustryId)}>
          {INDUSTRIES.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </Field>
      <Field label="ZIP code" id="co-zip" hint="Times heat, cold and storm talks to your weather">
        <input id="co-zip" inputMode="numeric" maxLength={5} autoComplete="postal-code" className={inputClass} value={c.zip ?? ""} onChange={(e) => set("zip", e.target.value.replace(/\D/g, ""))} />
        {zipInfo?.state && <small className="text-muted">{zipInfo.label}{zipInfo.hurricane ? " · hurricane prep included" : ""}{zipInfo.cold === "none" ? " · no cold-weather talks" : ""}</small>}
      </Field>
      <Field label="License numbers" id="co-lic" hint="One per line">
        <textarea id="co-lic" rows={3} className={inputClass} value={c.licenses} onChange={(e) => set("licenses", e.target.value)} />
      </Field>
      <Field label="Address" id="co-addr">
        <input id="co-addr" autoComplete="street-address" className={inputClass} value={c.address} onChange={(e) => set("address", e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" id="co-phone">
          <input id="co-phone" inputMode="tel" autoComplete="tel" className={inputClass} value={c.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Email or website" id="co-email">
          <input id="co-email" className={inputClass} value={c.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
      </div>
      <Field label="Default jobsite" id="co-site">
        <input id="co-site" className={inputClass} value={c.default_jobsite} onChange={(e) => set("default_jobsite", e.target.value)} />
      </Field>
      <Field label="Week 1 of the 52-week plan starts" id="co-start" hint="Rounded to that week's Monday">
        <input id="co-start" type="date" className={inputClass} value={c.program_start} onChange={(e) => set("program_start", e.target.value)} />
      </Field>
      {error && <Notice tone="error">{error}</Notice>}
      {saved && <Notice tone="ok">{saved}</Notice>}
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : submitLabel}</Button>
    </form>
  );
}
