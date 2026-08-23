"use client";

import { useRef, useId } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register once at module top level (outside component) — Next.js App Router safe
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
 *
 * Initial state (opacity:0, y:24px) is set via inline style on server-rendered
 * HTML so there is no hydration mismatch or flash of unstyled content.
 * GSAP then animates TO opacity:1, y:0.
 */
export default function HeroReveal({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", containerRef.current);

      if (prefersReducedMotion || items.length === 0) {
        // Snap to final state — clear the CSS initial state
        gsap.set(items, { opacity: 1, y: 0, clearProps: "opacity,transform" });
        return;
      }

      // Animate from the CSS initial state (opacity:0, y:24px) to final
      gsap.fromTo(items, { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1,
        clearProps: "opacity,transform",
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
