import { Spec } from "./langs/spec.js";

export class Token {
  /**
   * @type {string} type
   */
  type;
  /**
   * @type {string|number} value
   */
  value;
  /**
   *  @type {string} cssClass
   */
  cssClass;
  static types = {
    STRING: "STRING",
    NUMBER: "NUMBER",
    CONSTANT: "CONSTANT",
    IDENTIFIER: "IDENTIFIER",
    DELIMETER: "DELIMETER",
    OPERATOR: "OPERATOR",
    EXPRESSION: "EXPRESSION",
    KEYWORD: "KEYWORD",
    COMMENT: "COMMENT",
    SPECIAL_CHARACTER: "SPECIAL_CHARACTER",
  };
}

/**
 *
 */
class Tokenizer {
  /**
   * Initializes a string
   * @param {string} string
   * @param {Spec} spec
   *
   */
  init(string, spec) {
    this._string = string;
    this._cursor = 0;
    this.spec = spec;
  }
  /**
   * Checks if we reach the end of the string
   */
  endOfString() {
    return this._cursor == this._string.length;
  }
  /**
   *
   */
  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  /**
   * Obtain next token
   * @returns {Token}
   */
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }
    const string = this._string.slice(this._cursor);
    for (const { cssClass, regex, type } of this.spec.Specs) {
      const match = this._match(regex, string);
      if (!match) {
        continue;
      }

      return {
        cssClass: cssClass,
        value: match,
        type: type,
        regex: regex.source,
      };
    }
    //
  }
  /**
   *
   * @param {RegExp} regex
   * @param {string} token
   */
  _match(regex, token) {
    const match = regex.exec(token);

    if (!match) {
      return null;
    } else {
      this._cursor += match[0].length;
    }
    return match[0];
  }
}
export default Tokenizer;
