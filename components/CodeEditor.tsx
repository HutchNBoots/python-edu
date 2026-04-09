"use client";

import { useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = value.substring(0, start) + "    " + value.substring(end);
    onChange(next);
    // Restore cursor after React re-render
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 4;
    });
  }

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      readOnly={readOnly}
      aria-label="Python code editor"
      aria-readonly={readOnly}
      className="themed-scroll themed-scroll-code"
      style={{
        flex: 1,
        width: "100%",
        resize: "none",
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: "1.9",
        padding: "14px",
        backgroundColor: "var(--code-bg)",
        color: "var(--code-variable)",
        border: "2px solid var(--accent-primary)",
        borderRadius: "8px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}
