import { SKILLS } from "@/lib/skillProgress";

interface SkillTreeHeaderProps {
  totalXp: number;
  completedCount: number;
}

export default function SkillTreeHeader({
  totalXp,
  completedCount,
}: SkillTreeHeaderProps) {
  const totalSkills = SKILLS.length;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Skill tree
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            margin: "4px 0 0",
          }}
        >
          {completedCount} of {totalSkills} skills complete
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 14px",
          backgroundColor: "var(--accent-primary-subtle)",
          border: "1px solid var(--accent-primary-border)",
          borderRadius: "9999px",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--accent-primary-text)",
          whiteSpace: "nowrap",
        }}
      >
        <span aria-hidden="true">⭐</span>
        <span>{totalXp} XP earned</span>
      </div>
    </div>
  );
}
