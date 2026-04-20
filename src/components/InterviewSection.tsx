"use client";

import { useEffect, useState } from "react";

interface InterviewSectionProps {
  applicationId: string;
  role: string;
  jobDescription: string;
  initialQuestions: string[];
}

export default function InterviewSection({
  applicationId,
  role,
  jobDescription,
  initialQuestions,
}: InterviewSectionProps) {
  const [questions, setQuestions] = useState<string[]>(initialQuestions);
  const [streamedText, setStreamedText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-start if no questions exist yet
  useEffect(() => {
    if (initialQuestions.length === 0) {
      handleGenerate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setStreamedText("");
    setQuestions([]);
    setError(null);

    try {
      const res = await fetch("/api/ai/stream-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, role, jobDescription }),
      });

      if (!res.ok) throw new Error("Request failed");
      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        full += chunk;
        setStreamedText(full);
      }

      const parsed = full
        .split("\n")
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter((l) => l.length > 0);
      setQuestions(parsed);
      setStreamedText("");
    } catch (e) {
      console.error(e);
      setError("Failed to generate questions. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Questions card */}
      <div className="bg-card rounded-xl border border-foreground/10 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Interview Questions</h2>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-400 dark:border-emerald-900 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "↺ Regenerate"}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            <span>✗</span>
            {error}
          </div>
        )}

        {/* Streaming state */}
        {streamedText && (
          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
            {streamedText}
            <span className="animate-pulse">▌</span>
          </pre>
        )}

        {/* Loading skeleton while waiting for first chunk */}
        {generating && !streamedText && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-4 h-4 rounded bg-foreground/10 animate-pulse shrink-0 mt-0.5" />
                <div className="flex-1 h-4 rounded bg-foreground/10 animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
              </div>
            ))}
          </div>
        )}

        {/* Final questions list */}
        {!generating && questions.length > 0 && (
          <ol className="space-y-4">
            {questions.map((q, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground">
                <span className="text-foreground/30 shrink-0 font-mono w-5">{i + 1}.</span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
