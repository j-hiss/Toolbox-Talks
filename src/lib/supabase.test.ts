import { afterEach, describe, expect, it, vi } from "vitest";

// A legacy-style JWT whose payload says role = service_role (signature irrelevant here).
const fakeJwt = (role: string) =>
  ["e30", Buffer.from(JSON.stringify({ role })).toString("base64url"), "sig"].join(".");

async function load(url: string, key: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", key);
  return (await import("./supabase")).supabase;
}

describe("supabase config guard", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("accepts the Project URL with a publishable key", async () => {
    const supabase = await load("http://127.0.0.1:54321", "sb_publishable_example");
    expect(() => supabase()).not.toThrow();
  });
  it("rejects the Storage URL (the cause of the XML error)", async () => {
    const supabase = await load("http://127.0.0.1:54321/storage/v1/s3", "sb_publishable_example");
    expect(() => supabase()).toThrow(/just the Project URL/);
  });
  it("rejects the Secret key", async () => {
    const supabase = await load("http://127.0.0.1:54321", "sb_secret_example");
    expect(() => supabase()).toThrow(/Secret key/);
  });
  it("rejects an old-style service_role key but accepts an anon one", async () => {
    const bad = await load("http://127.0.0.1:54321", fakeJwt("service_role"));
    expect(() => bad()).toThrow(/Secret key/);
    const good = await load("http://127.0.0.1:54321", fakeJwt("anon"));
    expect(() => good()).not.toThrow();
  });
  it("explains a missing configuration", async () => {
    const supabase = await load("", "");
    expect(() => supabase()).toThrow(/isn't configured/);
  });
});
