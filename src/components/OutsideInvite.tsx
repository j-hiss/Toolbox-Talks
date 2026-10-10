"use client";

// The one form for inviting someone from outside the company by email: a trainer (Admin → Training) or an insurance
// partner (Safety profile). They sign in on the website with an email code and the invite is claimed then
// (accept_invites, migrations 0026 and 0027). `extra` adds fields of its own (a partner's kind).
import { useState } from "react";
import { Button, Field, Notice, inputClass } from "./ui";

export function OutsideInvite({ id, nameLabel, namePlaceholder, buttonLabel, extra, onInvite, after }: {
  id: string; nameLabel: string; namePlaceholder: string; buttonLabel: string; extra?: React.ReactNode;
  onInvite: (email: string, name: string) => Promise<void>; after: (name: string, email: string) => string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const send = async () => {
    setBusy(true); setMsg(null);
    try {
      await onInvite(email.trim().toLowerCase(), name.trim());
      setMsg({ tone: "ok", text: after(name.trim(), email.trim().toLowerCase()) });
      setEmail(""); setName("");
    } catch (e) { setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }); }
    setBusy(false);
  };
  return (
    <div className="mt-3 flex flex-col gap-2">
      <Field label={nameLabel} id={`${id}-name`}><input id={`${id}-name`} maxLength={120} className={inputClass} placeholder={namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Their email" id={`${id}-email`}><input id={`${id}-email`} type="email" inputMode="email" autoComplete="off" className={inputClass} placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      {extra}
      <Button size="sm" disabled={busy || !name.trim() || !email.includes("@")} onClick={send}>{buttonLabel}</Button>
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
    </div>
  );
}
