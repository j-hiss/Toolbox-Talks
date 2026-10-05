"use client";

// Reminders the phone schedules for itself (no server, no texts, works offline). Only in the iPhone/Android apps;
// on the website this does nothing. Turned on per phone. What to schedule comes from src/core/reminders.ts.
import { Capacitor } from "@capacitor/core";
import type { Reminder } from "@/core/reminders";

const KEY = "tt-reminders";
const IDS = [101, 102, 103];

export const remindersSupported = () => Capacitor.isNativePlatform();
export function remindersOn(): boolean { try { return localStorage.getItem(KEY) === "on"; } catch { return false; } }

/** Turn reminders on (asks the phone for permission) or off (cancels anything scheduled). */
export async function setReminders(on: boolean): Promise<boolean> {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  if (on) {
    const p = await LocalNotifications.requestPermissions();
    if (p.display !== "granted") return false;
  } else {
    await LocalNotifications.cancel({ notifications: IDS.map((id) => ({ id })) }).catch(() => {});
  }
  try { localStorage.setItem(KEY, on ? "on" : "off"); } catch { /* fine */ }
  return on;
}

/** Replace the scheduled reminders with these. Safe to call every time Home opens. */
export async function applyReminders(list: Reminder[]): Promise<void> {
  if (!remindersSupported() || !remindersOn()) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  await LocalNotifications.cancel({ notifications: IDS.map((id) => ({ id })) }).catch(() => {});
  if (!list.length) return;
  await LocalNotifications.schedule({
    notifications: list.map((r) => ({ id: r.id, title: r.title, body: r.body, schedule: { at: r.at, allowWhileIdle: true }, isExactNotification: false })),
  });
}
