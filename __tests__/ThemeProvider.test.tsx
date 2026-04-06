import { render, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { darkTheme } from "@/styles/themes/dark";
import { lightTheme } from "@/styles/themes/light";

// Helper component to expose hook values
function ThemeConsumer({
  onRender,
}: {
  onRender: (v: ReturnType<typeof useTheme>) => void;
}) {
  const value = useTheme();
  onRender(value);
  return null;
}

function renderWithTheme(onRender: (v: ReturnType<typeof useTheme>) => void) {
  return render(
    <ThemeProvider>
      <ThemeConsumer onRender={onRender} />
    </ThemeProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  // Reset any inline styles set on root
  Object.keys(darkTheme).forEach((prop) =>
    document.documentElement.style.removeProperty(prop)
  );
});

describe("ThemeProvider — token application", () => {
  it("applies dark theme tokens to document root by default", () => {
    renderWithTheme(() => {});
    expect(
      document.documentElement.style.getPropertyValue("--bg-base")
    ).toBe(darkTheme["--bg-base"]);
    expect(
      document.documentElement.style.getPropertyValue("--accent-primary")
    ).toBe(darkTheme["--accent-primary"]);
  });

  it("applies all dark theme tokens to the root element", () => {
    renderWithTheme(() => {});
    Object.entries(darkTheme).forEach(([prop, value]) => {
      expect(
        document.documentElement.style.getPropertyValue(prop)
      ).toBe(value);
    });
  });

  it("reads 'light' from localStorage and applies light theme tokens", () => {
    localStorage.setItem("dragonpy-theme", "light");
    renderWithTheme(() => {});
    expect(
      document.documentElement.style.getPropertyValue("--bg-base")
    ).toBe(lightTheme["--bg-base"]);
  });

  it("defaults to dark if localStorage value is missing", () => {
    renderWithTheme(() => {});
    expect(
      document.documentElement.style.getPropertyValue("--bg-base")
    ).toBe(darkTheme["--bg-base"]);
  });

  it("defaults to dark if localStorage contains an unexpected value", () => {
    localStorage.setItem("dragonpy-theme", "solarized");
    renderWithTheme(() => {});
    expect(
      document.documentElement.style.getPropertyValue("--bg-base")
    ).toBe(darkTheme["--bg-base"]);
  });
});

describe("ThemeProvider — toggleTheme", () => {
  it("toggleTheme switches from dark to light and persists to localStorage", () => {
    let captured: ReturnType<typeof useTheme> | null = null;
    renderWithTheme((v) => {
      captured = v;
    });

    act(() => {
      captured!.toggleTheme();
    });

    expect(localStorage.getItem("dragonpy-theme")).toBe("light");
    expect(
      document.documentElement.style.getPropertyValue("--bg-base")
    ).toBe(lightTheme["--bg-base"]);
  });

  it("toggleTheme switches from light back to dark and persists to localStorage", () => {
    localStorage.setItem("dragonpy-theme", "light");
    let captured: ReturnType<typeof useTheme> | null = null;
    renderWithTheme((v) => {
      captured = v;
    });

    act(() => {
      captured!.toggleTheme();
    });

    expect(localStorage.getItem("dragonpy-theme")).toBe("dark");
    expect(
      document.documentElement.style.getPropertyValue("--bg-base")
    ).toBe(darkTheme["--bg-base"]);
  });
});

describe("Light and dark theme token parity", () => {
  it("light and dark themes export identical token names", () => {
    const darkKeys = Object.keys(darkTheme).sort();
    const lightKeys = Object.keys(lightTheme).sort();
    expect(darkKeys).toEqual(lightKeys);
  });

  it("code block tokens are identical in both themes", () => {
    const codeTokens = [
      "--code-bg",
      "--code-comment",
      "--code-keyword",
      "--code-string",
      "--code-variable",
      "--code-value",
    ];
    codeTokens.forEach((token) => {
      expect(darkTheme[token]).toBe(lightTheme[token]);
    });
  });
});
