import { concepts } from "@/lib/concepts";
import Link from "next/link";
import HeroReveal from "@/components/hero-reveal";

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
      <main className="flex w-full max-w-[1200px] flex-col items-center px-5" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        {/* Hero */}
        <HeroReveal className="flex flex-col items-center gap-3 text-center">
          {/* Eyebrow label — 13px/500/Mint Green/+0.05em/uppercase */}
          <div
            data-reveal
            className="inline-flex items-center gap-2 text-[13px] font-medium uppercase text-accent"
            style={{ letterSpacing: "0.05em" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Learn by teaching
          </div>

          {/* Display — 57px/600/1.1/-0.02em */}
          <h1
            data-reveal
            className="max-w-2xl font-semibold text-foreground"
            style={{ fontSize: "57px", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600 }}
          >
            Reverse Socratic
          </h1>

          {/* Subtext — 18px/400/1.5 */}
          <p
            data-reveal
            className="max-w-xl text-muted-foreground"
            style={{ fontSize: "18px", lineHeight: 1.5, fontWeight: 400 }}
          >
            The AI plays a confused student with real misconceptions. Your job? Teach it well enough
            to fix what it gets wrong. The best way to prove you understand something is to teach it
            to someone who doesn&apos;t.
          </p>

          {/* CTAs — 4px radius, Ink Black filled + ghost border */}
          <div data-reveal className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={`/teach/${concepts[0].id}`}
              className="rounded-[4px] bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{ boxShadow: "var(--shadow-button)" }}
            >
              Try the demo &rarr;
            </Link>
            <a
              href="https://github.com/DruxAMB/reverse-socratic"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[4px] border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View the code
            </a>
          </div>

          {/* Status indicators — 4px squares, NOT rounded-full */}
          <div
            data-reveal
            className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-8"
          >
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-[4px] bg-destructive" />
              AI holds wrong beliefs
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-[4px] bg-foreground/30" />
              You explain and correct
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-[4px] bg-accent" />
              Get scored on your teaching
            </span>
          </div>
        </HeroReveal>

        {/* Proof it works — 16px card radius, 24px padding, 0.05 shadow */}
        <div className="mt-16 w-full max-w-3xl">
          <div
            className="overflow-hidden rounded-[16px] border border-border bg-card"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/40" />
              <span className="ml-2 text-xs text-muted-foreground">
                reverse-socratic.vercel.app
              </span>
            </div>
            {/* Chat mockup — 24px padding */}
            <div className="flex gap-4" style={{ padding: "24px" }}>
              <div className="flex-1 space-y-3">
                {/* AI message — 16px card radius */}
                <div className="max-w-[80%] rounded-[16px] bg-muted px-4 py-3">
                  <div className="mb-1 text-xs font-medium text-muted-foreground">AI Student</div>
                  <p className="text-sm text-card-foreground">
                    But wait &mdash; I thought electrons orbit the nucleus like planets orbit the
                    sun? That&apos;s what every diagram shows.
                  </p>
                </div>
                {/* User message — 4px radius (button geometry), Ink Black fill */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-[4px] bg-primary px-4 py-3 text-primary-foreground">
                    <div className="mb-1 text-xs font-medium opacity-60">You</div>
                    <p className="text-sm">
                      Those diagrams are simplified. Electrons exist in probability clouds called
                      orbitals &mdash; you can never know exactly where one is, only where it&apos;s
                      likely to be.
                    </p>
                  </div>
                </div>
                <div className="max-w-[80%] rounded-[16px] bg-muted px-4 py-3">
                  <div className="mb-1 text-xs font-medium text-muted-foreground">AI Student</div>
                  <p className="text-sm text-card-foreground">
                    Probability clouds? So they&apos;re not in a fixed orbit at all? That changes
                    everything I thought I knew&hellip;
                  </p>
                </div>
              </div>
              {/* Badge panel — 16px card radius, 4px square indicators */}
              <aside className="hidden w-48 flex-col gap-2 border-l border-border pl-4 sm:flex">
                <div className="text-xs font-semibold text-card-foreground">Misconceptions</div>
                <div className="flex items-center gap-2 rounded-[16px] border border-accent/30 p-2" style={{ backgroundColor: "rgba(12, 140, 94, 0.06)" }}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-accent text-xs font-bold text-accent-foreground">
                    {"\u2713"}
                  </span>
                  <span className="text-xs text-muted-foreground">Planetary orbit</span>
                </div>
                <div className="flex items-center gap-2 rounded-[16px] border border-border p-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-destructive text-xs font-bold text-destructive-foreground">
                    !
                  </span>
                  <span className="text-xs text-muted-foreground">Speed = current</span>
                </div>
                <div className="flex items-center gap-2 rounded-[16px] border border-border p-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-destructive text-xs font-bold text-destructive-foreground">
                    !
                  </span>
                  <span className="text-xs text-muted-foreground">Nucleus is source</span>
                </div>
              </aside>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            A real interaction &mdash; the AI student pushes back, you correct it, badges flip.
          </p>
        </div>

        {/* Concept picker — 80px section gap */}
        <div className="w-full" style={{ marginTop: "80px" }}>
          <div className="flex items-baseline justify-between">
            {/* heading-sm — 24px/500/1.33 */}
            <h2 className="font-medium text-foreground" style={{ fontSize: "24px", lineHeight: 1.33, fontWeight: 500 }}>
              Pick a concept to teach
            </h2>
            <p className="text-sm text-muted-foreground">{concepts.length} topics available</p>
          </div>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Each concept has real misconceptions students commonly hold. Choose one and start
            teaching.
          </p>
          {/* 12px element gap */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {concepts.map((concept) => (
              <Link
                key={concept.id}
                href={`/teach/${concept.id}`}
                className="group flex flex-col gap-3 rounded-[16px] border border-border bg-card transition-all hover:border-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{ padding: "24px", boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl" aria-hidden="true">
                    {iconMap[concept.icon] ?? "\uD83D\uDCDA"}
                  </span>
                  {/* tag — 4px radius */}
                  <span className="rounded-[4px] bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {concept.category}
                  </span>
                </div>
                <div>
                  {/* subheading — 20px/600/1.3 */}
                  <h3 className="font-semibold text-card-foreground" style={{ fontSize: "20px", lineHeight: 1.3, fontWeight: 600 }}>
                    {concept.title}
                  </h3>
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

        {/* How it works — 80px section gap */}
        <div className="w-full" style={{ marginTop: "80px" }}>
          <h2 className="mb-8 font-medium text-foreground" style={{ fontSize: "24px", lineHeight: 1.33, fontWeight: 500 }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              {/* Step number — 4px radius, Ink Black fill */}
              <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-primary text-sm font-semibold text-primary-foreground">
                1
              </div>
              <h3 className="font-medium text-foreground">Pick a concept</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Choose from curated topics with real, documented misconceptions students hold.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-primary text-sm font-semibold text-primary-foreground">
                2
              </div>
              <h3 className="font-medium text-foreground">Teach the AI</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The AI student holds wrong beliefs and pushes back. Explain why they&apos;re wrong
                until it gets it.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {/* Step 3 — Mint Green for active/decorative icon (allowed by spec) */}
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
        <footer className="flex flex-col items-center gap-2 border-t border-border pt-8 text-center" style={{ marginTop: "80px" }}>
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
