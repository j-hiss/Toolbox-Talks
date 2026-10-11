// Builds the phone preview: the real app's screens and core logic, bundled into ONE html file with demo data
// stored on the viewer's phone. Same components as the real app; only these swap out:
//   next/link, next/navigation   -> tiny in-page router (preview/shims)
//   @/lib/supabase               -> demo sign-in (code 123456)
//   @/lib/data/company, records, plan, reports, issues, safety, profile, members, certs, shares, trainers, partners, ownTalks -> demo data saved in the browser
//   @/lib/location               -> explains GPS isn't available in the preview
//   @/lib/download               -> the preview page's own save-file prompt
//   @/lib/weather                -> an example forecast (the preview can't reach the weather service)
//   @/lib/offlineApp             -> off (the preview is one page; there's no sw.js beside it)
// Run: npm run preview:build   (output: preview/dist/preview.html)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

const here = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  root: here("."),
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: [
      { find: /^next\/link$/, replacement: here("shims/link.tsx") },
      { find: /^next\/navigation$/, replacement: here("shims/navigation.ts") },
      { find: /^@\/lib\/supabase$/, replacement: here("demo/supabase.ts") },
      { find: /^@\/lib\/data\/company$/, replacement: here("demo/company.ts") },
      { find: /^@\/lib\/data\/records$/, replacement: here("demo/records.ts") },
      { find: /^@\/lib\/data\/plan$/, replacement: here("demo/plan.ts") },
      { find: /^@\/lib\/data\/reports$/, replacement: here("demo/reports.ts") },
      { find: /^@\/lib\/data\/issues$/, replacement: here("demo/issues.ts") },
      { find: /^@\/lib\/data\/safety$/, replacement: here("demo/safety.ts") },
      { find: /^@\/lib\/data\/profile$/, replacement: here("demo/profile.ts") },
      { find: /^@\/lib\/data\/members$/, replacement: here("demo/members.ts") },
      { find: /^@\/lib\/data\/certs$/, replacement: here("demo/certs.ts") },
      { find: /^@\/lib\/data\/shares$/, replacement: here("demo/shares.ts") },
      { find: /^@\/lib\/data\/trainers$/, replacement: here("demo/trainers.ts") },
      { find: /^@\/lib\/data\/partners$/, replacement: here("demo/partners.ts") },
      { find: /^@\/lib\/data\/ownTalks$/, replacement: here("demo/ownTalks.ts") },
      { find: /^@\/lib\/data\/verify$/, replacement: here("demo/verify.ts") },
      { find: /^@\/lib\/data\/injuries$/, replacement: here("demo/injuries.ts") },
      { find: /^@\/lib\/data\/inspections$/, replacement: here("demo/inspections.ts") },
      { find: /^@\/lib\/data\/ai$/, replacement: here("demo/ai.ts") },
      { find: /^@\/lib\/data\/me$/, replacement: here("demo/me.ts") },
      { find: /^@\/lib\/weather$/, replacement: here("demo/weather.ts") },
      { find: /^@\/lib\/location$/, replacement: here("demo/location.ts") },
      { find: /^@\/lib\/download$/, replacement: here("demo/download.ts") },
      { find: /^@\/lib\/offlineApp$/, replacement: here("demo/offlineApp.ts") },
      { find: /^@\//, replacement: here("../src") + "/" },
    ],
  },
  // Tailwind runs through its Vite plugin here; don't pick up the Next.js PostCSS config from the repo root.
  css: { postcss: { plugins: [] } },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    // Jobsite QR stickers need a web address; the preview prints an example one (the real app sets NEXT_PUBLIC_APP_URL).
    "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify("https://app.example.com"),
    // The insurance partner portal is a pilot (needs counsel's privacy review); the preview shows it.
    "process.env.NEXT_PUBLIC_PARTNER_PORTAL": JSON.stringify("pilot"),
    "process.env.NEXT_PUBLIC_AI_TAILORING": JSON.stringify("on"),
    __BUILT_AT__: JSON.stringify(
      new Date().toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    ),
  },
  build: {
    outDir: here("dist"),
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000, // fonts inline as data, so the file works with no other requests
    cssCodeSplit: false,
    rollupOptions: { input: here("index.html") },
  },
});
