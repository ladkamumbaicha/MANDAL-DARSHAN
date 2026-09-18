import { SignJWT, jwtVerify } from "jose";
import { config } from "./config.js";

const secret = () => new TextEncoder().encode(config.jwtSecret);

export async function signAdmin(email) {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function requireAdmin(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) throw new Error("Unauthorized");
  try {
    const { payload } = await jwtVerify(header.slice(7), secret());
    if (payload.role !== "admin" || payload.email !== config.adminEmail) throw new Error("Unauthorized");
    return payload;
  } catch {
    throw new Error("Unauthorized");
  }
}
