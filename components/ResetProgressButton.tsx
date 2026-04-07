"use client";

import { useState } from "react";
import { resetProgress } from "@/lib/progress";
import { saveCompletions } from "@/lib/skillProgress";

interface ResetProgressButtonProps {
  onReset: () => void;
}

export default function ResetProgressButton({ onReset }: ResetProgressButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      const profileId = localStorage.getItem("dragonpy-profile-id");
      if (profileId) {
        await resetProgress(profileId);
      }
      // Clear local cache too
      saveCompletions({});
    } finally {
      setIsLoading(false);
      setConfirming(false);
      onReset();
    }
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          This will delete all your progress. Sure?
        </span>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          style={{
            backgroundColor: "var(--accent-orange)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "5px 12px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Resetting…" : "Yes, reset"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{
            background: "none",
            border: "1px solid var(--border-subtle)",
            borderRadius: "6px",
            color: "var(--text-muted)",
            padding: "5px 12px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label="Reset my progress"
      style={{
        background: "none",
        border: "none",
        color: "var(--text-muted)",
        fontSize: "12px",
        cursor: "pointer",
        textDecoration: "underline",
        padding: 0,
      }}
    >
      Reset my progress
    </button>
  );
}
