import Link from "next/link";
import type { UnlockRequirement } from "@/lib/projectGates";

interface UnlockRequirementsProps {
  requirements: UnlockRequirement[];
}

const LEVEL_LABEL: Record<string, string> = {
  easy: "Easy",
  mid: "Mid",
  hard: "Hard",
};

export default function UnlockRequirements({ requirements }: UnlockRequirementsProps) {
  return (
    <div>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          margin: "0 0 8px",
        }}
      >
        Still needed
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {requirements.map((req) => (
          <Link
            key={`${req.skillId}-${req.minLevel}`}
            href={req.href}
            aria-label={`${req.skillName} ${LEVEL_LABEL[req.minLevel]} — go to exercise`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              backgroundColor: "var(--accent-orange-subtle)",
              border: "1px solid var(--accent-orange-border)",
              borderRadius: "9999px",
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--accent-orange)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {req.skillName} · {LEVEL_LABEL[req.minLevel]}
          </Link>
        ))}
      </div>
    </div>
  );
}
