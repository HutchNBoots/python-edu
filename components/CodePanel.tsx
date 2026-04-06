"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { codeTheme } from "@/styles/codeTheme";
import TryItButton from "@/components/TryItButton";
import HelpMeButton from "@/components/HelpMeButton";

interface CodePanelProps {
  code: string;
  slug: string;
}

export default function CodePanel({ code, slug }: CodePanelProps) {
  return (
    <section
      aria-label="Code example"
      style={{
        flex: 1,
        backgroundColor: "var(--bg-base)",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          margin: 0,
        }}
      >
        Code Example
      </p>

      {/* Syntax-highlighted code block */}
      <div
        style={{
          flex: 1,
          backgroundColor: "var(--code-bg)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <SyntaxHighlighter
          language="python"
          style={codeTheme}
          customStyle={{
            margin: 0,
            padding: "14px",
            background: "var(--code-bg)",
            fontSize: "12px",
            lineHeight: "1.9",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Button row */}
      <div style={{ display: "flex", gap: "8px" }}>
        <TryItButton slug={slug} />
        <HelpMeButton />
      </div>
    </section>
  );
}
