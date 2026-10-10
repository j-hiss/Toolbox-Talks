import type { NextConfig } from "next";
import path from "node:path";

// One build for every platform: `next build` writes a static site to out/.
// The same out/ folder is hosted as the web app and copied into the iPhone and Android apps by Capacitor.
// That means no server code: no API routes, server actions, middleware or runtime image optimization.
// All data goes straight to Supabase from the browser, protected by row-level security.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Pin the project root so a stray package-lock.json in a parent folder (e.g. your home folder) is ignored.
  turbopack: { root: path.join(__dirname) },
  // Baked in at build time (empty when unset), so a hidden pilot's screens are left out of the build, not just hidden.
  env: { NEXT_PUBLIC_PARTNER_PORTAL: process.env.NEXT_PUBLIC_PARTNER_PORTAL ?? "" },
};

export default nextConfig;
