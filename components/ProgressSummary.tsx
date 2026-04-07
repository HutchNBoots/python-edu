import { SKILLS } from "@/lib/skillProgress";

interface ProgressSummaryProps {
  username: string;
  totalXp: number;
  skillsComplete: number;
  projectsComplete: number;
}

export default function ProgressSummary({
  username,
  totalXp,
  skillsComplete,
  projectsComplete,
}: ProgressSummaryProps) {
  const totalSkills = SKILLS.length;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
        Welcome back,{" "}
        <strong style={{ color: "var(--text-primary)" }}>{username}</strong>!
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <StatPill
          icon="⭐"
          label="XP earned"
          value={String(totalXp)}
          colour="var(--accent-primary-text)"
          bg="var(--accent-primary-subtle)"
          border="var(--accent-primary-border)"
        />
        <StatPill
          icon="✅"
          label="Skills complete"
          value={`${skillsComplete} / ${totalSkills}`}
          colour="var(--accent-green)"
          bg="var(--accent-green-subtle)"
          border="var(--accent-green-border)"
        />
        <StatPill
          icon="🏆"
          label="Projects complete"
          value={`${projectsComplete} / 5`}
          colour="var(--accent-orange)"
          bg="var(--accent-orange-subtle)"
          border="var(--accent-orange-border)"
        />
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  colour,
  bg,
  border,
}: {
  icon: string;
  label: string;
  value: string;
  colour: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      aria-label={`${label}: ${value}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: "10px",
        flex: "1 1 auto",
        minWidth: "120px",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "18px" }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: colour }}>
          {value}
        </p>
      </div>
    </div>
  );
}
