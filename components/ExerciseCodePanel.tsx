"use client";

import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import XPRewardBanner from "@/components/XPRewardBanner";
import { runCode } from "@/lib/pyodide";
import { stripPaths } from "@/lib/stripPaths";
import { markPathComplete } from "@/lib/skillProgress";
import type { PathLevel } from "@/lib/skillProgress";
import { saveCompletion } from "@/lib/progress";

interface ExerciseCodePanelProps {
  skillId: string;
  level: PathLevel;
  starterCode: string;
  expectedOutput: string;
  xpReward: number;
  alreadyComplete: boolean;
  nextHref: string;
  nextLabel: string;
}

export default function ExerciseCodePanel({
  skillId,
  level,
  starterCode,
  expectedOutput,
  xpReward,
  alreadyComplete,
  nextHref,
  nextLabel,
}: ExerciseCodePanelProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [friendlyError, setFriendlyError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [errorFallback, setErrorFallback] = useState(false);
  const [isComplete, setIsComplete] = useState(alreadyComplete);

  // Keep alreadyComplete in sync if parent re-renders
  useEffect(() => {
    setIsComplete(alreadyComplete);
  }, [alreadyComplete]);

  async function handleRun() {
    setIsRunning(true);
    setOutput("");
    setFriendlyError(null);
    setRawError(null);
    setIsExplainingError(false);
    setErrorFallback(false);

    const result = await runCode(code);
    setIsRunning(false);

    if (result.rawError) {
      const stripped = stripPaths(result.rawError);
      setRawError(stripped);
      setIsExplainingError(true);
      try {
        const res = await fetch("/api/explain-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, rawError: stripped }),
        });
        const data = await res.json();
        setFriendlyError(data.explanation ?? null);
        if (!data.explanation) setErrorFallback(true);
      } catch {
        setErrorFallback(true);
      } finally {
        setIsExplainingError(false);
      }
      return;
    }

    const trimmedOutput = result.output.trim();
    const trimmedExpected = expectedOutput.trim();

    if (trimmedOutput === trimmedExpected) {
      if (!isComplete) {
        markPathComplete(skillId, level);
        // Fire-and-forget sync to Supabase; localStorage is already updated
        const profileId = localStorage.getItem("dragonpy-profile-id");
        if (profileId) {
          saveCompletion(profileId, skillId, level, xpReward).catch(() => {});
        }
        setIsComplete(true);
      }
    }

    setOutput(result.output);
  }

  function handleReset() {
    setCode(starterCode);
    setOutput("");
    setFriendlyError(null);
    setRawError(null);
    setIsExplainingError(false);
    setErrorFallback(false);
  }

  const LEVEL_ORDER: PathLevel[] = ["easy", "mid", "hard"];
  const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1] ?? null;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflow: "hidden",
        position: "relative",
        padding: "16px",
      }}
    >
      <CodeEditor value={code} onChange={setCode} />

      <OutputPanel
        output={output}
        friendlyError={friendlyError}
        rawError={rawError}
        isRunning={isRunning}
        isExplainingError={isExplainingError}
        errorFallback={errorFallback}
      />

      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          aria-label={isComplete ? "Run again" : "Run your Python code"}
          onClick={handleRun}
          disabled={isRunning}
          style={{
            flex: 1,
            backgroundColor: isComplete ? "var(--accent-green)" : "var(--accent-primary)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "11px 16px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: isRunning ? "not-allowed" : "pointer",
            opacity: isRunning ? 0.7 : 1,
          }}
        >
          {isRunning ? "Running…" : isComplete ? "Run again ✓" : "Run"}
        </button>
        <button
          aria-label="Reset code to starter"
          onClick={handleReset}
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            borderRadius: "8px",
            padding: "11px 14px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {isComplete && (
        <XPRewardBanner
          xpReward={xpReward}
          level={level}
          nextHref={nextHref}
          nextLabel={nextLabel}
        />
      )}
    </div>
  );
}
