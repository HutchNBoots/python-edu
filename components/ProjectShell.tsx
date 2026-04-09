"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TitleBar from "@/components/TitleBar";
import ProjectBar from "@/components/ProjectBar";
import ProjectPanel from "@/components/ProjectPanel";
import ProjectCodePanel from "@/components/ProjectCodePanel";
import { useSkillProgress } from "@/hooks/useSkillProgress";
import { useProjectProgress } from "@/hooks/useProjectProgress";
import { evaluateProjectState, PROJECTS } from "@/lib/projectGates";
import type { ProjectContent } from "@/lib/projectContent";

interface ProjectShellProps {
  projectId: string;
  content: ProjectContent;
}

export default function ProjectShell({ projectId, content }: ProjectShellProps) {
  const router = useRouter();
  const { skillStates, totalXp, completedCount, isLoaded } = useSkillProgress();
  const {
    attempts,
    attemptsRemaining,
    isComplete,
    isSolutionShown,
    handleFailedAttempt,
    handleComplete,
    handleShowSolution,
  } = useProjectProgress(projectId);

  // Redirect to /projects if the unlock gate is not met
  useEffect(() => {
    if (!isLoaded) return;
    const def = PROJECTS.find((p) => p.id === projectId);
    if (!def) return;
    const { status } = evaluateProjectState(def, skillStates);
    if (status === "locked") {
      router.replace("/projects");
    }
  }, [isLoaded, skillStates, projectId, router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <TitleBar
        skillProgress={
          completedCount > 0
            ? Math.round((completedCount / Math.max(skillStates.length, 1)) * 100)
            : 0
        }
        skillNumber={completedCount}
        totalSkills={skillStates.length}
        streak={0}
        totalXp={totalXp}
      />

      <ProjectBar
        name={content.title}
        badgeIcon={content.badgeIcon}
        xpReward={content.xpReward}
        attemptsRemaining={attemptsRemaining}
        isComplete={isComplete}
        isSolutionShown={isSolutionShown}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <ProjectPanel
          instructions={content.instructions}
          concepts={content.concepts}
          isComplete={isComplete}
        />
        <ProjectCodePanel
          scaffoldedCode={content.scaffoldedCode}
          solution={content.solution}
          expectedKeywords={content.expectedKeywords}
          xpReward={content.xpReward}
          badgeIcon={content.badgeIcon}
          projectName={content.title}
          attempts={attempts}
          isSolutionShown={isSolutionShown}
          isComplete={isComplete}
          onFailedAttempt={handleFailedAttempt}
          onComplete={handleComplete}
          onShowSolution={handleShowSolution}
        />
      </div>
    </div>
  );
}
