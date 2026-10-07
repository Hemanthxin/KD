"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import type { LoginState } from "@/app/actions/auth-actions";

export function LoginForm({
  action,
}: {
  action: (prevState: LoginState, formData: FormData) => Promise<LoginState>;
}) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/30">
          {state.error}
        </p>
      )}

      <SubmitButton className="w-full" size="lg" pendingText="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
