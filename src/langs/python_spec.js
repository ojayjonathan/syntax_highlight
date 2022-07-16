import { Token } from "../Tokenizer.js";
import { concatRegex } from "../utils.js";
import { Pattern, Spec } from "./spec.js";

/**
 *https://docs.python.org/3/reference/lexical_analysis.html
 *
 */
export class Python extends Spec {
  constructor() {
    super();
    this.IDENTIFIER = "[a-zA-Z_]([\\w_])*";

    this.REPOSITORY = {
      keywords: {
        cssClass: "keyword",
        match: "(" + this.SIMPLE_STATEMENT_KEYWORDS.join("|") + ")",
      },
      control: {
        cssClass: "keyword.control",
        match: "(" + this.CONTROL_KEYWORDS.join("|") + ")",
      },
      control: {
        cssClass: "entity.type",
        match: "(" + this.TYPES.join("|") + ")",
      },
      comment: {
        match: "#.*\n",
        cssClass: "comment",
      },
      operator: {
        cssClass: "keyword.operator",
        match: "(" + this.OPERATORS.join("|") + ")",
      },
      delimeter: {
        cssClass: "keyword.delimeter",
        match: "(" + this.DELIMETERS.join("|") + ")",
      },
      identifier: {
        cssClass: "identifier",
        match: this.IDENTIFIER,
      },
      indentation: {
        match: "(\\t|\\s|\\n)+",
        cssClass: "",
      },
      string: {
        cssClass: "string",
        patterns: this.STRING,
      },
      constant: {
        cssClass: "constant",
        patterns: [...this.NUMERIC],
      },
      parenExpression: {
        begin: "\\(",
        end: "\\(",
        beginCaptures: {
          0: { cssClass: "punctuation.paren.open" },
        },
        endCaptures: {
          0: { cssClass: "punctuation.paren.close" },
        },
      },
      functionCall: {
        cssClass: "entity.function",
        begin: `^(?<name>${this.IDENTIFIER})(?<name2>\\.${this.IDENTIFIER})*(?<paren>\\()`,
        beginCaptures: {
          name: { cssClass: "entity.name.function" },
          name2: { cssClass: "entity.name.function" },
          paren: { cssClass: "punctuation.paren.open" },
        },
        end: "\\)",
        endCaptures: {
          0: { cssClass: "punctuation.paren.close" },
        },
        patterns: [
          { include: "constant" },
          { include: "parenExpression" },
          { include: "string" },
          { include: "delimeter" },
          { include: "operator" },
          { include: "comment" },
        ],
      },
      functionArgs: {
        begin: "\\(",
        end: "\\)",
        beginCaptures: {
          0: { cssClass: "punctuation.paren.open" },
        },
        endCaptures: {
          0: { cssClass: "punctuation.paren.close" },
        },
        patterns: [
          { include: "string" },
          { include: "comment" },
          { include: "constant" },
          { include: "delimeter" },
          { include: "operator" },
        ],
      },
      functionDefination: {
        cssClass: "entity",
        begin: `((?<anotation>@${this.IDENTIFIER})(?<decoratorArgs>.*)\\n)?(?<name>def)`,
        beginCaptures: {
          anotation: { cssClass: "function.anotation" },
          decoratorArgs: {
            patterns: [{ include: "indentation" }, { include: "functionCall" }],
          },
          name: {
            cssClass: "keyword.function",
          },
        },
        end: ":",
        endCaptures: {
          0: { cssClass: "keyword.delimeter" },
        },
        patterns: [this.SPACE, { include: "functionArgs" }],
      },
    };
    this.grammar = {
      repository: this.REPOSITORY,
      cssClass: "syntax",
      patterns: [
        this.REPOSITORY.comment,
        this.REPOSITORY.functionDefination,
        this.REPOSITORY.control,
        this.REPOSITORY.keywords,
        this.REPOSITORY.delimeter,
        this.REPOSITORY.identifier,
        this.REPOSITORY.operator,
        this.REPOSITORY.identifier,
        this.REPOSITORY.indentation,
        this.REPOSITORY.constant,
      ],
    };
  }
  SPACE = "(\\t\\s)+";
  OPERATORS = [
    "\\+",
    "\\-",
    "\\*",
    "\\*\\*",
    "\\/",
    "\\/\\/",
    "\\%",
    "\\@",
    "\\<\\<",
    "\\>\\>",
    "\\&",
    "\\|",
    "\\^",
    "\\~",
    "\\:\\=",
    "\\<",
    "\\>",
    "\\<\\=",
    "\\>\\=",
    "\\=\\=",
    "\\!\\=",
  ];

