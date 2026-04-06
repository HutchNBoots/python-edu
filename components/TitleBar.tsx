interface TitleBarProps {
  skillProgress: number; // 0–100
  skillNumber: number;
  totalSkills: number;
  streak: number;
  totalXp: number;
}

export default function TitleBar({
  skillProgress,
  skillNumber,
  totalSkills,
  streak,
  totalXp,
}: TitleBarProps) {
  return (
    <header
      style={{
        height: "52px",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "0 18px",
        flexShrink: 0,
      }}
    >
      {/* Brand mark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "15px",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        <span aria-hidden="true">🐉</span>
        <span style={{ color: "var(--text-primary)" }}>dragon</span>
        <span style={{ color: "var(--accent-primary)" }}>.py</span>
      </div>

      {/* Skill progress bar */}
      <div
        role="progressbar"
        aria-valuenow={skillProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Skill progress: ${skillProgress}%`}
        style={{
          flex: 1,
          maxWidth: "220px",
          height: "5px",
          backgroundColor: "var(--bg-elevated)",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${skillProgress}%`,
            height: "100%",
            backgroundColor: "var(--accent-primary)",
            borderRadius: "9999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Skill label */}
      <span
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        Skill {skillNumber} of {totalSkills}
      </span>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Streak pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          backgroundColor: "var(--accent-orange-subtle)",
          border: "1px solid var(--accent-orange-border)",
          borderRadius: "9999px",
          fontSize: "12px",
          color: "var(--accent-orange)",
          whiteSpace: "nowrap",
        }}
      >
        <span aria-hidden="true">🔥</span>
        <span>{streak} day{streak !== 1 ? "s" : ""}</span>
      </div>

      {/* XP pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          backgroundColor: "var(--accent-primary-subtle)",
          border: "1px solid var(--accent-primary-border)",
          borderRadius: "9999px",
          fontSize: "12px",
          color: "var(--accent-primary-text)",
          whiteSpace: "nowrap",
        }}
      >
        <span>{totalXp} XP</span>
      </div>
    </header>
  );
}
