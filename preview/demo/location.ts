// The preview runs inside Claude, which doesn't give pages GPS access. Say so plainly instead of a confusing error.
export type { Fix } from "@/../src/lib/location";
import { LocationError as RealLocationError } from "@/../src/lib/location";

export const LocationError = RealLocationError;

export function getLocation(): Promise<never> {
  return Promise.reject(new RealLocationError("GPS isn't available in this preview. It works in the real app on your phone."));
}
