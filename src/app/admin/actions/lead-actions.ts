"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseLeadsFile } from "@/lib/leads-parser";

export type UploadState =
  | { error: string }
  | { success: true; created: number; skipped: number }
  | undefined;

export async function uploadLeads(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const session = await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a CSV or Excel file to upload" };
  }

  const buffer = await file.arrayBuffer();

  let parsed;
  try {
    parsed = parseLeadsFile(buffer);
  } catch {
    return {
      error: "Couldn't read that file. Please upload a valid CSV or Excel file.",
    };
  }

  if (parsed.leads.length === 0) {
    return {
      error:
        "No usable rows found. Each row needs at least a business name and a phone or email.",
    };
  }

  await db.$transaction(
    parsed.leads.map((lead) =>
      db.lead.create({
        data: {
          ...lead,
          uploadedById: session.uid,
          activities: {
            create: {
              action: "UPLOADED",
              actorId: session.uid,
              toStatus: "NEW",
            },
          },
        },
      })
    ),
    { timeout: 30000 }
  );

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/worker");
  revalidatePath("/worker/available");

  return {
    success: true,
    created: parsed.leads.length,
    skipped: parsed.skippedRows,
  };
}

export async function unassignLead(leadId: string) {
  const session = await requireAdmin();

  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead) return;

  await db.lead.update({
    where: { id: leadId },
    data: {
      status: "NEW",
      assignedToId: null,
      acceptedAt: null,
      completedAt: null,
      activities: {
        create: {
          action: "UNASSIGNED",
          actorId: session.uid,
          fromStatus: lead.status,
          toStatus: "NEW",
          note: "Released back to the pool by admin",
        },
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/worker");
  revalidatePath("/worker/available");
}

export async function deleteLead(leadId: string) {
  await requireAdmin();
  await db.lead.delete({ where: { id: leadId } });

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
