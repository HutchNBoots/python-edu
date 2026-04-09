import Link from "next/link";
import UnlockRequirements from "@/components/UnlockRequirements";
import ProjectBadge from "@/components/ProjectBadge";
import { PROJECTS } from "@/lib/projectGates";
import type { ProjectState } from "@/lib/projectGates";

const COMPLEXITY_DOTS: Record<string, number> = {
  starter:  1,
  mid:      2,
  advanced: 3,
};

function PadlockIcon({ locked }: { locked: boolean }) {
  return (
    <span style={{ fontSize: "22px", lineHeight: 1 }} aria-hidden="true">
      {locked ? "🔒" : "🔓"}
    </span>
  );
}

function DifficultyDots({ complexity }: { complexity: string }) {
  const filled = COMPLEXITY_DOTS[complexity] ?? 1;
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: n <= filled ? "var(--accent-primary)" : "var(--accent-primary-border)",
          }}
        />
      ))}
    </div>
  );
}

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
        {/* Padlock icon */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: isLocked ? "var(--bg-elevated)" : "var(--accent-primary-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PadlockIcon locked={isLocked} />
        </div>

        {/* Project number */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: "var(--bg-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "14px",
            fontWeight: 700,
            color: isLocked ? "var(--text-muted)" : "var(--text-primary)",
          }}
        >
          {PROJECTS.findIndex((p) => p.id === def.id) + 1}
        </div>

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
            <DifficultyDots complexity={def.complexity} />
            <div
              style={{
                marginLeft: "auto",
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
              +{def.xpReward} XP
            </div>
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

      {!isLocked && !isComplete && def.href && (
        <Link
          href={def.href}
          aria-label={`Start ${def.name}`}
          style={{
            alignSelf: "flex-start",
            backgroundColor: "var(--accent-primary)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Start →
        </Link>
      )}

      {!isLocked && !isComplete && !def.href && (
        <button
          disabled
          title="Coming soon"
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
