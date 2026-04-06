"use client";

import TitleBar from "@/components/TitleBar";
import SkillTreeHeader from "@/components/SkillTreeHeader";
import SkillCard from "@/components/SkillCard";
import { useSkillProgress } from "@/hooks/useSkillProgress";

export default function SkillTreePage() {
  const { skillStates, totalXp, completedCount } = useSkillProgress();

  const coreSkills = skillStates.filter((s) => s.category === "core");
  const additionalSkills = skillStates.filter((s) => s.category === "additional");

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
        skillProgress={completedCount > 0 ? Math.round((completedCount / skillStates.length) * 100) : 0}
        skillNumber={completedCount}
        totalSkills={skillStates.length}
        streak={0}
        totalXp={totalXp}
      />

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px",
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <SkillTreeHeader totalXp={totalXp} completedCount={completedCount} />

        <section aria-labelledby="core-heading" style={{ marginBottom: "32px" }}>
          <h2
            id="core-heading"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: "0 0 12px",
            }}
          >
            Core skills
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {coreSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>

        <section aria-labelledby="additional-heading">
          <h2
            id="additional-heading"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: "0 0 12px",
            }}
          >
            Additional skills
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {additionalSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
