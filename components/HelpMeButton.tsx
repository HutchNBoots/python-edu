"use client";

import { useState } from "react";

interface HelpMeButtonProps {
  onClick?: () => void;
}

export default function HelpMeButton({ onClick }: HelpMeButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      aria-label="Get a hint for this lesson"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "transparent",
        border: `1px solid ${hovered ? "var(--accent-primary)" : "var(--border-subtle)"}`,
        color: hovered ? "var(--accent-primary-text)" : "var(--text-secondary)",
        borderRadius: "8px",
        padding: "11px 14px",
        fontSize: "13px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "border-color 0.15s ease, color 0.15s ease",
      }}
    >
      Help me
    </button>
  );
}
