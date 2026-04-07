"use client";

import { useState, useEffect } from "react";
import {
  loadCompletions,
  saveCompletions,
  computeSkillStates,
  totalXpEarned,
  completedSkillsCount,
  type SkillState,
  type Completions,
} from "@/lib/skillProgress";
import { loadProgress } from "@/lib/progress";
import { rowsToCompletions, mergeCompletions } from "@/lib/progressUtils";

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
    async function init() {
      const local = loadCompletions();
      const profileId = localStorage.getItem("dragonpy-profile-id");

      if (profileId) {
        try {
          const { completions: rows } = await loadProgress(profileId);
          const remote = rowsToCompletions(rows);
          const merged = mergeCompletions(local, remote);
          // Cache the merged result locally so subsequent reads are instant
          saveCompletions(merged);
          setCompletions(merged);
        } catch {
          // Supabase unavailable — fall back to local cache
          setCompletions(local);
        }
      } else {
        setCompletions(local);
      }

      setIsLoaded(true);
    }

    init();
  }, []);

  const skillStates = computeSkillStates(completions);

  return {
    skillStates,
    totalXp: totalXpEarned(skillStates),
    completedCount: completedSkillsCount(skillStates),
    isLoaded,
  };
}
