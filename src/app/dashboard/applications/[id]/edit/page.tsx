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
    <main className="min-h-screen">
      <nav className="border-b border-foreground/10 sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-black/70 backdrop-blur-md">
        <Link href="/dashboard" className="font-bold text-foreground text-2xl tracking-tight hover:opacity-80 transition-opacity">Pipelined</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 space-y-4">
          <Link
            href={`/dashboard/applications/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Application</h1>
            <p className="text-foreground/50 mt-1 text-sm">
              {application.company} — {application.role}
            </p>
          </div>
        </div>

        <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6">
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
