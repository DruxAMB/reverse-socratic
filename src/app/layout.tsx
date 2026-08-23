import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reverse Socratic — Learn by teaching an AI that's wrong on purpose",
  description:
    "The best way to learn is to teach. Reverse Socratic gives you an AI student with real misconceptions — can you correct them?",
  openGraph: {
    title: "Reverse Socratic — Learn by teaching an AI",
    description:
      "The AI plays a confused student with real misconceptions. Your job? Teach it well enough to fix what it gets wrong.",
    url: "https://reverse-socratic.vercel.app",
    siteName: "Reverse Socratic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reverse Socratic — Learn by teaching an AI",
    description:
      "The AI plays a confused student with real misconceptions. Your job? Teach it well enough to fix what it gets wrong.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
