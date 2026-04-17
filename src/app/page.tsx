import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Pipelined
          </h1>
          <p className="text-lg text-zinc-400">
            Track every application. Score your resume with AI. Prep for interviews — fast.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 space-y-6">
          <ul className="text-left space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Kanban-style pipeline: Bookmarked → Offer
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              AI resume scoring against job descriptions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Auto-generated interview questions per role
            </li>
          </ul>

          <div className="space-y-3">
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-lg px-6 py-3 font-medium hover:bg-zinc-200 transition-colors"
              >
                <FaGithub className="w-5 h-5 text-lg" />
                Sign in with GitHub
              </button>
            </form>

            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-zinc-800 text-white border border-zinc-700 rounded-lg px-6 py-3 font-medium hover:bg-zinc-700 transition-colors"
              >
                <FaGoogle className="w-5 h-5 text-lg" />
                Sign in with Google
              </button>
            </form>
          </div>
        </div>

        <p className="text-xs text-zinc-600">
          One click, you&apos;re in.
        </p>
      </div>
    </main>
  );
}
