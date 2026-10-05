"use client";

// Keeps the offline outbox moving: uploads waiting talks on load, when the phone comes back online, and on demand.
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { flush, onOutboxChange, pending, type OutboxItem } from "@/lib/outbox";
import { saveTalkRecord } from "@/lib/data/records";

const EMPTY: OutboxItem[] = [];
let cache: { key: string; items: OutboxItem[] } = { key: "", items: EMPTY };

function snapshot(companyId: string) {
  const items = pending(companyId);
  const key = companyId + ":" + items.map((i) => i.record.client_id + (i.lastError ?? "")).join(",");
  if (key !== cache.key) cache = { key, items };
  return cache.items;
}

export function useOutbox(companyId: string) {
  const items = useSyncExternalStore(onOutboxChange, () => snapshot(companyId), () => EMPTY);
  const [busy, setBusy] = useState(false);

  const upload = useCallback(async () => {
    setBusy(true);
    try { return await flush(saveTalkRecord); } finally { setBusy(false); }
  }, []);

  useEffect(() => {
    if (pending(companyId).length) void flush(saveTalkRecord);
    const on = () => void flush(saveTalkRecord);
    window.addEventListener("online", on);
    return () => window.removeEventListener("online", on);
  }, [companyId]);

  return { items, busy, upload };
}
