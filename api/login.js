import bcrypt from "bcryptjs";
import { signAdmin } from "./_lib/auth.js";
import { config } from "./_lib/config.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email = "", password = "" } = req.body || {};
    const normalizedEmail = String(email).trim().toLowerCase();

    if (normalizedEmail !== config.adminEmail.toLowerCase()) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ok = config.adminPassword.startsWith("$2")
      ? await bcrypt.compare(String(password), config.adminPassword)
      : String(password) === config.adminPassword;

    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    return res.status(200).json({ token: await signAdmin(config.adminEmail), admin: { email: config.adminEmail } });
  } catch (error) {
    return res.status(500).json({ error: `Login service error: ${error.message}` });
  }
}
