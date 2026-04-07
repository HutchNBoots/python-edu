/**
 * Pure helper functions for progress data — no Supabase dependency.
 * Kept separate so tests can import them without triggering the Supabase client.
 */
import type { PathLevel, Completions } from "@/lib/skillProgress";

export interface PathCompletionRow {
  skill_id: string;
  level: PathLevel;
  xp_awarded: number;
}

export interface ProgressData {
  completions: PathCompletionRow[];
  totalXp: number;
  skillsComplete: number;
}

export function rowsToCompletions(rows: PathCompletionRow[]): Completions {
  const result: Completions = {};
  for (const row of rows) {
    if (!result[row.skill_id]) result[row.skill_id] = new Set();
    result[row.skill_id].add(row.level);
  }
  return result;
}

export function mergeCompletions(a: Completions, b: Completions): Completions {
  const result: Completions = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    result[key] = new Set([...(a[key] ?? []), ...(b[key] ?? [])]);
  }
  return result;
}

export function deriveProgressData(rows: PathCompletionRow[]): ProgressData {
  const totalXp = rows.reduce((sum, r) => sum + r.xp_awarded, 0);
  const bySkill = new Map<string, Set<string>>();
  for (const r of rows) {
    if (!bySkill.has(r.skill_id)) bySkill.set(r.skill_id, new Set());
    bySkill.get(r.skill_id)!.add(r.level);
  }
  const skillsComplete = [...bySkill.values()].filter(
    (levels) => levels.has("easy") && levels.has("mid") && levels.has("hard")
  ).length;
  return { completions: rows, totalXp, skillsComplete };
}
