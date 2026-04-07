interface ExpectedOutputBoxProps {
  expectedOutput: string;
}

export default function ExpectedOutputBox({ expectedOutput }: ExpectedOutputBoxProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "10px 14px",
      }}
    >
      <p
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          margin: "0 0 6px",
        }}
      >
        Expected output
      </p>
      <pre
        style={{
          margin: 0,
          fontFamily: "monospace",
          fontSize: "12px",
          lineHeight: "1.7",
          color: "var(--accent-green)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {expectedOutput}
      </pre>
    </div>
  );
}
