import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteApplication } from "@/app/actions/applications";
import Link from "next/link";
import AISection from "@/components/AISection";

const STATUS_LABELS: Record<string, string> = {
  BOOKMARKED: "Bookmarked",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const STATUS_COLORS: Record<string, string> = {
  BOOKMARKED: "bg-foreground/10 text-foreground/60",
  APPLIED:    "bg-blue-500/15 text-blue-400",
  INTERVIEW:  "bg-purple-500/15 text-purple-400",
  OFFER:      "bg-emerald-500/15 text-emerald-400",
  REJECTED:   "bg-red-500/15 text-red-400",
};

export default async function ApplicationDetailPage({
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

  const deleteWithId = deleteApplication.bind(null, id);

  return (
    <main className="min-h-screen">
      <nav className="border-b border-foreground/10 sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-black/70 backdrop-blur-md">
        <Link href="/dashboard" className="font-bold text-foreground text-2xl tracking-tight hover:opacity-80 transition-opacity">Pipelined</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        {/* Back + Header */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {application.company}
                </h1>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[application.status]}`}
                >
                  {STATUS_LABELS[application.status]}
                </span>
              </div>
              <p className="text-foreground/60">{application.role}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/dashboard/applications/${id}/edit`}
                className="text-sm bg-white/5 hover:bg-white/10 text-foreground px-4 py-2 rounded-lg transition-colors border border-white/10"
              >
                Edit
              </Link>
              <form action={deleteWithId}>
                <button
                  type="submit"
                  className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] divide-y divide-white/[0.06]">
          {application.jobUrl && (
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-foreground/50">Job URL</span>
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors truncate max-w-xs"
              >
                {application.jobUrl}
              </a>
            </div>
          )}
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-foreground/50">Applied on</span>
            <span className="text-sm text-foreground">
              {new Date(application.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-foreground/50">Last updated</span>
            <span className="text-sm text-foreground">
              {new Date(application.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Notes */}
        {application.notes && (
          <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6">
            <h2 className="text-sm font-medium text-foreground/40 mb-3">Notes</h2>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {application.notes}
            </p>
          </div>
        )}

        {/* AI Section */}
        <AISection application={application} />
      </div>
    </main>
  );
}
