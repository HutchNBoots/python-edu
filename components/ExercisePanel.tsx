import ExpectedOutputBox from "@/components/ExpectedOutputBox";

interface ExercisePanelProps {
  instructions: string;
  expectedOutput: string;
}

export default function ExercisePanel({
  instructions,
  expectedOutput,
}: ExercisePanelProps) {
  return (
    <div
      className="themed-scroll"
      style={{
        width: "340px",
        flexShrink: 0,
        borderRight: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
        overflowY: "auto",
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Task */}
      <div>
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
          Your task
        </p>
        <p
          style={{
            fontSize: "13px",
            lineHeight: "1.7",
            color: "var(--text-secondary)",
            margin: 0,
          }}
          dangerouslySetInnerHTML={{ __html: instructions }}
        />
      </div>

      {/* Expected output */}
      <ExpectedOutputBox expectedOutput={expectedOutput} />

      {/* Help button — stub for PY-008 */}
      <button
        disabled
        title="Coming soon in a future update"
        style={{
          alignSelf: "flex-start",
          background: "none",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          color: "var(--text-muted)",
          fontSize: "12px",
          padding: "6px 14px",
          cursor: "not-allowed",
          opacity: 0.5,
        }}
      >
        Give me a hint
      </button>
    </div>
  );
}
