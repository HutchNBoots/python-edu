export type PathState = "completed" | "active" | "locked";

interface PathPillProps {
  label: string;
  state: PathState;
}

const styles: Record<PathState, React.CSSProperties> = {
  completed: {
    backgroundColor: "var(--accent-green-subtle)",
    border: "1px solid var(--accent-green-border)",
    color: "var(--accent-green)",
  },
  active: {
    backgroundColor: "var(--accent-primary-subtle)",
    border: "1px solid var(--accent-primary-border)",
    color: "var(--accent-primary-text)",
  },
  locked: {
    backgroundColor: "transparent",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-muted)",
  },
};

export default function PathPill({ label, state }: PathPillProps) {
  return (
    <span
      data-state={state}
      style={{
        ...styles[state],
        padding: "3px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {state === "completed" && (
        <span aria-hidden="true" style={{ marginRight: "4px" }}>
          ✓
        </span>
      )}
      {label}
    </span>
  );
}
