import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const contentDir = path.join(process.cwd(), "content", "lessons");

export interface LessonData {
  slug: string;
  title: string;
  codeExample: string;
  contentHtml: string;
}

export async function getLessonData(slug: string): Promise<LessonData> {
  const filePath = path.join(contentDir, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title as string,
    codeExample: data.codeExample as string,
    contentHtml,
  };
}

export function getAllLessonSlugs(): string[] {
  const fileNames = fs.readdirSync(contentDir);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
}
