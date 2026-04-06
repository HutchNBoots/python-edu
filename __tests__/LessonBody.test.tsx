import { render, screen } from "@testing-library/react";
import LessonPanel from "@/components/LessonPanel";

describe("LessonPanel — body content", () => {
  it("renders explanation HTML content", () => {
    render(
      <LessonPanel
        title="Variables"
        contentHtml="<p>Think of a variable like a box.</p>"
        keyConcept="A variable stores a value."
        xp={50}
        skillProgress={33}
      />
    );
    expect(
      screen.getByText("Think of a variable like a box.")
    ).toBeInTheDocument();
  });
});
