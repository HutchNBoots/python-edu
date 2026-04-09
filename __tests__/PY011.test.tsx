/**
 * PY-011 test suite — Quiz game with scoreboard.
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProjectCodePanel from "@/components/ProjectCodePanel";
import ProjectBar from "@/components/ProjectBar";

jest.mock("../lib/pyodide", () => ({ runCode: jest.fn() }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: jest.fn().mockReturnValue("/projects/pj-4"),
}));

import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

const SCAFFOLDED = `questions = [\n    {"question": "Capital of France?", "answer": "paris"},\n]\nplayer_answers = ["Paris"]\nscore = 0\npass\nprint(f"Your score: {score} out of {len(questions)}")`;
const SOLUTION   = `questions = [\n    {"question": "Capital of France?", "answer": "paris"},\n]\nplayer_answers = ["Paris"]\nscore = 0\nfor question, player_answer in zip(questions, player_answers):\n    if player_answer.lower() == question["answer"].lower():\n        score += 1\n        print("Correct!")\n    else:\n        print(f"Wrong! The answer was {question['answer']}")\nprint(f"Your score: {score} out of {len(questions)}")`;
const KEYWORDS   = ["Correct!"];

const baseProps = {
  scaffoldedCode: SCAFFOLDED,
  solution: SOLUTION,
  expectedKeywords: KEYWORDS,
  xpReward: 400,
  badgeIcon: "🏆",
  projectName: "Quiz game with scoreboard",
  attempts: 0,
  isSolutionShown: false,
  isComplete: false,
  onFailedAttempt: jest.fn(),
  onComplete: jest.fn(),
  onShowSolution: jest.fn(),
};

beforeEach(() => { mockRunCode.mockReset(); jest.clearAllMocks(); });

describe("PY-011 — Quiz game with scoreboard", () => {
  it("pre-fills editor with scaffolded code", () => {
    render(<ProjectCodePanel {...baseProps} />);
    expect(screen.getByRole("textbox", { name: /python code editor/i })).toHaveValue(SCAFFOLDED);
  });

  it("calls onComplete when output contains 'Correct!'", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({
      output: "Capital of France?\nCorrect!\nYour score: 1 out of 1",
      rawError: null,
    });
    render(<ProjectCodePanel {...baseProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(400));
  });

  it("calls onFailedAttempt when output contains no keyword (loop not filled in)", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({
      output: "Your score: 0 out of 1\n--- Leaderboard ---\nScore: 0\n",
      rawError: null,
    });
    render(<ProjectCodePanel {...baseProps} onFailedAttempt={onFailedAttempt} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onFailedAttempt).toHaveBeenCalledTimes(1));
  });

  it("does not count errors as failed attempts", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({ output: "", rawError: "SyntaxError: invalid syntax" });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ explanation: "Check your loop syntax!" }),
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
    mockRunCode.mockResolvedValue({ output: "Correct!\nYour score: 1 out of 1", rawError: null });
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(mockRunCode).toHaveBeenCalled());
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("ProjectBar shows +400 XP for quiz game", () => {
    render(
      <ProjectBar
        name="Quiz game with scoreboard"
        badgeIcon="🏆"
        xpReward={400}
        attemptsRemaining={3}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText("+400 XP")).toBeInTheDocument();
  });

  it("attempt counter shows 2 of 3 after one failed attempt", () => {
    render(
      <ProjectBar
        name="Quiz game with scoreboard"
        badgeIcon="🏆"
        xpReward={400}
        attemptsRemaining={2}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText(/2 of 3 attempts remaining/i)).toBeInTheDocument();
  });
});
