import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pipelined — Job Application Tracker",
  description: "Track job applications, score resumes with AI, and prepare for interviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${geist.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
