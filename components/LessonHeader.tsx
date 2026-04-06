interface LessonHeaderProps {
  title: string;
}

export default function LessonHeader({ title }: LessonHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
    </header>
  );
}
