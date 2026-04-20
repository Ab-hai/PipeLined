import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ApplicationCard from "@/components/ApplicationCard";
import ThemeToggle from "@/components/ui/theme-toggle";

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
    <main className="min-h-screen bg-background">
      <nav className="border-b border-foreground/10 sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-md">
        <span className="font-semibold text-foreground text-lg">Pipelined</span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {image && (
            <Image
              src={image}
              alt={name ?? "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="text-sm text-foreground/60">{name ?? email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-foreground/50 hover:text-foreground transition-colors"
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
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back{name ? `, ${name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-foreground/50 mt-1 text-sm">
              Track your applications, score your resume, and prep for interviews.
            </p>
          </div>
          <Link
            href="/dashboard/applications/new"
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
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
              className="bg-card rounded-xl border border-foreground/10 p-6 shadow-sm"
            >
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-foreground/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Applications list */}
        {applications.length === 0 ? (
          <div className="bg-card rounded-xl border border-foreground/10 p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center text-2xl">
              📋
            </div>
            <div className="space-y-1">
              <p className="text-foreground font-medium">No applications yet</p>
              <p className="text-foreground/50 text-sm max-w-xs">
                Start tracking your job search. Add your first application to get AI resume scoring and interview prep.
              </p>
            </div>
            <Link
              href="/dashboard/applications/new"
              className="mt-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Add your first application
            </Link>
          </div>
        ) : (
          <ul className="list bg-card rounded-xl border border-foreground/10 shadow-sm">
            <li className="p-4 pb-2 text-xs text-foreground/40 tracking-wide uppercase">
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
