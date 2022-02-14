import { Python } from "../../src/langs/python_spec.js";
import assert from "assert";
import { concatGroupRegex, concatRegex } from "../../src/utils.js";

describe("Python Parser", () => {
  const python = new Python();
  describe("NUMERIC_LITERALS regex", () => {
    const numbers = [
      // literal, expected test value
      ["2147483647", true],
      ["0o177", true],
      ["0b100110111", true],
      ["3", true],
      ["79228162514264337593543950336", true],
      ["0o377", true],
      ["0xdeadbeef", true],
      ["100_000_000_000", true],
      ["0b_1110_0101", true],
      ["111_", false],
      ["ds", false],
      ["_11", false],
      ["3.14", true],
      ["10.", true],
      [".001", true],
      ["1e100", true],
      ["3.14e-10", true],
      ["0e0", true],
      ["3.14_15_93", true],
      [".", false],
    ];

    let expressions = python.NUMERIC_RULE.map((e) => e.match);
    let regex = concatGroupRegex(...expressions);
    // MAke the regex match from the bigining to the end of the string
    regex = concatRegex(`(${regex.source})`, /$/);
    for (const number of numbers) {
      it(number[0], () => {
        assert.equal(regex.test(number[0]), number[1]);
      });
    }
  });
  describe("STRING_LITERALS regex", () => {
    const strings = [
      // literal, expected test value
      [`f"He said his name is {name!r}."`, true],
      [`f""" 3 double quotes """`, true],
      [`f""" 3 Double quotes with new lines \n\n"""`, true],
      [`f"""" He said his name is {name!r}."""`, true],
      [`rU''''4 single quotes'''`, true],
      [`rU''' 3 single quotes '''`, true],
      [`hello`, false],
      [`"Single double quote'`, false],
      [`111_`, false],
    ];

    let expressions = python.STRING_RULES.map((e) => {
      return new RegExp(e.begin + ".*?" + e.end);
    });
    let regex = concatGroupRegex(...expressions);

    for (const string of strings) {
      it(string[0], () => {
        assert.equal(regex.test(string[0]), string[1]);
      });
    }
  });
});
