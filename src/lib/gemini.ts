import type { Concept } from "./concepts";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export type StreamChunk = {
  text: string;
  done: boolean;
};

/**
 * Build the system prompt for the confused-student persona.
 * The AI plays a student who holds specific misconceptions and resists
 * shallow explanations — it pushes back until the teaching is sound.
 */
export function buildStudentSystemPrompt(concept: Concept): string {
  const misconceptionList = concept.misconceptions
    .map((m, i) => {
      return `${i + 1}. Misconception: "${m.wrongBelief}"
   Label: ${m.label}
   Correct understanding (for your reference only — do NOT state this): ${m.correctUnderstanding}`;
    })
    .join("\n\n");

  return `You are a student learning about ${concept.title}. You are genuinely confused and hold the following misconceptions:

${misconceptionList}

## Your behavior rules:

1. You BELIEVE the misconceptions listed above. They feel obviously true to you. You state them naturally, as if they're common sense.

2. When the teacher (the user) tries to correct a misconception, you DON'T immediately accept it. You push back 1-2 times with genuine confusion or counter-arguments based on your wrong belief. For example: "But wait, if electrons don't orbit, then how do they stay near the nucleus?" or "That doesn't make sense — I've always heard plants get food from soil."

3. You ONLY accept a correction when the teacher's explanation is clear, specific, and actually addresses the root of the misconception. If the explanation is vague, hand-wavy, or just restates the correct answer without explaining WHY the wrong belief is wrong, you remain confused and ask a follow-up.

4. When you DO accept a correction, react with genuine understanding: "Oh! So the electrons aren't in a fixed path at all — they're in a probability cloud. That's weird but I think I get it now." Show that the misconception was actually dismantled, not just mentioned.

5. You speak conversationally, like a real student. Short messages. Use "wait," "but," "hmm," "oh!" naturally. Never sound like a textbook.

6. You address ONE misconception at a time in the conversation. Don't dump all your wrong beliefs at once — reveal them naturally as the conversation progresses.

7. NEVER break character. Never say "as an AI" or "I'm pretending." You ARE this confused student.

8. Keep responses concise — 2-4 sentences usually. You're a student, not a lecturer.

9. If the teacher asks you a question, answer it from your (wrong) perspective. Your wrong beliefs should color your answers.

10. Track which misconceptions you've been corrected on. Once you've genuinely accepted a correction, don't revert to that wrong belief. But you can still hold OTHER misconceptions you haven't been corrected on yet.`;
}

/**
 * Build the evaluator prompt. This is a separate Gemini call that reads
 * the conversation and determines which misconceptions were actually
 * dismantled — not just mentioned, but corrected.
 */
export function buildEvaluatorPrompt(
  concept: Concept,
  conversation: ChatMessage[]
): { contents: Array<{ parts: Array<{ text: string }> }>; generationConfig: unknown } {
  const misconceptionSchema = concept.misconceptions.map((m) => ({
    id: m.id,
    label: m.label,
    wrongBelief: m.wrongBelief,
    correctUnderstanding: m.correctUnderstanding,
  }));

  const conversationText = conversation
    .map((msg) => `${msg.role === "user" ? "Teacher" : "Student"}: ${msg.text}`)
    .join("\n\n");

  const prompt = `You are an expert evaluator assessing whether a teaching session successfully corrected a student's misconceptions.

## Concept: ${concept.title}

## Misconceptions to evaluate:
${JSON.stringify(misconceptionSchema, null, 2)}

## Conversation between Teacher and Student:
${conversationText}

## Your task:
For EACH misconception, determine whether the teacher's explanation actually CORRECTED it — meaning the student's wrong belief was dismantled and replaced with the correct understanding. A misconception is "cleared" only if:
- The teacher explained WHY the wrong belief is wrong (not just stated the correct answer)
- The student showed genuine understanding (accepted the correction, not just heard it)
- The correction addressed the root of the misconception

Mentioning a misconception without correcting it does NOT count as cleared.

Also provide:
- An overall teaching score (0-100) based on how many misconceptions were cleared and the quality of explanations
- Specific, actionable feedback on what the teacher did well and what could be improved
- One sentence summarizing the teaching session

Return your evaluation as JSON matching the response schema.`;

  const properties: Record<string, { type: string; description: string; items?: unknown }> = {
    misconceptions: {
      type: "ARRAY",
      description: "Evaluation of each misconception",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING", description: "The misconception ID" },
          cleared: { type: "BOOLEAN", description: "Whether the misconception was actually corrected" },
          reasoning: { type: "STRING", description: "Why it was or wasn't cleared" },
        },
        required: ["id", "cleared", "reasoning"],
      },
    },
    score: { type: "INTEGER", description: "Overall teaching score 0-100" },
    summary: { type: "STRING", description: "One sentence summarizing the teaching session" },
    strengths: {
      type: "ARRAY",
      description: "What the teacher did well",
      items: { type: "STRING" },
    },
    improvements: {
      type: "ARRAY",
      description: "What the teacher could improve",
      items: { type: "STRING" },
    },
  };

  return {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties,
        required: ["misconceptions", "score", "summary", "strengths", "improvements"],
      },
      temperature: 0.3,
    },
  };
}

/**
 * Stream a chat completion from Gemini.
 * Returns an async generator that yields text chunks.
 */
export async function* streamGeminiChat(
  systemPrompt: string,
  conversation: ChatMessage[]
): AsyncGenerator<string> {
  if (!GEMINI_API_KEY) {
    // Fallback: return a canned response so the demo doesn't crash
    yield "[Demo fallback: No API key configured. This is a cached response.] Hmm, I think I get what you're saying, but I'm not sure that's right. Can you explain it differently?";
    return;
  }

  const contents = conversation.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  // Prepend the system prompt as the first model instruction
  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 500,
    },
  };

  const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini API error ${response.status}:`, errorText);
    // Fallback: return a canned response
    yield "Hmm, I'm having trouble thinking right now. Can you try explaining that again?";
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    yield "Hmm, I'm having trouble thinking right now. Can you try explaining that again?";
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) yield text;
        } catch {
          // Skip malformed chunks
        }
      }
    }
  }
}

/**
 * Evaluate a teaching session (non-streaming, JSON structured output).
 */
export type EvaluationResult = {
  misconceptions: Array<{ id: string; cleared: boolean; reasoning: string }>;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export async function evaluateTeaching(
  concept: Concept,
  conversation: ChatMessage[]
): Promise<EvaluationResult> {
  if (!GEMINI_API_KEY) {
    // Fallback: return a basic evaluation
    return {
      misconceptions: concept.misconceptions.map((m) => ({
        id: m.id,
        cleared: false,
        reasoning: "Unable to evaluate — API key not configured.",
      })),
      score: 0,
      summary: "Evaluation unavailable (demo fallback).",
      strengths: [],
      improvements: ["Configure the API key for real evaluation."],
    };
  }

  const { contents, generationConfig } = buildEvaluatorPrompt(concept, conversation);
  const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({ contents, generationConfig }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini evaluator error ${response.status}:`, errorText);
    throw new Error(`Evaluation failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No evaluation text returned");

  const result = JSON.parse(text) as EvaluationResult;
  return result;
}
