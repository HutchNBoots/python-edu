import type { ProjectConcept } from "@/lib/projectContent";

interface ConceptSummaryProps {
  concepts: ProjectConcept[];
  visible: boolean;
}

export default function ConceptSummary({ concepts, visible }: ConceptSummaryProps) {
  return (
    <div
      aria-label="Concepts used"
      style={{
        overflow: "hidden",
        maxHeight: visible ? `${concepts.length * 80 + 60}px` : "0px",
        opacity: visible ? 1 : 0,
        transition: "max-height 0.4s ease, opacity 0.35s ease",
      }}
    >
      <div
        style={{
          paddingTop: "20px",
          borderTop: "1px solid var(--border-subtle)",
          marginTop: "4px",
        }}
      >
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
          Python concepts you used
        </p>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {concepts.map((c) => (
            <li key={c.name}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--accent-primary-text)",
                  backgroundColor: "var(--accent-primary-subtle)",
                  border: "1px solid var(--accent-primary-border)",
                  borderRadius: "4px",
                  padding: "1px 6px",
                  marginBottom: "3px",
                }}
              >
                {c.name}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  lineHeight: "1.6",
                  color: "var(--text-muted)",
                }}
              >
                {c.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
