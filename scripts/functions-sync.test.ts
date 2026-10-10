import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SHARED, aiTailorCopy, libraryJson } from "./functions-sync";

describe("server function copies", () => {
  it("are up to date with the app (run npm run functions:sync)", () => {
    expect(readFileSync(join(SHARED, "library.json"), "utf8")).toBe(libraryJson());
    expect(readFileSync(join(SHARED, "aiTailor.ts"), "utf8")).toBe(aiTailorCopy());
  });
});
