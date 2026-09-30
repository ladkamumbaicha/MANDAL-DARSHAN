import crypto from "node:crypto";
import { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } from "../config.js";

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verify(token) {
  if (!token || !JWT_SECRET) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = crypto.createHmac("sha256", JWT_SECRET).update(body).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function login(username, password) {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.startsWith("YOUR_")) return null;
  if (username !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return null;
  return sign({ sub: ADMIN_EMAIL, exp: Date.now() + 1000 * 60 * 60 * 12 });
}

export function requireAdmin(req, res) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const payload = verify(token);
  if (!payload) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return false;
  }
  return true;
}
