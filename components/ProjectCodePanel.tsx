"use client";

import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import ProjectBadge from "@/components/ProjectBadge";
import HelpMeButton from "@/components/HelpMeButton";
import { runCode } from "@/lib/pyodide";
import { stripPaths } from "@/lib/stripPaths";
import { MAX_ATTEMPTS } from "@/hooks/useProjectProgress";

interface ProjectCodePanelProps {
  scaffoldedCode: string;
  solution: string;
  expectedKeywords: string[];
  xpReward: number;
  badgeIcon: string;
  projectName: string;
  attempts: number;
  isSolutionShown: boolean;
  isComplete: boolean;
  onFailedAttempt: () => void;
  onComplete: (xpReward: number) => void;
  onShowSolution: () => void;
}

function checkKeywords(output: string, keywords: string[]): boolean {
  const lower = output.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

export default function ProjectCodePanel({
  scaffoldedCode,
  solution,
  expectedKeywords,
  xpReward,
  badgeIcon,
  projectName,
  attempts,
  isSolutionShown,
  isComplete,
  onFailedAttempt,
  onComplete,
  onShowSolution,
}: ProjectCodePanelProps) {
  const [code, setCode] = useState(scaffoldedCode);
  const [output, setOutput] = useState("");
  const [friendlyError, setFriendlyError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [errorFallback, setErrorFallback] = useState(false);

  // When solution is revealed, replace editor content
  useEffect(() => {
    if (isSolutionShown) {
      setCode(solution);
      setOutput("");
      setFriendlyError(null);
      setRawError(null);
    }
  }, [isSolutionShown, solution]);

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
      // Errors are not counted as failed attempts — learner can fix freely
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

    setOutput(result.output);

    if (checkKeywords(result.output, expectedKeywords)) {
      if (!isComplete && !isSolutionShown) {
        onComplete(xpReward);
      }
    } else {
      if (!isComplete) {
        onFailedAttempt();
      }
    }
  }

  function handleReset() {
    setCode(isSolutionShown ? solution : scaffoldedCode);
    setOutput("");
    setFriendlyError(null);
    setRawError(null);
    setIsExplainingError(false);
    setErrorFallback(false);
  }

  const showSolutionButton = attempts >= MAX_ATTEMPTS && !isComplete && !isSolutionShown;

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
      {/* Solution mode notice */}
      {isSolutionShown && !isComplete && (
        <div
          aria-label="Solution shown — badge not awarded"
          role="status"
          style={{
            padding: "8px 12px",
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--accent-orange-border)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--accent-orange)",
            flexShrink: 0,
          }}
        >
          Showing the solution — you can read through it, but the badge is only
          awarded when you solve it yourself.
        </div>
      )}

      {/* Completion badge (inline, shown when complete) */}
      {isComplete && (
        <div
          aria-label="Project complete"
          role="status"
          style={{
            flexShrink: 0,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <ProjectBadge
            icon={badgeIcon}
            name={projectName}
            xpReward={xpReward}
          />
        </div>
      )}

      {/* Code editor */}
      <CodeEditor
        value={code}
        onChange={isSolutionShown ? () => {} : setCode}
        readOnly={isSolutionShown}
      />

      {/* Output */}
      <OutputPanel
        output={output}
        friendlyError={friendlyError}
        rawError={rawError}
        isRunning={isRunning}
        isExplainingError={isExplainingError}
        errorFallback={errorFallback}
      />

      {/* Button row */}
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          aria-label={isComplete ? "Run again" : "Run your Python code"}
          onClick={handleRun}
          disabled={isRunning}
          style={{
            flex: 1,
            backgroundColor: isComplete
              ? "var(--accent-green)"
              : "var(--accent-primary)",
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

        {!isSolutionShown && (
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
        )}

        <HelpMeButton />
      </div>

      {/* Show solution button — appears after 3 failed attempts */}
      {showSolutionButton && (
        <button
          aria-label="Show the solution"
          onClick={onShowSolution}
          style={{
            width: "100%",
            padding: "10px 16px",
            backgroundColor: "transparent",
            border: "1px solid var(--border-default)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "var(--text-muted)",
            cursor: "pointer",
            flexShrink: 0,
            animation: "fadeIn 0.25s ease",
          }}
        >
          Show solution
        </button>
      )}
    </div>
  );
}
