import { getLessonData, getAllLessonSlugs } from "@/lib/lessons";
import LessonHeader from "@/components/LessonHeader";
import LessonBody from "@/components/LessonBody";
import CodeExample from "@/components/CodeExample";
import TryItButton from "@/components/TryItButton";

export async function generateStaticParams() {
  const slugs = getAllLessonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonData(slug);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 min-w-[320px]">
      <LessonHeader title={lesson.title} />
      <LessonBody contentHtml={lesson.contentHtml} />
      <CodeExample code={lesson.codeExample} />
      <TryItButton slug={slug} />
    </main>
  );
}
