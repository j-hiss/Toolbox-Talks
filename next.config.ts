import type { NextConfig } from "next";

// One build for every platform: `next build` writes a static site to out/.
// The same out/ folder is hosted as the web app and copied into the iPhone and Android apps by Capacitor.
// That means no server code: no API routes, server actions, middleware or runtime image optimization.
// All data goes straight to Supabase from the browser, protected by row-level security.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
