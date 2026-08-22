"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Concept, Misconception } from "@/lib/concepts";
import type { EvaluationResult } from "@/lib/gemini";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

type BadgeState = "red" | "green";

export default function TeachingView({ concept }: { concept: Concept }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "opening",
      role: "model",
      text: concept.openingLine,
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [badgeStates, setBadgeStates] = useState<Record<string, BadgeState>>(
    Object.fromEntries(concept.misconceptions.map((m) => [m.id, "red"]))
  );
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    // Build conversation for API (role mapping: user -> user, model -> model)
    const conversation = newMessages.map((m) => ({ role: m.role, text: m.text }));

    const aiMessageId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: aiMessageId, role: "model", text: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId: concept.id, conversation }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      if (reader) {
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
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === aiMessageId ? { ...m, text: fullText } : m))
                  );
                }
              } catch {
                // skip
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Send message error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId
            ? { ...m, text: "Hmm, I'm having trouble right now. Can you try explaining again?" }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }, [input, isStreaming, messages, concept.id]);

  const runEvaluation = useCallback(async () => {
    setIsEvaluating(true);
    try {
      const conversation = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId: concept.id, conversation }),
      });
      const result = await response.json();
      setEvaluation(result);

      // Update badge states based on evaluation
      if (result.misconceptions) {
        setBadgeStates((prev) => {
          const updated = { ...prev };
          for (const m of result.misconceptions) {
            if (m.cleared) updated[m.id] = "green";
          }
          return updated;
        });
      }
      setShowResults(true);
    } catch (error) {
      console.error("Evaluation error:", error);
    } finally {
      setIsEvaluating(false);
    }
  }, [messages, concept.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearedCount = Object.values(badgeStates).filter((s) => s === "green").length;
  const totalCount = concept.misconceptions.length;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; All concepts
          </Link>
          <span className="text-border">|</span>
          <h1 className="font-semibold text-foreground">{concept.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground tabular-nums">{clearedCount}</span>
          <span className="text-muted-foreground">/ {totalCount} corrected</span>
          {clearedCount === totalCount && (
            <span className="rounded-[4px] bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              All clear
            </span>
          )}
        </div>
      </header>

      {/* Mobile badge summary */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2 sm:hidden">
        {concept.misconceptions.map((m) => (
          <span
            key={m.id}
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{
              backgroundColor: badgeStates[m.id] === "green" ? "var(--success)" : "var(--destructive)",
            }}
          >
            {badgeStates[m.id] === "green" ? "\u2713" : "!"}
          </span>
        ))}
        <span className="ml-1 text-xs text-muted-foreground">
          {clearedCount}/{totalCount} corrected
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-[16px] px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-card-foreground"
                    }`}
                  >
                    <div className="mb-1 text-xs font-medium opacity-60">
                      {message.role === "user" ? "You" : "AI Student"}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.text}
                      {message.role === "model" && isStreaming && message.id === messages[messages.length - 1]?.id && (
                        <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-current align-middle" />
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-border px-6 py-4">
            <div className="mx-auto flex max-w-2xl flex-col gap-3">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Explain the concept to your AI student..."
                  rows={2}
                  disabled={isStreaming || showResults}
                  className="flex-1 resize-none rounded-[4px] border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Press Enter to send, Shift+Enter for new line
                </p>
                <div className="flex gap-2">
                  {!showResults && (
                    <button
                      onClick={runEvaluation}
                      disabled={isEvaluating || messages.length < 3 || isStreaming}
                      className="flex items-center gap-2 rounded-[4px] border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      {isEvaluating && (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
                      )}
                      {isEvaluating ? "Evaluating..." : "End & evaluate"}
                    </button>
                  )}
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isStreaming || showResults}
                    className="rounded-[4px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                  >
                    {isStreaming ? "Teaching..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Misconception state panel */}
        <aside className="hidden w-72 flex-col border-l border-border bg-card py-6 sm:flex">
          <div className="px-5">
            <h2 className="text-sm font-semibold text-card-foreground">Misconception State</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              These are the wrong beliefs your AI student holds. Turn them all green.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-3 px-5">
            {concept.misconceptions.map((m: Misconception) => (
              <div
                key={m.id}
                className="rounded-[16px] border border-border p-3 transition-colors"
                style={{
                  borderColor: badgeStates[m.id] === "green" ? "var(--success)" : undefined,
                  backgroundColor:
                    badgeStates[m.id] === "green" ? "color-mix(in srgb, var(--success) 8%, transparent)" : undefined,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      backgroundColor:
                        badgeStates[m.id] === "green" ? "var(--success)" : "var(--destructive)",
                    }}
                  >
                    {badgeStates[m.id] === "green" ? "\u2713" : "!"}
                  </span>
                  <span className="text-sm font-medium text-card-foreground">{m.label}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {badgeStates[m.id] === "green"
                    ? "Corrected \u2014 the student gets it now."
                    : "Still held by the student."}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Evaluation loading overlay */}
      {isEvaluating && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-3 rounded-[16px] bg-card p-8 shadow-[0_4px_8px_0_rgba(0,0,0,0.05)]">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
            <p className="text-sm font-medium text-card-foreground">Evaluating your teaching...</p>
          </div>
        </div>
      )}

      {/* Results modal */}
      {showResults && evaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[16px] bg-card p-6 shadow-[0_4px_8px_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-card-foreground">Teaching Score</h2>
              <button
                onClick={() => setShowResults(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {"\u2715"}
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[16px] border-4 border-foreground/20">
                <span className="text-2xl font-bold tabular-nums text-foreground">{evaluation.score}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">out of 100</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {evaluation.misconceptions?.filter((m) => m.cleared).length ?? 0} of{" "}
                  {concept.misconceptions.length} misconceptions cleared
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-card-foreground">{evaluation.summary}</p>

            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-success">What you did well</h3>
                <ul className="mt-2 flex flex-col gap-1">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-success">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.improvements && evaluation.improvements.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-destructive">To improve</h3>
                <ul className="mt-2 flex flex-col gap-1">
                  {evaluation.improvements.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-destructive">-</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Link
                href="/"
                className="flex-1 rounded-[4px] border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Try another concept
              </Link>
              <button
                onClick={() => {
                  setShowResults(false);
                  setMessages([{ id: "opening", role: "model", text: concept.openingLine }]);
                  setBadgeStates(Object.fromEntries(concept.misconceptions.map((m) => [m.id, "red"])));
                  setEvaluation(null);
                }}
                className="flex-1 rounded-[4px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
