"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TitleBar from "@/components/TitleBar";
import SkillBar from "@/components/SkillBar";
import ExercisePanel from "@/components/ExercisePanel";
import ExerciseCodePanel from "@/components/ExerciseCodePanel";
import { useSkillProgress } from "@/hooks/useSkillProgress";
import type { ExerciseData } from "@/lib/exercises";
import type { PathLevel } from "@/lib/skillProgress";

const LEVELS: PathLevel[] = ["easy", "mid", "hard"];

interface ExerciseShellProps {
  exercise: ExerciseData;
}

export default function ExerciseShell({ exercise }: ExerciseShellProps) {
  const { skillId, level, instructions, expectedOutput, starterCode, xpReward } = exercise;
  const router = useRouter();
  const { skillStates, totalXp, isLoaded } = useSkillProgress();

  const skill = skillStates.find((s) => s.id === skillId);
  const thisPath = skill?.paths.find((p) => p.level === level);

  // AC5 — redirect to first incomplete path if this one is locked
  useEffect(() => {
    if (!isLoaded || !skill) return;
    if (thisPath?.status === "locked") {
      const first = skill.paths.find((p) => p.status !== "complete");
      router.replace(`/lessons/${skillId}/${first?.level ?? "easy"}`);
    }
  }, [isLoaded, skill, thisPath, skillId, router]);

  const alreadyComplete = thisPath?.status === "complete";

  // Derive SkillBar path entries from live progress
  const pathEntries = (skill?.paths ?? LEVELS.map((l) => ({ level: l, status: "locked" as const, xpReward: 0, xpEarned: 0 }))).map((p) => ({
    name: p.level.charAt(0).toUpperCase() + p.level.slice(1),
    state: (
      p.status === "complete" ? "completed" :
      p.level === level      ? "active"    :
                               "locked"
    ) as "completed" | "active" | "locked",
  }));

  const currentIdx = LEVELS.indexOf(level as PathLevel);
  const nextLevel = LEVELS[currentIdx + 1];
  const nextHref  = nextLevel ? `/lessons/${skillId}/${nextLevel}` : "/skill-tree";
  const nextLabel = nextLevel
    ? `Try ${nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1)}`
    : "Back to skill tree";

  const completedCount = skillStates.filter((s) =>
    s.paths.every((p) => p.status === "complete")
  ).length;
  const skillProgress = skill
    ? Math.round((skill.paths.filter((p) => p.status === "complete").length / skill.paths.length) * 100)
    : 0;

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
        skillProgress={skillProgress}
        skillNumber={completedCount}
        totalSkills={skillStates.length}
        streak={0}
        totalXp={totalXp}
      />

      <SkillBar
        paths={pathEntries}
        skillName={skill?.name ?? skillId}
        lessonNumber={currentIdx + 1}
        totalLessons={LEVELS.length}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <ExercisePanel
          instructions={instructions}
          expectedOutput={expectedOutput}
        />
        <ExerciseCodePanel
          skillId={skillId}
          level={level as PathLevel}
          starterCode={starterCode}
          expectedOutput={expectedOutput}
          xpReward={xpReward}
          alreadyComplete={alreadyComplete ?? false}
          nextHref={nextHref}
          nextLabel={nextLabel}
        />
      </div>
    </div>
  );
}
