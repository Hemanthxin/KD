"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireEmployee } from "@/lib/auth";
import { db } from "@/lib/db";

export async function acceptLead(leadId: string) {
  const session = await requireEmployee();

  // Conditional update: only succeeds if the lead is still NEW and
  // unassigned, so two employees racing to accept the same lead can't
  // both win it. Whoever's update lands first flips the row and the
  // second attempt's where-clause no longer matches (count: 0).
  const result = await db.lead.updateMany({
    where: { id: leadId, status: "NEW", assignedToId: null },
    data: {
      status: "IN_PROGRESS",
      assignedToId: session.uid,
      acceptedAt: new Date(),
    },
  });

  revalidatePath("/employee");
  revalidatePath("/employee/available");
  revalidatePath("/employee/my-leads");
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);

  if (result.count === 0) return;

  await db.leadActivity.create({
    data: {
      leadId,
      actorId: session.uid,
      action: "ACCEPTED",
      fromStatus: "NEW",
      toStatus: "IN_PROGRESS",
    },
  });
}

const progressSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "NOT_INTERESTED"]),
  note: z.string().trim().max(2000).optional(),
});

export type ProgressState = { error: string } | { success: true } | undefined;

export async function updateProgress(
  _prevState: ProgressState,
  formData: FormData
): Promise<ProgressState> {
  const session = await requireEmployee();

  const parsed = progressSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { error: "Invalid submission" };
  }

  const { leadId, status, note } = parsed.data;

  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.assignedToId !== session.uid) {
    return { error: "You don't have this lead assigned" };
  }

  if (!note && status === lead.status) {
    return { error: "Add a note or change the status before saving" };
  }

  const statusChanged = status !== lead.status;

  await db.lead.update({
    where: { id: leadId },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : lead.completedAt,
      activities: {
        create: {
          action: statusChanged ? "STATUS_CHANGED" : "NOTE_ADDED",
          actorId: session.uid,
          fromStatus: statusChanged ? lead.status : undefined,
          toStatus: statusChanged ? status : undefined,
          note,
        },
      },
    },
  });

  revalidatePath("/employee");
  revalidatePath("/employee/my-leads");
  revalidatePath(`/employee/leads/${leadId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);

  return { success: true };
}

const recordingSchema = z.object({
  leadId: z.string().min(1),
  url: z.string().url(),
  fileName: z.string().trim().min(1).max(255),
});

export type AddRecordingState =
  | { error: string }
  | { success: true }
  | undefined;

export async function addCallRecording(
  input: z.infer<typeof recordingSchema>
): Promise<AddRecordingState> {
  const session = await requireEmployee();

  const parsed = recordingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid upload" };
  }

  const { leadId, url, fileName } = parsed.data;

  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.assignedToId !== session.uid) {
    return { error: "You don't have this lead assigned" };
  }

  await db.leadActivity.create({
    data: {
      leadId,
      actorId: session.uid,
      action: "RECORDING_ADDED",
      attachmentUrl: url,
      attachmentName: fileName,
    },
  });

  revalidatePath(`/employee/leads/${leadId}`);
  revalidatePath(`/admin/leads/${leadId}`);

  return { success: true };
}
