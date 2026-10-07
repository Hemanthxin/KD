"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSessionCookie, clearSessionCookie, verifyPassword } from "@/lib/auth";

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = { error?: string } | undefined;

async function loginAs(
  role: "ADMIN" | "WORKER",
  destination: string,
  formData: FormData
): Promise<LoginState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });

  if (!user || user.role !== role || !user.active) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  await createSessionCookie({
    uid: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  redirect(destination);
}

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  return loginAs("ADMIN", "/admin", formData);
}

export async function loginWorker(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  return loginAs("WORKER", "/worker", formData);
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}
