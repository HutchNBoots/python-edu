/**
 * PY-002 test suite — tabbed lesson page with Pyodide editor.
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import RightColumn from "@/components/RightColumn";
import TryItTabPanel from "@/components/TryItTabPanel";
import ExampleTabPanel from "@/components/ExampleTabPanel";
import OutputPanel from "@/components/OutputPanel";
import TabBar from "@/components/TabBar";
import CodeEditor from "@/components/CodeEditor";


// Mock Pyodide — we test the wiring, not the WASM runtime
jest.mock("../lib/pyodide", () => ({
  runCode: jest.fn(),
  getPyodide: jest.fn(),
}));

import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

const EXAMPLE_CODE = 'name = "Alex"\nprint(name)';
const STARTER_CODE = 'name = "change this"\nprint(name)';

// ---------------------------------------------------------------------------
// TabBar
// ---------------------------------------------------------------------------

describe("TabBar", () => {
  it("renders both tabs", () => {
    render(<TabBar active="example" onChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: /example/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /try it/i })).toBeInTheDocument();
  });

  it("marks the active tab with aria-selected=true", () => {
    render(<TabBar active="example" onChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: /example/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: /try it/i })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("shows hint labels under each tab", () => {
    render(<TabBar active="example" onChange={jest.fn()} />);
    expect(screen.getByText("see how it works")).toBeInTheDocument();
    expect(screen.getByText("write your own code")).toBeInTheDocument();
  });

  it("calls onChange with the correct tab id when clicked", () => {
    const onChange = jest.fn();
    render(<TabBar active="example" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: /try it/i }));
    expect(onChange).toHaveBeenCalledWith("tryit");
  });
});

// ---------------------------------------------------------------------------
// RightColumn — tab switching
// ---------------------------------------------------------------------------

describe("RightColumn — tab rendering and switching", () => {
  it("renders the Example tab panel by default", () => {
    render(<RightColumn code={EXAMPLE_CODE} starterCode={STARTER_CODE} />);
    expect(screen.getByRole("tabpanel", { name: /example/i })).toBeInTheDocument();
  });

  it("switches to Try it panel when tab is clicked", () => {
    render(<RightColumn code={EXAMPLE_CODE} starterCode={STARTER_CODE} />);
    fireEvent.click(screen.getByRole("tab", { name: /try it/i }));
    expect(screen.getByRole("tabpanel", { name: /try it/i })).toBeInTheDocument();
  });

  it("switches to Try it panel when Try it yourself button is clicked", () => {
    render(<RightColumn code={EXAMPLE_CODE} starterCode={STARTER_CODE} />);
    fireEvent.click(
      screen.getByRole("button", { name: /go to the exercise for this lesson/i })
    );
    expect(screen.getByRole("tabpanel", { name: /try it/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ExampleTabPanel
// ---------------------------------------------------------------------------

describe("ExampleTabPanel", () => {
  it("displays the example code", () => {
    const { container } = render(
      <ExampleTabPanel code={EXAMPLE_CODE} onTryIt={jest.fn()} />
    );
    const code = container.querySelector("code");
    expect(code).not.toBeNull();
    expect(code!.textContent).toContain("name");
  });

  it('has a "Try it yourself" button', () => {
    render(<ExampleTabPanel code={EXAMPLE_CODE} onTryIt={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: /go to the exercise for this lesson/i })
    ).toBeInTheDocument();
  });

  it('has a "Help me" button', () => {
    render(<ExampleTabPanel code={EXAMPLE_CODE} onTryIt={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: /get a hint for this lesson/i })
    ).toBeInTheDocument();
  });

  it("calls onTryIt when Try it yourself is clicked", () => {
    const onTryIt = jest.fn();
    render(<ExampleTabPanel code={EXAMPLE_CODE} onTryIt={onTryIt} />);
    fireEvent.click(
      screen.getByRole("button", { name: /go to the exercise for this lesson/i })
    );
    expect(onTryIt).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// TryItTabPanel — editor, output, buttons
// ---------------------------------------------------------------------------

describe("TryItTabPanel", () => {
  beforeEach(() => {
    mockRunCode.mockReset();
  });

  it("renders the code editor pre-populated with starter code", () => {
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    const editor = screen.getByRole("textbox", { name: /python code editor/i });
    expect(editor).toHaveValue(STARTER_CODE);
  });

  it("renders the output panel", () => {
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    expect(screen.getByLabelText(/code output/i)).toBeInTheDocument();
  });

  it('has a "Run" button', () => {
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    expect(
      screen.getByRole("button", { name: /run your python code/i })
    ).toBeInTheDocument();
  });

  it('has a "Reset" button', () => {
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    expect(
      screen.getByRole("button", { name: /reset code to starter/i })
    ).toBeInTheDocument();
  });

  it('has a "Help me" button', () => {
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    expect(
      screen.getByRole("button", { name: /get a hint for this lesson/i })
    ).toBeInTheDocument();
  });

  it("Run button calls runCode with current editor content", async () => {
    mockRunCode.mockResolvedValue({ output: "Alex", error: null });
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    expect(mockRunCode).toHaveBeenCalledWith(STARTER_CODE);
  });

  it("displays output in the output panel after Run", async () => {
    mockRunCode.mockResolvedValue({ output: "Hello, Alex!", error: null });
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent("Hello, Alex!")
    );
  });

  it("displays a plain-English error message when runCode returns an error", async () => {
    mockRunCode.mockResolvedValue({
      output: "",
      error: "Oops! 'x' hasn't been created yet — define it before you use it.",
    });
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
        "Oops! 'x' hasn't been created yet"
      )
    );
  });

  it("Reset restores the editor to starter code", async () => {
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    const editor = screen.getByRole("textbox", { name: /python code editor/i });
    fireEvent.change(editor, { target: { value: "x = 999" } });
    expect(editor).toHaveValue("x = 999");
    fireEvent.click(screen.getByRole("button", { name: /reset code to starter/i }));
    expect(editor).toHaveValue(STARTER_CODE);
  });

  it("Reset clears the output panel", async () => {
    mockRunCode.mockResolvedValue({ output: "Hello!", error: null });
    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });
    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent("Hello!")
    );
    fireEvent.click(screen.getByRole("button", { name: /reset code to starter/i }));
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
      "Output will appear here"
    );
  });
});

// ---------------------------------------------------------------------------
// OutputPanel
// ---------------------------------------------------------------------------

describe("OutputPanel", () => {
  it("shows placeholder text when empty", () => {
    render(<OutputPanel output="" error={null} isRunning={false} />);
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
      "Output will appear here"
    );
  });

  it("displays output text", () => {
    render(<OutputPanel output="Hello!" error={null} isRunning={false} />);
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent("Hello!");
  });

  it("displays error message", () => {
    render(
      <OutputPanel
        output=""
        error="There's a typo somewhere"
        isRunning={false}
      />
    );
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
      "There's a typo somewhere"
    );
  });

  it("shows running state", () => {
    render(<OutputPanel output="" error={null} isRunning={true} />);
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent("Running");
  });
});

// ---------------------------------------------------------------------------
// CodeEditor
// ---------------------------------------------------------------------------

describe("CodeEditor", () => {
  it("renders a textarea with the provided value", () => {
    render(<CodeEditor value={STARTER_CODE} onChange={jest.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue(STARTER_CODE);
  });

  it("has themed-scroll-code class for scrollbar styling", () => {
    const { container } = render(
      <CodeEditor value="" onChange={jest.fn()} />
    );
    expect(container.querySelector("textarea")).toHaveClass("themed-scroll-code");
  });
});

// ---------------------------------------------------------------------------
// Scrollbar classes
// ---------------------------------------------------------------------------

describe("Scrollbar CSS classes", () => {
  it("LessonPanel section has themed-scroll class", async () => {
    const LessonPanel = (await import("@/components/LessonPanel")).default;
    const { container } = render(
      <LessonPanel
        title="Test"
        contentHtml=""
        keyConcept="concept"
        xp={50}
        skillProgress={33}
      />
    );
    expect(container.querySelector("section")).toHaveClass("themed-scroll");
  });

  it("OutputPanel pre has themed-scroll class", () => {
    const { container } = render(
      <OutputPanel output="" error={null} isRunning={false} />
    );
    expect(container.querySelector("pre")).toHaveClass("themed-scroll");
  });
});
