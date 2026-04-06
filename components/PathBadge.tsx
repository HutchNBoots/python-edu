import type { PathLevel, PathStatus } from "@/lib/skillProgress";

interface PathBadgeProps {
  level: PathLevel;
  status: PathStatus;
  xpEarned: number;
}

const LABEL: Record<PathLevel, string> = {
  easy: "Easy",
  mid: "Mid",
  hard: "Hard",
};

export default function PathBadge({ level, status, xpEarned }: PathBadgeProps) {
  const isComplete = status === "complete";
  const isLocked = status === "locked";

  const bg = isComplete
    ? "var(--accent-green-subtle)"
    : isLocked
    ? "transparent"
    : "var(--accent-primary-subtle)";

  const border = isComplete
    ? "var(--accent-green-border)"
    : isLocked
    ? "var(--border-subtle)"
    : "var(--accent-primary-border)";

  const color = isComplete
    ? "var(--accent-green)"
    : isLocked
    ? "var(--text-muted)"
    : "var(--accent-primary-text)";

  return (
    <div
      aria-label={`${LABEL[level]} path — ${status}${isComplete ? `, ${xpEarned} XP` : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
        padding: "6px 10px",
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: "8px",
        minWidth: "56px",
      }}
    >
      <span
        aria-hidden="true"
        style={{ fontSize: "13px", lineHeight: 1 }}
      >
        {isComplete ? "✓" : isLocked ? "🔒" : "●"}
      </span>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color,
          letterSpacing: "0.04em",
        }}
      >
        {LABEL[level]}
      </span>
      {isComplete && (
        <span
          style={{
            fontSize: "10px",
            color: "var(--accent-green)",
            fontWeight: 500,
          }}
        >
          +{xpEarned} XP
        </span>
      )}
    </div>
  );
}
