/**
 * PY-014 test suite — projects page with lock/unlock/complete states.
 */
import { render, screen } from "@testing-library/react";
import {
  evaluateProjectState,
  evaluateAllProjects,
  PROJECTS,
} from "@/lib/projectGates";
import { computeSkillStates } from "@/lib/skillProgress";
import ProjectCard from "@/components/ProjectCard";
import UnlockRequirements from "@/components/UnlockRequirements";
import ProjectBadge from "@/components/ProjectBadge";
import type { Completions } from "@/lib/skillProgress";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCompletions(entries: Record<string, string[]>): Completions {
  return Object.fromEntries(
    Object.entries(entries).map(([k, v]) => [k, new Set(v as never[])])
  );
}

const noCompletions = computeSkillStates({});

// ---------------------------------------------------------------------------
// PROJECTS static data — AC1
// ---------------------------------------------------------------------------

describe("PROJECTS static data", () => {
  it("AC1: defines exactly 5 projects", () => {
    expect(PROJECTS).toHaveLength(5);
  });

  it("AC1: includes all five project names", () => {
    const names = PROJECTS.map((p) => p.name);
    expect(names).toContain("Password checker");
    expect(names).toContain("Caesar cipher");
    expect(names).toContain("Number guessing game");
    expect(names).toContain("Quiz game with scoreboard");
    expect(names).toContain("Newspaper guessing game");
  });

  it("each project has a non-empty description", () => {
    PROJECTS.forEach((p) => expect(p.description.length).toBeGreaterThan(0));
  });

  it("each project has badgeIcon and xpReward > 0", () => {
    PROJECTS.forEach((p) => {
      expect(p.badgeIcon).toBeTruthy();
      expect(p.xpReward).toBeGreaterThan(0);
    });
  });
});

// ---------------------------------------------------------------------------
// evaluateProjectState — AC2, AC3
// ---------------------------------------------------------------------------

describe("evaluateProjectState — PJ-1 (Password checker)", () => {
  const pj1 = PROJECTS.find((p) => p.id === "pj-1")!;

  it("AC3: locked with no completions", () => {
    const result = evaluateProjectState(pj1, noCompletions);
    expect(result.status).toBe("locked");
  });

  it("AC2: unmetRequirements lists missing skills when locked", () => {
    const result = evaluateProjectState(pj1, noCompletions);
    const ids = result.unmetRequirements.map((r) => r.skillId);
    expect(ids).toContain("variables");
    expect(ids).toContain("conditions");
  });

  it("AC3: available once variables easy + conditions easy are complete", () => {
    const completions = makeCompletions({
      variables:  ["easy"],
      conditions: ["easy"],
    });
    const states = computeSkillStates(completions);
    const result = evaluateProjectState(pj1, states);
    expect(result.status).toBe("available");
    expect(result.unmetRequirements).toHaveLength(0);
  });
});

describe("evaluateProjectState — PJ-3 (Number guessing game)", () => {
  const pj3 = PROJECTS.find((p) => p.id === "pj-3")!;

  it("locked when only easy paths are complete", () => {
    const completions = makeCompletions({
      variables:  ["easy"],
      loops:      ["easy"],
      conditions: ["easy"],
    });
    const states = computeSkillStates(completions);
    expect(evaluateProjectState(pj3, states).status).toBe("locked");
  });

  it("available when all core skills mid are complete", () => {
    const completions = makeCompletions({
      variables:  ["easy", "mid"],
      loops:      ["easy", "mid"],
      conditions: ["easy", "mid"],
    });
    const states = computeSkillStates(completions);
    expect(evaluateProjectState(pj3, states).status).toBe("available");
  });
});

