"use client";

// The talk in progress, saved on the phone after every change so closing the app or losing signal mid-talk
// doesn't lose signatures. One draft per company on this device.
import { useSyncExternalStore } from "react";
import type { Signature } from "@/core/record";
import type { LanguageId } from "@/core/languages";

export type TalkDraft = {
  clientId: string;
  companyId: string;
  talkId: string | null;          // null = still picking a talk
  lang: LanguageId;
  step: "pick" | "read" | "crew" | "sign";
  presenterId: string;
  teamId: string;                 // team id, "all", or "" for none
  jobsiteId: string;
  present: Record<string, boolean>;
  walkins: string[];
  signatures: Record<string, Signature>;
  presenterSignature: Signature | null;
  gps: { latitude: number; longitude: number; accuracyMeters: number } | null;
  startedAt: string;
};

const key = (companyId: string) => `tt-draft-${companyId}`;
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; draft: TalkDraft | null }>();

export function readDraft(companyId: string): TalkDraft | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key(companyId)); } catch { /* no storage */ }
  const hit = cache.get(companyId);
  if (hit && hit.raw === raw) return hit.draft;
  let draft: TalkDraft | null = null;
  try { draft = raw ? (JSON.parse(raw) as TalkDraft) : null; } catch { draft = null; }
  cache.set(companyId, { raw, draft });
  return draft;
}

export function writeDraft(d: TalkDraft) {
  try { localStorage.setItem(key(d.companyId), JSON.stringify(d)); } catch { /* full storage: keeps working in memory */ }
  cache.set(d.companyId, { raw: JSON.stringify(d), draft: d });
  listeners.forEach((l) => l());
}

export function clearDraft(companyId: string) {
  try { localStorage.removeItem(key(companyId)); } catch { /* fine */ }
  cache.delete(companyId);
  listeners.forEach((l) => l());
}

export function newDraft(companyId: string, talkId: string | null, jobsiteId = ""): TalkDraft {
  const d: TalkDraft = {
    clientId: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    companyId,
    talkId,
    lang: "en",
    step: talkId ? "read" : "pick",
    presenterId: "",
    teamId: "",
    jobsiteId,
    present: {},
    walkins: [],
    signatures: {},
    presenterSignature: null,
    gps: null,
    startedAt: new Date().toISOString(),
  };
  writeDraft(d);
  return d;
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export function useDraft(companyId: string): TalkDraft | null {
  return useSyncExternalStore(subscribe, () => readDraft(companyId), () => null);
}
