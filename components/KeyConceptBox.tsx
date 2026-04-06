interface KeyConceptBoxProps {
  concept: string;
}

export default function KeyConceptBox({ concept }: KeyConceptBoxProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--accent-primary-subtle)",
        border: "1px solid var(--accent-primary-border)",
        borderRadius: "8px",
        padding: "12px 14px",
        marginBottom: "16px",
      }}
    >
      <p
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--accent-primary)",
          marginBottom: "6px",
        }}
      >
        Key Concept
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "var(--accent-primary-text)",
          lineHeight: "1.6",
          margin: 0,
        }}
      >
        {concept}
      </p>
    </div>
  );
}
