"use client";

import { useState, useEffect } from "react";
import TitleBar from "@/components/TitleBar";
import ProjectCard from "@/components/ProjectCard";
import { useSkillProgress } from "@/hooks/useSkillProgress";
import { evaluateAllProjects, PROJECTS } from "@/lib/projectGates";
import { loadProjectCompletions } from "@/lib/projectCompletions";
import type { ProjectCompletions } from "@/lib/projectCompletions";

export default function ProjectsPage() {
  const { skillStates, totalXp, completedCount, isLoaded } = useSkillProgress();
  const [projectCompletions, setProjectCompletions] = useState<ProjectCompletions>({});

  useEffect(() => {
    setProjectCompletions(loadProjectCompletions());
  }, []);

  const projectStates = isLoaded
    ? evaluateAllProjects(skillStates, projectCompletions)
    : PROJECTS.map((def) => ({
        def,
        status: "locked" as const,
        unmetRequirements: [],
      }));

  const completedProjects = projectStates.filter((p) => p.status === "complete").length;

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
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Projects
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}>
              {completedProjects} of {PROJECTS.length} complete
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              backgroundColor: "var(--accent-primary-subtle)",
              border: "1px solid var(--accent-primary-border)",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--accent-primary-text)",
              whiteSpace: "nowrap",
            }}
          >
            <span aria-hidden="true">⭐</span>
            <span>{totalXp} XP</span>
          </div>
        </div>

        {/* Project cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {projectStates.map((ps) => (
            <ProjectCard key={ps.def.id} projectState={ps} />
          ))}
        </div>
      </main>
    </div>
  );
}
