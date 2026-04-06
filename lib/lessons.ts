import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const contentDir = path.join(process.cwd(), "content", "lessons");

export interface LessonData {
  slug: string;
  title: string;
  codeExample: string;
  contentHtml: string;
  keyConcept: string;
  xp: number;
}

export async function getLessonData(slug: string): Promise<LessonData> {
  const filePath = path.join(contentDir, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title as string,
    codeExample: data.codeExample as string,
    contentHtml,
    keyConcept: data.keyConcept as string,
    xp: data.xp as number,
  };
}

export function getAllLessonSlugs(): string[] {
  const fileNames = fs.readdirSync(contentDir);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
}
