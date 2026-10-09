import type { CapacitorConfig } from "@capacitor/cli";

// Wraps the static web build (out/) as the iPhone and Android apps.
// The native projects (ios/, android/) are generated on a Mac with `npx cap add ios` and `npx cap add android`.
//
// CAP_LOCAL=1 is for testing against local Supabase only: it lets the Android app call plain http on your Mac.
// Never ship a build made with it; real builds talk to Supabase over https.
const local = process.env.CAP_LOCAL === "1";

const config: CapacitorConfig = {
  appId: "com.toolboxtalks.app",
  appName: "Salvant", // PLACEHOLDER name; keep in step with src/content/brand.ts
  webDir: "out",
  ...(local ? { server: { androidScheme: "http", cleartext: true } } : {}),
};

export default config;
