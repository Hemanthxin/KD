import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/login-form";
import { loginAdmin } from "@/app/actions/auth-actions";

export const metadata = { title: "Admin Login | Krateus Dynamic Solutions" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-gradient">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <div className="mb-8 flex justify-center">
          <Logo href="/" dark size={48} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-emerald-500/15 text-brand-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Admin Access
              </h1>
              <p className="text-xs text-white/50">
                Restricted to authorized administrators
              </p>
            </div>
          </div>

          <LoginForm action={loginAdmin} />
        </div>

        <div className="mt-6 text-center text-sm text-white/40">
          <Link href="/login/worker" className="hover:text-white/70">
            Worker login →
          </Link>
        </div>
      </div>
    </div>
  );
}
