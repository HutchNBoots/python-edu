import { render, screen } from "@testing-library/react";
import LessonHeader from "@/components/LessonHeader";

describe("LessonHeader", () => {
  it("renders the lesson title", () => {
    render(<LessonHeader title="Variables & Data Types" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Variables & Data Types"
    );
  });
});
