"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";
import UsernameModal from "@/components/UsernameModal";
import ResetProgressButton from "@/components/ResetProgressButton";
import { useSkillProgress } from "@/hooks/useSkillProgress";
import type { SkillState } from "@/lib/skillProgress";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function firstIncompleteHref(skillStates: SkillState[]): string {
  for (const skill of skillStates) {
    for (const path of skill.paths) {
      if (path.status === "available") {
        return `/lessons/${skill.id}/${path.level}`;
      }
    }
  }
  return "/lessons/variables/easy";
}

function pathsCompleteCount(skillStates: SkillState[]): number {
  return skillStates.flatMap((s) => s.paths).filter((p) => p.status === "complete").length;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MetricCard({
  icon,
  label,
  value,
  colour,
  bg,
  border,
}: {
  icon: string;
  label: string;
  value: string;
  colour: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      aria-label={`${label}: ${value}`}
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: "12px",
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "22px", lineHeight: 1 }} aria-hidden="true">{icon}</span>
      <p style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: colour }}>{value}</p>
      <p style={{ margin: 0, fontSize: "10px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
    </div>
  );
}

function NextUpCard({
  href,
  skillName,
  level,
  label,
}: {
  href: string;
  skillName: string;
  level: string;
  label: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--accent-primary-border)",
        borderRadius: "12px",
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div>
        <p style={{ margin: "0 0 2px", fontSize: "10px", fontWeight: 600, color: "var(--accent-primary-text)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Next up
        </p>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
          {skillName}
          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> · {level}</span>
        </p>
      </div>
      <Link
        href={href}
        aria-label={`${label} ${skillName} ${level}`}
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "#fff",
          borderRadius: "8px",
          padding: "8px 18px",
          fontSize: "13px",
          fontWeight: 600,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {label} →
      </Link>
    </div>
  );
}

function QuickLinkCard({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "12px",
        padding: "18px 16px",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "22px", lineHeight: 1 }} aria-hidden="true">{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{label}</p>
        <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>{desc}</p>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { skillStates, totalXp, isLoaded } = useSkillProgress();

  useEffect(() => {
    setProfileId(localStorage.getItem("dragonpy-profile-id"));
    setUsername(localStorage.getItem("dragonpy-username"));
    setHydrated(true);
  }, []);

  const pathsComplete = pathsCompleteCount(skillStates);
  const totalPaths = skillStates.flatMap((s) => s.paths).length;
  const skillProgress = totalPaths > 0 ? Math.round((pathsComplete / totalPaths) * 100) : 0;

  const continueHref = firstIncompleteHref(skillStates);

  const nextUpSkill = skillStates.find((s) => s.paths.some((p) => p.status === "available"));
  const nextUpPath = nextUpSkill?.paths.find((p) => p.status === "available");

  const coreSkills = skillStates.filter((s) => s.category === "core");

  const isReturning = hydrated && !!profileId && isLoaded;

  function handleReset() {
    setProfileId(null);
    setUsername(null);
    localStorage.removeItem("dragonpy-profile-id");
    localStorage.removeItem("dragonpy-username");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg-base)",
      }}
    >
      <TitleBar
        skillProgress={skillProgress}
        skillNumber={pathsComplete}
        totalSkills={totalPaths}
        streak={0}
        totalXp={totalXp}
      />

      <main
        className="themed-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px",
          maxWidth: "680px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* ── FIRST VISIT ──────────────────────────────────────────── */}
        {hydrated && !profileId && (
          <>
            {/* Hero */}
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px",
                padding: "40px 28px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "44px", margin: "0 0 14px", lineHeight: 1 }} aria-hidden="true">
                🐉
              </p>
              <h1
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: "0 0 8px",
                }}
              >
                dragon<span style={{ color: "var(--accent-primary)" }}>.py</span>
              </h1>
              <p style={{ fontSize: "15px", color: "var(--text-muted)", margin: "0 0 28px" }}>
                Learn Python by building real things.
              </p>
              <Link
                href="/lessons/variables/easy"
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--accent-primary)",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "12px 32px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Start learning →
              </Link>
            </div>

            {/* Three-step explainer */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {[
                { icon: "📚", title: "Learn a skill", desc: "Work through guided exercises at your own pace." },
                { icon: "🔓", title: "Unlock projects", desc: "Complete skills to unlock real coding projects." },
                { icon: "🛠️", title: "Build things",  desc: "Write programs you can run and actually share." },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "12px",
                    padding: "18px 14px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: "26px", margin: "0 0 10px", lineHeight: 1 }} aria-hidden="true">
                    {icon}
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>
                    {title}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* First next-up card */}
            <NextUpCard
              href="/lessons/variables/easy"
              skillName="Variables & data types"
              level="Easy"
              label="Start"
            />
          </>
        )}

        {/* ── RETURNING LEARNER ────────────────────────────────────── */}
        {isReturning && username && (
          <>
            {/* Resume card */}
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px",
                padding: "24px 28px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    margin: "0 0 4px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Welcome back
                </p>
                <h1
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  {username}
                </h1>
              </div>
              <Link
                href={continueHref}
                aria-label={`Continue learning`}
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Continue →
              </Link>
            </div>

            {/* Metric cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <MetricCard
                icon="⭐"
                label="Total XP"
                value={String(totalXp)}
                colour="var(--accent-primary-text)"
                bg="var(--accent-primary-subtle)"
                border="var(--accent-primary-border)"
              />
              <MetricCard
                icon="✅"
                label="Paths complete"
                value={String(pathsComplete)}
                colour="var(--accent-green)"
                bg="var(--accent-green-subtle)"
                border="var(--accent-green-border)"
              />
              <MetricCard
                icon="🔥"
                label="Day streak"
                value="0"
                colour="var(--accent-orange)"
                bg="var(--accent-orange-subtle)"
                border="var(--accent-orange-border)"
              />
            </div>

            {/* Next up */}
            {nextUpSkill && nextUpPath && (
              <div style={{ marginBottom: "20px" }}>
                <NextUpCard
                  href={`/lessons/${nextUpSkill.id}/${nextUpPath.level}`}
                  skillName={nextUpSkill.name}
                  level={nextUpPath.level.charAt(0).toUpperCase() + nextUpPath.level.slice(1)}
                  label="Go"
                />
              </div>
            )}

            {/* Core skill progress bars */}
            {coreSkills.length > 0 && (
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Core skills
                </p>
                {coreSkills.map((skill) => {
                  const done = skill.paths.filter((p) => p.status === "complete").length;
                  const total = skill.paths.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={skill.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                        }}
                      >
                        <span style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 500 }}>
                          {skill.name}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {done}/{total}
                        </span>
                      </div>
                      <div
                        aria-label={`${skill.name} progress: ${done} of ${total} paths complete`}
                        style={{
                          height: "6px",
                          backgroundColor: "var(--bg-elevated)",
                          borderRadius: "9999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            backgroundColor: "var(--accent-primary)",
                            borderRadius: "9999px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick links */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <QuickLinkCard href="/skill-tree" icon="🎯" label="Skills" desc="Browse skill tree" />
              <QuickLinkCard href="/projects"  icon="🚀" label="Projects" desc="View your projects" />
            </div>

            {/* Reset */}
            <ResetProgressButton onReset={handleReset} />
          </>
        )}
      </main>

      {/* Username modal — first visit only */}
      {hydrated && !profileId && (
        <UsernameModal
          onReady={(id, name) => {
            setProfileId(id);
            setUsername(name);
          }}
        />
      )}
    </div>
  );
}
