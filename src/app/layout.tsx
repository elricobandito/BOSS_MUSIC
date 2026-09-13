import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "BOSS_MUSIC — Human-made music marketplace",
  description:
    "A marketplace where artists sell their own music and every song is rated for how human-made it is.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-white antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">{children}</main>
      </body>
    </html>
  );
}
