import Link from "next/link";

interface TryItButtonProps {
  slug: string;
}

export default function TryItButton({ slug }: TryItButtonProps) {
  return (
    <Link
      href={`/exercises/${slug}`}
      className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors"
    >
      Try it →
    </Link>
  );
}