  DELIMETERS = [
    "\\(",
    "\\)",
    "\\[",
    "\\]",
    "\\{",
    "\\}",
    "\\,",
    "\\:",
    "\\.",
    "\\;",
    "\\@",
    "\\=",
    "\\-\\>",
    "\\+\\=",
    "\\-\\=",
    "\\*\\=",
    "\\/\\=",
    "\\/\\/=",
    "\\%\\=",
    "\\@\\=",
    "\\&\\=",
    "\\|\\=",
    "\\^\\=",
    "\\>\\>\\=",
    "\\<\\<\\=",
    "\\*\\*\\=",
  ];

  // --------------------------------------------------
  // https://docs.python.org/3/reference/lexical_analysis.html#literals
  // Python strings
  //  :Single quote strings
  //  :Double quote strings
  //  :Triple single quote & Tripple double quote strings
  // ---------------------------------------------------

  STRING = [
    {
      cssClass: "string",
      match: `([rRuUfF]|[rbRB])?'''[^(''')]*'''`,
    },
    {
      cssClass: "string",
      match: `([rRuUfF]|[rbRB])?"""[^(""")]*"""`,
    },

    {
      cssClass: "string",
      match: `([rRuUfF]|[rbRB])?"[^"]*"`,
    },
    {
      cssClass: "string",
      begin: "([rRuUfF]|[rbRB])?'[^']*'",
    },
  ];
  // --------------------------------------------
  // https://docs.python.org/3/reference/lexical_analysis.html
  // :Integers
  // :Doubles
  NUMERIC = [
    // --------------------
    //Integers
    // --------------------

    // decimalinteger
    {
      cssClass: "constant.number",
      match: "([1-9](_?\\d)*)|0",
    },
    // decimalinteger

    // bininteger
    {
      cssClass: "constant.number",
      match: "0(b|B)(_?[0-1])*",
    },
    // hexinteger
    {
      cssClass: "constant.number",
      match: "0(x|x)(_?[0-9a-fA-F])*",
    },
    // octinteger
    {
      cssClass: "constant.number",
      match: "0(o|O)(_?[0-7])*",
    },
    // ------------------------------
    //  Floating point constant.numbers
    // -------------------------------
    // floatconstant.number eg .11, 1.00, 1.
    {
      cssClass: "constant.number",
      match: "(\\d(_?\\d)*\\.(\\d(_?\\d)*)?)|((\\d(_?\\d)*)?\\.(\\d(_?\\d)*))",
    },
    // exponentfloat eg 0e0
    {
      cssClass: "constant.number",
      match:
        "((\\d(_?\\d)*)|(\\d(_?d)*)*((\\.(\\d(_?\\d)*)*)|([1-9](_?\\d)*\\.)))(e|E)([\\+|\\-])?(\\d(_?\\d)*)",
    },
  ];

  SIMPLE_STATEMENT_KEYWORDS = [
    "__*__",
    "False",
    "True",
    "None",
    "assert",
    "import",
    "del",
    "future",
    "global",
    "nonlocal",
    "from",
    "def",
    "class",
    "async",
    "lambda",
  ];

  CONTROL_KEYWORDS = [
    "and",
    "is",
    "if",
    "else",
    "elif",
    "while",
    "for",
    "try",
    "with",
    "match",
    "except",
    "finally",
    "return",
    "yield",
    "pass",
    "raise",
    "continue",
    "break",
    "not",
    "or",
  ];
  KEYWORDS = [...this.CONTROL_KEYWORDS, this.SIMPLE_STATEMENT_KEYWORDS];

  // function defination

  TYPES = ["float", "int", "dict"];

  /**
   * @returns {Array.<Pattern>}
   */

  get pattern() {
    return this.patterns;
  }
}
