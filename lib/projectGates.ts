import projectsData from "@/content/projects.json";
import type { PathLevel, SkillState } from "@/lib/skillProgress";

export type ProjectStatus = "locked" | "available" | "complete";

export interface UnlockRequirement {
  skillId: string;
  skillName: string;
  minLevel: PathLevel;
  href: string;
}

export interface ProjectDef {
  id: string;
  name: string;
  description: string;
  complexity: "starter" | "mid" | "advanced";
  badgeIcon: string;
  xpReward: number;
  unlockGate: Array<{ skillId: string; minLevel: PathLevel }>;
}

export interface ProjectState {
  def: ProjectDef;
  status: ProjectStatus;
  unmetRequirements: UnlockRequirement[];
}

export const PROJECTS: ProjectDef[] = projectsData.projects as ProjectDef[];

export function evaluateProjectState(
  project: ProjectDef,
  skillStates: SkillState[]
): ProjectState {
  const unmetRequirements: UnlockRequirement[] = [];

  for (const gate of project.unlockGate) {
    const skill = skillStates.find((s) => s.id === gate.skillId);
    const path = skill?.paths.find((p) => p.level === gate.minLevel);
    if (path?.status !== "complete") {
      unmetRequirements.push({
        skillId: gate.skillId,
        skillName: skill?.name ?? gate.skillId,
        minLevel: gate.minLevel,
        href: `/lessons/${gate.skillId}/${gate.minLevel}`,
      });
    }
  }

  const status: ProjectStatus =
    unmetRequirements.length === 0 ? "available" : "locked";

  return { def: project, status, unmetRequirements };
}

export function evaluateAllProjects(skillStates: SkillState[]): ProjectState[] {
  return PROJECTS.map((p) => evaluateProjectState(p, skillStates));
}
