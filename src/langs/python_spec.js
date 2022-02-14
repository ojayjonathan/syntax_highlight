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
    this.patterns = [
      this.ANNOTATION,
      this.FUNCTION_CALL,
      this.FUNCTION_DEFINATION,
      ...this.STRING_RULES,
      ...this.NUMERIC_RULE,
      this.COMMENT_RULE,
      this.OPERATOR_RULE,
      this.DELIMETER_RULE,
      this.INDENTATION_RULE,
      this.IDENTIFIER_RULE,
      this.SIMPLE_STATEMENTS_KEYWORDS_,
      this.COMPOUND_EXPRESSIONS_KEYWORDS_,
    ].map((p) => Pattern.fromObject(p));
    this.patterns = this.patterns.sort((a, b) => b.priority - a.priority);
    console.log(this.patterns)
  }

  RESERVED_KEY_WORDS = [
    "__*__",
    "False",
    "await",
    "else",
    "import",
    "pass",
    "None",
    "break",
    "except",
    "in",
    "raise",
    "True",
    "class",
    "finally",
    "is",
    "return",
    "and",
    "continue",
    "for",
    "lambda",
    "try",
    "as",
    "def",
    "from",
    "nonlocal",
    "while",
    "assert",
    "del",
    "global",
    "not",
    "with",
    "async",
    "elif",
    "if",
    "or",
    "yield",
  ];
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
  OPERATOR_RULE = {
    type: Pattern.types.PRIMARY,
    cssClass: "syntax_operator",
    match: "(" + this.OPERATORS.join("|") + ")",
  };
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

  DELIMETER_RULE = {
    type: Pattern.types.PRIMARY,
    cssClass: "syntax_delimeter",
    match: "(" + this.DELIMETERS.join("|") + ")",
  };

  // -------------------------------------------
  // Comment
  // ------------------------------------------

  COMMENT_RULE = {
    type: Pattern.types.PRIMARY,
    priority: 100,
    match: "#.*\n",
    cssClass: "syntax_comment",
  };

  // -------------------------------------
  // Identifiers
  // --------------------------------------

  IDENTIFIER = "[a-zA-Z_]([\\w_])*";
  IDENTIFIER_RULE = {
    type: Pattern.types.PRIMARY,
    cssClass: "syntax_identifier",
    match: this.IDENTIFIER,
    priority: 5,
  };
  //----------------------------------------------------
  // Space and tab indentation
  // ----------------------------------------------------

  INDENTATION_RULE = {
    type: Pattern.types.SPECIAL_CHARACTER,
    match: "(\\t|\\s|\\n)+",
    cssClass: "",
    priority: 100,
  };

  // --------------------------------------------------
  // https://docs.python.org/3/reference/lexical_analysis.html#literals
  // Python strings
  //  :Single quote strings
  //  :Double quote strings
  //  :Triple single quote & Tripple double quote strings
  // ---------------------------------------------------

  STRING_RULES = [
    {
      priority: 10,
      type: Pattern.types.EXPRESSION,
      cssClass: "syntax_string",
      begin: "([rRuUfF]|[rbRB])?'''",
      end: "'''",
      patterns: [{ match: `[^(''')]*`, cssClass: "syntax_string" }],
    },
    {
      priority: 10,
      type: Pattern.types.EXPRESSION,
      cssClass: "syntax_string",
      begin: `([rRuUfF]|[rbRB])?"""`,
      end: `"""`,
      patterns: [{ match: `[^(""")]*?`, cssClass: "syntax_string" }],
    },
    {
      priority: 10,
      type: Pattern.types.EXPRESSION,
      cssClass: "syntax_string",
      begin: `([rRuUfF]|[rbRB])?"`,
      end: `"`,
      patterns: [{ match: `[^"]*`, cssClass: "syntax_string" }],
    },
    {
      priority: 10,
      type: Pattern.types.EXPRESSION,
      cssClass: "syntax_string",
      begin: "([rRuUfF]|[rbRB])?'",
      end: "'",
      patterns: [{ match: "[^']*", cssClass: "syntax_string" }],
    },
  ];
  // --------------------------------------------
  // https://docs.python.org/3/reference/lexical_analysis.html
  // :Integers
  // :Doubles
  NUMERIC_RULE = [
    // --------------------
    //Integers
    // --------------------

    // decimalinteger
    {
      cssClass: "syntax_number",
      type: Pattern.types.PRIMARY,
      priority: 10,
      match: "([1-9](_?\\d)*)|0",
    },
    // decimalinteger

    // bininteger
    {
      cssClass: "syntax_number",
      type: Pattern.types.PRIMARY,
      priority: 10,
      match: "0(b|B)(_?[0-1])*",
    },
    // hexinteger
    {
      cssClass: "syntax_number",
      type: Pattern.types.PRIMARY,
      priority: 10,
      match: "0(x|x)(_?[0-9a-fA-F])*",
    },
    // octinteger
    {
      cssClass: "syntax_number",
      type: Pattern.types.PRIMARY,
      priority: 10,
      match: "0(o|O)(_?[0-7])*",
    },
    // ------------------------------
    //  Floating point numbers
    // -------------------------------
    // floatnumber eg .11, 1.00, 1.
    {
      cssClass: "syntax_number",
      type: Pattern.types.PRIMARY,
      priority: 10,
      match: "(\\d(_?\\d)*\\.(\\d(_?\\d)*)?)|((\\d(_?\\d)*)?\\.(\\d(_?\\d)*))",
    },
    // exponentfloat eg 0e0
    {
      cssClass: "syntax_number",
      type: Pattern.types.PRIMARY,
      priority: 10,
      match:
        "((\\d(_?\\d)*)|(\\d(_?d)*)*((\\.(\\d(_?\\d)*)*)|([1-9](_?\\d)*\\.)))(e|E)([\\+|\\-])?(\\d(_?\\d)*)",
    },
  ];

  SIMPLE_STATEMENT_KEYWORDS = [
    "assert",
    "import",
    "del",
    "return",
    "yield",
    "pass",
    "raise",
    "continue",
    "break",
    "future",
    "global",
    "nonlocal",
    "from"
  ];
  COMPOUND_EXPRESSIONS_KEYWORDS = [
    "if",
    "while",
    "for",
    "try",
    "with",
    "match",
    "def",
    "class",
    "async",
    "except",
    "finally",
  ];
  SIMPLE_STATEMENTS_KEYWORDS_ = {
    cssClass: "syntax_keyword",
    type: Token.types.KEYWORD,
    match: "(" + this.SIMPLE_STATEMENT_KEYWORDS.join("|") + ")",
    priority: 6,
  };
  COMPOUND_EXPRESSIONS_KEYWORDS_ = {
    priority: 6,
    cssClass: "syntax_keyword",
    type: Token.types.KEYWORD,
    match: "(" + this.COMPOUND_EXPRESSIONS_KEYWORDS.join("|") + ")",
  };

  COMPOUND_EXPRESSIONS = {
    cssClass: "",
    type: Token.types.EXPRESSION,
    match: new RegExp(
      `(${this.COMPOUND_EXPRESSIONS_KEYWORDS.join("|")})` + /.*?:/
    ),
  };
  // --------------------------------------
  //Function
  ///
  SPACE = {
    match: "\\s+",
    cssClass: "",
  };
  ANNOTATION = {
    priority: 10,
    match: `@${this.IDENTIFIER}`,
    cssClass: "syntax_annotation",
  };
  FUNCTION_CALL = {
    match: `${this.IDENTIFIER}(\\.${this.IDENTIFIER})*(?=\\()`,
    cssClass: "syntax_function",
    priority: 10,
  };
  // function defination
  FUNCTION_DEFINATION = {
    cssClass: "syntax_keyword",
    begin: `def`,
    end: ":",
    priority:20,
    patterns: [
      {
        cssClass: "function arguments",
        begin: "\\(",
        end: "\\)",
        patterns: [
          {
            match: this.IDENTIFIER,
            cssClass: "syntax_argument",
          },
          this.SPACE,
          ...this.STRING_RULES,
          this.COMMENT_RULE,
          ...this.NUMERIC_RULE,
          this.DELIMETER_RULE,
          this.OPERATOR_RULE,
        ],
      },
      { priority: 110, match: "def", cssClass: "syntax_keyword" },
      {
        match: this.IDENTIFIER,
        cssClass: "syntax_function",
        priority: 110,
      },
      this.SPACE,
    ],
  };

  // function params
  static KEY_WORDS = [
    "assert",
    "async",
    "await",
    "break",
    "continue",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "lambda",
    "nonlocal",
    "not",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
    "case",
    "match",
  ];
   TYPES = ["float", "int", "dict"];
  /**
   * @returns {Array.<Pattern>}
   */

  get pattern() {
    return this.patterns;
  }
}
