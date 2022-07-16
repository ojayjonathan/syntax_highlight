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
  parse(string, spec) {
    this._root = new Node({
      cssClass: "syntax",
      value: "",
    });
    this.spec = spec;
    this.grammar = spec.grammar;
    this._string = string;
    this._parse(spec.grammar.patterns, this._root);
  }
  _parse(pattern, node) {
    do {
      let string = this._string.slice(this._cursor);
      this._lookahead = this.getNextToken(pattern, string);
      if (!this._lookahead) {
        return;
      }
      if (this._lookahead.pattern.patterns) {
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
  getNextToken(patterns, string) {
    string = string || this._string.slice(this._cursor);
    let match;
    for (let p of patterns) {
      if (p.include) {
        p = this.grammar.repository[p.include];
      }
      if (p.begin) {
        match = this._match(new RegExp(`^(${p.begin})`), string);
        if (match) {
          return { match: match, pattern: p };
        }
        continue;
      }
      
      else {
        match = this._match(new RegExp(`^(${p.match})`), string);
        if (match) {
          return { match: match, pattern: p };
        }
      }
    }
  }
  _match(regex, string) {
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
    let pattern = this._lookahead.pattern;
    const match = this._lookahead.match;

    const childNode = new Node({});
    node.addChild(childNode);
    if (pattern.beginCaptures) {
      if (match.groups) {
        for (const key in match.groups) {
          if (match.groups[key]) {
            this.__eat(
              {
                value: match.groups[key],
                cssClass: pattern.beginCaptures[key].cssClass,
              },
              childNode
            );
          }
        }
      } else {
        let firstCapture = Object.keys(pattern.beginCaptures)[0];
        this.__eat(
          {
            value: match[0],
            cssClass: pattern.beginCaptures[firstCapture].cssClass,
          },
          childNode
        );
      }
    } else {
      this.__eat(
        {
          value: match[0],
        },
        childNode
      );
    }

    const endTokenRe = new RegExp(pattern.end, "s");
    const endMatch = endTokenRe.exec(this._string.slice(this._cursor));
    let endtoken = endMatch ? endMatch[0] : "";

    this._lookahead = this.getNextToken(pattern.patterns);
    while (
      this._lookahead &&
      this._lookahead.match[0] &&
      this._lookahead.match[0] !== endtoken
    ) {
      if (this._lookahead.pattern.patterns) {
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

    if (pattern.endCaptures) {
      if (endMatch.groups) {
        for (const key in endMatch.groups) {
          if (endMatch.groups[key]) {
            this.__eat(
              {
                value: endMatch.groups[key],
                cssClass: pattern.endCaptures[key].cssClass,
              },
              childNode
            );
          }
        }
      } else {
        let firstCapture = Object.keys(pattern.endCaptures)[0];
        this.__eat(
          {
            value: endMatch[0],
            cssClass: pattern.endCaptures[firstCapture].cssClass,
          },
          childNode
        );
      }
    } else {
      this.__eat(
        {
          value: endMatch[0],
        },
        childNode
      );
    }

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
// console.log(spec.grammar);

// console.log(spec.Specs);
// p.parse(``, spec);
// p.parse(
//   `#!/usr/bin/env python
// import os
// import sys

// if __name__ == "__main__":
// a=100*20
// os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gettingstarted.settings")

// from django.core.management import execute_from_command_line

// execute_from_command_line(sys.argv)
// @func(10,arg)
// def helloWorld(arg1,arg2) :\n 10
// x *= 1100;
// ''' multiline string s1 '''
// ''' multiline \n string s2 '''

// `,
//   spec
// );

p.parse(
  `
#program
@func (a=100,b=20)
def hellow():
  a = 10
`,
  spec
);
console.log(JSON.stringify(p._root, false, 2));
