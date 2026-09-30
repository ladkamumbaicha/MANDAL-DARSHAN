import { connectMongoDB } from "../mongo.js";
import Mandal from "../models/Mandal.js";
import { requireAdmin } from "./auth.js";

export default async function mandalByIdHandler(req, res) {
  await connectMongoDB();
  const id = req.params.id;
  const mandal = await Mandal.findById(id);
  if (!mandal) return res.status(404).json({ success: false, message: "Mandal not found" });

  if (req.method === "GET") return res.json({ success: true, data: mandal });
  if (!requireAdmin(req, res)) return;

  if (req.method === "PUT") {
    const updated = await Mandal.findByIdAndUpdate(id, normalize(req.body), { new: true, runValidators: true });
    return res.json({ success: true, data: updated });
  }

  if (req.method === "DELETE") {
    await Mandal.findByIdAndDelete(id);
    return res.json({ success: true });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}

function normalize(body = {}) {
  const out = {};
  for (const key of ["name", "location", "address", "description", "darshanTime", "category", "image"]) {
    if (body[key] !== undefined) out[key] = String(body[key]);
  }
  if (body.latitude !== undefined) out.latitude = Number(body.latitude);
  if (body.longitude !== undefined) out.longitude = Number(body.longitude);
  if (body.year !== undefined) out.year = Number(body.year) || 2027;
  if (body.active !== undefined) out.active = Boolean(body.active);
  if (Array.isArray(body.gallery)) out.gallery = body.gallery.map(String);
  if (body.social !== undefined) out.social = body.social || {};
  return out;
}
