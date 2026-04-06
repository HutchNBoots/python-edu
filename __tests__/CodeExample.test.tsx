import { render } from "@testing-library/react";
import CodePanel from "@/components/CodePanel";

describe("CodePanel — code block", () => {
  it("renders the code content in a code element", () => {
    const { container } = render(
      <CodePanel code={'name = "Alex"\nprint(name)'} slug="variables" />
    );
    const codeEl = container.querySelector("code");
    expect(codeEl).not.toBeNull();
    expect(codeEl!.textContent).toContain("name");
    expect(codeEl!.textContent).toContain('"Alex"');
  });
});
