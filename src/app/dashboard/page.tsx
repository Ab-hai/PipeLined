import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ApplicationCard from "@/components/ApplicationCard";
import { FileText, Users, Brain } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { name, email, image } = session.user;

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalApplied = applications.filter((a) =>
    ["APPLIED", "INTERVIEW", "OFFER"].includes(a.status)
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

  const stats = [
    { label: "Total Applied", value: totalApplied.toString(), icon: FileText },
    { label: "Interviews",    value: interviewCount.toString(), icon: Users },
    { label: "Avg AI Score",  value: avgScore ? `${avgScore}%` : "—", icon: Brain },
  ];

  return (
    <main className="min-h-screen">
      <nav className="border-b border-foreground/[0.08] sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-background/70 backdrop-blur-md">
        <Link href="/dashboard" className="font-bold text-foreground text-2xl tracking-tight hover:opacity-80 transition-opacity">Pipelined</Link>

        <div className="flex items-center gap-3">
          {/* User pill */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-1.5 pr-3 py-1.5">
            {image ? (
              <Image
                src={image}
                alt={name ?? "User"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="size-6 rounded-full bg-foreground/20 flex items-center justify-center text-xs font-bold text-foreground">
                {(name ?? email ?? "U")[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm text-foreground/70">{name?.split(" ")[0] ?? email}</span>
          </div>

          {/* Sign out */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Welcome back{name ? `, ${name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-foreground/40 mt-1.5 text-sm">
              Track your applications, score your resume, and prep for interviews.
            </p>
          </div>
          <Link
            href="/dashboard/applications/new"
            className="flex items-center gap-1.5 bg-foreground text-background rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            + Add Application
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6 flex items-start justify-between"
            >
              <div>
                <p className="text-sm text-foreground/40 mb-3">{label}</p>
                <p className="text-3xl font-bold text-foreground">{value}</p>
              </div>
              <div className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon className="size-4 text-foreground/40" />
              </div>
            </div>
          ))}
        </div>

        {/* Applications list */}
        {applications.length === 0 ? (
          <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <FileText className="size-6 text-foreground/30" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground font-medium">No applications yet</p>
              <p className="text-foreground/40 text-sm max-w-xs">
                Start tracking your job search. Add your first application to get AI resume scoring and interview prep.
              </p>
            </div>
            <Link
              href="/dashboard/applications/new"
              className="mt-2 bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-foreground/90 transition-colors"
            >
              + Add your first application
            </Link>
          </div>
        ) : (
          <div className="bg-white/[0.03] rounded-xl border border-white/[0.08]">
            <div className="px-5 py-4 border-b border-white/[0.07]">
              <h2 className="font-semibold text-foreground">Your Applications</h2>
            </div>
            <ul>
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
