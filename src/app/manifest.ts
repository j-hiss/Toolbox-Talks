import type { MetadataRoute } from "next";
import { BRAND } from "@/content/brand";
import { DEFAULT_THEME } from "@/core/theme";

// The installable web app ("Add to Home Screen" on a phone or tablet, "Install" in Chrome or Edge on a computer).
// Written into out/manifest.webmanifest at build time; no server. Icons: scripts/make-icons.mjs (placeholder mark).
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.name,
    description: BRAND.tagline,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any", // phones upright, tablets and computers either way
    background_color: DEFAULT_THEME.bg,
    theme_color: DEFAULT_THEME.bg,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
