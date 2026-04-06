"use client";

import { useState, useEffect } from "react";
import {
  loadCompletions,
  computeSkillStates,
  totalXpEarned,
  completedSkillsCount,
  type SkillState,
  type Completions,
} from "@/lib/skillProgress";

interface SkillProgressResult {
  skillStates: SkillState[];
  totalXp: number;
  completedCount: number;
  isLoaded: boolean;
}

export function useSkillProgress(): SkillProgressResult {
  const [completions, setCompletions] = useState<Completions>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCompletions(loadCompletions());
    setIsLoaded(true);
  }, []);

  const skillStates = computeSkillStates(completions);

  return {
    skillStates,
    totalXp: totalXpEarned(skillStates),
    completedCount: completedSkillsCount(skillStates),
    isLoaded,
  };
}
