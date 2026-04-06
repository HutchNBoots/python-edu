"use client";

import { useState, useEffect } from "react";

interface OutputPanelProps {
  output: string;
  friendlyError: string | null;
  rawError: string | null;
  isRunning: boolean;
  isExplainingError: boolean;
  errorFallback: boolean;
}

export default function OutputPanel({
  output,
  friendlyError,
  rawError,
  isRunning,
  isExplainingError,
  errorFallback,
}: OutputPanelProps) {
  const [showRaw, setShowRaw] = useState(false);

  // Collapse raw traceback whenever a new error comes in
  useEffect(() => {
    setShowRaw(false);
  }, [rawError]);

  const hasError = isExplainingError || friendlyError || errorFallback;
  const isEmpty = !output && !hasError && !isRunning;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "12px 14px",
        minHeight: "72px",
        maxHeight: "200px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          margin: "0 0 8px",
          flexShrink: 0,
        }}
      >
        Output
      </p>

      <pre
        aria-label="Code output"
        aria-live="polite"
        className="themed-scroll"
        style={{
          margin: 0,
          fontFamily: "monospace",
          fontSize: "12px",
          lineHeight: "1.7",
          overflowY: "auto",
          flex: 1,
          color: hasError
            ? "var(--accent-orange)"
            : isEmpty || isRunning
            ? "var(--text-muted)"
            : "var(--text-primary)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {isRunning ? (
          "Running…"
        ) : isExplainingError ? (
          "Explaining error…"
        ) : errorFallback ? (
          "Something went wrong — check your code for typos and try again!"
        ) : friendlyError ? (
          <>
            <span aria-hidden="true">⚠️ </span>
            {friendlyError}
            {rawError && (
              <span
                style={{
                  display: "block",
                  marginTop: "8px",
                }}
              >
                <button
                  aria-expanded={showRaw}
                  onClick={() => setShowRaw((v) => !v)}
                  style={{
                    background: "none",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    color: "var(--text-muted)",
                    fontSize: "11px",
                    cursor: "pointer",
                    padding: "2px 8px",
                    fontFamily: "inherit",
                  }}
                >
                  {showRaw ? "Hide technical detail" : "Show technical detail"}
                </button>
                {showRaw && (
                  <span
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "var(--text-muted)",
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {rawError}
                  </span>
                )}
              </span>
            )}
          </>
        ) : isEmpty ? (
          "Output will appear here"
        ) : (
          output
        )}
      </pre>
    </div>
  );
}
