"use client";

/**
 * Where the app lives on the web, for links that leave the app (jobsite QR stickers, shared safety profiles). The
 * phone apps run from an app-only address nobody else can open. Set NEXT_PUBLIC_APP_URL once the website is live;
 * until then the website's own address is used when it's a normal http(s) address.
 */
export function appWebAddress(): string | null {
  const set = process.env.NEXT_PUBLIC_APP_URL;
  if (set && /^https?:\/\//.test(set)) return set;
  if (typeof location !== "undefined" && /^https?:$/.test(location.protocol) && location.origin !== "null") return location.origin;
  return null;
}
