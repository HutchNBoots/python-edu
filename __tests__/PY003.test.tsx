/**
 * PY-003 test suite — friendly error messages via Claude Haiku.
 */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import TryItTabPanel from "@/components/TryItTabPanel";
import OutputPanel from "@/components/OutputPanel";
import { stripPaths } from "@/lib/stripPaths";

// Mock Pyodide with relative path (avoids jest.mock hoisting alias issue)
jest.mock("../lib/pyodide", () => ({
  runCode: jest.fn(),
  getPyodide: jest.fn(),
}));

import { runCode } from "../lib/pyodide";
const mockRunCode = runCode as jest.MockedFunction<typeof runCode>;

const STARTER_CODE = 'name = "change this"\nprint(name)';

const emptyPanelProps = {
  output: "",
  friendlyError: null,
  rawError: null,
  isRunning: false,
  isExplainingError: false,
  errorFallback: false,
};

// ---------------------------------------------------------------------------
// stripPaths
// ---------------------------------------------------------------------------

describe("stripPaths", () => {
  it("replaces <exec> with script.py", () => {
    const input = 'File "<exec>", line 1, in <module>';
    expect(stripPaths(input)).toContain("script.py");
    expect(stripPaths(input)).not.toContain("<exec>");
  });

  it("replaces unix absolute paths", () => {
    const input = 'File "/home/user/projects/my_script.py", line 3';
    expect(stripPaths(input)).toContain("script.py");
    expect(stripPaths(input)).not.toContain("/home/user");
  });

  it("replaces windows absolute paths", () => {
    const input = 'File "C:\\Users\\hutch\\script.py", line 2';
    expect(stripPaths(input)).toContain("script.py");
    expect(stripPaths(input)).not.toContain("C:\\Users");
  });

  it("replaces File \"...\" references", () => {
    const input = 'File "/tmp/pyodide_script.py", line 1';
    const result = stripPaths(input);
    expect(result).toContain('File "script.py"');
  });

  it("leaves non-path content unchanged", () => {
    const input = "NameError: name 'x' is not defined";
    expect(stripPaths(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// OutputPanel — PY-003 states
// ---------------------------------------------------------------------------

describe("OutputPanel — error states", () => {
  it("shows 'Explaining error…' during API call", () => {
    render(<OutputPanel {...emptyPanelProps} isExplainingError={true} />);
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
      "Explaining error"
    );
  });

  it("shows friendly error message in orange", () => {
    render(
      <OutputPanel
        {...emptyPanelProps}
        friendlyError="Looks like 'x' hasn't been defined yet!"
      />
    );
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
      "Looks like 'x' hasn't been defined yet!"
    );
  });

  it("shows static fallback when errorFallback is true", () => {
    render(<OutputPanel {...emptyPanelProps} errorFallback={true} />);
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
      "Something went wrong"
    );
  });

  it("shows TechnicalToggle button when friendlyError and rawError present", () => {
    render(
      <OutputPanel
        {...emptyPanelProps}
        friendlyError="Oops!"
        rawError="NameError: name 'x' is not defined"
      />
    );
    expect(
      screen.getByRole("button", { name: /show technical detail/i })
    ).toBeInTheDocument();
  });

  it("toggle button has aria-expanded=false by default", () => {
    render(
      <OutputPanel
        {...emptyPanelProps}
        friendlyError="Oops!"
        rawError="NameError: name 'x' is not defined"
      />
    );
    expect(
      screen.getByRole("button", { name: /show technical detail/i })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("clicking toggle reveals raw traceback and sets aria-expanded=true", () => {
    render(
      <OutputPanel
        {...emptyPanelProps}
        friendlyError="Oops!"
        rawError="NameError: name 'x' is not defined"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /show technical detail/i }));
    expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
      "NameError: name 'x' is not defined"
    );
    expect(
      screen.getByRole("button", { name: /hide technical detail/i })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking toggle again hides raw traceback and sets aria-expanded=false", () => {
    render(
      <OutputPanel
        {...emptyPanelProps}
        friendlyError="Oops!"
        rawError="NameError: name 'x' is not defined"
      />
    );
    const btn = screen.getByRole("button", { name: /show technical detail/i });
    fireEvent.click(btn);
    fireEvent.click(screen.getByRole("button", { name: /hide technical detail/i }));
    expect(
      screen.getByRole("button", { name: /show technical detail/i })
    ).toHaveAttribute("aria-expanded", "false");
  });
});

// ---------------------------------------------------------------------------
// TryItTabPanel — PY-003 integration
// ---------------------------------------------------------------------------

describe("TryItTabPanel — PY-003 error flow", () => {
  beforeEach(() => {
    mockRunCode.mockReset();
    jest.restoreAllMocks();
  });

  it("shows 'Explaining error…' immediately after run fails", async () => {
    mockRunCode.mockResolvedValue({
      output: "",
      rawError: "NameError: name 'x' is not defined",
    });
    // Block fetch so the loading state is visible
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));

    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
        "Explaining error"
      )
    );
  });

  it("displays friendly error message after API responds", async () => {
    mockRunCode.mockResolvedValue({
      output: "",
      rawError: "NameError: name 'x' is not defined",
    });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        explanation: "It looks like 'x' hasn't been defined. Give it another go!",
      }),
    }) as jest.Mock;

    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
        "It looks like 'x' hasn't been defined"
      )
    );
  });

  it("displays fallback message when API call fails", async () => {
    mockRunCode.mockResolvedValue({
      output: "",
      rawError: "SyntaxError: invalid syntax",
    });
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error")) as jest.Mock;

    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
        "Something went wrong"
      )
    );
  });

  it("displays fallback when API returns fallback:true", async () => {
    mockRunCode.mockResolvedValue({
      output: "",
      rawError: "SyntaxError: invalid syntax",
    });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ fallback: true }),
    }) as jest.Mock;

    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/code output/i)).toHaveTextContent(
        "Something went wrong"
      )
    );
  });

  it("strips paths before sending to API", async () => {
    mockRunCode.mockResolvedValue({
      output: "",
      rawError: 'File "<exec>", line 1\nNameError: name \'x\' is not defined',
    });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ explanation: "Nice try!" }),
    }) as jest.Mock;

    render(<TryItTabPanel starterCode={STARTER_CODE} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /run your python code/i }));
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const body = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[0][1].body
    );
    expect(body.rawError).not.toContain("<exec>");
    expect(body.rawError).toContain("script.py");
  });
});
