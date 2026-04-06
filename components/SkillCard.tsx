import Link from "next/link";
import PathBadge from "@/components/PathBadge";
import type { SkillState } from "@/lib/skillProgress";
import { firstIncompletePathLevel } from "@/lib/skillProgress";

interface SkillCardProps {
  skill: SkillState;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const nextLevel = firstIncompletePathLevel(skill);
  const allComplete = nextLevel === null;
  const href = allComplete
    ? `/lessons/${skill.id}/hard`
    : `/lessons/${skill.id}/${nextLevel}`;

  const cardInner = (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: `1px solid ${skill.isLocked ? "var(--border-subtle)" : "var(--border-default)"}`,
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        opacity: skill.isLocked ? 0.55 : 1,
        transition: "border-color 0.15s, opacity 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {skill.isLocked && (
          <span aria-hidden="true" style={{ fontSize: "13px" }}>
            🔒
          </span>
        )}
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: skill.isLocked ? "var(--text-muted)" : "var(--text-primary)",
          }}
        >
          {skill.name}
        </span>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {skill.paths.map((path) => (
          <PathBadge
            key={path.level}
            level={path.level}
            status={path.status}
            xpEarned={path.xpEarned}
          />
        ))}
      </div>
    </div>
  );

  if (skill.isLocked) {
    return (
      <div aria-label={`${skill.name} — locked`} style={{ cursor: "default" }}>
        {cardInner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${skill.name} — go to ${allComplete ? "hard" : nextLevel} path`}
      style={{ textDecoration: "none", display: "block" }}
    >
      {cardInner}
    </Link>
  );
}
