interface LessonBodyProps {
  contentHtml: string;
}

export default function LessonBody({ contentHtml }: LessonBodyProps) {
  return (
    <div
      className="prose prose-gray max-w-none mb-8 text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
