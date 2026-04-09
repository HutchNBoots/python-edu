/**
 * PY-010 test suite — Number guessing game scaffolded project.
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProjectCodePanel from "@/components/ProjectCodePanel";
import ProjectBar from "@/components/ProjectBar";

jest.mock("../lib/pyodide", () => ({ runCode: jest.fn() }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: jest.fn().mockReturnValue("/projects/pj-3"),
}));

import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

const SCAFFOLDED = `secret_number = 7\nguesses = [3, 10, 7]\nguess_count = 0\nfound = False\nfor guess in guesses:\n    guess_count += 1\n    # FILL IN\nif found:\n    print(f"Got it in {guess_count} guesses!")\nelse:\n    print(f"The number was {secret_number}. Better luck next time!")`;
const SOLUTION   = `secret_number = 7\nguesses = [3, 10, 7]\nguess_count = 0\nfound = False\nfor guess in guesses:\n    guess_count += 1\n    if guess == secret_number:\n        found = True\n        break\n    if guess > secret_number:\n        print("Too high!")\n    else:\n        print("Too low!")\nif found:\n    print(f"Got it in {guess_count} guesses!")\nelse:\n    print(f"The number was {secret_number}. Better luck next time!")`;
const KEYWORDS   = ["Got it"];

const baseProps = {
  scaffoldedCode: SCAFFOLDED,
  solution: SOLUTION,
  expectedKeywords: KEYWORDS,
  xpReward: 300,
  badgeIcon: "🎯",
  projectName: "Number guessing game",
  attempts: 0,
  isSolutionShown: false,
  isComplete: false,
  onFailedAttempt: jest.fn(),
  onComplete: jest.fn(),
  onShowSolution: jest.fn(),
};

beforeEach(() => { mockRunCode.mockReset(); jest.clearAllMocks(); });

describe("PY-010 — Number guessing game", () => {
  it("pre-fills editor with scaffolded code", () => {
    render(<ProjectCodePanel {...baseProps} />);
    expect(screen.getByRole("textbox", { name: /python code editor/i })).toHaveValue(SCAFFOLDED);
  });

  it("calls onComplete when output contains 'Got it'", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "Too low!\nToo high!\nGot it in 3 guesses!", rawError: null });
    render(<ProjectCodePanel {...baseProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(300));
  });

  it("keyword check is case-insensitive", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "got it in 3 guesses!", rawError: null });
    render(<ProjectCodePanel {...baseProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(300));
  });

  it("calls onFailedAttempt when output does not contain keyword", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({ output: "The number was 7. Better luck next time!", rawError: null });
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
      json: async () => ({ explanation: "Check for a missing colon!" }),
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

  it("shows solution notice, not badge, when solution is shown without completion", () => {
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} />);
    expect(screen.getByRole("status", { name: /solution shown — badge not awarded/i })).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: /project complete/i })).not.toBeInTheDocument();
  });

  it("does not call onComplete when solution shown and keyword found", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "Got it in 3 guesses!", rawError: null });
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(mockRunCode).toHaveBeenCalled());
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("attempt counter shows correct remaining attempts on ProjectBar", () => {
    render(
      <ProjectBar
        name="Number guessing game"
        badgeIcon="🎯"
        xpReward={300}
        attemptsRemaining={1}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText(/1 of 3 attempts remaining/i)).toBeInTheDocument();
  });

  it("ProjectBar shows XP reward of 300", () => {
    render(
      <ProjectBar
        name="Number guessing game"
        badgeIcon="🎯"
        xpReward={300}
        attemptsRemaining={3}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText("+300 XP")).toBeInTheDocument();
  });
});
