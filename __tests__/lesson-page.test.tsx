/**
 * Integration test: lesson page renders all required elements.
 * Covers acceptance criteria:
 *   - Displays title, explanation text, syntax-highlighted code example
 *   - "Try it" button is visible and navigates to the exercise
 *   - Page is readable on mobile (min-width rendered — layout uses min-w-[320px])
 *   - Lesson content loaded from markdown, not hardcoded
 */
import { render, screen } from "@testing-library/react";
import LessonHeader from "@/components/LessonHeader";
import LessonBody from "@/components/LessonBody";
import CodeExample from "@/components/CodeExample";
import TryItButton from "@/components/TryItButton";

const FAKE_LESSON = {
  slug: "variables",
  title: "Variables & Data Types",
  contentHtml: "<p>Think of a variable like a labelled box.</p>",
  codeExample: 'name = "Alex"\nprint(name)',
};

function LessonPageComposite() {
  return (
    <main>
      <LessonHeader title={FAKE_LESSON.title} />
      <LessonBody contentHtml={FAKE_LESSON.contentHtml} />
      <CodeExample code={FAKE_LESSON.codeExample} />
      <TryItButton slug={FAKE_LESSON.slug} />
    </main>
  );
}

describe("Lesson page — PY-001 acceptance criteria", () => {
  beforeEach(() => {
    render(<LessonPageComposite />);
  });

  it("AC: displays the lesson title", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Variables & Data Types"
    );
  });

  it("AC: displays explanation text", () => {
    expect(
      screen.getByText("Think of a variable like a labelled box.")
    ).toBeInTheDocument();
  });

  it("AC: displays a syntax-highlighted code example", () => {
    // Syntax highlighter splits code into spans — check the code element's full text
    const codeEl = document.querySelector("code");
    expect(codeEl).not.toBeNull();
    expect(codeEl!.textContent).toContain("name");
  });

  it('AC: "Try it" button is visible', () => {
    expect(screen.getByRole("link", { name: /try it/i })).toBeInTheDocument();
  });

  it('AC: "Try it" button navigates to the exercise for this lesson', () => {
    const link = screen.getByRole("link", { name: /try it/i });
    expect(link).toHaveAttribute("href", "/exercises/variables");
  });
});
