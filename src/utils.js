/**
 *concatinate regex expressions
 * @param {RegExp|string} re1
 * @param {RegExp|string} re2
 * @returns {RegExp}
 */
export function concatRegex(re1, re2) {
  let flags = "";
  if (re1 instanceof RegExp) {
    flags += re1.flags;
    re1 = re1.source;
  }
  if (re2 instanceof RegExp) {
    flags += re2.flags;
    re2 = re2.source;
  }
  return new RegExp(re1 + re2, flags);
}

/**
 *concatinate regex expression as groups
 * @param {Array.<RegExp|string>} arguments
 * @returns {RegExp}
 */
export function concatGroupRegex() {
  let expressions = Array.from(arguments).map(
    (e) => `(${e instanceof RegExp ? e.source : e})`
  );

  return new RegExp(expressions.join("|"));
}
