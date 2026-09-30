const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("node:path");

const { MONGODB_URI, DB_NAME, MONGODB_COLLECTION, ADMIN_EMAIL, ADMIN, JWT_SECRET } = require("./config.js");
const Mandal = require("./models/Mandal.js");

const app = express();
const PORT = process.env.PORT || 10000;
const PUBLIC_DIR = path.join(__dirname, "public");
const SITE_URL = "https://ganpatimandallcator.dpdns.org";

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(self), camera=(), microphone=(), payment=()");
  if (req.path === "/admin" || req.path.startsWith("/api/")) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  next();
});

async function connectDatabase() {
  await mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
    collection: MONGODB_COLLECTION
  });
  console.log(`MongoDB connected: ${DB_NAME}.${MONGODB_COLLECTION}`);
}

function adminAuth(req, res, next) {
  const username = req.get("x-admin-user");
  const password = req.get("x-admin-password");
  if (username === ADMIN.username && password === ADMIN.password) return next();
  return res.status(401).json({ success: false, message: "Unauthorized" });
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    database: DB_NAME,
    collection: MONGODB_COLLECTION
  });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN.username && password === ADMIN.password) {
    return res.json({ success: true, email: ADMIN_EMAIL });
  }
  return res.status(401).json({ success: false, message: "Invalid username or password" });
});

app.get("/api/mandals", async (req, res, next) => {
  try {
    const filter = { active: true };
    if (req.query.year) filter.year = Number(req.query.year);
    const data = await Mandal.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

app.get("/api/mandals/:id", async (req, res, next) => {
  try {
    const data = await Mandal.findById(req.params.id).lean();
    if (!data) return res.status(404).json({ success: false, message: "Mandal not found" });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

app.get("/api/admin/mandals", adminAuth, async (req, res, next) => {
  try {
    const data = await Mandal.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

app.post("/api/admin/mandals", adminAuth, async (req, res, next) => {
  try {
    const data = await Mandal.create({ ...req.body, active: req.body.active !== false });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

app.put("/api/admin/mandals/:id", adminAuth, async (req, res, next) => {
  try {
    const data = await Mandal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: "Mandal not found" });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

app.delete("/api/admin/mandals/:id", adminAuth, async (req, res, next) => {
  try {
    const data = await Mandal.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Mandal not found" });
    res.json({ success: true, message: "Mandal deleted successfully" });
  } catch (err) { next(err); }
});

app.post("/api/upload", adminAuth, (req, res) => {
  res.status(501).json({ success: false, message: "Use an image URL in the admin panel. Cloud uploads are not configured in this build." });
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});

app.get("/sitemap.xml", async (req, res, next) => {
  try {
    const mandals = await Mandal.find({ active: true }).select("_id updatedAt").lean();
    const urls = [
      `<url><loc>${SITE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      ...mandals.map(m => `<url><loc>${SITE_URL}/?mandal=${encodeURIComponent(m._id)}</loc><lastmod>${new Date(m.updatedAt || Date.now()).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
    ].join("");
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  } catch (err) { next(err); }
});

app.get("/admin", (req, res) => res.sendFile(path.join(PUBLIC_DIR, "admin.html")));
app.use(express.static(PUBLIC_DIR, { etag: true, maxAge: "1h", index: "index.html" }));

app.use("/api", (req, res) => res.status(404).json({ success: false, message: "API endpoint not found" }));

app.get("*splat", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

let databaseReady = false;
const databasePromise = connectDatabase()
  .then(() => {
    databaseReady = true;
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    if (require.main === module) process.exit(1);
  });

if (require.main === module) {
  databasePromise.then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Ganpati Mandal Locator running on port ${PORT}`)
    );
  });
}

module.exports = app;
