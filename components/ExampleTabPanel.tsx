"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darkCodeTheme, lightCodeTheme } from "@/styles/codeTheme";
import { useTheme } from "@/components/ThemeProvider";
import HelpMeButton from "@/components/HelpMeButton";

interface ExampleTabPanelProps {
  code: string;
  onTryIt: () => void;
}

export default function ExampleTabPanel({ code, onTryIt }: ExampleTabPanelProps) {
  const { theme } = useTheme();
  const codeTheme = theme === "dark" ? darkCodeTheme : lightCodeTheme;

  return (
    <div
      id="tabpanel-example"
      role="tabpanel"
      aria-labelledby="tab-example"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflow: "hidden",
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
          flexShrink: 0,
        }}
      >
        Code Example
      </p>

      {/* Syntax-highlighted block */}
      <div
        className="themed-scroll-code"
        style={{
          flex: 1,
          backgroundColor: "var(--code-bg)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        <SyntaxHighlighter
          language="python"
          style={codeTheme}
          customStyle={{
            margin: 0,
            padding: "14px",
            background: "transparent",
            fontSize: "12px",
            lineHeight: "1.9",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Button row */}
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          aria-label="Go to the exercise for this lesson"
          onClick={onTryIt}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            backgroundColor: "var(--accent-primary)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "11px 16px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try it yourself <span aria-hidden="true">→</span>
        </button>
        <HelpMeButton />
      </div>
    </div>
  );
}
