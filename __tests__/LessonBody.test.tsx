import { render, screen } from "@testing-library/react";
import LessonBody from "@/components/LessonBody";

describe("LessonBody", () => {
  it("renders explanation HTML content", () => {
    render(<LessonBody contentHtml="<p>Think of a variable like a box.</p>" />);
    expect(screen.getByText("Think of a variable like a box.")).toBeInTheDocument();
  });
});
