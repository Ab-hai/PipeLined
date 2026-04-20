"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Application, InterviewQuestion } from "@prisma/client";
import { scoreResume, saveJDAndResume, AIScore } from "@/app/actions/ai";

interface AISectionProps {
  application: Application & { interviewQuestions: InterviewQuestion[] };
}

export default function AISection({ application }: AISectionProps) {
  const router = useRouter();
  const [resumeText, setResumeText] = useState(application.resumeText ?? "");
  const [jobDescription, setJobDescription] = useState(application.jobDescription ?? "");
  const [aiScore, setAiScore] = useState<AIScore | null>(
    application.aiScore as AIScore | null
  );
  const [scoring, setScoring] = useState(false);
  const [navigating, setNavigating] = useState(false);
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

  async function handleGoToInterview() {
    if (!jobDescription.trim()) return;
    setNavigating(true);
    setError(null);
    try {
      await saveJDAndResume(application.id, resumeText, jobDescription);
      router.push(`/dashboard/applications/${application.id}/interview`);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
      setNavigating(false);
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
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-foreground">AI Analysis</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/50">
            Job Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={6}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder-foreground/25 focus:outline-none focus:border-white/20 transition-colors resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/50">
            Your Resume <span className="text-red-400">*</span>
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={6}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-foreground placeholder-foreground/25 focus:outline-none focus:border-white/20 transition-colors resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
            <span>✗</span>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleScore}
            disabled={scoring || !resumeText.trim() || !jobDescription.trim()}
            className="bg-foreground text-background text-sm font-medium px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {scoring ? "Scoring..." : "Score Resume"}
          </button>
          <button
            onClick={handleGoToInterview}
            disabled={navigating || !jobDescription.trim()}
            className="bg-white/5 text-foreground text-sm font-medium px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {navigating ? "Opening..." : "Generate Interview Questions →"}
          </button>
        </div>
      </div>

      {/* Score Result */}
      {aiScore && (
        <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Resume Match</h2>
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {aiScore.score}%
            </span>
          </div>

          <p className="text-sm text-foreground/50">{aiScore.summary}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Strengths
              </p>
              <ul className="space-y-1.5">
                {aiScore.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-emerald-400 mt-0.5">✓</span>
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
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-red-400 mt-0.5">✗</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
