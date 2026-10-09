// Turns on the offline helper (out/sw.js, made by scripts/build-sw.mjs) for the website and the installed web app.
// Not inside the iPhone/Android apps (they carry every file already), not in `npm run dev` (it would hold on to old
// code while you work), and only where browsers allow it (https, or localhost on your Mac).
import { Capacitor } from "@capacitor/core";

export function startOfflineApp() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (process.env.NODE_ENV !== "production" || Capacitor.isNativePlatform()) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
  navigator.serviceWorker.register("/sw.js").catch(() => { /* the app still works online without it */ });
}
