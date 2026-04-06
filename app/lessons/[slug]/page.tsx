import { getLessonData, getAllLessonSlugs } from "@/lib/lessons";
import TitleBar from "@/components/TitleBar";
import SkillBar from "@/components/SkillBar";
import LessonPanel from "@/components/LessonPanel";
import RightColumn from "@/components/RightColumn";

export async function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonData(slug);

  // TODO: replace with live data from Supabase (PY-013)
  const progressData = {
    skillProgress: 33,
    skillNumber: 1,
    totalSkills: 3,
    streak: 4,
    totalXp: 120,
    paths: [
      { name: "Easy", state: "active" as const },
      { name: "Mid", state: "locked" as const },
      { name: "Hard", state: "locked" as const },
    ],
    lessonNumber: 1,
    totalLessons: 3,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <TitleBar
        skillProgress={progressData.skillProgress}
        skillNumber={progressData.skillNumber}
        totalSkills={progressData.totalSkills}
        streak={progressData.streak}
        totalXp={progressData.totalXp}
      />

      <SkillBar
        paths={progressData.paths}
        skillName={lesson.title.split("&")[0].trim()}
        lessonNumber={progressData.lessonNumber}
        totalLessons={progressData.totalLessons}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <LessonPanel
          title={lesson.title}
          contentHtml={lesson.contentHtml}
          keyConcept={lesson.keyConcept}
          xp={lesson.xp}
          skillProgress={progressData.skillProgress}
        />
        <RightColumn
          code={lesson.codeExample}
          starterCode={lesson.starterCode}
        />
      </div>
    </div>
  );
}
