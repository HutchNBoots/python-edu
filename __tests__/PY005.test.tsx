/**
 * PY-005 test suite — easy path exercise: run, compare, award XP.
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ExerciseCodePanel from "@/components/ExerciseCodePanel";
import ExercisePanel from "@/components/ExercisePanel";
import ExpectedOutputBox from "@/components/ExpectedOutputBox";
import { markPathComplete, loadCompletions, computeSkillStates } from "@/lib/skillProgress";
import { getExercise, getAllExerciseParams } from "@/lib/exercises";

// ---------------------------------------------------------------------------
// Mock Pyodide
// ---------------------------------------------------------------------------

jest.mock("../lib/pyodide", () => ({ runCode: jest.fn() }));
import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

// ---------------------------------------------------------------------------
// Mock localStorage
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
  mockRunCode.mockReset();
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Exercise content loading
// ---------------------------------------------------------------------------

describe("getExercise", () => {
  it("loads variables-easy exercise with all required fields", () => {
    const ex = getExercise("variables", "easy");
    expect(ex.skillId).toBe("variables");
    expect(ex.level).toBe("easy");
    expect(ex.title).toBeTruthy();
    expect(ex.instructions).toBeTruthy();
    expect(ex.starterCode).toBeTruthy();
    expect(ex.expectedOutput).toBeTruthy();
    expect(ex.xpReward).toBeGreaterThan(0);
  });

  it("loads loops-easy exercise", () => {
    const ex = getExercise("loops", "easy");
    expect(ex.skillId).toBe("loops");
    expect(ex.expectedOutput).toBeTruthy();
  });

  it("loads conditions-easy exercise", () => {
    const ex = getExercise("conditions", "easy");
    expect(ex.skillId).toBe("conditions");
    expect(ex.expectedOutput).toBeTruthy();
  });

  it("throws for a missing exercise file", () => {
    expect(() => getExercise("variables", "nonexistent")).toThrow();
  });
});

describe("getAllExerciseParams", () => {
  it("returns at least the three core easy exercises", () => {
    const params = getAllExerciseParams();
    expect(params).toContainEqual({ slug: "variables", level: "easy" });
    expect(params).toContainEqual({ slug: "loops", level: "easy" });
    expect(params).toContainEqual({ slug: "conditions", level: "easy" });
  });
});

// ---------------------------------------------------------------------------
// markPathComplete — unit
// ---------------------------------------------------------------------------

describe("markPathComplete", () => {
  it("writes completion to localStorage", () => {
    markPathComplete("variables", "easy");
    const completions = loadCompletions();
    expect(completions["variables"]?.has("easy")).toBe(true);
  });

  it("does not overwrite existing completions", () => {
    markPathComplete("variables", "easy");
    markPathComplete("variables", "mid");
    const completions = loadCompletions();
    expect(completions["variables"]?.has("easy")).toBe(true);
    expect(completions["variables"]?.has("mid")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ExpectedOutputBox
// ---------------------------------------------------------------------------

describe("ExpectedOutputBox", () => {
  it("AC1: renders the expected output text", () => {
    render(<ExpectedOutputBox expectedOutput="Hello, world!" />);
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });

  it("renders multi-line expected output", () => {
    render(<ExpectedOutputBox expectedOutput={"1\n2\n3"} />);
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ExercisePanel
// ---------------------------------------------------------------------------

describe("ExercisePanel", () => {
  it("AC1: renders the instructions", () => {
    render(
      <ExercisePanel
        instructions="Set name to Alice"
        expectedOutput="Hello, Alice!"
      />
    );
    expect(screen.getByText(/set name to alice/i)).toBeInTheDocument();
  });

  it("AC6: renders a disabled hint button", () => {
    render(
      <ExercisePanel
        instructions="Do something"
        expectedOutput="output"
      />
    );
    const btn = screen.getByRole("button", { name: /hint/i });
    expect(btn).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// ExerciseCodePanel — core AC2, AC3, AC4, AC5
// ---------------------------------------------------------------------------

const defaultProps = {
  skillId: "variables",
  level: "easy" as const,
  starterCode: 'name = "Alice"\nage = 14\nprint(f"My name is {name} and I am {age} years old.")',
  expectedOutput: "My name is Alice and I am 14 years old.",
  xpReward: 50,
  alreadyComplete: false,
  nextHref: "/lessons/variables/mid",
  nextLabel: "Try Mid",
};

describe("ExerciseCodePanel — output matching", () => {
  it("AC3: marks path complete and shows banner when output matches", async () => {
    mockRunCode.mockResolvedValue({
      output: "My name is Alice and I am 14 years old.\n",
      rawError: "",
    });

    render(<ExerciseCodePanel {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByRole("status")).toBeInTheDocument()
    );
    expect(screen.getByText(/easy path complete/i)).toBeInTheDocument();
  });

  it("AC4: XP reward is shown in the banner", async () => {
    mockRunCode.mockResolvedValue({
      output: "My name is Alice and I am 14 years old.\n",
      rawError: "",
    });

    render(<ExerciseCodePanel {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByText(/\+50 XP/i)).toBeInTheDocument()
    );
  });

  it("AC4: markPathComplete is called on a matching run", async () => {
    mockRunCode.mockResolvedValue({
      output: "My name is Alice and I am 14 years old.",
      rawError: "",
    });

    render(<ExerciseCodePanel {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() => {
      const completions = loadCompletions();
      expect(completions["variables"]?.has("easy")).toBe(true);
    });
  });

  it("AC3: trimmed whitespace still matches", async () => {
    mockRunCode.mockResolvedValue({
      output: "  My name is Alice and I am 14 years old.  \n",
      rawError: "",
    });

    render(<ExerciseCodePanel {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByRole("status")).toBeInTheDocument()
    );
  });

  it("AC3: no banner when output does not match", async () => {
    mockRunCode.mockResolvedValue({
      output: "Wrong output",
      rawError: "",
    });

    render(<ExerciseCodePanel {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent("Wrong output")
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("AC3: path is not marked complete when output does not match", async () => {
    mockRunCode.mockResolvedValue({ output: "Wrong output", rawError: "" });

    render(<ExerciseCodePanel {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent("Wrong output")
    );
    const completions = loadCompletions();
    expect(completions["variables"]?.has("easy")).toBeFalsy();
  });

  it("AC3: XP is only awarded once even if run again after completion", async () => {
    mockRunCode.mockResolvedValue({
      output: "My name is Alice and I am 14 years old.",
      rawError: "",
    });

    render(
      <ExerciseCodePanel {...defaultProps} alreadyComplete={false} />
    );

    // First run — completes
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => screen.getByRole("status"));

    // Second run — still only one completion entry
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run again/i }));
    });
    await waitFor(() => screen.getByRole("status"));

    const completions = loadCompletions();
    expect(Array.from(completions["variables"] ?? []).filter((v) => v === "easy")).toHaveLength(1);
  });

  it("AC2: starter code is pre-filled in the editor", () => {
    render(<ExerciseCodePanel {...defaultProps} />);
    expect(screen.getByRole("textbox")).toHaveValue(defaultProps.starterCode);
  });

  it("AC1: banner shows next path link", async () => {
    mockRunCode.mockResolvedValue({
      output: "My name is Alice and I am 14 years old.",
      rawError: "",
    });

    render(<ExerciseCodePanel {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() => screen.getByRole("status"));
    expect(screen.getByRole("link", { name: /try mid/i })).toHaveAttribute("href", "/lessons/variables/mid");
  });
});

// ---------------------------------------------------------------------------
// AC5 — no-skip: computeSkillStates enforces path ordering
// ---------------------------------------------------------------------------

describe("AC5 — path locking enforced by computeSkillStates", () => {
  it("variables mid is locked before easy is complete", () => {
    const states = computeSkillStates({});
    const vars = states.find((s) => s.id === "variables")!;
    expect(vars.paths.find((p) => p.level === "mid")?.status).toBe("locked");
  });

  it("variables mid is available after easy is complete", () => {
    markPathComplete("variables", "easy");
    const completions = loadCompletions();
    const states = computeSkillStates(completions);
    const vars = states.find((s) => s.id === "variables")!;
    expect(vars.paths.find((p) => p.level === "mid")?.status).toBe("available");
  });

  it("variables hard is locked until mid is complete", () => {
    markPathComplete("variables", "easy");
    const completions = loadCompletions();
    const states = computeSkillStates(completions);
    const vars = states.find((s) => s.id === "variables")!;
    expect(vars.paths.find((p) => p.level === "hard")?.status).toBe("locked");
  });
});
