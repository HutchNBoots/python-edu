interface ProjectBadgeProps {
  icon: string;
  name: string;
  xpReward: number;
}

export default function ProjectBadge({ icon, name, xpReward }: ProjectBadgeProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        backgroundColor: "var(--accent-green-subtle)",
        border: "1px solid var(--accent-green-border)",
        borderRadius: "10px",
      }}
    >
      <span style={{ fontSize: "22px", lineHeight: 1 }} aria-hidden="true">
        {icon}
      </span>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--accent-green)",
          }}
        >
          {name}
        </p>
        <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>
          +{xpReward} XP earned
        </p>
      </div>
    </div>
  );
}
