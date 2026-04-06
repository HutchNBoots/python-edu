"use client";

import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import HelpMeButton from "@/components/HelpMeButton";
import { runCode } from "@/lib/pyodide";
import { stripPaths } from "@/lib/stripPaths";

interface TryItTabPanelProps {
  starterCode: string;
}

export default function TryItTabPanel({ starterCode }: TryItTabPanelProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [friendlyError, setFriendlyError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [errorFallback, setErrorFallback] = useState(false);

  // Keep editor in sync if starterCode changes (e.g. different lesson)
  useEffect(() => {
    setCode(starterCode);
    setOutput("");
    setFriendlyError(null);
    setRawError(null);
    setIsExplainingError(false);
    setErrorFallback(false);
  }, [starterCode]);

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
        if (data.explanation) {
          setFriendlyError(data.explanation);
        } else {
          setErrorFallback(true);
        }
      } catch {
        setErrorFallback(true);
      } finally {
        setIsExplainingError(false);
      }
    } else {
      setOutput(result.output);
    }
  }

  function handleReset() {
    setCode(starterCode);
    setOutput("");
    setFriendlyError(null);
    setRawError(null);
    setIsExplainingError(false);
    setErrorFallback(false);
  }

  return (
    <div
      id="tabpanel-tryit"
      role="tabpanel"
      aria-labelledby="tab-tryit"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflow: "hidden",
      }}
    >
      {/* Editor */}
      <CodeEditor value={code} onChange={setCode} />

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
          aria-label="Run your Python code"
          onClick={handleRun}
          disabled={isRunning}
          style={{
            flex: 1,
            backgroundColor: "var(--accent-green)",
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
          {isRunning ? "Running…" : "Run"}
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
        <HelpMeButton />
      </div>
    </div>
  );
}
