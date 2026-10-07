"use client";

import { useActionState, useRef } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  updateProgress,
  type ProgressState,
} from "@/app/worker/actions/worker-lead-actions";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { LeadStatus } from "@prisma/client";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed — converted to client" },
  { value: "NOT_INTERESTED", label: "Not Interested" },
];

export function ProgressForm({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: LeadStatus;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<ProgressState, FormData>(
    async (prevState, formData) => {
      const result = await updateProgress(prevState, formData);
      if (result && "success" in result) {
        const textarea = formRef.current?.elements.namedItem(
          "note"
        ) as HTMLTextAreaElement | null;
        if (textarea) textarea.value = "";
      }
      return result;
    },
    undefined
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="leadId" value={leadId} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Status
        </label>
        <select
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Progress note
        </label>
        <textarea
          name="note"
          rows={3}
          placeholder="e.g. Called the owner, interested, sending proposal tomorrow"
          className="w-full rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-emerald-400 focus:ring-1 focus:ring-brand-emerald-400"
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
          Saved.
        </p>
      )}

      <SubmitButton pendingText="Saving…">Save update</SubmitButton>
    </form>
  );
}
