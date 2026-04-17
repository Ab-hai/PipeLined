import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { name, email, image } = session.user;

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

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back{name ? `, ${name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-zinc-400 mt-1">
            Track your applications, score your resume, and prep for interviews.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Applied", value: "0" },
            { label: "Interviews", value: "0" },
            { label: "Avg AI Score", value: "—" },
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

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-600 text-sm">
            No applications yet. Add one to get started.
          </p>
        </div>
      </div>
    </main>
  );
}
