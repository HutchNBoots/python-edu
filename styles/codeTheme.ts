/**
 * Prism theme objects built from the token files.
 * Hex values live here (a styles file), not in component files.
 */
import { darkTheme } from "@/styles/themes/dark";
import { lightTheme } from "@/styles/themes/light";

type CSSProperties = Record<string, string | number>;
export type CodeTheme = Record<string, CSSProperties>;

function buildTheme(t: Record<string, string>): CodeTheme {
  return {
    'code[class*="language-"]': {
      color: t["--code-variable"],
      background: t["--code-bg"],
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
      color: t["--code-variable"],
      background: t["--code-bg"],
      fontFamily: "monospace",
      fontSize: "12px",
      lineHeight: "1.9",
      margin: 0,
      padding: "14px",
      overflow: "auto",
      borderRadius: "0 0 8px 8px",
    },
    comment: { color: t["--code-comment"], fontStyle: "italic" },
    prolog: { color: t["--code-comment"] },
    doctype: { color: t["--code-comment"] },
    cdata: { color: t["--code-comment"] },
    punctuation: { color: t["--code-variable"] },
    keyword: { color: t["--code-keyword"] },
    builtin: { color: t["--code-keyword"] },
    "class-name": { color: t["--code-keyword"] },
    function: { color: t["--code-keyword"] },
    boolean: { color: t["--code-value"] },
    number: { color: t["--code-value"] },
    string: { color: t["--code-string"] },
    "attr-value": { color: t["--code-string"] },
    char: { color: t["--code-string"] },
    regex: { color: t["--code-string"] },
    variable: { color: t["--code-variable"] },
    operator: { color: t["--code-variable"] },
    "attr-name": { color: t["--code-variable"] },
    tag: { color: t["--code-keyword"] },
    namespace: { color: t["--code-comment"] },
    important: { fontWeight: "bold" },
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
  };
}

export const darkCodeTheme = buildTheme(darkTheme);
export const lightCodeTheme = buildTheme(lightTheme);
