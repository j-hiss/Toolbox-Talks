"use client";
import { RequireCompany } from "@/components/Guard";
import { MyRecord } from "@/components/MyRecord";
import { Eyebrow, Shell, Title } from "@/components/ui";

export default function MePage() {
  return (
    <RequireCompany>
      {(m) => (
        <Shell>
          <Eyebrow>{m.company.name}</Eyebrow>
          <Title>My record</Title>
          <div className="mt-4"><MyRecord m={m} /></div>
        </Shell>
      )}
    </RequireCompany>
  );
}
