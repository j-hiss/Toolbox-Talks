"use client";

// The one "add a training card" form: training type (or a typed name), issued and expiry dates typed from the card,
// note, optional photo. Used by Admin → Training (adds the card) and the trainer portal (sends it for approval).
// Rule notes come from src/content/certTypes.ts; the app never works out an expiry by itself (only the checked crane
// rule, or a company's or trainer's own training with a renewal set (migration 0053), offers a suggestion the person can
// take).
import { useState } from "react";
import { CERT_TYPES } from "@/content/certTypes";
import { activeCourses, expiryAfter, type TrainingCourse } from "@/core/courses";
import { repeatNoteText } from "@/content/repeats";
import { Button, Field, FileButton, Notice, inputClass } from "./ui";

export type CardFields = { certType: string; customName: string; issuedOn: string | null; expiresOn: string | null; note: string };

const span = (m: number) => (m % 12 === 0 ? `${m / 12} year${m === 12 ? "" : "s"}` : `${m} months`);

export function CardForm({ initialType, saveLabel = "Save card", courses = [], onSave }: {
  initialType?: string; saveLabel?: string; courses?: TrainingCourse[]; onSave: (c: CardFields, file: File | null) => Promise<void>;
}) {
  const [type, setType] = useState(initialType ?? CERT_TYPES[0].id);
  const [custom, setCustom] = useState("");
  const [issued, setIssued] = useState("");
  const [expires, setExpires] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const info = CERT_TYPES.find((c) => c.id === type);
  const course = courses.find((c) => c.code === type);
  const months = info?.suggestMonths ?? course?.renew_months ?? null;
  const own = activeCourses(courses);
  const bad = (type === "custom" && !custom.trim()) || (!!issued && !!expires && expires < issued);

  const save = async () => {
    setBusy(true); setMsg(null);
    try {
      await onSave({ certType: type, customName: custom, issuedOn: issued || null, expiresOn: expires || null, note }, file);
      setIssued(""); setExpires(""); setNote(""); setFile(null); setCustom("");
    } catch (e) { setMsg(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };
  const suggest = () => {
    if (!months || !issued) return;
    setExpires(expiryAfter(issued, months));
  };

  return (
    <div className="mt-3 flex flex-col gap-3">
      <Field label="Training" id="ct-type">
        <select id="ct-type" className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
          {own.length > 0 && <optgroup label="Your own trainings">{own.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>}
          <optgroup label="Common trainings">{CERT_TYPES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
          <option value="custom">Other (type a name)</option>
        </select>
      </Field>
      {type === "custom" && <Field label="Name" id="ct-custom"><input id="ct-custom" maxLength={100} className={inputClass} value={custom} onChange={(e) => setCustom(e.target.value)} /></Field>}
      {course?.description && <p className="whitespace-pre-line text-sm text-muted">{course.description}</p>}
      {info?.note && <Notice tone="caution">{repeatNoteText(info.note).replace(/ This talk.*$/, "")}</Notice>}
      <div className="grid grid-cols-2 gap-2">
        <Field label="Issued" id="ct-issued"><input id="ct-issued" type="date" className={inputClass} value={issued} onChange={(e) => setIssued(e.target.value)} onBlur={() => !expires && suggest()} /></Field>
        <Field label="Expires" id="ct-expires" hint="from the card"><input id="ct-expires" type="date" className={inputClass} value={expires} min={issued || undefined} onChange={(e) => setExpires(e.target.value)} /></Field>
      </div>
      {months && issued && !expires && <button className="text-left text-sm font-semibold text-brand-text underline" onClick={suggest}>Use {span(months)} from the issue date</button>}
      <Field label="Note (optional)" id="ct-note"><input id="ct-note" maxLength={300} className={inputClass} placeholder="Trainer, card number last 4, equipment" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      <FileButton label="Photo of the card (optional)" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={busy} chosen={file?.name} onFile={setFile} />
      <Button size="sm" disabled={busy || bad} onClick={save}>{saveLabel}</Button>
      {msg && <Notice tone="error">{msg}</Notice>}
    </div>
  );
}
