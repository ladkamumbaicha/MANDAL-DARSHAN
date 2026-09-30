import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { requireAdmin } from "./auth.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(root, "..", "public", "uploads");

export default async function uploadHandler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  const { data, extension = "jpg" } = req.body || {};
  if (typeof data !== "string" || !data.startsWith("data:image/")) {
    return res.status(400).json({ success: false, message: "Send an image as a data URL" });
  }

  const match = data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!match) return res.status(400).json({ success: false, message: "Supported images: PNG, JPG, WEBP" });

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > 5 * 1024 * 1024) return res.status(413).json({ success: false, message: "Image must be 5 MB or smaller" });

  await fs.mkdir(uploadDir, { recursive: true });
  const ext = ["png", "jpeg", "jpg", "webp"].includes(extension.toLowerCase()) ? extension.toLowerCase() : match[1];
  const filename = `${crypto.randomUUID()}.${ext}`;
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  res.json({ success: true, url: `/uploads/${filename}` });
}
