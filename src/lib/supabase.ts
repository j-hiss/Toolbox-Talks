// The one Supabase client for the app. Browser-side only: the app is a static build, so there is no server.
// Only the public URL and the publishable (anon) key belong here. The service-role key must never be in this app.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase isn't configured. Copy .env.example to .env.local and fill it in from `npx supabase status`.",
    );
  }
  client = createClient(url, key);
  return client;
}
