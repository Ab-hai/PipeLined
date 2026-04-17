import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ApplicationCard from "@/components/ApplicationCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { name, email, image } = session.user;

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalApplied = applications.filter((a) =>
    ["APPLIED", "PHONE_SCREEN", "INTERVIEW", "OFFER"].includes(a.status)
  ).length;

  const interviewCount = applications.filter(
    (a) => a.status === "INTERVIEW"
  ).length;

  const aiScores = applications
    .map((a) => {
      const score = a.aiScore as { score?: number } | null;
      return score?.score ?? null;
    })
    .filter((s): s is number => s !== null);

  const avgScore =
    aiScores.length > 0
      ? Math.round(aiScores.reduce((a, b) => a + b, 0) / aiScores.length)
      : null;

  return (
    <main className="min-h-screen bg-black">
      <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-white text-lg">Pipelined</span>
        <div className="flex items-center gap-4">
          {image && (
            <Image
              src={image}
              alt={name ?? "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="text-sm text-zinc-400">{name ?? email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back{name ? `, ${name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-zinc-400 mt-1 text-sm">
              Track your applications, score your resume, and prep for interviews.
            </p>
          </div>
          <Link
            href="/dashboard/applications/new"
            className="bg-white text-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            + Add Application
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Applied", value: totalApplied.toString() },
            { label: "Interviews", value: interviewCount.toString() },
            { label: "Avg AI Score", value: avgScore ? `${avgScore}%` : "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-6"
            >
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Applications list */}
        {applications.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-16 flex flex-col items-center justify-center text-center">
            <p className="text-zinc-500 text-sm">No applications yet.</p>
            <Link
              href="/dashboard/applications/new"
              className="mt-4 text-sm text-white underline underline-offset-4 hover:text-zinc-300 transition-colors"
            >
              Add your first one
            </Link>
          </div>
        ) : (
          <ul className="list bg-zinc-900 rounded-xl border border-zinc-800 shadow-md">
            <li className="p-4 pb-2 text-xs text-zinc-500 tracking-wide uppercase">
              {applications.length} application{applications.length !== 1 ? "s" : ""}
            </li>
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
