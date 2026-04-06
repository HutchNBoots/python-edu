interface OutputPanelProps {
  output: string;
  error: string | null;
  isRunning: boolean;
}

export default function OutputPanel({ output, error, isRunning }: OutputPanelProps) {
  const isEmpty = !output && !error && !isRunning;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "12px 14px",
        minHeight: "72px",
        maxHeight: "140px",
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
          maxHeight: "80px",
          color: error
            ? "var(--accent-orange)"
            : isEmpty || isRunning
            ? "var(--text-muted)"
            : "var(--text-primary)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {isRunning
          ? "Running…"
          : error
          ? error
          : isEmpty
          ? "Output will appear here"
          : output}
      </pre>
    </div>
  );
}
