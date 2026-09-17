import { SignJWT, jwtVerify } from "jose";
import { config } from "./config.js";

function getSecret() {
  if (!config.jwtSecret) {
    throw new Error(
      "JWT_SECRET environment variable is not configured."
    );
  }

  return new TextEncoder().encode(
    config.jwtSecret
  );
}

export async function signAdmin(email) {
  return new SignJWT({
    email,
    role: "admin"
  })
    .setProtectedHeader({
      alg: "HS256"
    })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecret());
}

export async function requireAdmin(req) {
  const authorization =
    req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorization.slice(7);

  try {
    const { payload } = await jwtVerify(
      token,
      getSecret()
    );

    if (
      payload.role !== "admin" ||
      payload.email !== config.adminEmail
    ) {
      throw new Error("Unauthorized");
    }

    return payload;
  } catch {
    throw new Error("Unauthorized");
  }
}
