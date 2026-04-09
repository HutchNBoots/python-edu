/**
 * PY-009 test suite — Caesar cipher scaffolded project.
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProjectCodePanel from "@/components/ProjectCodePanel";
import ProjectBar from "@/components/ProjectBar";

jest.mock("../lib/pyodide", () => ({ runCode: jest.fn() }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: jest.fn().mockReturnValue("/projects/pj-2"),
}));

import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

const SCAFFOLDED = `message = "Hello"\nshift = 3\nencoded = ""\nfor char in message:\n    encoded += char\nprint("Encoded:", encoded)`;
const SOLUTION   = `message = "Hello"\nshift = 3\nencoded = ""\nfor char in message:\n    if char.isalpha():\n        base = ord('A') if char.isupper() else ord('a')\n        encoded += chr((ord(char) - base + shift) % 26 + base)\n    else:\n        encoded += char\nprint("Encoded:", encoded)`;
const KEYWORDS   = ["Khoor"];

const baseProps = {
  scaffoldedCode: SCAFFOLDED,
  solution: SOLUTION,
  expectedKeywords: KEYWORDS,
  xpReward: 200,
  badgeIcon: "🔐",
  projectName: "Caesar cipher",
  attempts: 0,
  isSolutionShown: false,
  isComplete: false,
  onFailedAttempt: jest.fn(),
  onComplete: jest.fn(),
  onShowSolution: jest.fn(),
};

beforeEach(() => { mockRunCode.mockReset(); jest.clearAllMocks(); });

describe("PY-009 — Caesar cipher", () => {
  it("pre-fills editor with scaffolded code", () => {
    render(<ProjectCodePanel {...baseProps} />);
    expect(screen.getByRole("textbox", { name: /python code editor/i })).toHaveValue(SCAFFOLDED);
  });

  it("calls onComplete when output contains 'Khoor'", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "Encoded: Khoor\nDecoded: Hello", rawError: null });
    render(<ProjectCodePanel {...baseProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(200));
  });

  it("keyword check is case-insensitive for Khoor", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "Encoded: khoor\nDecoded: hello", rawError: null });
    render(<ProjectCodePanel {...baseProps} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(200));
  });

  it("calls onFailedAttempt when output does not contain keyword", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({ output: "Encoded: Hello\nDecoded: Hello", rawError: null });
    render(<ProjectCodePanel {...baseProps} onFailedAttempt={onFailedAttempt} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(onFailedAttempt).toHaveBeenCalledTimes(1));
  });

  it("does not count errors as failed attempts", async () => {
    const onFailedAttempt = jest.fn();
    mockRunCode.mockResolvedValue({ output: "", rawError: "NameError: name 'encoded' is not defined" });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ explanation: "Looks like encoded hasn't been defined yet!" }),
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

  it("solution replaces editor content and is read-only", () => {
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} />);
    const editor = screen.getByRole("textbox", { name: /python code editor/i });
    expect(editor).toHaveValue(SOLUTION);
    expect(editor).toHaveAttribute("readonly");
  });

  it("shows solution notice, not badge, when solution is shown", () => {
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} />);
    expect(screen.getByRole("status", { name: /solution shown — badge not awarded/i })).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: /project complete/i })).not.toBeInTheDocument();
  });

  it("does not call onComplete when solution shown and keyword found", async () => {
    const onComplete = jest.fn();
    mockRunCode.mockResolvedValue({ output: "Encoded: Khoor", rawError: null });
    render(<ProjectCodePanel {...baseProps} isSolutionShown={true} onComplete={onComplete} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() => expect(mockRunCode).toHaveBeenCalled());
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("unlock gate: shows 3 of 3 attempts remaining on ProjectBar", () => {
    render(
      <ProjectBar
        name="Caesar cipher"
        badgeIcon="🔐"
        xpReward={200}
        attemptsRemaining={3}
        isComplete={false}
        isSolutionShown={false}
      />
    );
    expect(screen.getByText(/3 of 3 attempts remaining/i)).toBeInTheDocument();
  });
});
