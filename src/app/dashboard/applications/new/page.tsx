import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createApplication } from "@/app/actions/applications";
import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";

export default async function NewApplicationPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <main className="min-h-screen">
      <nav className="border-b border-foreground/10 sticky top-0 z-50 px-6 py-4 flex items-center bg-black/70 backdrop-blur-md">
        <span className="font-semibold text-foreground text-lg">Pipelined</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Application</h1>
            <p className="text-foreground/50 mt-1 text-sm">
              Add a job you want to track.
            </p>
          </div>
        </div>

        <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6">
          <ApplicationForm
            action={createApplication}
            submitLabel="Add Application"
            cancelHref="/dashboard"
          />
        </div>
      </div>
    </main>
  );
}
