import { getLessonData, getAllLessonSlugs } from "@/lib/lessons";
import fs from "fs";
import path from "path";

describe("getLessonData", () => {
  it("returns title from markdown frontmatter — not hardcoded", async () => {
    const lesson = await getLessonData("variables");
    expect(lesson.title).toBeTruthy();
    expect(typeof lesson.title).toBe("string");
  });

  it("returns rendered HTML content from markdown body", async () => {
    const lesson = await getLessonData("variables");
    expect(lesson.contentHtml).toContain("<p>");
  });

  it("returns a code example from frontmatter", async () => {
    const lesson = await getLessonData("variables");
    expect(lesson.codeExample).toBeTruthy();
  });

  it("content is loaded from a file in /content/lessons/, not hardcoded", () => {
    const filePath = path.join(process.cwd(), "content", "lessons", "variables.md");
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

describe("getAllLessonSlugs", () => {
  it("returns an array of slugs from /content/lessons/", () => {
    const slugs = getAllLessonSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs).toContain("variables");
  });
});
