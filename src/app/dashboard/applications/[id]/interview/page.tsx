import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import InterviewSection from "@/components/InterviewSection";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
    include: { interviewQuestions: { orderBy: { createdAt: "asc" } } },
  });

  if (!application) redirect("/dashboard");
  if (!application.jobDescription) redirect(`/dashboard/applications/${id}`);

  return (
    <main className="min-h-screen">
      <nav className="border-b border-foreground/10 sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-black/70 backdrop-blur-md">
        <span className="font-semibold text-foreground text-lg">Pipelined</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        <div className="space-y-4">
          <Link
            href={`/dashboard/applications/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            ← Back to application
          </Link>
          <div>
            <p className="text-sm text-foreground/50 uppercase tracking-wide font-semibold mb-1">
              Interview Prep
            </p>
            <h1 className="text-2xl font-bold text-foreground">{application.company}</h1>
            <p className="text-foreground/60 mt-1">{application.role}</p>
          </div>
        </div>

        <InterviewSection
          applicationId={id}
          role={application.role}
          jobDescription={application.jobDescription}
          initialQuestions={application.interviewQuestions.map((q) => q.question)}
        />
      </div>
    </main>
  );
}
