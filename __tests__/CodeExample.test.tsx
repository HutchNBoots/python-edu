import { render, screen } from "@testing-library/react";
import CodeExample from "@/components/CodeExample";

describe("CodeExample", () => {
  it("renders the code content", () => {
    const { container } = render(<CodeExample code={'name = "Alex"\nprint(name)'} />);
    // Syntax highlighter splits code into spans — check the full pre/code text instead
    const codeEl = container.querySelector("code");
    expect(codeEl).not.toBeNull();
    expect(codeEl!.textContent).toContain("name");
    expect(codeEl!.textContent).toContain('"Alex"');
  });
});
