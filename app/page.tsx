"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UsernameModal from "@/components/UsernameModal";
import ProgressSummary from "@/components/ProgressSummary";
import ResetProgressButton from "@/components/ResetProgressButton";
import { useSkillProgress } from "@/hooks/useSkillProgress";

export default function Home() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { totalXp, completedCount, isLoaded } = useSkillProgress();

  useEffect(() => {
    setProfileId(localStorage.getItem("dragonpy-profile-id"));
    setUsername(localStorage.getItem("dragonpy-username"));
    setHydrated(true);
  }, []);

  function handleProfileReady(id: string, name: string) {
    setProfileId(id);
    setUsername(name);
  }

  function handleReset() {
    setProfileId(null);
    setUsername(null);
    localStorage.removeItem("dragonpy-profile-id");
    localStorage.removeItem("dragonpy-username");
  }

  return (
    <main
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "48px 20px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Brand */}
      <div>
        <p style={{ fontSize: "36px", margin: "0 0 10px", lineHeight: 1 }} aria-hidden="true">
          🐉
        </p>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: "0 0 8px",
          }}
        >
          dragon<span style={{ color: "var(--accent-primary)" }}>.py</span>
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", margin: 0 }}>
          Learn Python by building real things.
        </p>
      </div>

      {/* Progress summary — shown once profile is known */}
      {hydrated && isLoaded && profileId && username && (
        <ProgressSummary
          username={username}
          totalXp={totalXp}
          skillsComplete={completedCount}
          projectsComplete={0}
        />
      )}

      {/* Nav links */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link
          href="/skill-tree"
          style={{
            display: "block",
            backgroundColor: "var(--accent-primary)",
            color: "#fff",
            borderRadius: "10px",
            padding: "13px 18px",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          View skill tree →
        </Link>
        <Link
          href="/lessons/variables/easy"
          style={{
            display: "block",
            backgroundColor: "transparent",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
            borderRadius: "10px",
            padding: "13px 18px",
            fontSize: "14px",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Start with Variables
        </Link>
      </div>

      {/* Reset — only shown when profile exists */}
      {hydrated && profileId && (
        <div style={{ marginTop: "8px" }}>
          <ResetProgressButton onReset={handleReset} />
        </div>
      )}

      {/* Username modal — shown on first visit */}
      {hydrated && !profileId && (
        <UsernameModal onReady={handleProfileReady} />
      )}
    </main>
  );
}
