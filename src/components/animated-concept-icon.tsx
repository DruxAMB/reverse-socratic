"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

type IconName = "bolt" | "leaf" | "dna" | "sky" | "sun";

const COLORS = {
  primary: "#5cc700",
  primaryDim: "#3d8a00",
  accent: "#1cb0f6",
  accentDim: "#0e7ab3",
  warm: "#f5a623",
};

export function AnimatedConceptIcon({ name, size = 48 }: { name: IconName; size?: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      switch (name) {
        case "bolt":
          gsap.to(svg.querySelector("[data-bolt]"), {
            scale: 1.15,
            transformOrigin: "center",
            duration: 0.15,
            repeat: -1,
            repeatDelay: 1.5,
            yoyo: true,
            yoyoEase: "power2.out",
            ease: "power2.in",
          });
          gsap.to(svg.querySelector("[data-glow]"), {
            opacity: 0.8,
            duration: 0.15,
            repeat: -1,
            repeatDelay: 1.5,
            yoyo: true,
            ease: "none",
          });
          break;

        case "leaf":
          gsap.to(svg.querySelector("[data-leaf]"), {
            rotation: 8,
            transformOrigin: "bottom left",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          gsap.to(svg.querySelector("[data-vein]"), {
            scale: 1,
            transformOrigin: "bottom left",
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          break;

        case "dna": {
          const strands = svg.querySelectorAll("[data-strand]");
          strands.forEach((strand, i) => {
            gsap.to(strand, {
              rotation: 360,
              transformOrigin: "center",
              duration: 6,
              repeat: -1,
              ease: "none",
              delay: i * 0.1,
            });
          });
          gsap.to(svg, {
            y: -2,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          break;
        }

        case "sky":
          gsap.to(svg.querySelector("[data-wind-1]"), {
            x: 6,
            opacity: 0.3,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          gsap.to(svg.querySelector("[data-wind-2]"), {
            x: 8,
            opacity: 0.3,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.3,
          });
          gsap.to(svg.querySelector("[data-wind-3]"), {
            x: 5,
            opacity: 0.3,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.6,
          });
          gsap.to(svg.querySelector("[data-cloud]"), {
            x: 3,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          break;

        case "sun":
          gsap.to(svg.querySelector("[data-rays]"), {
            rotation: 360,
            transformOrigin: "center",
            duration: 20,
            repeat: -1,
            ease: "none",
          });
          gsap.to(svg.querySelector("[data-core]"), {
            scale: 1.1,
            transformOrigin: "center",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          break;
      }
    }, svg);

    return () => ctx.revert();
  }, [name]);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {name === "bolt" && (
        <>
          <circle data-glow cx="24" cy="24" r="20" fill={COLORS.primary} opacity="0.15" />
          <path
            data-bolt
            d="M26 6 L14 26 H22 L20 42 L34 20 H26 L26 6 Z"
            fill={COLORS.primary}
            stroke={COLORS.primaryDim}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </>
      )}

      {name === "leaf" && (
        <>
          <path
            data-leaf
            d="M10 38 C10 20 22 10 38 10 C38 28 26 38 10 38 Z"
            fill={COLORS.primary}
            stroke={COLORS.primaryDim}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            data-vein
            d="M10 38 L38 10"
            stroke={COLORS.primaryDim}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M16 32 L24 24 M20 34 L28 26 M12 28 L18 22"
            stroke={COLORS.primaryDim}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
        </>
      )}

      {name === "dna" && (
        <>
          <g data-strand>
            <path
              d="M16 6 C32 14 16 22 32 30 C16 38 32 42 16 42"
              stroke={COLORS.primary}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
          <g>
            <path
              d="M32 6 C16 14 32 22 16 30 C32 38 16 42 32 42"
              stroke={COLORS.accent}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
          <line x1="14" y1="12" x2="34" y2="12" stroke={COLORS.primaryDim} strokeWidth="1.5" opacity="0.5" />
          <line x1="14" y1="24" x2="34" y2="24" stroke={COLORS.primaryDim} strokeWidth="1.5" opacity="0.5" />
          <line x1="14" y1="36" x2="34" y2="36" stroke={COLORS.primaryDim} strokeWidth="1.5" opacity="0.5" />
        </>
      )}

      {name === "sky" && (
        <>
          <path
            data-cloud
            d="M12 28 C8 28 6 25 6 22 C6 18 9 16 13 16 C14 11 18 8 23 8 C29 8 33 12 33 18 C37 18 40 20 40 24 C40 27 38 28 35 28 H12 Z"
            fill={COLORS.accent}
            opacity="0.2"
            stroke={COLORS.accent}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path data-wind-1 d="M10 34 H28" stroke={COLORS.accent} strokeWidth="2.5" strokeLinecap="round" />
          <path data-wind-2 d="M14 40 H34" stroke={COLORS.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path data-wind-3 d="M8 44 H22" stroke={COLORS.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        </>
      )}

      {name === "sun" && (
        <>
          <g data-rays>
            <line x1="24" y1="4" x2="24" y2="10" stroke={COLORS.warm} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="38" x2="24" y2="44" stroke={COLORS.warm} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="4" y1="24" x2="10" y2="24" stroke={COLORS.warm} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="38" y1="24" x2="44" y2="24" stroke={COLORS.warm} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="10" y1="10" x2="14" y2="14" stroke={COLORS.warm} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="34" y1="34" x2="38" y2="38" stroke={COLORS.warm} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="38" y1="10" x2="34" y2="14" stroke={COLORS.warm} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="14" y1="34" x2="10" y2="38" stroke={COLORS.warm} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <circle
            data-core
            cx="24"
            cy="24"
            r="9"
            fill={COLORS.warm}
            stroke={COLORS.primaryDim}
            strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  );
}
