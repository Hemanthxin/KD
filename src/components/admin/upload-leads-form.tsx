"use client";

import { useActionState, useRef } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { uploadLeads, type UploadState } from "@/app/admin/actions/lead-actions";
import { FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";

export function UploadLeadsForm() {
  const [state, formAction] = useActionState<UploadState, FormData>(
    async (prevState, formData) => {
      const result = await uploadLeads(prevState, formData);
      if (result && "success" in result) {
        formRef.current?.reset();
      }
      return result;
    },
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <label
        htmlFor="file"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle bg-surface-muted px-6 py-12 text-center hover:border-brand-emerald-400"
      >
        <FileSpreadsheet className="h-9 w-9 text-brand-emerald-500" />
        <span className="text-sm font-medium text-foreground">
          Click to choose a CSV or Excel file
        </span>
        <span className="text-xs text-text-muted">
          .csv, .xlsx, or .xls — any column order
        </span>
        <input
          id="file"
          name="file"
          type="file"
          accept=".csv,.xlsx,.xls"
          required
          className="sr-only"
        />
      </label>

      {state && "error" in state && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-inset ring-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      {state && "success" in state && (
        <p className="flex items-start gap-2 rounded-lg bg-brand-emerald-100 px-3 py-2.5 text-sm text-brand-emerald-700 ring-1 ring-inset ring-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Added {state.created} lead{state.created === 1 ? "" : "s"}.
          {state.skipped > 0 &&
            ` Skipped ${state.skipped} row${state.skipped === 1 ? "" : "s"} missing a business name or contact info.`}
        </p>
      )}

      <SubmitButton pendingText="Uploading…">Upload Leads</SubmitButton>
    </form>
  );
}
