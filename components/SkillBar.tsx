import PathPill, { PathState } from "@/components/PathPill";

export interface PathEntry {
  name: string;
  state: PathState;
}

interface SkillBarProps {
  paths: PathEntry[];
  skillName: string;
  lessonNumber: number;
  totalLessons: number;
}

export default function SkillBar({
  paths,
  skillName,
  lessonNumber,
  totalLessons,
}: SkillBarProps) {
  return (
    <nav
      aria-label="Skill paths"
      style={{
        height: "40px",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 18px",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
        Path
      </span>

      {paths.map((path) => (
        <PathPill key={path.name} label={path.name} state={path.state} />
      ))}

      <div style={{ flex: 1 }} />

      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
        {skillName} · Lesson {lessonNumber} of {totalLessons}
      </span>
    </nav>
  );
}
