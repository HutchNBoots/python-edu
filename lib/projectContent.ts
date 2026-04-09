import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content", "projects");

export interface ProjectConcept {
  name: string;
  note: string;
}

export interface ProjectContent {
  id: string;
  title: string;
  badgeIcon: string;
  xpReward: number;
  expectedKeywords: string[];
  instructions: string[];
  concepts: ProjectConcept[];
  scaffoldedCode: string;
  solution: string;
}

export function getProjectContent(id: string): ProjectContent {
  const filePath = path.join(contentDir, `${id}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  return {
    id,
    title: data.title as string,
    badgeIcon: data.badgeIcon as string,
    xpReward: data.xpReward as number,
    expectedKeywords: data.expectedKeywords as string[],
    instructions: data.instructions as string[],
    concepts: data.concepts as ProjectConcept[],
    scaffoldedCode: data.scaffoldedCode as string,
    solution: data.solution as string,
  };
}
