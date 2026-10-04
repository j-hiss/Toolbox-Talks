import type { CapacitorConfig } from "@capacitor/cli";

// Wraps the static web build (out/) as the iPhone and Android apps.
// The native projects (ios/, android/) are generated on a Mac with `npx cap add ios` and `npx cap add android`.
const config: CapacitorConfig = {
  appId: "com.toolboxtalks.app",
  appName: "Toolbox Talks",
  webDir: "out",
};

export default config;
