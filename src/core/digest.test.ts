import { describe, expect, it } from "vitest";
import { DIGEST_FOOTER, buildDigest, type DigestInput } from "./digest";

const base = (over: Partial<DigestInput> = {}): DigestInput => ({
  companyName: "Example Co", appUrl: "https://app.example.com", today: new Date("2026-10-12T12:00:00Z"),
  periods: [{ key: "2026-10-12", weeks: 1 }, { key: "2026-10-05", weeks: 1 }], makeupWeeks: 4,
  people: [
    { id: "p1", name: "A", teamId: "t1", createdAt: "2026-01-01T00:00:00Z", deactivatedAt: null },
    { id: "p2", name: "B", teamId: "t2", createdAt: "2026-01-01T00:00:00Z", deactivatedAt: null },
  ],
  records: [{ id: "r", title: "Ladders", heldAt: "2026-10-06T13:00:00Z", weekStart: "2026-10-05", makeupForWeek: null, makeupReason: null, teamName: "A", jobsiteName: "", presenterId: null, presenterSigned: false,
    attendees: [{ personId: "p1", name: "A", status: "signed", location: null }] }],
  teams: [{ id: "t1", name: "A crew" }, { id: "t2", name: "B crew" }],
  issues: [], roster: [{ id: "p1", role_id: null }, { id: "p2", role_id: null }], certs: [], reqs: [], hazards: [], ...over,
});

describe("weekly email", () => {
  it("shows a team with no signatures as not signed, never leaves it out", () => {
    const d = buildDigest(base());
    expect(d.weekKey).toBe("2026-10-05");
    expect(d.sections[0].lines).toContain("B crew: no one signed. No talk recorded for this team.");
    expect(d.sections[0].tone).toBe("attention");
    expect(d.subject).toMatch(/need attention/);
  });
  it("a week everyone signed reads as fine and asks for nothing", () => {
    const d = buildDigest(base({ records: [{ ...base().records[0], attendees: [{ personId: "p1", name: "A", status: "signed", location: null }, { personId: "p2", name: "B", status: "signed", location: null }] }] }));
    expect(d.sections[0].tone).toBe("ok");
    expect(d.attention).toBe(0);
    expect(d.subject).not.toMatch(/attention/);
  });
  it("adds training, issues and crew reports only when there's something to say", () => {
    const d = buildDigest(base({
      issues: [{ status: "open", due_date: "2026-10-01" }, { status: "fixed", due_date: null }],
      hazards: [{ kind: "hazard", reviewed_at: null, created_at: "2026-10-11T00:00:00Z" }],
    }));
    expect(d.sections.map((s) => s.title)).toEqual(["Week of Oct 5", "Makeups", "Issues to fix", "Crew reports"]);
    expect(d.sections.find((s) => s.title === "Issues to fix")!.lines[0]).toBe("1 open issue, 1 overdue.");
  });
  it("never claims compliance, and the HTML escapes names", () => {
    const d = buildDigest(base({ companyName: "Example <Co> & Sons" }));
    expect(d.text).toContain(DIGEST_FOOTER);
    expect(d.html).toContain("Example &lt;Co&gt; &amp; Sons");
    // Outside the footer (which says the summary is not a claim), nothing mentions compliance at all.
    expect(d.sections.flatMap((x) => [x.title, ...x.lines]).join(" ").toLowerCase()).not.toMatch(/complian/);
    expect(d.subject.toLowerCase()).not.toMatch(/complian/);
  });
  it("before any week has ended, says so instead of guessing", () => {
    const d = buildDigest(base({ periods: [{ key: "2026-10-12", weeks: 1 }], records: [] }));
    expect(d.weekKey).toBeNull();
    expect(d.sections[0].lines[0]).toMatch(/No finished talk period/);
  });
});
