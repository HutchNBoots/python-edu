import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "dragon.py",
  description: "Learn Python by building real things",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
