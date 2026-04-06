export interface RunResult {
  output: string;
  rawError: string | null;
}

interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/";

let instance: PyodideInterface | null = null;
let loading: Promise<PyodideInterface> | null = null;

async function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function getPyodide(): Promise<PyodideInterface> {
  if (instance) return instance;
  if (loading) return loading;

  loading = (async () => {
    await loadScript(`${PYODIDE_CDN}pyodide.js`);
    if (!window.loadPyodide) throw new Error("loadPyodide not available");
    instance = await window.loadPyodide({ indexURL: PYODIDE_CDN });
    return instance;
  })();

  return loading;
}

function simplifyError(raw: string): string {
  if (raw.includes("NameError")) {
    const m = raw.match(/name '(.+?)' is not defined/);
    return m
      ? `Oops! '${m[1]}' hasn't been created yet — define it before you use it.`
      : "You're using a variable that hasn't been set up yet. Check your variable names.";
  }
  if (raw.includes("SyntaxError")) {
    return "There's a typo somewhere — check for missing colons, brackets, or quote marks.";
  }
  if (raw.includes("IndentationError")) {
    return "Check your indentation — Python uses spaces to organise code blocks. Each level needs to be consistent.";
  }
  if (raw.includes("TypeError")) {
    return "You're mixing up types — like trying to add a number to text. Check what kind of values your variables hold.";
  }
  if (raw.includes("ZeroDivisionError")) {
    return "You're dividing by zero, which isn't allowed. Check your division operations.";
  }
  if (raw.includes("IndexError")) {
    return "You're trying to access an item that doesn't exist in the list. Check your index numbers.";
  }
  if (raw.includes("KeyError")) {
    return "You're looking for a key that doesn't exist in your dictionary. Check your key names.";
  }
  const lines = raw.trim().split("\n");
  return `Something went wrong: ${lines[lines.length - 1]}`;
}

export async function runCode(code: string): Promise<RunResult> {
  const pyodide = await getPyodide();

  await pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

  try {
    await pyodide.runPythonAsync(code);
    const output = pyodide.runPython("sys.stdout.getvalue()") as string;
    return { output: output.trim() || "(no output)", rawError: null };
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    return { output: "", rawError: raw };
  }
}
