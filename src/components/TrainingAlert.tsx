"use client";

// Home (admins): training cards that are expired, expiring within 30 days, or missing for someone's job title.
// Quiet when everything is current. Math: trainingSummary in src/core/certs.ts.
import { useEffect, useState } from "react";
import Link from "next/link";
import { EXPIRING_DAYS, trainingSummary, type TrainingSummary } from "@/core/certs";
import { listCerts, listRequirements } from "@/lib/data/certs";
import { listPeople } from "@/lib/data/company";
import { Notice } from "./ui";

export function TrainingAlert({ companyId }: { companyId: string }) {
  const [s, setS] = useState<TrainingSummary | null>(null);
  useEffect(() => {
    let live = true;
    Promise.all([listPeople(companyId), listCerts(companyId), listRequirements(companyId)])
      .then(([people, certs, reqs]) => live && setS(trainingSummary(people, certs, reqs, new Date())))
      .catch(() => { /* offline or not migrated yet: say nothing */ });
    return () => { live = false; };
  }, [companyId]);
  if (!s || s.expired + s.expiring + s.missing === 0) return null;
  const parts = [s.expired && `${s.expired} expired`, s.expiring && `${s.expiring} expiring within ${EXPIRING_DAYS} days`, s.missing && `${s.missing} missing`].filter(Boolean);
  return (
    <div className="mt-4">
      <Notice tone={s.expired || s.missing ? "caution" : "info"}>
        <b>Training cards:</b> {parts.join(" · ")}.{" "}
        <Link href="/admin/#training" className="font-semibold text-brand-text underline underline-offset-2">See who</Link>
      </Notice>
    </div>
  );
}
