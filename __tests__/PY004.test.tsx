/**
 * PY-004 test suite — skill tree and progress view.
 */
import { render, screen } from "@testing-library/react";
import {
  computeSkillStates,
  totalXpEarned,
  completedSkillsCount,
  firstIncompletePathLevel,
  SKILLS,
  type Completions,
} from "@/lib/skillProgress";
import SkillTreeHeader from "@/components/SkillTreeHeader";
import PathBadge from "@/components/PathBadge";
import SkillCard from "@/components/SkillCard";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCompletions(entries: Record<string, string[]>): Completions {
  return Object.fromEntries(
    Object.entries(entries).map(([k, v]) => [k, new Set(v as never[])])
  );
}

// ---------------------------------------------------------------------------
// computeSkillStates — core logic
// ---------------------------------------------------------------------------

describe("computeSkillStates", () => {
  it("AC1: returns all 7 skills", () => {
    const states = computeSkillStates({});
    expect(states).toHaveLength(7);
  });

  it("AC1: includes core skills — variables, loops, conditions", () => {
    const states = computeSkillStates({});
    const ids = states.map((s) => s.id);
    expect(ids).toContain("variables");
    expect(ids).toContain("loops");
    expect(ids).toContain("conditions");
  });

  it("AC1: includes additional skills — lists, files, functions, dictionaries", () => {
    const states = computeSkillStates({});
    const ids = states.map((s) => s.id);
    expect(ids).toContain("lists");
    expect(ids).toContain("files");
    expect(ids).toContain("functions");
    expect(ids).toContain("dictionaries");
  });

  it("AC2: variables easy is available with no completions", () => {
    const states = computeSkillStates({});
    const vars = states.find((s) => s.id === "variables")!;
    expect(vars.paths[0].status).toBe("available");
  });

  it("AC2: variables mid is locked until easy is complete", () => {
    const states = computeSkillStates({});
    const vars = states.find((s) => s.id === "variables")!;
    expect(vars.paths[1].status).toBe("locked");
  });

  it("AC2: variables mid becomes available once easy is complete", () => {
    const completions = makeCompletions({ variables: ["easy"] });
    const states = computeSkillStates(completions);
    const vars = states.find((s) => s.id === "variables")!;
    expect(vars.paths[1].status).toBe("available");
  });

  it("AC2: variables easy shows as complete with xpEarned when done", () => {
    const completions = makeCompletions({ variables: ["easy"] });
    const states = computeSkillStates(completions);
    const vars = states.find((s) => s.id === "variables")!;
    expect(vars.paths[0].status).toBe("complete");
    expect(vars.paths[0].xpEarned).toBe(50);
  });

  it("AC3: loops easy is locked until variables easy is complete", () => {
    const states = computeSkillStates({});
    const loops = states.find((s) => s.id === "loops")!;
    expect(loops.isLocked).toBe(true);
    expect(loops.paths[0].status).toBe("locked");
  });

  it("AC3: loops easy becomes available once variables easy is complete", () => {
    const completions = makeCompletions({ variables: ["easy"] });
    const states = computeSkillStates(completions);
    const loops = states.find((s) => s.id === "loops")!;
    expect(loops.isLocked).toBe(false);
    expect(loops.paths[0].status).toBe("available");
  });

  it("AC3: lists stays locked until core skills mid are all complete", () => {
    const completions = makeCompletions({
      variables: ["easy", "mid"],
      loops: ["easy", "mid"],
    });
    const states = computeSkillStates(completions);
    const lists = states.find((s) => s.id === "lists")!;
    expect(lists.isLocked).toBe(true);
  });

  it("AC3: lists unlocks when all core skills mid are complete", () => {
    const completions = makeCompletions({
      variables: ["easy", "mid"],
      loops: ["easy", "mid"],
      conditions: ["easy", "mid"],
    });
    const states = computeSkillStates(completions);
    const lists = states.find((s) => s.id === "lists")!;
    expect(lists.isLocked).toBe(false);
    expect(lists.paths[0].status).toBe("available");
  });

  it("AC4: completed paths show xpEarned equal to xpReward", () => {
    const completions = makeCompletions({ variables: ["easy", "mid", "hard"] });
    const states = computeSkillStates(completions);
    const vars = states.find((s) => s.id === "variables")!;
    expect(vars.paths[0].xpEarned).toBe(50);
    expect(vars.paths[1].xpEarned).toBe(100);
    expect(vars.paths[2].xpEarned).toBe(150);
  });
});

// ---------------------------------------------------------------------------
// totalXpEarned and completedSkillsCount
// ---------------------------------------------------------------------------

describe("totalXpEarned", () => {
  it("returns 0 with no completions", () => {
    expect(totalXpEarned(computeSkillStates({}))).toBe(0);
  });

  it("returns 50 when variables easy is complete", () => {
    const completions = makeCompletions({ variables: ["easy"] });
    expect(totalXpEarned(computeSkillStates(completions))).toBe(50);
  });

  it("returns 300 when variables all paths complete", () => {
    const completions = makeCompletions({ variables: ["easy", "mid", "hard"] });
    expect(totalXpEarned(computeSkillStates(completions))).toBe(300);
  });
});

