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
  BOOKMARKED: "bg-zinc-700 text-zinc-300",
  APPLIED: "bg-blue-900 text-blue-300",
  INTERVIEW: "bg-purple-900 text-purple-300",
  OFFER: "bg-emerald-900 text-emerald-300",
  REJECTED: "bg-red-900 text-red-300",
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
    <main className="min-h-screen bg-black">
      <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center">
        <span className="font-semibold text-white text-lg">Pipelined</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        {/* Back + Header */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            ← Back to dashboard
          </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">
                {application.company}
              </h1>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[application.status]}`}
              >
                {STATUS_LABELS[application.status]}
              </span>
            </div>
            <p className="text-zinc-400">{application.role}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/dashboard/applications/${id}/edit`}
              className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors border border-zinc-700"
            >
              Edit
            </Link>
            <form action={deleteWithId}>
              <button
                type="submit"
                className="text-sm bg-red-950 hover:bg-red-900 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-900"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
        </div>

        {/* Details */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
          {application.jobUrl && (
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-zinc-500">Job URL</span>
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
            <span className="text-sm text-zinc-500">Applied on</span>
            <span className="text-sm text-zinc-300">
              {new Date(application.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-zinc-500">Last updated</span>
            <span className="text-sm text-zinc-300">
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
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-sm font-medium text-zinc-400 mb-3">Notes</h2>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap">
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
