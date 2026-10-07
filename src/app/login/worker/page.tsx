import Link from "next/link";
import { Users } from "lucide-react";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/login-form";
import { loginWorker } from "@/app/actions/auth-actions";

export const metadata = { title: "Worker Login | Krateus Dynamic Solutions" };

export default function WorkerLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-gradient">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <div className="mb-8 flex justify-center">
          <Logo href="/" dark size={48} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-emerald-500/15 text-brand-emerald-400">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Worker Login
              </h1>
              <p className="text-xs text-white/50">
                Sign in to view and work your leads
              </p>
            </div>
          </div>

          <LoginForm action={loginWorker} />
        </div>

        <div className="mt-6 text-center text-sm text-white/40">
          <p>Don&apos;t have an account? Ask your admin to create one for you.</p>
          <Link href="/login/admin" className="mt-2 inline-block hover:text-white/70">
            Admin login →
          </Link>
        </div>
      </div>
    </div>
  );
}
