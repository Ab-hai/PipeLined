import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import ThemeToggle from "@/components/ui/theme-toggle";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background relative">
      <div className="absolute top-4 right-6">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Pipelined
          </h1>
          <p className="text-lg text-foreground/60">
            Track every application. Score your resume with AI. Prep for interviews — fast.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-foreground/10 p-8 space-y-6 shadow-sm">
          <ul className="text-left space-y-3 text-sm text-foreground/70">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Track applications from Bookmarked → Offer
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
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground rounded-lg px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
              >
                <FaGithub className="w-5 h-5" />
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
                className="w-full flex items-center justify-center gap-3 bg-card text-foreground border border-foreground/15 rounded-lg px-6 py-3 font-medium hover:bg-background transition-colors"
              >
                <FaGoogle className="w-5 h-5" />
                Sign in with Google
              </button>
            </form>
          </div>
        </div>

        <p className="text-xs text-foreground/40">
          One click, you&apos;re in.
        </p>
      </div>
    </main>
  );
}
