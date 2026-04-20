import { auth } from "@/auth";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { applicationId, role, jobDescription } = await req.json();

  // Clear old questions
  await prisma.interviewQuestion.deleteMany({ where: { applicationId } });

  const prompt = `You are an expert technical interviewer. Generate 6 targeted interview questions for the following role and job description.

ROLE: ${role}
JOB DESCRIPTION:
${jobDescription}

Each time you are asked, generate a FRESH and DIFFERENT set of questions. Focus on different aspects, skills, or scenarios each time — vary between behavioral, technical, situational, and role-specific questions.

Variation seed: ${Math.random()}

Format your response as a numbered list like this:
1. Question one
2. Question two
3. Question three
4. Question four
5. Question five
6. Question six

Only output the numbered list, nothing else.`;

  const stream = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    stream: true,
  });

  const encoder = new TextEncoder();
  let fullText = "";

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) {
          fullText += text;
          controller.enqueue(encoder.encode(text));
        }
      }

      // Parse and save questions to DB after streaming completes
      const lines = fullText
        .split("\n")
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter((l) => l.length > 0);

      await prisma.interviewQuestion.createMany({
        data: lines.map((question) => ({ applicationId, question })),
      });

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
