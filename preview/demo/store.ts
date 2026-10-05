// Demo storage for the preview: one JSON blob in this browser. Never leaves the phone.
const KEY = "tt-preview-db";

export type DemoDb = {
  session: { user: { id: string; email: string } } | null;
  companies: Record<string, unknown>[];
  members: { company_id: string; user_id: string; access: string }[];
  roles: Record<string, unknown>[];
  teams: Record<string, unknown>[];
  people: Record<string, unknown>[];
  jobsites: Record<string, unknown>[];
  records: Record<string, unknown>[];
  overrides: { company_id: string; week_start: string; talk_id: string }[];
};

const empty = (): DemoDb => ({ session: null, companies: [], members: [], roles: [], teams: [], people: [], jobsites: [], records: [], overrides: [] });

let memory: DemoDb | null = null;

export function db(): DemoDb {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    memory = empty();
  }
  return memory!;
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db())); } catch { /* private mode: kept in memory for this visit */ }
}

/** Erase everything the preview stored on this phone: demo data, talks in progress, the upload queue, choices. */
export function resetDemo() {
  memory = empty();
  try {
    Object.keys(localStorage).filter((k) => k.startsWith("tt-")).forEach((k) => localStorage.removeItem(k));
  } catch { /* nothing stored */ }
  save();
}

export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

/** Small delay so loading states show the way they do against a real database. */
export const tick = () => new Promise((r) => setTimeout(r, 120));
