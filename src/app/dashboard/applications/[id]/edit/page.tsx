import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateApplication } from "@/app/actions/applications";
import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!application) redirect("/dashboard");

  const updateWithId = updateApplication.bind(null, id);

  return (
    <main className="min-h-screen bg-black">
      <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center">
        <span className="font-semibold text-white text-lg">Pipelined</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 space-y-4">
          <Link
            href={`/dashboard/applications/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Application</h1>
            <p className="text-zinc-400 mt-1 text-sm">
              {application.company} — {application.role}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <ApplicationForm
            action={updateWithId}
            defaultValues={{
              company: application.company,
              role: application.role,
              jobUrl: application.jobUrl ?? "",
              status: application.status,
              notes: application.notes ?? "",
            }}
            submitLabel="Save Changes"
            cancelHref={`/dashboard/applications/${id}`}
          />
        </div>
      </div>
    </main>
  );
}
