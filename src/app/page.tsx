import { concepts } from "@/lib/concepts";
import Link from "next/link";

const iconMap: Record<string, string> = {
  bolt: "\u26A1",
  leaf: "\uD83C\uDF3F",
  dna: "\uD83E\uDCEC",
  sky: "\uD83C\uDF2C\uFE0F",
  sun: "\u2600\uFE0F",
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-background">
      <main className="flex w-full max-w-[1120px] flex-col items-center px-5 py-20">
        {/* Hero */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-[4px] border border-border bg-muted px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            LEARN BY TEACHING
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            Reverse Socratic
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            The AI plays a confused student with real misconceptions. Your job? Teach it well enough
            to fix what it gets wrong. The best way to prove you understand something is to teach it
            to someone who doesn&apos;t.
          </p>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              AI holds wrong beliefs
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-foreground/30" />
              You explain and correct
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              Get scored on your teaching
            </span>
          </div>
        </div>

        {/* Concept picker */}
        <div className="mt-20 w-full">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-foreground">Pick a concept to teach</h2>
            <p className="text-sm text-muted-foreground">{concepts.length} topics available</p>
          </div>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Each concept has real misconceptions students commonly hold. Choose one and start
            teaching.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {concepts.map((concept) => (
              <Link
                key={concept.id}
                href={`/teach/${concept.id}`}
                className="group flex flex-col gap-3 rounded-[16px] border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{iconMap[concept.icon] ?? "\uD83D\uDCDA"}</span>
                  <span className="rounded-[4px] bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {concept.category}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{concept.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{concept.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors group-hover:text-foreground">
                  {concept.misconceptions.length} misconceptions to correct
                  <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24 w-full">
          <h2 className="mb-8 text-lg font-semibold text-foreground">How it works</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-foreground text-sm font-semibold text-background">
                1
              </div>
              <h3 className="font-medium text-foreground">Pick a concept</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Choose from curated topics with real, documented misconceptions students hold.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-foreground text-sm font-semibold text-background">
                2
              </div>
              <h3 className="font-medium text-foreground">Teach the AI</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The AI student holds wrong beliefs and pushes back. Explain why they&apos;re wrong
                until it gets it.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-accent text-sm font-semibold text-accent-foreground">
                3
              </div>
              <h3 className="font-medium text-foreground">Get scored</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                An evaluator AI assesses whether your teaching actually fixed the misconceptions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 flex flex-col items-center gap-2 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Built for the Prometheus August AI Challenge
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Next.js + Gemini</span>
            <span className="text-border">|</span>
            <span>Powered by AI agents</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
