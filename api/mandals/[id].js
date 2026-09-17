import { config } from './_lib/config.js';
import { ObjectId } from "mongodb";
import { getDb } from "../_lib/db.js";
import { requireAdmin } from "../_lib/auth.js";

export default async function handler(req, res) {
  try {
    await requireAdmin(req);
    const db = await getDb();
    const col = db.collection(config.mongodbCollection);
    const rawId = req.params?.id || req.query?.id;
    if (!rawId || !ObjectId.isValid(rawId)) return res.status(400).json({ error: "Invalid mandal id" });
    const _id = new ObjectId(rawId);

    if (req.method === "PUT") {
      const doc = { ...req.body, updatedAt: new Date() };
      delete doc._id;
      delete doc.createdAt;
      await col.updateOne({ _id }, { $set: doc });
      return res.json({ ok: true });
    }
    if (req.method === "DELETE") {
      await col.deleteOne({ _id });
      return res.json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    const status = e.message === "Unauthorized" ? 401 : 500;
    return res.status(status).json({ error: status === 401 ? "Your admin session has expired. Please log in again." : e.message });
  }
}
