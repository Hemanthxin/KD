"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireWorker } from "@/lib/auth";
import { db } from "@/lib/db";

export async function acceptLead(leadId: string) {
  const session = await requireWorker();

  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.status !== "NEW" || lead.assignedToId) return;

  await db.lead.update({
    where: { id: leadId },
    data: {
      status: "IN_PROGRESS",
      assignedToId: session.uid,
      acceptedAt: new Date(),
      activities: {
        create: {
          action: "ACCEPTED",
          actorId: session.uid,
          fromStatus: "NEW",
          toStatus: "IN_PROGRESS",
        },
      },
    },
  });

  revalidatePath("/worker");
  revalidatePath("/worker/available");
  revalidatePath("/worker/my-leads");
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
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
  const session = await requireWorker();

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

  revalidatePath("/worker");
  revalidatePath("/worker/my-leads");
  revalidatePath(`/worker/leads/${leadId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);

  return { success: true };
}
