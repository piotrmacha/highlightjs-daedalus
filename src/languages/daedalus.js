/*
 Language: daedalus
 Category: scripting
 Author: Piotr Macha <me@piotrmacha.pl>
 Description: Scripting language for ZenGin (Gothic I and Gothic II engine)
*/
module.exports = function (hljs) {
  const DAEDALUS_IDENT_RE = /[a-zA-Z_][a-zA-Z_0-9]*/;
  const TYPES = ["int", "float", "void", "string"];
  const LITERALS = ['true', 'false', 'null'];

  const KEYWORDS = {
    keyword: [
      'if', 'else', 'var', 'const', 'func', 'extern',
      'class', 'instance', 'prototype',
      'while', 'break', 'continue', 'return'
    ],
    literal: LITERALS,
    type: TYPES
  };

  const VARIABLE_DECLARATION = {
    match: [
      /\b(?:var)/,
      /\s+/,
      /\b(?:int|string|float|void|instance)/,
      /\s+/,
      DAEDALUS_IDENT_RE
    ],
    className: {
      1: "keyword",
      3: "keyword",
      5: "variable"
    }
  };

  return {
    name: "daedalus",
    aliases: ["dea"],
    keywords: KEYWORDS,
    case_insensitive: true,
    disableAutodetect: false,
    contains: [
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.HASH_COMMENT_MODE,
      hljs.NUMBER_MODE,
      // Built-in
      {
        match: /\b(?:C_NPC|C_INFO|C_MENU_DEF|C_MENU_ITEM_DEF|C_MUSICSYS_CFG|C_MUSICTHEME|C_SFX_DEF)/,
        className: 'title.class'
      },
      {
        match: /\b(?:self|other|item|victim|hero|null|instance_help)/,
        className: 'variable.language'
      },
      // Class declaration
      {
        begin: [
          /\bclass/,
          /\s+/,
          DAEDALUS_IDENT_RE,
          /\s+{/
        ],
        className: {
          1: "keyword",
          3: "title.class"
        }
      },
      // Instance/prototype declaration
      {
        begin: [
          /\b(?:instance|prototype)/,
          /\s+/,
          DAEDALUS_IDENT_RE,
          /\s*\(\s*/,
          DAEDALUS_IDENT_RE,
          /\s*\)\s*{/,
        ],
        className: {
          1: "keyword",
          3: "title.class",
          5: "title.class.inherited",
        }
      },
      // Function declaration
      {
        begin: [
          /func/,
          /\s+/,
          /\b(?:int|string|float|void)/,
          /\s+/,
          DAEDALUS_IDENT_RE,
          /\s*(?=\()/,
        ],
        className: {
          1: "keyword",
          3: "keyword",
          5: "title.function"
        },
        contains: [
          {
            begin: /(\s*)\(/, // to match the parms with
            end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            contains: [
              VARIABLE_DECLARATION
            ]
          }
        ]
      },
      // Variable declaration
      VARIABLE_DECLARATION,
      // Const declaration
      {
        match: [
          /\b(?:const)/,
          /\s+/,
          /\b(?:int|string|float|void)/,
          /\s+/,
          DAEDALUS_IDENT_RE
        ],
        className: {
          1: "keyword",
          3: "keyword",
          5: "variable"
        }
      },
      // Function call
      {
        begin: [
          /\b(?!if|else|while)/,
          DAEDALUS_IDENT_RE,
          /\s*(?=\()/
        ],
        className: {
          2: "title.function.invoke"
        }
      }
    ]
  };
}
