"use client";

import Link from "next/link";

interface XPRewardBannerProps {
  xpReward: number;
  level: string;
  nextHref: string;
  nextLabel: string;
}

export default function XPRewardBanner({
  xpReward,
  level,
  nextHref,
  nextLabel,
}: XPRewardBannerProps) {
  const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--accent-green-border)",
        borderRadius: "12px",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        zIndex: 10,
        whiteSpace: "nowrap",
        animation: "slideUp 0.25s ease",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <span aria-hidden="true" style={{ fontSize: "20px" }}>🎉</span>

      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "13px", color: "var(--text-primary)" }}>
          {levelLabel} path complete!
        </p>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--accent-green)" }}>
          +{xpReward} XP earned
        </p>
      </div>

      <Link
        href={nextHref}
        style={{
          backgroundColor: "var(--accent-green)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "7px 16px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        {nextLabel}
      </Link>
    </div>
  );
}
