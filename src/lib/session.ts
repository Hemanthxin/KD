import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "kd_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  uid: string;
  role: "ADMIN" | "WORKER";
  name: string;
  email: string;
};

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.uid === "string" &&
      (payload.role === "ADMIN" || payload.role === "WORKER") &&
      typeof payload.name === "string" &&
      typeof payload.email === "string"
    ) {
      return {
        uid: payload.uid,
        role: payload.role,
        name: payload.name,
        email: payload.email,
      };
    }
    return null;
  } catch {
    return null;
  }
}
