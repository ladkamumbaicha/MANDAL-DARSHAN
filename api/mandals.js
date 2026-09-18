import { config } from './_lib/config.js';
import { getDb } from "./_lib/db.js";
import { requireAdmin } from "./_lib/auth.js";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const col = db.collection(config.mongodbCollection);

    if (req.method === "GET") {
      const docs = await col.find({}).sort({ featured: -1, createdAt: -1 }).toArray();
      res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
      return res.status(200).json(docs.map((d) => ({ ...d, _id: d._id.toString() })));
    }

    await requireAdmin(req);

    if (req.method === "POST") {
      const now = new Date();
      const doc = { ...req.body, createdAt: now, updatedAt: now };
      delete doc._id;
      const r = await col.insertOne(doc);
      return res.status(201).json({ ...doc, _id: r.insertedId.toString() });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    const status = e.message === "Unauthorized" ? 401 : 500;
    return res.status(status).json({ error: status === 401 ? "Your admin session has expired. Please log in again." : e.message });
  }
}
