import { NextRequest } from "next/server";
import { getConcept } from "@/lib/concepts";
import { buildStudentSystemPrompt, streamGeminiChat, type ChatMessage } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { conceptId, conversation } = body as {
    conceptId: string;
    conversation: ChatMessage[];
  };

  if (!conceptId || !conversation) {
    return new Response(JSON.stringify({ error: "Missing conceptId or conversation" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const concept = getConcept(conceptId);
  if (!concept) {
    return new Response(JSON.stringify({ error: "Concept not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const systemPrompt = buildStudentSystemPrompt(concept);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamGeminiChat(systemPrompt, conversation)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Chat stream error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ text: "Hmm, I'm having trouble thinking right now. Can you try again?" })}\n\n`
          )
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
