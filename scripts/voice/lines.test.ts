import { describe, expect, it } from "vitest";
import { approvedVoices } from "./lines";

describe("voice license gate", () => {
  it("only voices marked Yes for commercial use", () => {
    const md = [
      "| Language | Engine | Voice | License | Commercial use OK? | Checked on |",
      "|---|---|---|---|---|---|",
      "| English | Kokoro | af_heart | Apache 2.0 | Yes | 2026-10-10 |",
      "| Spanish | Piper | _tbd (es_MX)_ | _per voice_ | _verify_ | |",
      "| French | X | `ff_x` | CC BY-NC | No | |",
    ].join("\n");
    expect([...approvedVoices(md)]).toEqual(["af_heart"]);
  });
});
