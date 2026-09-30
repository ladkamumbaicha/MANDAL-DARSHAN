import { connectMongoDB } from "../mongo.js";
import Mandal from "../models/Mandal.js";
import { requireAdmin } from "./auth.js";

export default async function mandalsHandler(req, res) {
  await connectMongoDB();

  if (req.method === "GET") {
    const filter = req.query.admin === "1" ? {} : { active: true };
    const data = await Mandal.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data });
  }

  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  const data = await Mandal.create(normalize(req.body));
  res.status(201).json({ success: true, data });
}

function normalize(body = {}) {
  return {
    name: String(body.name || "").trim(),
    location: String(body.location || "").trim(),
    address: String(body.address || "").trim(),
    latitude: Number(body.latitude),
    longitude: Number(body.longitude),
    description: String(body.description || ""),
    darshanTime: String(body.darshanTime || ""),
    category: String(body.category || "Ganpati Mandal"),
    image: String(body.image || ""),
    gallery: Array.isArray(body.gallery) ? body.gallery.map(String) : [],
    social: body.social || {},
    year: Number(body.year) || 2027,
    active: body.active !== false
  };
}
