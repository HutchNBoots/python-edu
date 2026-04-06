import { render } from "@testing-library/react";
import ExampleTabPanel from "@/components/ExampleTabPanel";


describe("ExampleTabPanel — code block", () => {
  it("renders the code content in a code element", () => {
    const { container } = render(
      <ExampleTabPanel
        code={'name = "Alex"\nprint(name)'}
        onTryIt={jest.fn()}
      />
    );
    const codeEl = container.querySelector("code");
    expect(codeEl).not.toBeNull();
    expect(codeEl!.textContent).toContain("name");
    expect(codeEl!.textContent).toContain('"Alex"');
  });
});
