import { describe, expect, it } from "vitest";
import { isOwnTalk, latestOwnTalks, newTalkKey, ownTalkProblem, ownTalkToTalk, tidyTalkText, type OwnTalkRow } from "./ownTalks";

const text = { title: "Pool deck work", hook: "Wet decks are slick.", sections: [{ heading: "Before you start", items: ["Dry the walkway", ""] }], ask: "Where is it wet today?" };
const row = (talk_key: string, version: number, extra: Partial<OwnTalkRow> = {}): OwnTalkRow => ({
  talk_key, version, retired: false, title: text.title, minutes: 4, code: "", content: { en: text }, es_status: "none", es_reviewed_by: "",
  based_on: null, created_at: `2026-10-0${version}T00:00:00Z`, ...extra,
});

describe("own talks", () => {
  it("ids never collide with the library", () => {
    const id = newTalkKey(() => "ABCDEF12-3456-7890-abcd-ef1234567890");
    expect(id).toBe("own-abcdef123456");
    expect(isOwnTalk(id)).toBe(true);
    expect(isOwnTalk("fall")).toBe(false);
  });
  it("the latest version counts, and a retired talk drops out", () => {
    const list = latestOwnTalks([row("own-a", 1), row("own-a", 2), row("own-b", 1), row("own-b", 2, { retired: true })]);
    expect(list.map((r) => `${r.talk_key}@${r.version}`)).toEqual(["own-a@2"]);
    const all = latestOwnTalks([row("own-a", 1), row("own-b", 1), row("own-b", 2, { retired: true })], true);
    expect(all.map((r) => `${r.talk_key}@${r.version}`).sort()).toEqual(["own-a@1", "own-b@2"]);
  });
  it("becomes a Talk outside the automatic rotation, Spanish only when written", () => {
    const t = ownTalkToTalk(row("own-a", 1));
    expect(t).toMatchObject({ id: "own-a", industries: [], code: "Company talk", minutes: 4 });
    expect(t.content.es).toBeUndefined();
    const es = ownTalkToTalk(row("own-a", 1, { content: { en: text, es: text }, es_status: "draft" }));
    expect(es.translationStatus.es).toBe("draft");
  });
  it("says plainly what's missing", () => {
    expect(ownTalkProblem({ ...text, ask: "" })).toBe("Add a question to ask the crew at the end.");
    expect(ownTalkProblem({ ...text, sections: [{ heading: "", items: ["x"] }] })).toBe("Every section needs a heading.");
    expect(ownTalkProblem(text)).toBeNull();
    expect(ownTalkProblem(text, { ...text, sections: [] })).toMatch(/Spanish/);
    expect(ownTalkProblem(text, { ...text, hook: "" })).toMatch(/Spanish/);
    expect(ownTalkProblem(text, text)).toBeNull();
  });
  it("saves exactly what's read: no empty lines", () => {
    expect(tidyTalkText(text).sections[0].items).toEqual(["Dry the walkway"]);
  });
});
