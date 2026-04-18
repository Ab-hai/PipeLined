"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { revalidatePath } from "next/cache";

export interface AIScore {
  score: number;
  strengths: string[];
  gaps: string[];
  summary: string;
}

export async function scoreResume(
  applicationId: string,
  resumeText: string,
  jobDescription: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Save the resume text and JD to the application
  await prisma.application.update({
    where: { id: applicationId, userId: session.user.id },
    data: { resumeText, jobDescription },
  });

  const prompt = `You are an expert recruiter and career coach. Analyze the following resume against the job description and return a JSON response.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{
  "score": <number between 0-100>,
  "strengths": [<list of 3-5 matching skills or experiences>],
  "gaps": [<list of 2-4 missing skills or requirements>],
  "summary": "<2 sentence summary of the match>"
}`;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = completion.choices[0].message.content?.trim() ?? "";

  // Strip markdown code blocks if model wraps the response
  const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  const aiScore: AIScore = JSON.parse(cleaned);

  await prisma.application.update({
    where: { id: applicationId },
    data: { aiScore },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  return aiScore;
}

export async function saveJDAndResume(
  applicationId: string,
  resumeText: string,
  jobDescription: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.application.update({
    where: { id: applicationId, userId: session.user.id },
    data: { resumeText, jobDescription },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
}
