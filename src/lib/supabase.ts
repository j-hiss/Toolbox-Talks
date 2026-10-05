// The one Supabase client for the app. Browser-side only: the app is a static build, so there is no server.
// Only the public URL and the publishable (anon) key belong here. The service-role key must never be in this app.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** The role inside an older-style JWT key (anon / service_role), or null for the newer sb_ keys. */
function jwtRole(key: string): string | null {
  const parts = key.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))).role ?? null;
  } catch {
    return null;
  }
}

export function supabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase isn't configured. Copy .env.example to .env.local and fill it in from `npx supabase status`.",
    );
  }
  // Catch the easy mix-ups from `npx supabase status` before they turn into confusing errors later.
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`NEXT_PUBLIC_SUPABASE_URL isn't a web address: "${url}". Use the Project URL, like http://127.0.0.1:54321.`);
  }
  if (parsed.pathname !== "/" && parsed.pathname !== "") {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL should be just the Project URL (like ${parsed.origin}), not "${url}". ` +
        "That looks like the Storage or REST address. Fix .env.local and restart npm run dev.",
    );
  }
  if (/^sb_secret_/.test(key) || jwtRole(key) === "service_role") {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is the Secret key. Use the Publishable key instead; the Secret key must never be in the app.");
  }
  client = createClient(parsed.origin, key);
  return client;
}
