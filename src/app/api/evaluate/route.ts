import { NextRequest } from "next/server";
import { getConcept } from "@/lib/concepts";
import { evaluateTeaching, type ChatMessage } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { conceptId, conversation } = body as {
    conceptId: string;
    conversation: ChatMessage[];
  };

  if (!conceptId || !conversation) {
    return Response.json({ error: "Missing conceptId or conversation" }, { status: 400 });
  }

  const concept = getConcept(conceptId);
  if (!concept) {
    return Response.json({ error: "Concept not found" }, { status: 404 });
  }

  try {
    const result = await evaluateTeaching(concept, conversation);
    return Response.json(result);
  } catch (error) {
    console.error("Evaluation error:", error);
    return Response.json(
      {
        error: "Evaluation failed. Please try again.",
        misconceptions: concept.misconceptions.map((m) => ({
          id: m.id,
          cleared: false,
          reasoning: "Unable to evaluate.",
        })),
        score: 0,
        summary: "Evaluation unavailable.",
        strengths: [],
        improvements: ["Please try evaluating again."],
      },
      { status: 500 }
    );
  }
}
