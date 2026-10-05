// The phone's current location, with plain-language errors. Works in browsers on https or localhost, and inside
// the iPhone/Android apps once their location permission text is set (see README).
import type { Point } from "@/core/geo";

export type Fix = Point & { accuracyMeters: number };

export class LocationError extends Error {}

export function getLocation(timeoutMs = 15_000): Promise<Fix> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return reject(new LocationError("Location isn't available on this device or in this view."));
    }
    if (typeof window !== "undefined" && !window.isSecureContext) {
      return reject(new LocationError("Location only works over a secure connection (https), or on the computer running the app."));
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude, accuracyMeters: p.coords.accuracy }),
      (e) =>
        reject(
          new LocationError(
            e.code === e.PERMISSION_DENIED
              ? "Location is turned off for this app. Allow it in your phone's settings, then try again."
              : e.code === e.TIMEOUT
                ? "Couldn't get a GPS fix in time. Step outside or away from steel, then try again."
                : "Couldn't find your location. Try again in a moment.",
          ),
        ),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30_000 },
    );
  });
}
