import fs from "fs";
import path from "path";
import matter from "gray-matter";

const exercisesDir = path.join(process.cwd(), "content", "exercises");

export interface ExerciseData {
  skillId: string;
  level: string;
  title: string;
  instructions: string;
  starterCode: string;
  expectedOutput: string;
  xpReward: number;
}

export function getExercise(skillId: string, level: string): ExerciseData {
  const filePath = path.join(exercisesDir, `${skillId}-${level}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  return {
    skillId,
    level,
    title: data.title as string,
    instructions: data.instructions as string,
    starterCode: (data.starterCode as string).trimEnd(),
    expectedOutput: (data.expectedOutput as string).trim(),
    xpReward: data.xpReward as number,
  };
}

export function getAllExerciseParams(): Array<{ slug: string; level: string }> {
  if (!fs.existsSync(exercisesDir)) return [];
  return fs
    .readdirSync(exercisesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const name = f.replace(/\.md$/, "");
      const lastDash = name.lastIndexOf("-");
      return { slug: name.slice(0, lastDash), level: name.slice(lastDash + 1) };
    });
}
