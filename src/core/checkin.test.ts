import { describe, expect, it } from "vitest";
import { checkinLink, checkinRoster, mergeCheckins, reopenTaken, secretFromHash } from "./checkin";

const secret = "a".repeat(64);
describe("crew self check-in", () => {
  it("puts the secret after # and reads it back; anything else is refused", () => {
    expect(checkinLink("https://app.example/", secret)).toBe(`https://app.example/checkin/#${secret}`);
    expect(secretFromHash(`#${secret}`)).toBe(secret);
    expect(secretFromHash("#abc")).toBeNull();
    expect(secretFromHash(`#${"g".repeat(64)}`)).toBeNull();
  });
  it("offers only roster people marked here who haven't signed; walk-ins sign on the presenter's phone", () => {
    const roster = [{ key: "p1", name: "A", personId: "p1" }, { key: "p2", name: "B", personId: "p2" }, { key: "p3", name: "C", personId: "p3" }, { key: "walkin:0", name: "W", personId: null }];
    const sig = { image: "data:image/png;base64,x", signedAt: "2026-10-11T12:00:00Z" };
    expect(checkinRoster(roster, { p2: false }, { p3: sig })).toEqual([{ key: "p1", name: "A" }]);
  });
  it("takes phone signatures into the draft without replacing one already there, only for people on the roster", () => {
    const mine = { image: "data:image/png;base64,mine", signedAt: "2026-10-11T12:00:00Z" };
    const w = (k: string) => ({ roster_key: k, name: k.toUpperCase(), image: `data:image/png;base64,${k}`, signed_at: "2026-10-11T12:05:00Z", confirmed_at: "2026-10-11T12:04:50Z" });
    const r = mergeCheckins(["p1", "p2", "p3"], { p1: mine }, { p3: false }, [w("p1"), w("p2"), w("p3"), w("gone")]);
    expect(r.signatures.p1).toBe(mine);
    expect(r.signatures.p2).toEqual({ image: "data:image/png;base64,p2", signedAt: "2026-10-11T12:05:00Z", confirmedAt: "2026-10-11T12:04:50Z" });
    expect(r.signatures.p3).toBeUndefined(); // marked "Isn't here": a phone signature doesn't override that
    expect(r.signatures.gone).toBeUndefined();
    expect(r.added).toEqual(["P2"]);
    expect(r.taken.sort()).toEqual(["gone", "p1", "p2", "p3"]);
  });
  it("a new code lets people sign by phone again after their earlier signature was removed", () => {
    const w = { roster_key: "p2", name: "P2", image: "data:image/png;base64,p2b", signed_at: "2026-10-11T12:09:00Z", confirmed_at: "2026-10-11T12:08:50Z" };
    const taken = reopenTaken(["p1", "p2"], ["p2", "p3"]);
    expect(taken).toEqual(["p1"]);
    expect(mergeCheckins(["p2"], {}, {}, [w], taken).added).toEqual(["P2"]);
  });
  it("never brings back a signature the talk already took, even if it arrives again", () => {
    const w = { roster_key: "p2", name: "P2", image: "data:image/png;base64,p2", signed_at: "2026-10-11T12:05:00Z", confirmed_at: "2026-10-11T12:04:50Z" };
    const r = mergeCheckins(["p2"], {}, {}, [w], ["p2"]); // taken earlier, then the presenter removed it
    expect(r.signatures.p2).toBeUndefined();
    expect(r.added).toEqual([]);
  });
});
