import skillsData from "@/content/skills.json";

export type PathLevel = "easy" | "mid" | "hard";
export type PathStatus = "locked" | "available" | "complete";

const LEVEL_ORDER: PathLevel[] = ["easy", "mid", "hard"];

function levelIndex(level: PathLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

export interface SkillDef {
  id: string;
  name: string;
  category: "core" | "additional";
  prerequisites: Array<{ skillId: string; minLevel: PathLevel }>;
  paths: Array<{ level: PathLevel; xpReward: number }>;
}

export interface PathState {
  level: PathLevel;
  xpReward: number;
  status: PathStatus;
  xpEarned: number;
}

export interface SkillState {
  id: string;
  name: string;
  category: "core" | "additional";
  paths: PathState[];
  isLocked: boolean;
}

// completions: { skillId: Set<PathLevel> }
export type Completions = Record<string, Set<PathLevel>>;

export const SKILLS: SkillDef[] = skillsData.skills as SkillDef[];

export function loadCompletions(): Completions {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("dragonpy-progress");
    if (!raw) return {};
    const parsed: Record<string, string[]> = JSON.parse(raw);
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, new Set(v as PathLevel[])])
    );
  } catch {
    return {};
  }
}

export function saveCompletions(completions: Completions): void {
  const serialisable = Object.fromEntries(
    Object.entries(completions).map(([k, v]) => [k, Array.from(v)])
  );
  localStorage.setItem("dragonpy-progress", JSON.stringify(serialisable));
}

function isPathComplete(
  skillId: string,
  level: PathLevel,
  completions: Completions
): boolean {
  return completions[skillId]?.has(level) ?? false;
}

function prerequisitesMet(
  prereqs: SkillDef["prerequisites"],
  completions: Completions
): boolean {
  return prereqs.every(({ skillId, minLevel }) => {
    const required = levelIndex(minLevel);
    return LEVEL_ORDER.slice(0, required + 1).every((lvl) =>
      isPathComplete(skillId, lvl, completions)
    );
  });
}

export function computeSkillStates(completions: Completions): SkillState[] {
  return SKILLS.map((skill) => {
    const prereqsMet = prerequisitesMet(skill.prerequisites, completions);

    const paths: PathState[] = skill.paths.map((path, i) => {
      const complete = isPathComplete(skill.id, path.level, completions);
      if (complete) {
        return { ...path, status: "complete", xpEarned: path.xpReward };
      }

      const prevComplete =
        i === 0 || isPathComplete(skill.id, LEVEL_ORDER[i - 1], completions);

      const locked = !prereqsMet || !prevComplete;
      return {
        ...path,
        status: locked ? "locked" : "available",
        xpEarned: 0,
      };
    });

    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      paths,
      isLocked: paths[0].status === "locked",
    };
  });
}

export function totalXpEarned(skillStates: SkillState[]): number {
  return skillStates.flatMap((s) => s.paths).reduce((sum, p) => sum + p.xpEarned, 0);
}

export function completedSkillsCount(skillStates: SkillState[]): number {
  return skillStates.filter((s) => s.paths.every((p) => p.status === "complete"))
    .length;
}

export function firstIncompletePathLevel(skill: SkillState): PathLevel | null {
  const path = skill.paths.find((p) => p.status !== "complete");
  return path?.level ?? null;
}
