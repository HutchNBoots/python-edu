"use client";

import { useState } from "react";
import { createProfile } from "@/lib/progress";

interface UsernameModalProps {
  onReady: (profileId: string, username: string) => void;
}

export default function UsernameModal({ onReady }: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);

    try {
      const profile = await createProfile(trimmed);
      localStorage.setItem("dragonpy-profile-id", profile.id);
      localStorage.setItem("dragonpy-username", profile.username);
      onReady(profile.id, profile.username);
    } catch {
      setError("Couldn't save your name — check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="username-modal-heading"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "16px",
          padding: "32px 28px",
          width: "100%",
          maxWidth: "380px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>
          <p style={{ fontSize: "28px", margin: "0 0 8px", lineHeight: 1 }} aria-hidden="true">
            🐉
          </p>
          <h1
            id="username-modal-heading"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: "0 0 6px",
            }}
          >
            Welcome to dragon.py!
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
            What should we call you? We&apos;ll remember your progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            aria-label="Your name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Alex"
            maxLength={32}
            autoFocus
            required
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              fontSize: "14px",
              padding: "10px 14px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p style={{ fontSize: "12px", color: "var(--accent-orange)", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "11px 16px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading || !username.trim() ? "not-allowed" : "pointer",
              opacity: isLoading || !username.trim() ? 0.6 : 1,
            }}
          >
            {isLoading ? "Saving…" : "Let's go!"}
          </button>
        </form>
      </div>
    </div>
  );
}
