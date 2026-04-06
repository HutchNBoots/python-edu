/**
 * Prism theme built from the token files.
 * Hex values live here (a styles file), not in component files.
 * Code tokens are identical in both themes — the editor is always dark.
 */
import { darkTheme } from "@/styles/themes/dark";

type CSSProperties = Record<string, string | number>;

export const codeTheme: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: darkTheme["--code-variable"],
    background: darkTheme["--code-bg"],
    fontFamily: "monospace",
    fontSize: "12px",
    lineHeight: "1.9",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    tabSize: 4,
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: darkTheme["--code-variable"],
    background: darkTheme["--code-bg"],
    fontFamily: "monospace",
    fontSize: "12px",
    lineHeight: "1.9",
    margin: 0,
    padding: "14px",
    overflow: "auto",
    borderRadius: "0 0 8px 8px",
  },
  comment: { color: darkTheme["--code-comment"], fontStyle: "italic" },
  prolog: { color: darkTheme["--code-comment"] },
  doctype: { color: darkTheme["--code-comment"] },
  cdata: { color: darkTheme["--code-comment"] },
  punctuation: { color: darkTheme["--code-variable"] },
  keyword: { color: darkTheme["--code-keyword"] },
  "builtin": { color: darkTheme["--code-keyword"] },
  "class-name": { color: darkTheme["--code-keyword"] },
  function: { color: darkTheme["--code-keyword"] },
  boolean: { color: darkTheme["--code-value"] },
  number: { color: darkTheme["--code-value"] },
  string: { color: darkTheme["--code-string"] },
  "attr-value": { color: darkTheme["--code-string"] },
  char: { color: darkTheme["--code-string"] },
  regex: { color: darkTheme["--code-string"] },
  variable: { color: darkTheme["--code-variable"] },
  operator: { color: darkTheme["--code-variable"] },
  "attr-name": { color: darkTheme["--code-variable"] },
  tag: { color: darkTheme["--code-keyword"] },
  namespace: { color: darkTheme["--code-comment"] },
  important: { fontWeight: "bold" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};
