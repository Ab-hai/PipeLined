"use client";

import { useState } from "react";
import { Application, InterviewQuestion } from "@prisma/client";
import { scoreResume } from "@/app/actions/ai";
import { AIScore } from "@/app/actions/ai";

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

  async function handleScore() {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setScoring(true);
    try {
      const result = await scoreResume(application.id, resumeText, jobDescription);
      setAiScore(result);
    } catch (e) {
      console.error(e);
    } finally {
      setScoring(false);
    }
  }

  async function handleGenerateQuestions() {
    if (!jobDescription.trim()) return;
    setGenerating(true);
    setStreamedText("");
    setQuestions([]);

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

      // Parse the final streamed text into individual questions
      const parsed = full
        .split("\n")
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter((l) => l.length > 0);
      setQuestions(parsed);
      setStreamedText("");
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  const scoreColor =
    aiScore?.score == null
      ? ""
      : aiScore.score >= 75
      ? "text-emerald-400"
      : aiScore.score >= 50
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white">AI Analysis</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={6}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">
            Your Resume <span className="text-red-500">*</span>
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={6}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleScore}
            disabled={scoring || !resumeText.trim() || !jobDescription.trim()}
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {scoring ? "Scoring..." : "Score Resume"}
          </button>
          <button
            onClick={handleGenerateQuestions}
            disabled={generating || !jobDescription.trim()}
            className="bg-zinc-800 text-white text-sm font-medium px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "Generate Interview Questions"}
          </button>
        </div>
      </div>

      {/* Score Result */}
      {aiScore && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Resume Match</h2>
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {aiScore.score}%
            </span>
          </div>

          <p className="text-sm text-zinc-400">{aiScore.summary}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Strengths
              </p>
              <ul className="space-y-1.5">
                {aiScore.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                Gaps
              </p>
              <ul className="space-y-1.5">
                {aiScore.gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-red-500 mt-0.5">✗</span>
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
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Interview Questions</h2>
          {streamedText ? (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
              {streamedText}
              <span className="animate-pulse">▌</span>
            </pre>
          ) : (
            <ol className="space-y-3">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="text-zinc-600 shrink-0 font-mono">{i + 1}.</span>
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
