"use client";

import { useActionState, useRef } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  createWorker,
  type CreateWorkerState,
} from "@/app/admin/actions/worker-actions";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function CreateWorkerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<CreateWorkerState, FormData>(
    async (prevState, formData) => {
      const result = await createWorker(prevState, formData);
      if (result && "success" in result) formRef.current?.reset();
      return result;
    },
    undefined
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Full name
        </label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
          placeholder="Jordan Smith"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
          placeholder="jordan@krateusdynamics.com"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Temporary password
        </label>
        <input
          name="password"
          type="text"
          required
          minLength={6}
          className="w-full rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
          placeholder="At least 6 characters"
        />
      </div>

      {state && "error" in state && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-inset ring-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="flex items-start gap-2 rounded-lg bg-brand-emerald-100 px-3 py-2.5 text-sm text-brand-emerald-700 ring-1 ring-inset ring-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {state.name} can now sign in from the Worker Login page.
        </p>
      )}

      <SubmitButton className="w-full" pendingText="Creating…">
        Create worker
      </SubmitButton>
    </form>
  );
}
