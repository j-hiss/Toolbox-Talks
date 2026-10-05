"use client";

// The talk in progress, saved on the phone after every change so closing the app or losing signal mid-talk
// doesn't lose signatures. One draft per company on this device.
import { useSyncExternalStore } from "react";
import type { Signature } from "@/core/record";
import type { LanguageId } from "@/core/languages";
import { readLastSetup } from "./lastSetup";

export type TalkDraft = {
  clientId: string;
  companyId: string;
  talkId: string | null;          // null = still choosing which missed week to make up
  lang: LanguageId;
  step: "makeup" | "read" | "crew" | "sign";
  /** Set when this talk makes up a missed week. The record still gets today's real date, week and GPS. */
  makeup: { weekStart: string; weekNumber: number } | null;
  makeupPick: string;             // one of MAKEUP_REASONS
  makeupNote: string;
  presenterId: string;
  teamId: string;                 // team id, "all", "needs", or "" for none
  /** For teamId "needs": the people who still needed the talk when the roster was chosen (kept for offline). */
  needIds: string[] | null;
  jobsiteId: string;
  present: Record<string, boolean>;
  walkins: string[];
  signatures: Record<string, Signature>;
  presenterSignature: Signature | null;
  gps: { latitude: number; longitude: number; accuracyMeters: number } | null;
  startedAt: string;
  /** A line or two for this site today, read to the crew. */
  siteNotes: string;
  /** The heat check for this talk; reminder_read once the heat reminder was part of what was read. */
  heat: { max_heat_index_f: number; level: string; reminder_read: boolean; checked_at: string; source: string; place: string } | null;
  /** Things the crew raised, logged before saving. */
  issues: DraftIssue[];
};

export type DraftIssue = { clientId: string; description: string; ownerId: string; dueDate: string };

const key = (companyId: string) => `tt-draft-${companyId}`;
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; draft: TalkDraft | null }>();

export function readDraft(companyId: string): TalkDraft | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key(companyId)); } catch { /* no storage */ }
  const hit = cache.get(companyId);
  if (hit && hit.raw === raw) return hit.draft;
  let draft: TalkDraft | null = null;
  try { draft = raw ? upgrade(JSON.parse(raw)) : null; } catch { draft = null; }
  cache.set(companyId, { raw, draft });
  return draft;
}

/** Drafts saved by an earlier version of the app (free talk picking) become a makeup choice or carry on as is. */
function upgrade(raw: unknown): TalkDraft {
  const d = raw as Omit<Partial<TalkDraft>, "step"> & Omit<TalkDraft, "step" | "makeup" | "makeupPick" | "makeupNote" | "needIds" | "siteNotes" | "heat" | "issues"> & { step: string };
  const step = (d.step === "pick" ? (d.talkId ? "read" : "makeup") : d.step) as TalkDraft["step"];
  return { ...d, makeup: d.makeup ?? null, makeupPick: d.makeupPick ?? "", makeupNote: d.makeupNote ?? "", needIds: d.needIds ?? null, siteNotes: d.siteNotes ?? "", heat: d.heat ?? null, issues: d.issues ?? [], step };
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

/** Start this week's talk (talkId), or a makeup (talkId null: the presenter picks the missed week first). */
export function newDraft(companyId: string, talkId: string | null, jobsiteId = ""): TalkDraft {
  const last = readLastSetup(companyId); // same presenter and crew as last time on this phone
  const d: TalkDraft = {
    clientId: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    companyId,
    talkId,
    lang: "en",
    step: talkId ? "read" : "makeup",
    makeup: null,
    makeupPick: "",
    makeupNote: "",
    presenterId: last?.presenterId ?? "",
    teamId: last?.teamId ?? "",
    needIds: null,
    jobsiteId: jobsiteId || last?.jobsiteId || "",
    present: {},
    walkins: [],
    signatures: {},
    presenterSignature: null,
    gps: null,
    startedAt: new Date().toISOString(),
    siteNotes: "",
    heat: null,
    issues: [],
  };
  writeDraft(d);
  return d;
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export function useDraft(companyId: string): TalkDraft | null {
  return useSyncExternalStore(subscribe, () => readDraft(companyId), () => null);
}
