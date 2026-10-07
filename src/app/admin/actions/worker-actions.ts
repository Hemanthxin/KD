"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const workerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateWorkerState =
  | { error: string }
  | { success: true; name: string }
  | undefined;

export async function createWorker(
  _prevState: CreateWorkerState,
  formData: FormData
): Promise<CreateWorkerState> {
  await requireAdmin();

  const parsed = workerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "A user with that email already exists" };
  }

  const passwordHash = await hashPassword(password);

  await db.user.create({
    data: { name, email, passwordHash, role: "WORKER" },
  });

  revalidatePath("/admin/workers");

  return { success: true, name };
}

export async function toggleWorkerActive(userId: string) {
  await requireAdmin();

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "WORKER") return;

  await db.user.update({
    where: { id: userId },
    data: { active: !user.active },
  });

  revalidatePath("/admin/workers");
}
