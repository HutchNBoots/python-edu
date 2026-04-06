import { render, screen } from "@testing-library/react";
import TryItButton from "@/components/TryItButton";

describe("TryItButton", () => {
  it('renders with aria-label "Go to the exercise for this lesson"', () => {
    render(<TryItButton slug="variables" />);
    expect(
      screen.getByRole("link", { name: "Go to the exercise for this lesson" })
    ).toBeInTheDocument();
  });

  it("navigates to the correct exercise URL", () => {
    render(<TryItButton slug="variables" />);
    expect(
      screen.getByRole("link", { name: "Go to the exercise for this lesson" })
    ).toHaveAttribute("href", "/exercises/variables");
  });
});
