// Demo sign-in for the preview. It starts already signed in as a demo user, so the sign-in screen is skipped.
// After "Sign out", any email works and the code is always 123456 (shown in the preview banner).
import { db, save, tick } from "./store";

export const DEMO_CODE = "123456";

type Listener = (event: string, session: { user: { id: string; email: string } } | null) => void;
const listeners = new Set<Listener>();
const emit = (event: string) => listeners.forEach((l) => l(event, db().session));

const DEMO_USER = { id: "demo-user", email: "demo@toolboxtalks.app" };
let skippedOnce = false;
/** First load of the preview: sign in automatically. */
function autoSession() {
  if (!db().session && !skippedOnce) {
    db().session = { user: DEMO_USER };
    save();
  }
  skippedOnce = true;
  return db().session;
}

const fakeClient = {
  auth: {
    async getSession() {
      return { data: { session: autoSession() }, error: null };
    },
    onAuthStateChange(cb: Listener) {
      listeners.add(cb);
      return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
    },
    async signInWithOtp() {
      await tick();
      return { data: {}, error: null };
    },
    async verifyOtp({ email, token }: { email: string; token: string }) {
      await tick();
      if (token !== DEMO_CODE) return { data: {}, error: { message: "Invalid code" } };
      const existing = db().session?.user.email === email ? db().session : null;
      db().session = existing ?? { user: { id: `demo-${email.toLowerCase()}`, email } };
      save();
      emit("SIGNED_IN");
      return { data: { session: db().session }, error: null };
    },
    async signOut() {
      db().session = null;
      save();
      emit("SIGNED_OUT");
      return { error: null };
    },
  },
};

// Same export shape as src/lib/supabase.ts. The cast is deliberate: the preview only implements what the screens use.
export function supabase() {
  return fakeClient as unknown as ReturnType<typeof import("@supabase/supabase-js").createClient>;
}
