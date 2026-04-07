/**
 * PY-006 test suite — mid and hard path exercises.
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { getExercise, getAllExerciseParams } from "@/lib/exercises";
import {
  markPathComplete,
  loadCompletions,
  computeSkillStates,
  SKILLS,
} from "@/lib/skillProgress";
import ExerciseCodePanel from "@/components/ExerciseCodePanel";

// ---------------------------------------------------------------------------
// Mock Pyodide
// ---------------------------------------------------------------------------

jest.mock("../lib/pyodide", () => ({ runCode: jest.fn() }));
import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

beforeEach(() => {
  localStorage.clear();
  mockRunCode.mockReset();
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Exercise content — all six new files load correctly
// ---------------------------------------------------------------------------

describe("Exercise content — mid and hard files", () => {
  const cases = [
    { skill: "variables",  level: "mid",  xp: 100 },
    { skill: "variables",  level: "hard", xp: 150 },
    { skill: "loops",      level: "mid",  xp: 100 },
    { skill: "loops",      level: "hard", xp: 150 },
    { skill: "conditions", level: "mid",  xp: 100 },
    { skill: "conditions", level: "hard", xp: 150 },
  ];

  cases.forEach(({ skill, level, xp }) => {
    it(`loads ${skill}-${level} with xpReward ${xp}`, () => {
      const ex = getExercise(skill, level);
      expect(ex.skillId).toBe(skill);
      expect(ex.level).toBe(level);
      expect(ex.title).toBeTruthy();
      expect(ex.instructions).toBeTruthy();
      expect(ex.starterCode).toBeTruthy();
      expect(ex.expectedOutput).toBeTruthy();
      expect(ex.xpReward).toBe(xp);
    });
  });
});

// ---------------------------------------------------------------------------
// AC: hard path awards more XP than mid, mid more than easy
// ---------------------------------------------------------------------------

describe("XP values increase per level", () => {
  ["variables", "loops", "conditions"].forEach((skillId) => {
    it(`${skillId}: easy < mid < hard`, () => {
      const easy = getExercise(skillId, "easy");
      const mid  = getExercise(skillId, "mid");
      const hard = getExercise(skillId, "hard");
      expect(easy.xpReward).toBeLessThan(mid.xpReward);
      expect(mid.xpReward).toBeLessThan(hard.xpReward);
    });
  });

  it("XP values are 50 / 100 / 150 for all core skills", () => {
    ["variables", "loops", "conditions"].forEach((skillId) => {
      expect(getExercise(skillId, "easy").xpReward).toBe(50);
      expect(getExercise(skillId, "mid").xpReward).toBe(100);
      expect(getExercise(skillId, "hard").xpReward).toBe(150);
    });
  });

  it("skills.json xpReward values match exercise files", () => {
    const skill = SKILLS.find((s) => s.id === "variables")!;
    expect(skill.paths.find((p) => p.level === "easy")?.xpReward).toBe(50);
    expect(skill.paths.find((p) => p.level === "mid")?.xpReward).toBe(100);
    expect(skill.paths.find((p) => p.level === "hard")?.xpReward).toBe(150);
  });
});

// ---------------------------------------------------------------------------
// AC: mid unlocks only after easy; hard only after mid
// ---------------------------------------------------------------------------

describe("Path unlock ordering", () => {
  it("mid is locked before easy is complete", () => {
    const states = computeSkillStates({});
    ["variables", "loops", "conditions"].forEach((id) => {
      const mid = states.find((s) => s.id === id)!.paths.find((p) => p.level === "mid");
      expect(mid?.status).toBe("locked");
    });
  });

  it("mid becomes available once easy is complete", () => {
    markPathComplete("variables", "easy");
    const states = computeSkillStates(loadCompletions());
    const mid = states.find((s) => s.id === "variables")!.paths.find((p) => p.level === "mid");
    expect(mid?.status).toBe("available");
  });

  it("hard is locked after easy but before mid is complete", () => {
    markPathComplete("variables", "easy");
    const states = computeSkillStates(loadCompletions());
    const hard = states.find((s) => s.id === "variables")!.paths.find((p) => p.level === "hard");
    expect(hard?.status).toBe("locked");
  });

  it("hard becomes available once mid is complete", () => {
    markPathComplete("variables", "easy");
    markPathComplete("variables", "mid");
    const states = computeSkillStates(loadCompletions());
    const hard = states.find((s) => s.id === "variables")!.paths.find((p) => p.level === "hard");
    expect(hard?.status).toBe("available");
  });
});

// ---------------------------------------------------------------------------
// AC: completion state persists between sessions (localStorage round-trip)
// ---------------------------------------------------------------------------

describe("Completion persists between sessions", () => {
  it("completions survive a localStorage round-trip", () => {
    markPathComplete("variables", "easy");
    markPathComplete("variables", "mid");

    // Simulate a new session by reloading completions from storage
    const reloaded = loadCompletions();
    expect(reloaded["variables"]?.has("easy")).toBe(true);
    expect(reloaded["variables"]?.has("mid")).toBe(true);
  });

  it("hard completion also persists", () => {
    markPathComplete("variables", "easy");
    markPathComplete("variables", "mid");
    markPathComplete("variables", "hard");

    const reloaded = loadCompletions();
    expect(reloaded["variables"]?.has("hard")).toBe(true);
  });

  it("completions for multiple skills persist independently", () => {
    markPathComplete("variables", "easy");
    markPathComplete("loops", "easy");

    const reloaded = loadCompletions();
    expect(reloaded["variables"]?.has("easy")).toBe(true);
    expect(reloaded["loops"]?.has("easy")).toBe(true);
    expect(reloaded["conditions"]?.has("easy")).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// AC: mid and hard ExerciseCodePanel awards correct XP on completion
// ---------------------------------------------------------------------------

describe("ExerciseCodePanel — mid and hard XP", () => {
  it("mid path awards 100 XP on correct output", async () => {
    mockRunCode.mockResolvedValue({ output: "212.0", rawError: "" });

    render(
      <ExerciseCodePanel
        skillId="variables"
        level="mid"
        starterCode="celsius = 100\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)"
        expectedOutput="212.0"
        xpReward={100}
        alreadyComplete={false}
        nextHref="/lessons/variables/hard"
        nextLabel="Try Hard"
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByText(/\+100 XP/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/mid path complete/i)).toBeInTheDocument();
  });

  it("hard path awards 150 XP on correct output", async () => {
    mockRunCode.mockResolvedValue({ output: "22.9", rawError: "" });

    render(
      <ExerciseCodePanel
        skillId="variables"
        level="hard"
        starterCode="# Calculate BMI"
        expectedOutput="22.9"
        xpReward={150}
        alreadyComplete={false}
        nextHref="/skill-tree"
        nextLabel="Back to skill tree"
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByText(/\+150 XP/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/hard path complete/i)).toBeInTheDocument();
  });

  it("hard path banner links to skill tree as the final path", async () => {
    mockRunCode.mockResolvedValue({ output: "22.9", rawError: "" });

    render(
      <ExerciseCodePanel
        skillId="variables"
        level="hard"
        starterCode="# Calculate BMI"
        expectedOutput="22.9"
        xpReward={150}
        alreadyComplete={false}
        nextHref="/skill-tree"
        nextLabel="Back to skill tree"
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() => screen.getByRole("status"));
    expect(screen.getByRole("link", { name: /back to skill tree/i })).toHaveAttribute(
      "href",
      "/skill-tree"
    );
  });
});

// ---------------------------------------------------------------------------
// getAllExerciseParams includes all nine exercises
// ---------------------------------------------------------------------------

describe("getAllExerciseParams", () => {
  it("includes all mid and hard exercises", () => {
    const params = getAllExerciseParams();
    const expected = [
      { slug: "variables",  level: "mid"  },
      { slug: "variables",  level: "hard" },
      { slug: "loops",      level: "mid"  },
      { slug: "loops",      level: "hard" },
      { slug: "conditions", level: "mid"  },
      { slug: "conditions", level: "hard" },
    ];
    expected.forEach((e) => expect(params).toContainEqual(e));
  });

  it("has 9 exercises total (3 skills × 3 levels)", () => {
    expect(getAllExerciseParams()).toHaveLength(9);
  });
});
