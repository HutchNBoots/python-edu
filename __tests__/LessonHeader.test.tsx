import { render, screen } from "@testing-library/react";
import LessonPanel from "@/components/LessonPanel";

describe("LessonPanel — heading", () => {
  it("renders the lesson title as an h1", () => {
    render(
      <LessonPanel
        title="Variables & Data Types"
        contentHtml=""
        keyConcept="A variable stores a value."
        xp={50}
        skillProgress={33}
      />
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Variables & Data Types"
    );
  });
});
