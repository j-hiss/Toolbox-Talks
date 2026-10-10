"use client";

// The talk library a screen sees: the built-in talks plus the current company's own talks (src/core/ownTalks.ts).
// One list for every screen and the plan, so a company talk works everywhere a library talk does. The company's
// talks are kept on the phone too, so a planned company talk still shows with no signal.
import { useSyncExternalStore } from "react";
import { TALKS } from "@/content/talks";
import { latestOwnTalks, ownTalkToTalk, type OwnTalkRow } from "@/core/ownTalks";
import type { Talk } from "@/core/talks";
import { listOwnTalks } from "@/lib/data/ownTalks";

const cacheKey = (companyId: string) => `tt-own-talks-${companyId}`;
type Lookup = (id: string | null | undefined) => Talk | undefined;
const libraryById = new Map(TALKS.map((t) => [t.id, t]));
const libraryLookup: Lookup = (id) => (id ? libraryById.get(id) : undefined);

let companyId: string | null = null;
let rows: OwnTalkRow[] = [];
let all: Talk[] = TALKS;
let lookup: Lookup = libraryLookup;
const listeners = new Set<() => void>();

function publish(next: OwnTalkRow[]) {
  rows = next;
  all = [...TALKS, ...latestOwnTalks(next).map(ownTalkToTalk)];
  // Lookups also find retired company talks, so a week planned before a talk was retired still shows it.
  const byId = new Map(libraryById);
  for (const r of latestOwnTalks(next, true)) byId.set(r.talk_key, ownTalkToTalk(r));
  lookup = (id) => (id ? byId.get(id) : undefined);
  listeners.forEach((l) => l());
}

/** Load (and keep loaded) the company's own talks. Called by the session when the company changes. */
export function loadOwnTalks(id: string | null): Promise<void> {
  companyId = id;
  if (!id) { publish([]); return Promise.resolve(); }
  try { publish(JSON.parse(localStorage.getItem(cacheKey(id)) ?? "[]")); } catch { publish([]); }
  return listOwnTalks(id)
    .then((r) => {
      if (companyId !== id) return;
      try { localStorage.setItem(cacheKey(id), JSON.stringify(r)); } catch { /* fine */ }
      publish(r);
    })
    .catch(() => { /* offline or not migrated yet: keep the copy on this phone */ });
}

/** Reload after an admin saves or retires a talk. */
export const refreshOwnTalks = () => loadOwnTalks(companyId);

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
/** The talks a company can plan and give: the built-in talks plus its own (not retired). Re-renders on change. */
export function useTalks(): Talk[] {
  return useSyncExternalStore(subscribe, () => all, () => TALKS);
}
/** Find any talk by id, including a company talk retired after it was planned. Undefined while still loading. */
export function useTalkLookup(): Lookup {
  return useSyncExternalStore(subscribe, () => lookup, () => libraryLookup);
}
/** Every version of the company's talks, for the editor. */
export function useOwnTalkRows(): OwnTalkRow[] {
  return useSyncExternalStore(subscribe, () => rows, () => rows);
}
