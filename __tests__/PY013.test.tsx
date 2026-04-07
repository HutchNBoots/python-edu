/**
 * PY-013 test suite — progress persistence via Supabase.
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
// Pure helpers live in progressUtils — no Supabase import chain
import {
  rowsToCompletions,
  mergeCompletions,
  deriveProgressData,
} from "@/lib/progressUtils";
import UsernameModal from "@/components/UsernameModal";
import ProgressSummary from "@/components/ProgressSummary";
import ResetProgressButton from "@/components/ResetProgressButton";
import { saveCompletions, loadCompletions } from "@/lib/skillProgress";

// ---------------------------------------------------------------------------
// Mock lib/progress so Supabase is never called in tests
// ---------------------------------------------------------------------------

jest.mock("../lib/progress", () => ({
  createProfile: jest.fn(),
  loadProgress: jest.fn(),
  saveCompletion: jest.fn(),
  resetProgress: jest.fn(),
}));

import {
  createProfile,
  loadProgress,
  saveCompletion,
  resetProgress,
} from "../lib/progress";

const mockCreateProfile  = createProfile  as jest.MockedFunction<typeof createProfile>;
const mockLoadProgress   = loadProgress   as jest.MockedFunction<typeof loadProgress>;
const mockSaveCompletion = saveCompletion as jest.MockedFunction<typeof saveCompletion>;
const mockResetProgress  = resetProgress  as jest.MockedFunction<typeof resetProgress>;

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// rowsToCompletions — pure helper
// ---------------------------------------------------------------------------

describe("rowsToCompletions", () => {
  it("converts empty rows to empty completions", () => {
    expect(rowsToCompletions([])).toEqual({});
  });

  it("converts rows to Completions format", () => {
    const rows = [
      { skill_id: "variables", level: "easy" as const, xp_awarded: 50 },
      { skill_id: "variables", level: "mid"  as const, xp_awarded: 100 },
      { skill_id: "loops",     level: "easy" as const, xp_awarded: 50 },
    ];
    const result = rowsToCompletions(rows);
    expect(result["variables"]?.has("easy")).toBe(true);
    expect(result["variables"]?.has("mid")).toBe(true);
    expect(result["loops"]?.has("easy")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// mergeCompletions — pure helper
// ---------------------------------------------------------------------------

describe("mergeCompletions", () => {
  it("merges two disjoint completion sets", () => {
    const a = { variables: new Set(["easy" as const]) };
    const b = { loops: new Set(["easy" as const]) };
    const merged = mergeCompletions(a, b);
    expect(merged["variables"]?.has("easy")).toBe(true);
    expect(merged["loops"]?.has("easy")).toBe(true);
  });

  it("merges overlapping completions without duplicates", () => {
    const a = { variables: new Set(["easy" as const]) };
    const b = { variables: new Set(["easy" as const, "mid" as const]) };
    const merged = mergeCompletions(a, b);
    expect(Array.from(merged["variables"]).sort()).toEqual(["easy", "mid"]);
  });

  it("handles one empty side", () => {
    const a = { variables: new Set(["easy" as const]) };
    expect(mergeCompletions(a, {})).toEqual(a);
    expect(mergeCompletions({}, a)).toEqual(a);
  });
});

// ---------------------------------------------------------------------------
// deriveProgressData — pure helper
// ---------------------------------------------------------------------------

describe("deriveProgressData", () => {
  it("returns 0 XP and 0 skills for empty rows", () => {
    const result = deriveProgressData([]);
    expect(result.totalXp).toBe(0);
    expect(result.skillsComplete).toBe(0);
  });

  it("sums XP correctly", () => {
    const rows = [
      { skill_id: "variables", level: "easy" as const, xp_awarded: 50 },
      { skill_id: "variables", level: "mid"  as const, xp_awarded: 100 },
    ];
    expect(deriveProgressData(rows).totalXp).toBe(150);
  });

  it("counts a skill as complete only when all 3 levels present", () => {
    const incomplete = [
      { skill_id: "variables", level: "easy" as const, xp_awarded: 50 },
      { skill_id: "variables", level: "mid"  as const, xp_awarded: 100 },
    ];
    expect(deriveProgressData(incomplete).skillsComplete).toBe(0);

    const complete = [
      ...incomplete,
      { skill_id: "variables", level: "hard" as const, xp_awarded: 150 },
    ];
    expect(deriveProgressData(complete).skillsComplete).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// UsernameModal — AC: profile created, profile_id stored in localStorage
// ---------------------------------------------------------------------------

describe("UsernameModal", () => {
  it("renders the username input and submit button", () => {
    render(<UsernameModal onReady={jest.fn()} />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /let's go/i })).toBeInTheDocument();
  });

  it("submit button is disabled when input is empty", () => {
    render(<UsernameModal onReady={jest.fn()} />);
    expect(screen.getByRole("button", { name: /let's go/i })).toBeDisabled();
  });

  it("AC: creates profile and stores profile_id on submit", async () => {
    mockCreateProfile.mockResolvedValue({ id: "uuid-123", username: "Alex" });
    const onReady = jest.fn();

    render(<UsernameModal onReady={onReady} />);
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Alex" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /let's go/i }));
    });

    await waitFor(() => {
      expect(localStorage.getItem("dragonpy-profile-id")).toBe("uuid-123");
      expect(localStorage.getItem("dragonpy-username")).toBe("Alex");
      expect(onReady).toHaveBeenCalledWith("uuid-123", "Alex");
    });
  });

  it("shows error message when createProfile fails", async () => {
    mockCreateProfile.mockRejectedValue(new Error("Network error"));

    render(<UsernameModal onReady={jest.fn()} />);
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Alex" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /let's go/i }));
    });

    await waitFor(() =>
      expect(screen.getByText(/couldn't save/i)).toBeInTheDocument()
    );
  });
});

// ---------------------------------------------------------------------------
// ProgressSummary — AC: shows XP, skills, projects
// ---------------------------------------------------------------------------

describe("ProgressSummary", () => {
  it("AC: shows total XP earned", () => {
    render(
      <ProgressSummary username="Alex" totalXp={250} skillsComplete={1} projectsComplete={0} />
    );
    expect(screen.getByLabelText(/xp earned: 250/i)).toBeInTheDocument();
  });

  it("AC: shows skills complete out of total", () => {
    render(
      <ProgressSummary username="Alex" totalXp={0} skillsComplete={2} projectsComplete={0} />
    );
    expect(screen.getByLabelText(/skills complete: 2 \/ 7/i)).toBeInTheDocument();
  });

  it("AC: shows projects complete", () => {
    render(
      <ProgressSummary username="Alex" totalXp={0} skillsComplete={0} projectsComplete={0} />
    );
    expect(screen.getByLabelText(/projects complete: 0 \/ 5/i)).toBeInTheDocument();
  });

  it("shows the learner's username", () => {
    render(
      <ProgressSummary username="Jordan" totalXp={100} skillsComplete={0} projectsComplete={0} />
    );
    expect(screen.getByText(/jordan/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ResetProgressButton — AC: resets only on explicit confirmation
// ---------------------------------------------------------------------------

describe("ResetProgressButton", () => {
  it("shows reset button initially", () => {
    render(<ResetProgressButton onReset={jest.fn()} />);
    expect(screen.getByRole("button", { name: /reset my progress/i })).toBeInTheDocument();
  });

  it("shows confirmation prompt after clicking reset", () => {
    render(<ResetProgressButton onReset={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /reset my progress/i }));
    expect(screen.getByRole("button", { name: /yes, reset/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("cancel returns to reset button without resetting", () => {
    render(<ResetProgressButton onReset={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /reset my progress/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.getByRole("button", { name: /reset my progress/i })).toBeInTheDocument();
    expect(mockResetProgress).not.toHaveBeenCalled();
  });

  it("AC: confirm calls resetProgress with profileId", async () => {
    localStorage.setItem("dragonpy-profile-id", "uuid-abc");
    mockResetProgress.mockResolvedValue();
    const onReset = jest.fn();

    render(<ResetProgressButton onReset={onReset} />);
    fireEvent.click(screen.getByRole("button", { name: /reset my progress/i }));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /yes, reset/i }));
    });

    await waitFor(() => {
      expect(mockResetProgress).toHaveBeenCalledWith("uuid-abc");
      expect(onReset).toHaveBeenCalled();
    });
  });

  it("AC: confirm clears localStorage completions", async () => {
    localStorage.setItem("dragonpy-profile-id", "uuid-abc");
    saveCompletions({ variables: new Set(["easy"]) });
    mockResetProgress.mockResolvedValue();

    render(<ResetProgressButton onReset={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /reset my progress/i }));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /yes, reset/i }));
    });

    await waitFor(() => {
      const completions = loadCompletions();
      expect(Object.keys(completions)).toHaveLength(0);
    });
  });
});

// ---------------------------------------------------------------------------
// AC: completion persists — saveCompletion called from ExerciseCodePanel
// ---------------------------------------------------------------------------

jest.mock("../lib/pyodide", () => ({ runCode: jest.fn() }));
import { runCode } from "../lib/pyodide";
import ExerciseCodePanel from "@/components/ExerciseCodePanel";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

describe("ExerciseCodePanel — Supabase sync", () => {
  it("AC: calls saveCompletion with profileId when profile is set", async () => {
    localStorage.setItem("dragonpy-profile-id", "uuid-xyz");
    mockSaveCompletion.mockResolvedValue();
    mockRunCode.mockResolvedValue({ output: "My name is Alice and I am 14 years old.", rawError: "" });

    render(
      <ExerciseCodePanel
        skillId="variables"
        level="easy"
        starterCode='name = "Alice"\nage = 14\nprint(f"My name is {name} and I am {age} years old.")'
        expectedOutput="My name is Alice and I am 14 years old."
        xpReward={50}
        alreadyComplete={false}
        nextHref="/lessons/variables/mid"
        nextLabel="Try Mid"
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(mockSaveCompletion).toHaveBeenCalledWith("uuid-xyz", "variables", "easy", 50)
    );
  });

  it("AC: does not call saveCompletion when no profile is set", async () => {
    mockRunCode.mockResolvedValue({ output: "My name is Alice and I am 14 years old.", rawError: "" });

    render(
      <ExerciseCodePanel
        skillId="variables"
        level="easy"
        starterCode="code"
        expectedOutput="My name is Alice and I am 14 years old."
        xpReward={50}
        alreadyComplete={false}
        nextHref="/lessons/variables/mid"
        nextLabel="Try Mid"
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() => screen.getByRole("status"));
    expect(mockSaveCompletion).not.toHaveBeenCalled();
  });
});
