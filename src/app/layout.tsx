import type { Metadata, Viewport } from "next";
// The interface font is the phone's own: San Francisco on iPhone and Mac (the system font, not bundled), and Inter,
// bundled so it works with no signal, everywhere else (Android, Windows). Inter is the closest open match.
// Archivo (bundled) is the display face: titles and big numbers.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/archivo/800.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BRAND } from "@/content/brand";
import { DEFAULT_THEME } from "@/core/theme";

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.tagline,
  applicationName: BRAND.name,
  // Installable web app (src/app/manifest.ts); iPhone and iPad read the apple-* tags when added to the Home Screen.
  appleWebApp: { capable: true, title: BRAND.name, statusBarStyle: "black-translucent" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: DEFAULT_THEME.bg,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
