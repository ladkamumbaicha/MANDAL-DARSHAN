import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import loginHandler from "./api/login.js";
import mandalsHandler from "./api/mandals.js";
import mandalByIdHandler from "./api/mandals-id.js";
import uploadHandler from "./api/upload.js";
import { connectMongoDB } from "./mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 10000;

app.disable("x-powered-by");
app.use(cors({ origin: true, credentials: false }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(self), camera=(), microphone=(), payment=()");
  if (req.path === "/admin" || req.path.startsWith("/api/")) res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const adapt = (handler) => async (req, res, next) => {
  try { await handler(req, res); } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ success: false, error: "Internal server error" });
    else next(error);
  }
};

app.all("/api/login", adapt(loginHandler));
app.all("/api/admin/login", adapt(loginHandler));
app.all("/api/mandals", adapt(mandalsHandler));
app.all("/api/admin/mandals", (req, res, next) => {
  if (req.method === "GET") req.query.admin = "1";
  return adapt(mandalsHandler)(req, res, next);
});
app.all("/api/mandals/:id", adapt(mandalByIdHandler));
app.all("/api/admin/mandals/:id", adapt(mandalByIdHandler));
app.all("/api/upload", adapt(uploadHandler));
app.all("/api/admin/upload", adapt(uploadHandler));

app.get("/sitemap.xml", async (req, res) => {
  const base = "https://ganpatimandallcator.dpdns.org";
  let urls = [base + "/"];
  try {
    await connectMongoDB();
    const Mandal = (await import("./models/Mandal.js")).default;
    const mandals = await Mandal.find({ active: true }).select("_id updatedAt").lean();
    urls = urls.concat(mandals.map(m => `${base}/mandal/${m._id}`));
  } catch (e) { console.error("Sitemap DB read failed:", e.message); }
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${u}</loc></url>`).join("")}</urlset>`;
  res.type("application/xml").send(xml);
});

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir, { maxAge: "1h", etag: true }));
app.get("/admin", (req, res) => res.sendFile(path.join(publicDir, "admin.html")));
app.use("/api", (req, res) => res.status(404).json({ success: false, error: "API endpoint not found" }));
app.get("*splat", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(publicDir, "index.html"));
});
app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);
  if (res.headersSent) return next(error);
  res.status(500).json({ success: false, error: "Internal server error" });
});

if (!process.env.VERCEL) {
  connectMongoDB().then(() => {
    app.listen(port, "0.0.0.0", () => console.log(`Ganpati Mandal Locator running on port ${port}`));
  }).catch(() => process.exit(1));
}

export default app;