describe("evaluateProjectState — PJ-5 (Newspaper guessing game)", () => {
  const pj5 = PROJECTS.find((p) => p.id === "pj-5")!;

  it("locked with no completions — shows all unmet requirements", () => {
    const result = evaluateProjectState(pj5, noCompletions);
    expect(result.status).toBe("locked");
    expect(result.unmetRequirements.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// evaluateAllProjects — AC1
// ---------------------------------------------------------------------------

describe("evaluateAllProjects", () => {
  it("AC1: returns a state for all 5 projects", () => {
    expect(evaluateAllProjects(noCompletions)).toHaveLength(5);
  });

  it("AC2: unmet requirement hrefs point to exercise pages", () => {
    const states = evaluateAllProjects(noCompletions);
    const locked = states.find((s) => s.status === "locked")!;
    locked.unmetRequirements.forEach((req) => {
      expect(req.href).toMatch(/^\/lessons\/.+\/.+$/);
    });
  });
});

// ---------------------------------------------------------------------------
// UnlockRequirements component — AC2
// ---------------------------------------------------------------------------

describe("UnlockRequirements", () => {
  const requirements = [
    { skillId: "loops",     skillName: "Loops",     minLevel: "mid" as const, href: "/lessons/loops/mid" },
    { skillId: "variables", skillName: "Variables & data types", minLevel: "easy" as const, href: "/lessons/variables/easy" },
  ];

  it("AC2: renders a pill for each unmet requirement", () => {
    render(<UnlockRequirements requirements={requirements} />);
    expect(screen.getByLabelText(/loops mid/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/variables.*easy/i)).toBeInTheDocument();
  });

  it("AC2: each pill is a link to the exercise page", () => {
    render(<UnlockRequirements requirements={requirements} />);
    expect(screen.getByLabelText(/loops mid/i)).toHaveAttribute("href", "/lessons/loops/mid");
  });
});

// ---------------------------------------------------------------------------
// ProjectBadge component — AC4
// ---------------------------------------------------------------------------

describe("ProjectBadge", () => {
  it("AC4: shows badge icon and project name", () => {
    render(<ProjectBadge icon="🔒" name="Password checker" xpReward={200} />);
    expect(screen.getByText("Password checker")).toBeInTheDocument();
  });

  it("AC4: shows XP awarded", () => {
    render(<ProjectBadge icon="🔒" name="Password checker" xpReward={200} />);
    expect(screen.getByText(/\+200 XP earned/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ProjectCard component — AC1, AC2, AC3, AC4, AC5
// ---------------------------------------------------------------------------

describe("ProjectCard — locked", () => {
  const lockedState = {
    def: PROJECTS.find((p) => p.id === "pj-1")!,
    status: "locked" as const,
    unmetRequirements: [
      { skillId: "variables", skillName: "Variables & data types", minLevel: "easy" as const, href: "/lessons/variables/easy" },
    ],
  };

  it("AC1: renders the project name", () => {
    render(<ProjectCard projectState={lockedState} />);
    expect(screen.getByText("Password checker")).toBeInTheDocument();
  });

  it("AC3: shows locked state in aria-label", () => {
    render(<ProjectCard projectState={lockedState} />);
    expect(screen.getByLabelText(/password checker — locked/i)).toBeInTheDocument();
  });

  it("AC2: shows unmet requirement pills", () => {
    render(<ProjectCard projectState={lockedState} />);
    expect(screen.getByLabelText(/variables.*easy/i)).toBeInTheDocument();
  });

  it("AC5: does not show Start button when locked", () => {
    render(<ProjectCard projectState={lockedState} />);
    expect(screen.queryByRole("button", { name: /start/i })).not.toBeInTheDocument();
  });
});

describe("ProjectCard — available", () => {
  const availableState = {
    def: PROJECTS.find((p) => p.id === "pj-1")!,
    status: "available" as const,
    unmetRequirements: [],
  };

  it("AC3: shows Start button when available", () => {
    render(<ProjectCard projectState={availableState} />);
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });

  it("AC3: Start button is disabled (stub — PY-007 not built yet)", () => {
    render(<ProjectCard projectState={availableState} />);
    expect(screen.getByRole("button", { name: /start/i })).toBeDisabled();
  });

  it("AC2: does not show unmet requirements when available", () => {
    render(<ProjectCard projectState={availableState} />);
    expect(screen.queryByText(/still needed/i)).not.toBeInTheDocument();
  });
});

describe("ProjectCard — complete", () => {
  const completeState = {
    def: PROJECTS.find((p) => p.id === "pj-1")!,
    status: "complete" as const,
    unmetRequirements: [],
  };

  it("AC4: shows badge with XP when complete", () => {
    render(<ProjectCard projectState={completeState} />);
    expect(screen.getByText(/\+200 XP earned/i)).toBeInTheDocument();
  });

  it("AC1: still shows project name when complete", () => {
    render(<ProjectCard projectState={completeState} />);
    expect(screen.getByRole("heading", { name: "Password checker" })).toBeInTheDocument();
  });
});
