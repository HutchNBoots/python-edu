import { supabase } from "@/lib/supabase";
import type { PathLevel } from "@/lib/skillProgress";
import { deriveProgressData } from "@/lib/progressUtils";
import type { PathCompletionRow, ProgressData } from "@/lib/progressUtils";

// Re-export pure helpers so consumers can import from one place
export { rowsToCompletions, mergeCompletions, deriveProgressData } from "@/lib/progressUtils";
export type { PathCompletionRow, ProgressData } from "@/lib/progressUtils";

// ---------------------------------------------------------------------------
// Supabase data access
// ---------------------------------------------------------------------------

export async function createProfile(
  username: string
): Promise<{ id: string; username: string }> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("profiles")
    .insert({ username })
    .select("id, username")
    .single();
  if (error) throw error;
  return data;
}

export async function loadProgress(profileId: string): Promise<ProgressData> {
  if (!supabase) return { completions: [], totalXp: 0, skillsComplete: 0 };
  const { data, error } = await supabase
    .from("path_completions")
    .select("skill_id, level, xp_awarded")
    .eq("profile_id", profileId);
  if (error) throw error;
  return deriveProgressData((data ?? []) as PathCompletionRow[]);
}

export async function saveCompletion(
  profileId: string,
  skillId: string,
  level: PathLevel,
  xpAwarded: number
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("path_completions").upsert(
    { profile_id: profileId, skill_id: skillId, level, xp_awarded: xpAwarded },
    { onConflict: "profile_id,skill_id,level" }
  );
  if (error) throw error;
}

export async function resetProgress(profileId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("path_completions")
    .delete()
    .eq("profile_id", profileId);
  if (error) throw error;
}
