/**
 * PY-007 test suite — Password checker scaffolded project.
 * Covers all acceptance criteria from the story.
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProjectCodePanel from "@/components/ProjectCodePanel";
import ProjectBar from "@/components/ProjectBar";
import ProjectPanel from "@/components/ProjectPanel";
import ConceptSummary from "@/components/ConceptSummary";
import CodeEditor from "@/components/CodeEditor";

// Mock Pyodide
jest.mock("../lib/pyodide", () => ({
  runCode: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: jest.fn().mockReturnValue("/projects/pj-1"),
}));

import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

const SCAFFOLDED = 'password = "Dragon123"\n# is_long_enough = ...\n# has_uppercase = ...';
const SOLUTION   = 'password = "Dragon123"\nis_long_enough = len(password) >= 8\nhas_uppercase = any(c.isupper() for c in password)\nhas_number = any(c.isdigit() for c in password)';
const KEYWORDS   = ["weak", "okay", "strong"];
const CONCEPTS   = [
  { name: "Variables", note: "You stored values in named variables." },
  { name: "Conditions", note: "You used if/elif/else." },
];

const defaultPanelProps = {
  scaffoldedCode: SCAFFOLDED,
  solution: SOLUTION,
  expectedKeywords: KEYWORDS,
  xpReward: 200,
  badgeIcon: "🔒",
  projectName: "Password checker",
  attempts: 0,
  isSolutionShown: false,
  isComplete: false,
  onFailedAttempt: jest.fn(),
  onComplete: jest.fn(),
  onShowSolution: jest.fn(),
};

beforeEach(() => {
  mockRunCode.mockReset();
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// AC: Scaffolded code pre-fills editor
// ---------------------------------------------------------------------------

describe("ProjectCodePanel — editor pre-fill", () => {
  it("pre-fills the editor with scaffolded code", () => {
    render(<ProjectCodePanel {...defaultPanelProps} />);
    const editor = screen.getByRole("textbox", { name: /python code editor/i });
    expect(editor).toHaveValue(SCAFFOLDED);
  });
});

// ---------------------------------------------------------------------------
// AC: Keyword check passes on correct output / badge and XP awarded
// ---------------------------------------------------------------------------

describe("ProjectCodePanel — completion", () => {
  it("calls onComplete when output contains a keyword", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "strong", rawError: null });
    render(<ProjectCodePanel {...defaultPanelProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(200));
  });

  it("calls onComplete with 'okay' keyword", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "okay", rawError: null });
    render(<ProjectCodePanel {...defaultPanelProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(200));
  });

  it("keyword check is case-insensitive", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "STRONG", rawError: null });
    render(<ProjectCodePanel {...defaultPanelProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(200));
  });

  it("shows badge when isComplete prop is true", () => {
    render(<ProjectCodePanel {...defaultPanelProps} isComplete={true} />);
    expect(screen.getByRole("status", { name: /project complete/i })).toBeInTheDocument();
  });

  it("does not call onComplete when output has no keyword", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "hello world", rawError: null });
    render(<ProjectCodePanel {...defaultPanelProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(mockRunCode).toHaveBeenCalled());
    expect(onComplete).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// AC: Attempt counter decrements correctly
// ---------------------------------------------------------------------------

describe("ProjectBar — attempt counter", () => {
  it("shows 3 of 3 attempts remaining initially", () => {
    render(
      <ProjectBar
        name="Password checker"
        badgeIcon="🔒"
        xpReward={200}
        attemptsRemaining={3}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText(/3 of 3 attempts remaining/i)).toBeInTheDocument();
  });

  it("shows 2 of 3 after one failed attempt", () => {
    render(
      <ProjectBar
        name="Password checker"
        badgeIcon="🔒"
        xpReward={200}
        attemptsRemaining={2}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText(/2 of 3 attempts remaining/i)).toBeInTheDocument();
  });

  it("shows 0 of 3 when all attempts used", () => {
    render(
      <ProjectBar
        name="Password checker"
        badgeIcon="🔒"
        xpReward={200}
        attemptsRemaining={0}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText(/0 of 3 attempts remaining/i)).toBeInTheDocument();
  });

  it("shows 'complete' when isComplete is true", () => {
    render(
      <ProjectBar
        name="Password checker"
        badgeIcon="🔒"
        xpReward={200}
        attemptsRemaining={2}
        isComplete={true}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText("complete")).toBeInTheDocument();
  });
});

describe("ProjectCodePanel — attempt counting", () => {
  it("calls onFailedAttempt when output does not match keyword", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({ output: "hello world", rawError: null });
    render(<ProjectCodePanel {...defaultPanelProps} onFailedAttempt={onFailedAttempt} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onFailedAttempt).toHaveBeenCalledTimes(1));
  });

  it("does not call onFailedAttempt when there is an error", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({ output: "", rawError: "NameError: is_long_enough" });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ explanation: "Looks like a variable isn't defined yet!" }),
    }) as jest.Mock;
    render(<ProjectCodePanel {...defaultPanelProps} onFailedAttempt={onFailedAttempt} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(mockRunCode).toHaveBeenCalled());
    expect(onFailedAttempt).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// AC: Solution reveals after 3 attempts
// ---------------------------------------------------------------------------

describe("ProjectCodePanel — solution reveal", () => {
  it("shows the Show solution button when attempts >= 3", () => {
    render(<ProjectCodePanel {...defaultPanelProps} attempts={3} />);
    expect(
      screen.getByRole("button", { name: /show the solution/i })
    ).toBeInTheDocument();
  });

  it("does not show Show solution button before 3 attempts", () => {
    render(<ProjectCodePanel {...defaultPanelProps} attempts={2} />);
    expect(
      screen.queryByRole("button", { name: /show the solution/i })
    ).not.toBeInTheDocument();
  });

  it("calls onShowSolution when Show solution is clicked", () => {
    const onShowSolution = jest.fn();
    render(
      <ProjectCodePanel
        {...defaultPanelProps}
        attempts={3}
        onShowSolution={onShowSolution}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /show the solution/i }));
    expect(onShowSolution).toHaveBeenCalledTimes(1);
  });

  it("replaces editor content with solution when isSolutionShown becomes true", () => {
    render(
      <ProjectCodePanel {...defaultPanelProps} isSolutionShown={true} />
    );
    const editor = screen.getByRole("textbox", { name: /python code editor/i });
    expect(editor).toHaveValue(SOLUTION);
  });
});

// ---------------------------------------------------------------------------
// AC: Solution mode is read-only
// ---------------------------------------------------------------------------

describe("ProjectCodePanel — solution mode read-only", () => {
  it("editor is read-only when isSolutionShown is true", () => {
    render(
      <ProjectCodePanel {...defaultPanelProps} isSolutionShown={true} />
    );
    const editor = screen.getByRole("textbox", { name: /python code editor/i });
    expect(editor).toHaveAttribute("readonly");
  });

  it("editor is NOT read-only in normal mode", () => {
    render(<ProjectCodePanel {...defaultPanelProps} />);
    const editor = screen.getByRole("textbox", { name: /python code editor/i });
    expect(editor).not.toHaveAttribute("readonly");
  });
});

// ---------------------------------------------------------------------------
// AC: No badge awarded on solution reveal
// ---------------------------------------------------------------------------

describe("ProjectCodePanel — no badge on solution reveal", () => {
  it("shows solution notice (not badge) when isSolutionShown and not complete", () => {
    render(
      <ProjectCodePanel {...defaultPanelProps} isSolutionShown={true} />
    );
    expect(
      screen.getByRole("status", { name: /solution shown — badge not awarded/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: /project complete/i })
    ).not.toBeInTheDocument();
  });

  it("does not call onComplete when solution is shown and keyword found", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "strong", rawError: null });
    render(
      <ProjectCodePanel
        {...defaultPanelProps}
        isSolutionShown={true}
        onComplete={onComplete}
      />
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(mockRunCode).toHaveBeenCalled());
    expect(onComplete).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// AC: Concept summary reveals on completion
// ---------------------------------------------------------------------------

describe("ConceptSummary — transition", () => {
  it("is hidden (zero max-height) when not visible", () => {
    const { container } = render(
      <ConceptSummary concepts={CONCEPTS} visible={false} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.maxHeight).toBe("0px");
    expect(wrapper.style.opacity).toBe("0");
  });

  it("is visible when visible prop is true", () => {
    const { container } = render(
      <ConceptSummary concepts={CONCEPTS} visible={true} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.maxHeight).not.toBe("0px");
    expect(wrapper.style.opacity).toBe("1");
  });

  it("renders all concept names", () => {
    render(<ConceptSummary concepts={CONCEPTS} visible={true} />);
    expect(screen.getByText("Variables")).toBeInTheDocument();
    expect(screen.getByText("Conditions")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// AC: ProjectPanel renders task instructions
// ---------------------------------------------------------------------------

describe("ProjectPanel", () => {
  const instructions = [
    "Fill in is_long_enough.",
    "Fill in has_uppercase.",
    "Fill in has_number.",
  ];

  it("renders all three instructions", () => {
    render(
      <ProjectPanel
        instructions={instructions}
        concepts={CONCEPTS}
        isComplete={false}
      />
    );
    expect(screen.getByText("Fill in is_long_enough.")).toBeInTheDocument();
    expect(screen.getByText("Fill in has_uppercase.")).toBeInTheDocument();
    expect(screen.getByText("Fill in has_number.")).toBeInTheDocument();
  });

  it("concept summary is hidden before completion", () => {
    const { container } = render(
      <ProjectPanel
        instructions={instructions}
        concepts={CONCEPTS}
        isComplete={false}
      />
    );
    const summary = container.querySelector("[aria-label='Concepts used']") as HTMLElement;
    expect(summary.style.opacity).toBe("0");
  });

  it("concept summary is visible after completion", () => {
    const { container } = render(
      <ProjectPanel
        instructions={instructions}
        concepts={CONCEPTS}
        isComplete={true}
      />
    );
    const summary = container.querySelector("[aria-label='Concepts used']") as HTMLElement;
    expect(summary.style.opacity).toBe("1");
  });
});

// ---------------------------------------------------------------------------
// AC: Page redirects if locked — tested via ProjectShell redirect logic
// ---------------------------------------------------------------------------

describe("ProjectShell — redirect when locked", () => {
  it("redirects to /projects when the project is locked", async () => {
    const mockReplace = jest.fn();
    jest.doMock("next/navigation", () => ({
      useRouter: () => ({ replace: mockReplace }),
      usePathname: jest.fn().mockReturnValue("/projects/pj-1"),
    }));

    // Mock useSkillProgress to return empty completions (all locked)
    jest.doMock("../hooks/useSkillProgress", () => ({
      useSkillProgress: () => ({
        skillStates: [],
        totalXp: 0,
        completedCount: 0,
        isLoaded: true,
      }),
    }));

    // Mock useProjectProgress
    jest.doMock("../hooks/useProjectProgress", () => ({
      useProjectProgress: () => ({
        attempts: 0,
        attemptsRemaining: 3,
        isComplete: false,
        isSolutionShown: false,
        handleFailedAttempt: jest.fn(),
        handleComplete: jest.fn(),
        handleShowSolution: jest.fn(),
      }),
      MAX_ATTEMPTS: 3,
    }));

    const { default: ProjectShell } = await import("@/components/ProjectShell");
    render(
      <ProjectShell
        projectId="pj-1"
        content={{
          id: "pj-1",
          title: "Password checker",
          badgeIcon: "🔒",
          xpReward: 200,
          expectedKeywords: KEYWORDS,
          instructions: ["Fill in is_long_enough."],
          concepts: CONCEPTS,
          scaffoldedCode: SCAFFOLDED,
          solution: SOLUTION,
        }}
      />
    );

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/projects"));
  });
});

// ---------------------------------------------------------------------------
// CodeEditor — readOnly prop
// ---------------------------------------------------------------------------

describe("CodeEditor — readOnly", () => {
  it("renders with readonly attribute when readOnly is true", () => {
    const { container } = render(
      <CodeEditor value="x = 1" onChange={jest.fn()} readOnly={true} />
    );
    expect(container.querySelector("textarea")).toHaveAttribute("readonly");
  });

  it("does not have readonly attribute by default", () => {
    const { container } = render(
      <CodeEditor value="x = 1" onChange={jest.fn()} />
    );
    expect(container.querySelector("textarea")).not.toHaveAttribute("readonly");
  });
});
