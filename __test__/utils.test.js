import assert from "assert";
import { concatRegex } from "../src/utils.js";

describe("Utils", () => {
  describe("Regex", () => {
    it("regex concatinations", () => {
      assert.equal(concatRegex(/\w+/, "\\d+").source, "\\w+\\d+");
    });
  });
});
