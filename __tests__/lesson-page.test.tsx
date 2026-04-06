/**
 * PY-001 test suite — dragon.py lesson page redesign.
 * Covers all acceptance criteria from the CX specification.
 */
import { render, screen } from "@testing-library/react";
import TitleBar from "@/components/TitleBar";
import SkillBar from "@/components/SkillBar";
import LessonPanel from "@/components/LessonPanel";
import ExampleTabPanel from "@/components/ExampleTabPanel";
import PathPill from "@/components/PathPill";
import KeyConceptBox from "@/components/KeyConceptBox";
import XPRewardNotice from "@/components/XPRewardNotice";
import HelpMeButton from "@/components/HelpMeButton";


// ---------------------------------------------------------------------------
// TitleBar
// ---------------------------------------------------------------------------

describe("TitleBar", () => {
  it("renders the dragon.py brand name", () => {
    render(
      <TitleBar
        skillProgress={33}
        skillNumber={1}
        totalSkills={3}
        streak={4}
        totalXp={120}
      />
    );
    expect(screen.getByText("dragon")).toBeInTheDocument();
    expect(screen.getByText(".py")).toBeInTheDocument();
  });

  it("renders the streak pill with day count", () => {
    render(
      <TitleBar
        skillProgress={33}
        skillNumber={1}
        totalSkills={3}
        streak={4}
        totalXp={120}
      />
    );
    expect(screen.getByText(/4 days/i)).toBeInTheDocument();
  });

  it("renders the XP pill with total XP", () => {
    render(
      <TitleBar
        skillProgress={33}
        skillNumber={1}
        totalSkills={3}
        streak={4}
        totalXp={120}
      />
    );
    expect(screen.getByText(/120 XP/i)).toBeInTheDocument();
  });

  it("renders the skill progress bar with correct value", () => {
    render(
      <TitleBar
        skillProgress={60}
        skillNumber={2}
        totalSkills={3}
        streak={1}
        totalXp={200}
      />
    );
    const bar = screen.getByRole("progressbar", { name: /skill progress/i });
    expect(bar).toHaveAttribute("aria-valuenow", "60");
  });

  it("renders the skill label", () => {
    render(
      <TitleBar
        skillProgress={33}
        skillNumber={1}
        totalSkills={3}
        streak={4}
        totalXp={120}
      />
    );
    expect(screen.getByText("Skill 1 of 3")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// PathPill states
// ---------------------------------------------------------------------------

describe("PathPill — correct state rendering", () => {
  it("completed pill has data-state=completed", () => {
    const { container } = render(<PathPill label="Easy" state="completed" />);
    expect(container.firstChild).toHaveAttribute("data-state", "completed");
  });

  it("active pill has data-state=active", () => {
    const { container } = render(<PathPill label="Mid" state="active" />);
    expect(container.firstChild).toHaveAttribute("data-state", "active");
  });

  it("locked pill has data-state=locked", () => {
    const { container } = render(<PathPill label="Hard" state="locked" />);
    expect(container.firstChild).toHaveAttribute("data-state", "locked");
  });

  it("completed pill shows a check mark", () => {
    render(<PathPill label="Easy" state="completed" />);
    expect(screen.getByText("Easy").closest("span")).toHaveTextContent("✓");
  });
});

describe("SkillBar — path pills", () => {
  const paths = [
    { name: "Easy", state: "completed" as const },
    { name: "Mid", state: "active" as const },
    { name: "Hard", state: "locked" as const },
  ];

  it("renders all three path pills", () => {
    render(
      <SkillBar
        paths={paths}
        skillName="Variables"
        lessonNumber={1}
        totalLessons={3}
      />
    );
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Mid")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("renders the lesson position label", () => {
    render(
      <SkillBar
        paths={paths}
        skillName="Variables"
        lessonNumber={1}
        totalLessons={3}
      />
    );
    expect(screen.getByText(/Variables · Lesson 1 of 3/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// LessonPanel
// ---------------------------------------------------------------------------

describe("LessonPanel", () => {
  const baseProps = {
    title: "Variables & Data Types",
    contentHtml: "<p>Think of a variable like a labelled box.</p>",
    keyConcept: "A variable stores a value under a name.",
    xp: 50,
    skillProgress: 33,
  };

  it("renders the lesson heading", () => {
    render(<LessonPanel {...baseProps} />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent("Variables & Data Types");
  });

  it("renders explanation text", () => {
    render(<LessonPanel {...baseProps} />);
    expect(
      screen.getByText("Think of a variable like a labelled box.")
    ).toBeInTheDocument();
  });

  it("renders the XP reward notice with correct XP value", () => {
    render(<LessonPanel {...baseProps} />);
    expect(screen.getByText(/50 XP/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// XPRewardNotice
// ---------------------------------------------------------------------------

describe("XPRewardNotice", () => {
  it("displays the correct XP value", () => {
    render(<XPRewardNotice xp={75} />);
    expect(screen.getByText(/75 XP/i)).toBeInTheDocument();
  });

  it("shows the +XP badge", () => {
    render(<XPRewardNotice xp={50} />);
    expect(screen.getByText("+50")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// KeyConceptBox
// ---------------------------------------------------------------------------

describe("KeyConceptBox", () => {
  it("renders the KEY CONCEPT label", () => {
    render(<KeyConceptBox concept="Variables store values." />);
    expect(screen.getByText(/key concept/i)).toBeInTheDocument();
  });

  it("renders the concept text", () => {
    render(<KeyConceptBox concept="Variables store values." />);
    expect(screen.getByText("Variables store values.")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ExampleTabPanel — code block and buttons
// ---------------------------------------------------------------------------

describe("ExampleTabPanel", () => {
  it("renders the CODE EXAMPLE label", () => {
    render(<ExampleTabPanel code={'name = "Alex"'} onTryIt={jest.fn()} />);
    expect(screen.getByText(/code example/i)).toBeInTheDocument();
  });

  it("renders a code block containing the code content", () => {
    const { container } = render(
      <ExampleTabPanel code={'name = "Alex"\nprint(name)'} onTryIt={jest.fn()} />
    );
    const codeEl = container.querySelector("code");
    expect(codeEl).not.toBeNull();
    expect(codeEl!.textContent).toContain("name");
  });

  it('Try it button has aria-label "Go to the exercise for this lesson"', () => {
    render(<ExampleTabPanel code={'x = 1'} onTryIt={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: "Go to the exercise for this lesson" })
    ).toBeInTheDocument();
  });

  it('Help me button has aria-label "Get a hint for this lesson"', () => {
    render(<ExampleTabPanel code={'x = 1'} onTryIt={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: "Get a hint for this lesson" })
    ).toBeInTheDocument();
  });
});


// ---------------------------------------------------------------------------
// HelpMeButton
// ---------------------------------------------------------------------------

describe("HelpMeButton", () => {
  it('has aria-label "Get a hint for this lesson"', () => {
    render(<HelpMeButton />);
    expect(
      screen.getByRole("button", { name: "Get a hint for this lesson" })
    ).toBeInTheDocument();
  });
});
