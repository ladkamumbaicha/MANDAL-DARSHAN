import { requireAdmin } from "./_lib/auth.js";

export default async function handler(req, res) {
  try {
    await requireAdmin(req);
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    return res.status(400).json({ error: "Image upload is not enabled. Add a public Image URL in the admin form." });
  } catch (e) {
    return res.status(e.message === "Unauthorized" ? 401 : 500).json({ error: e.message });
  }
}