describe("completedSkillsCount", () => {
  it("returns 0 with no completions", () => {
    expect(completedSkillsCount(computeSkillStates({}))).toBe(0);
  });

  it("returns 1 when all paths of variables are complete", () => {
    const completions = makeCompletions({ variables: ["easy", "mid", "hard"] });
    expect(completedSkillsCount(computeSkillStates(completions))).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// firstIncompletePathLevel
// ---------------------------------------------------------------------------

describe("firstIncompletePathLevel", () => {
  it("AC5: returns easy when no paths are complete", () => {
    const states = computeSkillStates({});
    const vars = states.find((s) => s.id === "variables")!;
    expect(firstIncompletePathLevel(vars)).toBe("easy");
  });

  it("AC5: returns mid when easy is complete", () => {
    const completions = makeCompletions({ variables: ["easy"] });
    const states = computeSkillStates(completions);
    const vars = states.find((s) => s.id === "variables")!;
    expect(firstIncompletePathLevel(vars)).toBe("mid");
  });

  it("AC5: returns null when all paths are complete", () => {
    const completions = makeCompletions({ variables: ["easy", "mid", "hard"] });
    const states = computeSkillStates(completions);
    const vars = states.find((s) => s.id === "variables")!;
    expect(firstIncompletePathLevel(vars)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// PathBadge component — AC2, AC3, AC4
// ---------------------------------------------------------------------------

describe("PathBadge", () => {
  it("AC2: renders level label", () => {
    render(<PathBadge level="easy" status="available" xpEarned={0} />);
    expect(screen.getByText("Easy")).toBeInTheDocument();
  });

  it("AC4: shows XP earned when complete", () => {
    render(<PathBadge level="mid" status="complete" xpEarned={100} />);
    expect(screen.getByText("+100 XP")).toBeInTheDocument();
  });

  it("AC4: does not show XP when not complete", () => {
    render(<PathBadge level="mid" status="available" xpEarned={0} />);
    expect(screen.queryByText(/XP/)).not.toBeInTheDocument();
  });

  it("AC3: locked badge has aria-label containing 'locked'", () => {
    render(<PathBadge level="easy" status="locked" xpEarned={0} />);
    expect(screen.getByLabelText(/locked/i)).toBeInTheDocument();
  });

  it("AC2: complete badge has aria-label containing 'complete'", () => {
    render(<PathBadge level="hard" status="complete" xpEarned={150} />);
    expect(screen.getByLabelText(/complete/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SkillCard component — AC3, AC5
// ---------------------------------------------------------------------------

describe("SkillCard", () => {
  it("AC3: locked skill is not a link", () => {
    const states = computeSkillStates({});
    const loops = states.find((s) => s.id === "loops")!;
    render(<SkillCard skill={loops} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("AC5: available skill is a link", () => {
    const states = computeSkillStates({});
    const vars = states.find((s) => s.id === "variables")!;
    render(<SkillCard skill={vars} />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("AC5: link points to the first incomplete path", () => {
    const states = computeSkillStates({});
    const vars = states.find((s) => s.id === "variables")!;
    render(<SkillCard skill={vars} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/lessons/variables/easy");
  });

  it("AC5: link advances to mid once easy is complete", () => {
    const completions = makeCompletions({ variables: ["easy"] });
    const states = computeSkillStates(completions);
    const vars = states.find((s) => s.id === "variables")!;
    render(<SkillCard skill={vars} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/lessons/variables/mid");
  });
});

// ---------------------------------------------------------------------------
// SkillTreeHeader component — AC4
// ---------------------------------------------------------------------------

describe("SkillTreeHeader", () => {
  it("shows total XP", () => {
    render(<SkillTreeHeader totalXp={250} completedCount={1} />);
    expect(screen.getByText(/250 XP earned/i)).toBeInTheDocument();
  });

  it("shows completed count out of total skills", () => {
    render(<SkillTreeHeader totalXp={0} completedCount={2} />);
    expect(screen.getByText(/2 of 7 skills complete/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SKILLS static data — AC1
// ---------------------------------------------------------------------------

describe("SKILLS static data", () => {
  it("has 3 core skills", () => {
    expect(SKILLS.filter((s) => s.category === "core")).toHaveLength(3);
  });

  it("has 4 additional skills", () => {
    expect(SKILLS.filter((s) => s.category === "additional")).toHaveLength(4);
  });

  it("each skill has easy, mid, hard paths", () => {
    SKILLS.forEach((skill) => {
      const levels = skill.paths.map((p) => p.level);
      expect(levels).toContain("easy");
      expect(levels).toContain("mid");
      expect(levels).toContain("hard");
    });
  });
});
