"use client";

import { useState, useEffect } from "react";
import {
  loadProjectCompletions,
  saveProjectCompletion,
  isProjectComplete,
} from "@/lib/projectCompletions";

export const MAX_ATTEMPTS = 3;

export interface ProjectProgressResult {
  attempts: number;
  attemptsRemaining: number;
  isComplete: boolean;
  isSolutionShown: boolean;
  handleFailedAttempt: () => void;
  handleComplete: (xpReward: number) => void;
  handleShowSolution: () => void;
}

export function useProjectProgress(projectId: string): ProjectProgressResult {
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSolutionShown, setIsSolutionShown] = useState(false);

  useEffect(() => {
    setIsComplete(isProjectComplete(projectId));
  }, [projectId]);

  function handleFailedAttempt() {
    setAttempts((a) => a + 1);
  }

  function handleComplete(xpReward: number) {
    if (!isComplete) {
      saveProjectCompletion(projectId, xpReward);
      setIsComplete(true);
    }
  }

  function handleShowSolution() {
    setIsSolutionShown(true);
  }

  return {
    attempts,
    attemptsRemaining: MAX_ATTEMPTS - attempts,
    isComplete,
    isSolutionShown,
    handleFailedAttempt,
    handleComplete,
    handleShowSolution,
  };
}
