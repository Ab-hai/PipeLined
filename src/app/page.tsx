import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Spotlight } from "@/components/ui/spotlight-new";
import { FeatureList } from "@/components/ui/feature-list";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-black antialiased relative overflow-hidden">
      <Spotlight />

      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Pipelined
          </h1>
          <p className="text-lg text-neutral-400">
            Track every application. Score your resume with AI. Prep for interviews — fast.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-6">
          <FeatureList />

          <div className="space-y-3">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-lg px-6 py-3 font-medium hover:bg-neutral-200 transition-colors"
              >
                <FaGoogle className="w-5 h-5" />
                Sign in with Google
              </button>
            </form>

            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white/10 text-white border border-white/10 rounded-lg px-6 py-3 font-medium hover:bg-white/15 transition-colors"
              >
                <FaGithub className="w-5 h-5" />
                Sign in with GitHub
              </button>
            </form>
          </div>
        </div>

        <p className="text-xs text-neutral-600">
          One click, you&apos;re in.
        </p>
      </div>
    </main>
  );
}
