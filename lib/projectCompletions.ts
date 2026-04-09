const KEY = "dragonpy-project-completions";

export interface ProjectCompletion {
  completedAt: string;
  xpEarned: number;
}

export type ProjectCompletions = Record<string, ProjectCompletion>;

export function loadProjectCompletions(): ProjectCompletions {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProjectCompletions) : {};
  } catch {
    return {};
  }
}

export function saveProjectCompletion(projectId: string, xpEarned: number): void {
  const completions = loadProjectCompletions();
  completions[projectId] = { completedAt: new Date().toISOString(), xpEarned };
  localStorage.setItem(KEY, JSON.stringify(completions));
}

export function isProjectComplete(projectId: string): boolean {
  return !!loadProjectCompletions()[projectId];
}
