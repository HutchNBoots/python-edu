"use client";

import { useState } from "react";
import Link from "next/link";

interface TryItButtonProps {
  slug: string;
}

export default function TryItButton({ slug }: TryItButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/exercises/${slug}`}
      aria-label="Go to the exercise for this lesson"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        backgroundColor: hovered
          ? "var(--accent-primary-hover)"
          : "var(--accent-primary)",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "11px 16px",
        fontSize: "13px",
        fontWeight: 500,
        textDecoration: "none",
        transition: "background-color 0.15s ease",
      }}
    >
      Try it yourself <span aria-hidden="true">→</span>
    </Link>
  );
}
