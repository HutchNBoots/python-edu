/**
 * PY-012 test suite — Newspaper guessing game (capstone).
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProjectCodePanel from "@/components/ProjectCodePanel";
import ProjectBar from "@/components/ProjectBar";
import ConceptSummary from "@/components/ConceptSummary";

jest.mock("../lib/pyodide", () => ({ runCode: jest.fn() }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: jest.fn().mockReturnValue("/projects/pj-5"),
}));

import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

const SCAFFOLDED = `players = {"alice": "password1"}\nsessions = [{"username": "alice", "password": "password1", "guesses": ["P"]}]\nsecret_word = "PYTHON"\nscores = {}\npass\npass`;
const SOLUTION   = `players = {"alice": "password1"}\nsessions = [{"username": "alice", "password": "password1", "guesses": ["P"]}]\nsecret_word = "PYTHON"\nscores = {}\nfor session in sessions:\n    username = session["username"]\n    if username in players and players[username] == session["password"]:\n        print(f"{username} logged in")\n        scores[username] = len([g for g in session["guesses"] if g in secret_word])\n    else:\n        print(f"{username}: invalid login")\nprint("--- Leaderboard ---")\nfor name, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):\n    print(f"{name}: {score}")`;
const KEYWORDS   = ["Leaderboard"];

const CAPSTONE_CONCEPTS = [
  { name: "Dictionaries", note: "You used a players dict to look up passwords by username." },
  { name: "Functions", note: "You used sorted(), len(), and lambda to sort the leaderboard." },
  { name: "Loops", note: "You looped through every game session." },
  { name: "Conditions (if/else)", note: "You validated logins and checked guesses." },
  { name: "Variables", note: "Used in every project." },
  { name: "Lists", note: "Each session's guesses were stored as a list." },
  { name: "Files", note: "Used in the Quiz Game to save scores." },
  { name: "Built-in functions", note: "ord() and chr() powered the Caesar cipher." },
];

const baseProps = {
  scaffoldedCode: SCAFFOLDED,
  solution: SOLUTION,
  expectedKeywords: KEYWORDS,
  xpReward: 500,
  badgeIcon: "🗞️",
  projectName: "Newspaper guessing game",
  attempts: 0,
  isSolutionShown: false,
  isComplete: false,
  onFailedAttempt: jest.fn(),
  onComplete: jest.fn(),
  onShowSolution: jest.fn(),
};

beforeEach(() => { mockRunCode.mockReset(); jest.clearAllMocks(); });

describe("PY-012 — Newspaper guessing game (capstone)", () => {
  it("pre-fills editor with scaffolded code", () => {
    render(<ProjectCodePanel {...baseProps} />);
    expect(screen.getByRole("textbox", { name: /python code editor/i })).toHaveValue(SCAFFOLDED);
  });

  it("calls onComplete when output contains 'Leaderboard'", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({
      output: "alice logged in\nbob: invalid login\n--- Leaderboard ---\nalice: 6\nbob: 2",
      rawError: null,
    });
    render(<ProjectCodePanel {...baseProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(500));
  });

  it("keyword check is case-insensitive", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "--- leaderboard ---\nalice: 6", rawError: null });
    render(<ProjectCodePanel {...baseProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(500));
  });

  it("calls onFailedAttempt when tasks not filled in (no output)", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({ output: "", rawError: null });
    render(<ProjectCodePanel {...baseProps} onFailedAttempt={onFailedAttempt} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onFailedAttempt).toHaveBeenCalledTimes(1));
  });

  it("does not count errors as failed attempts", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({ output: "", rawError: "NameError: name 'scores' is not defined" });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ explanation: "Looks like scores is not defined yet!" }),
    }) as jest.Mock;
    render(<ProjectCodePanel {...baseProps} onFailedAttempt={onFailedAttempt} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(mockRunCode).toHaveBeenCalled());
    expect(onFailedAttempt).not.toHaveBeenCalled();
  });

  it("shows badge when isComplete is true", () => {
    render(<ProjectCodePanel {...baseProps} isComplete={true} />);
    expect(screen.getByRole("status", { name: /project complete/i })).toBeInTheDocument();
  });

  it("shows Show solution button after 3 failed attempts", () => {
    render(<ProjectCodePanel {...baseProps} attempts={3} />);
    expect(screen.getByRole("button", { name: /show the solution/i })).toBeInTheDocument();
  });

  it("does not show Show solution button before 3 attempts", () => {
    render(<ProjectCodePanel {...baseProps} attempts={2} />);
    expect(screen.queryByRole("button", { name: /show the solution/i })).not.toBeInTheDocument();
  });

  it("solution replaces editor content and is read-only", () => {
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} />);
    const editor = screen.getByRole("textbox", { name: /python code editor/i });
    expect(editor).toHaveValue(SOLUTION);
    expect(editor).toHaveAttribute("readonly");
  });

  it("shows solution notice, not badge, when solution shown without completion", () => {
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} />);
    expect(screen.getByRole("status", { name: /solution shown — badge not awarded/i })).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: /project complete/i })).not.toBeInTheDocument();
  });

  it("does not call onComplete when solution shown and keyword found", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "--- Leaderboard ---\nalice: 6", rawError: null });
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(mockRunCode).toHaveBeenCalled());
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("ProjectBar shows +500 XP for capstone project", () => {
    render(
      <ProjectBar
        name="Newspaper guessing game"
        badgeIcon="🗞️"
        xpReward={500}
        attemptsRemaining={3}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText("+500 XP")).toBeInTheDocument();
  });

  it("capstone ConceptSummary lists all 8 skills when complete", () => {
    render(<ConceptSummary concepts={CAPSTONE_CONCEPTS} visible={true} />);
    expect(screen.getByText("Dictionaries")).toBeInTheDocument();
    expect(screen.getByText("Functions")).toBeInTheDocument();
    expect(screen.getByText("Loops")).toBeInTheDocument();
    expect(screen.getByText("Conditions (if/else)")).toBeInTheDocument();
    expect(screen.getByText("Variables")).toBeInTheDocument();
    expect(screen.getByText("Lists")).toBeInTheDocument();
    expect(screen.getByText("Files")).toBeInTheDocument();
    expect(screen.getByText("Built-in functions")).toBeInTheDocument();
  });

  it("capstone ConceptSummary is hidden before completion", () => {
    const { container } = render(
      <ConceptSummary concepts={CAPSTONE_CONCEPTS} visible={false} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("0");
  });
});
