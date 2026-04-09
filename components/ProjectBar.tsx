import { MAX_ATTEMPTS } from "@/hooks/useProjectProgress";

interface ProjectBarProps {
  name: string;
  badgeIcon: string;
  xpReward: number;
  attemptsRemaining: number;
  isComplete: boolean;
  isSolutionShown: boolean;
}

export default function ProjectBar({
  name,
  badgeIcon,
  xpReward,
  attemptsRemaining,
  isComplete,
  isSolutionShown,
}: ProjectBarProps) {
  const clampedRemaining = Math.max(0, attemptsRemaining);

  let attemptsLabel: string;
  let attemptsColor: string;
  if (isComplete) {
    attemptsLabel = "complete";
    attemptsColor = "var(--accent-green)";
  } else if (isSolutionShown) {
    attemptsLabel = "solution shown";
    attemptsColor = "var(--text-muted)";
  } else if (clampedRemaining === 0) {
    attemptsLabel = "0 of 3 attempts remaining";
    attemptsColor = "var(--accent-orange)";
  } else {
    attemptsLabel = `${clampedRemaining} of ${MAX_ATTEMPTS} attempts remaining`;
    attemptsColor =
      clampedRemaining === 1 ? "var(--accent-orange)" : "var(--text-secondary)";
  }

  return (
    <div
      aria-label="Project info"
      style={{
        height: "40px",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 18px",
        flexShrink: 0,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "15px", lineHeight: 1 }}>
        {badgeIcon}
      </span>

      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text-primary)",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>

      <div
        style={{
          padding: "2px 8px",
          backgroundColor: "var(--accent-primary-subtle)",
          border: "1px solid var(--accent-primary-border)",
          borderRadius: "9999px",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--accent-primary-text)",
          whiteSpace: "nowrap",
        }}
      >
        +{xpReward} XP
      </div>

      <div style={{ flex: 1 }} />

      <span
        aria-label={`Attempts: ${attemptsLabel}`}
        style={{
          fontSize: "12px",
          color: attemptsColor,
          whiteSpace: "nowrap",
          transition: "color 0.2s ease",
        }}
      >
        {attemptsLabel}
      </span>
    </div>
  );
}
