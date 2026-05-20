import { SignJWT, jwtVerify } from "jose";

/**
 * Edge-safe auth helpers (no bcrypt / no next/headers).
 * Used by middleware and any Edge runtime code.
 */

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lucia-jeans-dev-secret-change-me-please-32+chars"
);
const EXPIRES = "7d";

export const SESSION_COOKIE = "lucia_session";

export interface SessionPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  [key: string]: unknown;
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("lucia-jeans")
    .setExpirationTime(EXPIRES)
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: "lucia-jeans"
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
