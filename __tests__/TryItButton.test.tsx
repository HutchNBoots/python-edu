import { render, screen } from "@testing-library/react";
import TryItButton from "@/components/TryItButton";

describe("TryItButton", () => {
  it("renders a visible Try it button", () => {
    render(<TryItButton slug="variables" />);
    const button = screen.getByRole("link", { name: /try it/i });
    expect(button).toBeInTheDocument();
  });

  it("navigates to the correct exercise URL", () => {
    render(<TryItButton slug="variables" />);
    const link = screen.getByRole("link", { name: /try it/i });
    expect(link).toHaveAttribute("href", "/exercises/variables");
  });
});
