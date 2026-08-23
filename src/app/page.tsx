"use client";

import { useState, useRef } from "react";
import { concepts } from "@/lib/concepts";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatedConceptIcon } from "@/components/animated-concept-icon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const iconNames = ["bolt", "leaf", "dna", "sky", "sun"] as const;

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", heroRef.current);

      if (prefersReducedMotion || items.length === 0) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 24 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1,
      });
    },
    { scope: heroRef }
  );

  const handleTryDemo = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    // Animate hero out, then render picker and animate it in
    const heroItems = gsap.utils.toArray<HTMLElement>("[data-reveal]", heroRef.current);
    gsap.to(heroItems, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.04,
      onComplete: () => {
        setRevealed(true);
        requestAnimationFrame(() => {
          const pickerItems = gsap.utils.toArray<HTMLElement>(
            "[data-picker-item]",
            pickerRef.current
          );
          gsap.set(pickerItems, { opacity: 0, y: 32 });
          gsap.to(pickerItems, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.06,
            delay: 0.1,
          });
        });
      },
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Hero — fills the viewport, no scroll. Hides when picker is revealed. */}
      {!revealed && (
        <section
          ref={heroRef}
          className="flex h-[100dvh] flex-col items-center justify-center px-5"
        >
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            data-reveal
            className="inline-flex items-center gap-2 rounded-[12px] border-2 border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-wide text-primary"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            LEARN BY TEACHING
          </div>
          <h1
            data-reveal
            className="max-w-2xl text-5xl font-extrabold leading-[1.2] tracking-tight text-foreground sm:text-7xl"
          >
            Reverse Socratic
          </h1>
          <p
            data-reveal
            className="max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            The AI plays a confused student with real misconceptions. Your job? Teach it well enough
            to fix what it gets wrong. The best way to prove you understand something is to teach it
            to someone who doesn&apos;t.
          </p>
          <div data-reveal className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={handleTryDemo}
              className="rounded-[12px] border-2 border-primary bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0.5"
            >
              Try the demo &rarr;
            </button>
            <a
              href="https://github.com/DruxAMB/reverse-socratic"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[12px] border-2 border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-all hover:border-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0.5"
            >
              View the code
            </a>
          </div>
          <div
            data-reveal
            className="mt-2 flex flex-col gap-3 text-sm font-semibold text-muted-foreground sm:flex-row sm:gap-8"
          >
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-destructive bg-destructive/20" />
              AI holds wrong beliefs
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-foreground/30 bg-foreground/10" />
              You explain and correct
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-success bg-success/20" />
              Get scored on your teaching
            </span>
          </div>
        </div>
      </section>
      )}

      {/* Concept picker — hidden until "Try demo" is clicked, then animates in */}
      {revealed && (
        <section ref={pickerRef} className="flex flex-col items-center px-5 py-20">
          <div className="w-full max-w-[1120px]">
            <div data-picker-item className="flex items-baseline justify-between">
              <h2 className="text-2xl font-extrabold text-foreground">Pick a concept to teach</h2>
              <p className="text-sm font-semibold text-muted-foreground">
                {concepts.length} topics available
              </p>
            </div>
            <p data-picker-item className="mb-6 mt-1 text-sm text-muted-foreground">
              Each concept has real misconceptions students commonly hold. Choose one and start
              teaching.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {concepts.map((concept) => (
                <Link
                  key={concept.id}
                  data-picker-item
                  href={`/teach/${concept.id}`}
                  className="group relative flex flex-col gap-3 overflow-visible rounded-[16px] border-2 border-border bg-card p-5 pt-8 transition-all hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0.5"
                >
                  <div className="absolute -top-6 -right-3 h-24 w-24">
                    <AnimatedConceptIcon
                      name={concept.icon as typeof iconNames[number]}
                      size={96}
                    />
                  </div>
                  <span className="w-fit rounded-[12px] border-2 border-border bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                    {concept.category}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">{concept.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{concept.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-primary transition-transform group-hover:translate-x-0.5">
                    {concept.misconceptions.length} misconceptions to correct
                    <span>&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* How it works */}
            <div className="mt-24">
              <h2 data-picker-item className="mb-8 text-2xl font-extrabold text-foreground">
                How it works
              </h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div data-picker-item className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border-2 border-foreground bg-foreground text-lg font-extrabold text-background">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Pick a concept</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Choose from curated topics with real, documented misconceptions students hold.
                  </p>
                </div>
                <div data-picker-item className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border-2 border-foreground bg-foreground text-lg font-extrabold text-background">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Teach the AI</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The AI student holds wrong beliefs and pushes back. Explain why they&apos;re
                    wrong until it gets it.
                  </p>
                </div>
                <div data-picker-item className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border-2 border-primary bg-primary text-lg font-extrabold text-primary-foreground">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Get scored</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    An evaluator AI assesses whether your teaching actually fixed the
                    misconceptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer data-picker-item className="mt-24 flex flex-col items-center gap-2 border-t-2 border-border pt-8 text-center">
              <p className="text-sm font-semibold text-muted-foreground">
                Built for the Prometheus August AI Challenge
              </p>
              <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                <span>Next.js + Gemini</span>
                <span className="text-border">|</span>
                <span>Powered by AI agents</span>
              </div>
            </footer>
          </div>
        </section>
      )}
    </div>
  );
}
