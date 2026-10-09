// Demo version of src/lib/offlineApp.ts: the preview is one self-contained page with no sw.js beside it, so the
// offline helper stays off.
import type * as Real from "@/../src/lib/offlineApp";

export function startOfflineApp() { /* nothing to install in the preview */ }

const _sameShape = { startOfflineApp } satisfies Omit<typeof Real, never>;
void _sameShape;
