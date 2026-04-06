import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Learn Python 🐍</h1>
      <p className="text-lg text-gray-600 mb-8">
        Build real stuff while learning to code. Let&apos;s go!
      </p>
      <Link
        href="/lessons/variables"
        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        Start with Variables →
      </Link>
    </main>
  );
}
