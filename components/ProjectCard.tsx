import UnlockRequirements from "@/components/UnlockRequirements";
import ProjectBadge from "@/components/ProjectBadge";
import type { ProjectState } from "@/lib/projectGates";

const COMPLEXITY_LABEL: Record<string, string> = {
  starter:  "Starter",
  mid:      "Mid",
  advanced: "Advanced",
};

const COMPLEXITY_COLOUR: Record<string, string> = {
  starter:  "var(--accent-green)",
  mid:      "var(--accent-primary-text)",
  advanced: "var(--accent-orange)",
};

interface ProjectCardProps {
  projectState: ProjectState;
}

export default function ProjectCard({ projectState }: ProjectCardProps) {
  const { def, status, unmetRequirements } = projectState;
  const isLocked = status === "locked";
  const isComplete = status === "complete";

  return (
    <div
      aria-label={`${def.name} — ${status}`}
      style={{
        backgroundColor: "var(--bg-surface)",
        border: `1px solid ${isComplete ? "var(--accent-green-border)" : "var(--border-default)"}`,
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        opacity: isLocked ? 0.6 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ fontSize: "28px", lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
          {isLocked ? "🔒" : def.badgeIcon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                color: isLocked ? "var(--text-muted)" : "var(--text-primary)",
              }}
            >
              {def.name}
            </h2>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: COMPLEXITY_COLOUR[def.complexity],
                padding: "2px 7px",
                border: `1px solid ${COMPLEXITY_COLOUR[def.complexity]}`,
                borderRadius: "9999px",
                opacity: 0.8,
              }}
            >
              {COMPLEXITY_LABEL[def.complexity]}
            </span>
          </div>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              lineHeight: "1.6",
              color: "var(--text-muted)",
            }}
          >
            {def.description}
          </p>
        </div>
      </div>

      {/* State-specific content */}
      {isLocked && <UnlockRequirements requirements={unmetRequirements} />}

      {isComplete && (
        <ProjectBadge
          icon={def.badgeIcon}
          name={def.name}
          xpReward={def.xpReward}
        />
      )}

      {!isLocked && !isComplete && (
        <button
          disabled
          title="Project pages are coming soon!"
          aria-label={`Start ${def.name} — coming soon`}
          style={{
            alignSelf: "flex-start",
            backgroundColor: "var(--accent-primary)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "not-allowed",
            opacity: 0.5,
          }}
        >
          Start →
        </button>
      )}
    </div>
  );
}
