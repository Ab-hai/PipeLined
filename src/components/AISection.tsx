"use client";

import { useState } from "react";
import { Application, InterviewQuestion } from "@prisma/client";
import { scoreResume, AIScore } from "@/app/actions/ai";

interface AISectionProps {
  application: Application & { interviewQuestions: InterviewQuestion[] };
}

export default function AISection({ application }: AISectionProps) {
  const [resumeText, setResumeText] = useState(application.resumeText ?? "");
  const [jobDescription, setJobDescription] = useState(application.jobDescription ?? "");
  const [aiScore, setAiScore] = useState<AIScore | null>(
    application.aiScore as AIScore | null
  );
  const [questions, setQuestions] = useState<string[]>(
    application.interviewQuestions.map((q) => q.question)
  );
  const [scoring, setScoring] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleScore() {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setScoring(true);
    setError(null);
    try {
      const result = await scoreResume(application.id, resumeText, jobDescription);
      setAiScore(result);
    } catch (e) {
      console.error(e);
      setError("Failed to score resume. Please try again.");
    } finally {
      setScoring(false);
    }
  }

  async function handleGenerateQuestions() {
    if (!jobDescription.trim()) return;
    setGenerating(true);
    setStreamedText("");
    setQuestions([]);
    setError(null);

    try {
      const res = await fetch("/api/ai/stream-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application.id,
          role: application.role,
          jobDescription,
        }),
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

  const scoreColor =
    aiScore?.score == null
      ? ""
      : aiScore.score >= 75
      ? "text-emerald-600"
      : aiScore.score >= 50
      ? "text-yellow-600"
      : "text-red-500";

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-card rounded-xl border border-foreground/10 p-6 space-y-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">AI Analysis</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/60">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={6}
            className="w-full bg-input border border-foreground/15 rounded-lg px-4 py-3 text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/60">
            Your Resume <span className="text-red-500">*</span>
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={6}
            className="w-full bg-input border border-foreground/15 rounded-lg px-4 py-3 text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            <span>✗</span>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleScore}
            disabled={scoring || !resumeText.trim() || !jobDescription.trim()}
            className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {scoring ? "Scoring..." : "Score Resume"}
          </button>
          <button
            onClick={handleGenerateQuestions}
            disabled={generating || !jobDescription.trim()}
            className="bg-card text-foreground text-sm font-medium px-4 py-2 rounded-lg border border-foreground/15 hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "Generate Interview Questions"}
          </button>
        </div>
      </div>

      {/* Score Result */}
      {aiScore && (
        <div className="bg-card rounded-xl border border-foreground/10 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Resume Match</h2>
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {aiScore.score}%
            </span>
          </div>

          <p className="text-sm text-foreground/60">{aiScore.summary}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                Strengths
              </p>
              <ul className="space-y-1.5">
                {aiScore.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">
                Gaps
              </p>
              <ul className="space-y-1.5">
                {aiScore.gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-red-400 mt-0.5">✗</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Interview Questions */}
      {(questions.length > 0 || streamedText) && (
        <div className="bg-card rounded-xl border border-foreground/10 p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Interview Questions</h2>
          {streamedText ? (
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
              {streamedText}
              <span className="animate-pulse">▌</span>
            </pre>
          ) : (
            <ol className="space-y-3">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <span className="text-foreground/30 shrink-0 font-mono">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
