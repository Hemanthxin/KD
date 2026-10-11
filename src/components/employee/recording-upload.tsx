"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Mic, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { addCallRecording } from "@/app/employee/actions/employee-lead-actions";

type Status =
  | { state: "idle" }
  | { state: "uploading"; percentage: number }
  | { state: "error"; message: string }
  | { state: "success" };

export function RecordingUpload({ leadId }: { leadId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleFile(file: File) {
    setStatus({ state: "uploading", percentage: 0 });

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/employee/upload-recording",
        clientPayload: JSON.stringify({ leadId }),
        multipart: file.size > 10 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => {
          setStatus({ state: "uploading", percentage });
        },
      });

      const result = await addCallRecording({
        leadId,
        url: blob.url,
        fileName: file.name,
      });

      if (result && "error" in result) {
        setStatus({ state: "error", message: result.error });
        return;
      }

      setStatus({ state: "success" });
      router.refresh();
    } catch (err) {
      setStatus({
        state: "error",
        message:
          err instanceof Error ? err.message : "Upload failed. Try again.",
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const uploading = status.state === "uploading";

  return (
    <div className="space-y-3">
      <label
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center text-sm transition-colors ${
          uploading
            ? "cursor-not-allowed border-border-subtle bg-surface-muted text-text-muted"
            : "border-border-subtle bg-surface-muted text-text-muted hover:border-brand-emerald-400"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading… {status.percentage}%
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Click to upload a call recording
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          disabled={uploading}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>

      {status.state === "error" && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-inset ring-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {status.message}
        </p>
      )}
      {status.state === "success" && (
        <p className="flex items-start gap-2 rounded-lg bg-brand-emerald-100 px-3 py-2.5 text-sm text-brand-emerald-700 ring-1 ring-inset ring-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Recording uploaded.
        </p>
      )}
    </div>
  );
}
