import { concatRegex } from "../utils.js";
/**
 * Rules that matches portion a document for a given language
 * begin, end and pattern is specified expression
 * @example expression => const a = 200;
 */
/**
 * @typedef {Object} PatternObject
 * @property {string} cssClass
 * @property {string} type
 * @property {RegExp} match
 * @property {RegExp} end
 * @property {RegExp} begin
 * @property {number} priority
 * @property {Array<PatternObject>} patterns
 * */

export class Pattern {
  constructor({
    cssClass,
    match,
    begin,
    end,
    patterns,
    priority = 0,
    type = "PRIMARY",
  }) {
    this.begin = begin;
    this.type = type;
    this.cssClass = cssClass;
    this.match = match;
    this.end = end;
    this.patterns = patterns;
    this.priority = priority;
    if (!((this.begin && this.end) || this.match)) {
      throw EvalError("invalid pattern" + JSON.stringify(this, null, 4));
    }
    if (this.patterns) {
      this.patterns = this.patterns.sort((a, b) => b.priority - a.priority);
    }
  }
  /**
   * will be used as html atribute class value
   * @type {string}
   *
   */
  cssClass;
  /**
   *regex match an atom
   * @type {RegExp}
   * @example atoms => "hello"|10|const
   */
  match;

  /**
   *regex begin an expression
   * @type {RegExp}
   */
  begin;
  /**
   *regex end an expression
   * @type {RegExp}
   */
  end;
  /**
   * patterns that makes up an expression
   * @type {Array.<Pattern>}
   */
  patterns;
  /**
   *
   * @param {PatternObject} obj
   */
  static types = {
    PRIMARY: "PRIMARY",
    EXPRESSION: "EXPRESSION",
    KEYWORD: "KEYWORD",
    COMMENT: "COMMENT",
    SPECIAL_CHARACTER: "SPECIAL_CHARACTER",
  };
  static fromObject(obj) {
    let pattern = new Pattern(obj);
    if (obj.patterns) {
      pattern.patterns = obj.patterns.map((e) => Pattern.fromObject(e));
    }
    return pattern;
  }
  get isExpression() {
    return this.patterns && this.patterns.length > 0;
  }
}
export class Spec {
  /**
   * @param {PatternObject} rule
   */

  /**
   * @type {Array.<number>} RESERVED_KEY_WORDS
   * @type {Array.<string>} OPERATORS
   
   * */
  RESERVED_KEY_WORDS = [];

  OPERATORS = [];
  /**
   * @type {PatternObject} COMMENT
   */
  COMMENT = {};
  /**
   * @returns {Array.<PatternObject>}
   */
  /**
   * @returns {Array.<PatternObject>}
   */
  get Specs() {
    return this._PatternObjects;
  }
  /**
   * @returns {Array.<Pattern>}
   */
  get pattern() {
    throw Error("Not Implemented");
  }
}
