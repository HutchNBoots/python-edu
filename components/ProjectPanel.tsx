import ConceptSummary from "@/components/ConceptSummary";
import type { ProjectConcept } from "@/lib/projectContent";

interface ProjectPanelProps {
  instructions: string[];
  concepts: ProjectConcept[];
  isComplete: boolean;
}

export default function ProjectPanel({
  instructions,
  concepts,
  isComplete,
}: ProjectPanelProps) {
  return (
    <div
      className="themed-scroll"
      style={{
        width: "340px",
        flexShrink: 0,
        borderRight: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
        overflowY: "auto",
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Task list */}
      <div>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: "0 0 10px",
          }}
        >
          Your tasks
        </p>
        <ol
          style={{
            margin: 0,
            paddingLeft: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {instructions.map((step, i) => (
            <li
              key={i}
              style={{
                fontSize: "13px",
                lineHeight: "1.7",
                color: "var(--text-secondary)",
              }}
            >
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Concepts revealed on completion */}
      <ConceptSummary concepts={concepts} visible={isComplete} />
    </div>
  );
}
