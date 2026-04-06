import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Python",
  description: "Learn Python by building real things",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-w-[320px]">{children}</body>
    </html>
  );
}
