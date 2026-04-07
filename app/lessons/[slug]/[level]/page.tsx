import { notFound } from "next/navigation";
import { getExercise, getAllExerciseParams } from "@/lib/exercises";
import ExerciseShell from "@/components/ExerciseShell";

export function generateStaticParams() {
  return getAllExerciseParams().map(({ slug, level }) => ({ slug, level }));
}

type PageProps = { params: Promise<{ slug: string; level: string }> };

export default async function ExercisePage({ params }: PageProps) {
  const { slug, level } = await params;

  let exercise;
  try {
    exercise = getExercise(slug, level);
  } catch {
    notFound();
  }

  return <ExerciseShell exercise={exercise!} />;
}
