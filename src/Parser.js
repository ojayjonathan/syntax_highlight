import { Python } from "./langs/python_spec.js";
import { Pattern, Spec } from "./langs/spec.js";
import Tokenizer, { Token } from "./Tokenizer.js";
import { concatRegex } from "./utils.js";

export class Node {
  value;
  cssClass;
  constructor({ value, cssClass }) {
    this.value = value;
    this.cssClass = cssClass;

    /**
     * @typedef {Node} children
     */
  }
  addChild(value) {
    this.children ? this.children.push(value) : (this.children = [value]);
  }
  get isLeaf() {
    return this.children ? false : true;
  }
  get removeChild() {
    this.children.pop();
  }
  /**
   * pass through each child of a node
   * @param {Function} start
   * @param {Function} complete
   * @returns
   */
  traverse(start, complete) {
    start(this);
    if (this.isLeaf) {
      complete(this);
      return;
    }
    this.children.map((c) => c.traverse(start, complete));
    complete(this);
  }
}

export class ParserTree {
  /**
   *@typedef {Object} Lookahead
   *@property {Array} match
   *@property {Pattern} pattern
   */
  /**
   * @type {Lookahead} _lookahead
   */
  _lookahead;
  constructor() {
    this._string = "";
    this.tokens = [];
    this._cursor = 0;
  }
  endOfString() {
    return this._string.length == this._cursor;
  }
  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  /**
   * Parse a string int AST
   * @param {string} string
   * @param {Spec} languageSpecification
   */
  parse(string, languageSpecification) {
    this._root = new Node({
      cssClass: "syntax",
      value: "",
    });
    this.spec = languageSpecification;
    this._string = string;
    this._parse(spec.pattern, this._root);
  }
  _parse(pattern, node) {
    do {
      this._lookahead = this.getNextToken(pattern, node);
  
      if (!this._lookahead) {
        return;
      }
      if (this._lookahead.pattern.isExpression) {
        this.Expression(node);
      } else {
        this.Primary(node);
      }
    } while (this.hasMoreTokens());
  }
  /**
   * @param {Array.<Pattern>} patterns
   * @returns {Lookahead}
   */
  getNextToken(patterns) {
    let match;
    for (const p of patterns) {
      if (p.isExpression) {
        match = this._match(new RegExp(`^(${p.begin})`));
        if (match) {
          return { match: match, pattern: p };
        }
        continue;
      } else {
        match = this._match(new RegExp(`^(${p.match})`));
        if (match) {
          return { match: match, pattern: p };
        }
      }
    }
  }
  _match(regex) {
    let string = this._string.slice(this._cursor);
    return regex.exec(string);
  }
  __eat(token, node) {
    node.addChild(new Node(token));
    this._cursor += token.value.length;
  }
  /**
   *
   */
  Primary(node) {
    let token = {
      value: this._lookahead.match[0],
      cssClass: this._lookahead.pattern.cssClass,
    };
    this.__eat(token, node);
  }
  /**
   * Literal
   * :NumericLiteral
   * |StringLiteral
   */

  Expression(node) {
    const start = this._lookahead.match[0];
    const childNode = new Node({
      value: "",
      cssClass: this._lookahead.pattern.cssClass,
    });
    let pattern = this._lookahead.pattern;
    const endRe = new RegExp(this._lookahead.pattern.end, "s");
    const token = endRe.exec(this._string.slice(this._cursor),"------------");
    let endtoken = token ? token[0] : "";
    node.addChild(childNode);
    this.__eat(
      {
        value: start,
        cssClass: this._lookahead.pattern.cssClass,
      },
      childNode
    );
    this._lookahead = this.getNextToken(pattern.patterns);
    console.log(endtoken,"----------end token",this._lookahead.match[0])
    while (
      this._lookahead &&
      this._lookahead.match[0] &&
      this._lookahead.match[0] !== endtoken
    ) {
      console.log(endtoken,"----------end token",this._lookahead.match[0])

      // console.log(this._lookahead);
      if (this._lookahead.pattern.isExpression) {
        this.Expression(childNode);
      } else {
        this.__eat(
          {
            value: this._lookahead.match[0],
            cssClass: this._lookahead.pattern.cssClass,
          },
          childNode
        );
      }
      this._lookahead = this.getNextToken(pattern.patterns);
    }
    let endValue = this._match(new RegExp(`^.*?(${pattern.end})`));
    this.__eat(
      {
        value: endValue ? endValue[0] : "",
        cssClass: "this._lookahead.pattern.cssClass",
      },
      childNode
    );
    this._lookahead = this.getNextToken(pattern.patterns);
  }
  /**
   * NumericLiteral
   *    :NUMBER
   */
  NumericLiteral() {
    const token = this._eat("NUMBER");
    return {
      type: "NUMERICLITERAL",
      value: Number(token),
    };
  }
  /**
   * StringLiteral
   *    :STRING
   */
  StringLiteral() {
    const token = this._eat("String");
    return {
      type: "STRINGLITERAL",
      value: token.slice(1, -1),
    };
  }
  /**
   *Expects a a token of a given type
   * @param {string} type
   */

  ParentesisedExpression(closingParentesis) {
    stack = [];
  }
}

let p = new ParserTree();
const spec = new Python();
// console.log(spec.Specs);
// p.parse(``, spec);
p.parse(
  `#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
a=100*20
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gettingstarted.settings")

from django.core.management import execute_from_command_line

execute_from_command_line(sys.argv)
@func(10,arg)
def helloWorld(arg1,arg2) :\n 10
x *= 1100;
''' multiline string s1 '''
''' multiline \n string s2 '''

`,
  spec
);
