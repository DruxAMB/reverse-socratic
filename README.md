# Reverse Socratic

> Learn by teaching an AI that's wrong on purpose.

Reverse Socratic flips the AI tutor on its head. Instead of the AI teaching you, **you teach the AI** — but the AI plays a confused student who holds real, documented misconceptions. Your job is to explain the concept well enough to correct those wrong beliefs. An evaluator agent then scores your teaching.

## Why this works

The [Feynman technique](https://en.wikipedia.org/wiki/Feynman_technique) — learning by teaching — is one of the most effective study methods. But teaching a passive listener doesn't test understanding. Teaching someone who *actively resists with a specific wrong belief* forces you to explain *why* the misconception is wrong, not just recite the correct answer. That's what Reverse Socratic does.

## How it works

1. **Pick a concept** — choose from curated topics (electricity, photosynthesis, natural selection, why the sky is blue, seasons), each with 2-3 real misconceptions students commonly hold.
2. **Teach the AI student** — the AI opens by stating its wrong belief. You explain why it's wrong. The AI pushes back 1-2 times with genuine confusion until your explanation is clear and specific enough to actually dismantle the misconception.
3. **Get scored** — an evaluator AI reads the conversation and determines which misconceptions were *actually corrected* (not just mentioned). You get a teaching score (0-100) with specific feedback on what worked and what to improve.

## The AI architecture

Two distinct AI agents run in concert — this is not a single chat-completion wrapper:

- **The confused student** (Gemini Flash, streaming) — initialized with a system prompt encoding the concept's misconceptions and a "resist until taught properly" behavior. It pushes back against shallow explanations, accepts corrections only when they address the root of the wrong belief, and speaks like a real student.
- **The evaluator** (Gemini Flash, JSON structured output) — reads the full conversation and uses a response schema to return per-misconception verdicts (cleared/not cleared + reasoning), an overall score, strengths, and improvements. It distinguishes "mentioned the misconception" from "actually corrected it."

Both agents use Google's Gemini 3.6 Flash model via the Generative Language API.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** with a semantic token system adapted from the [Duolingo design system](https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350)
- **Google Gemini 3.6 Flash** for both AI agents
- **GSAP** for hero animations and animated concept icons
- **Thinking Orbs** (`thinking-orbs`) for AI agent status indicators
- **Vercel** for deployment
- No database, no auth — the app is stateless and session-based

## Design

The visual system is adapted from [Duolingo's design language](https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350) via Refero Styles:

- **Nunito** font (rounded geometric sans, open via Google Fonts)
- Saturated green accent (#5cc700) — reads as "correct answer," maps to the misconception badge mechanic
- 12px border radius on buttons/inputs, 16px on cards
- 2px borders on all interactive elements (sticker-like feel)
- Animated SVG concept icons (GSAP-powered): lightning bolt, leaf, DNA helix, wind/cloud, sun
- Thinking Orbs on AI messages: "working" while streaming, "breathing" when idle, "searching" while thinking, "listening" when user types, "solving" during evaluation

## Getting started

```bash
# Clone the repo
git clone https://github.com/DruxAMB/reverse-socratic.git
cd reverse-socratic

# Install dependencies
npm install

# Set up your Gemini API key (get one at https://aistudio.google.com/apikey)
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # SSE streaming endpoint for the confused student
│   │   └── evaluate/route.ts      # JSON structured-output endpoint for the evaluator
│   ├── teach/[conceptId]/
│   │   ├── page.tsx               # Server component — loads concept, renders teaching view
│   │   └── teaching-view.tsx      # Client component — chat UI, orbs, badges, results modal
│   ├── globals.css                # Semantic token layer (Duolingo-derived)
│   ├── layout.tsx                 # Root layout, Nunito font, metadata
│   └── page.tsx                   # Landing page with hero + animated concept picker
├── components/
│   └── animated-concept-icon.tsx  # GSAP-animated SVG icons (bolt, leaf, dna, sky, sun)
├── lib/
│   ├── concepts.ts                # Seed data: 5 concepts with 15 misconceptions
│   └── gemini.ts                  # Gemini client, system prompts, streaming, evaluation
```

## Concepts and misconceptions

Each concept has 2-3 carefully researched misconceptions drawn from science education literature:

| Concept | Misconceptions |
|---|---|
| How Electricity Works | Planetary orbit model · Speed = current · Nucleus is the source |
| Photosynthesis | Plants eat soil · Oxygen comes from CO2 · Plants don't respire |
| Natural Selection | Organisms evolve what they want · Survival of the strongest · Evolution has a goal |
| Why the Sky Is Blue | Sky reflects the ocean · Air absorbs other colors · The sky is inherently blue |
| Why We Have Seasons | Distance from the sun · Whole Earth has same season · Tilt means closer to sun |

## Demo

- **Live demo:** [https://reverse-socratic.druxamb.dev](https://reverse-socratic.druxamb.dev)
- **Demo video:** [https://youtu.be/zcSliSmhdUk](https://youtu.be/zcSliSmhdUk)

## Built for

The Prometheus August AI Challenge — an educational AI/ML hackathon.

## License

MIT — see [LICENSE](LICENSE)

## Third-party licences

- **GSAP** (`gsap`, `@gsap/react`) — GreenSock standard "no charge" licence. Free for commercial use including all formerly Club-only plugins (SplitText, ScrollTrigger, etc.). Not MIT; the GSAP licence covers the library, not this project's source.
- **Thinking Orbs** (`thinking-orbs`) — MIT
- **Next.js** — MIT
- **Tailwind CSS** — MIT
- **React** — MIT
- **Nunito** (Google Fonts) — SIL Open Font License

## Acknowledgments

- Design system adapted from [Duolingo](https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350) via Refero Styles
- AI status indicators by [Thinking Orbs](https://orbs.jakubantalik.com/) by Jakub Antalik
- AI powered by [Google Gemini](https://ai.google.dev/)
- Built with [Next.js](https://nextjs.org/) and deployed on [Vercel](https://vercel.com/)
