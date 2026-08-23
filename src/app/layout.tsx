import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{`[data-reveal] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
