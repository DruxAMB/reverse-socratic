"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register once at module top level (outside component) — Next.js App Router safe
// Guard for window (ScrollTrigger touches window, but we're not using it here)
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Staggered fade-up on load — documented GSAP recipe.
 * Animates opacity and transform only (never layout properties).
 * Honours prefers-reduced-motion: sets elements to final state immediately.
 */
export default function HeroReveal({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", containerRef.current);

      if (prefersReducedMotion || items.length === 0) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      // Start state — server HTML must match this (set via inline style)
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
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
