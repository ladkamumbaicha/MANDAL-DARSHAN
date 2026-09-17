import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import loginHandler from "./api/login.js";
import mandalsHandler from "./api/mandals.js";
import mandalByIdHandler from "./api/mandals/[id].js";
import uploadHandler from "./api/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 10000;

app.disable("x-powered-by");
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
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

const adapt = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
  }
};

app.all("/api/login", adapt(loginHandler));
app.all("/api/mandals", adapt(mandalsHandler));
app.all("/api/mandals/:id", adapt(mandalByIdHandler));
app.all("/api/upload", adapt(uploadHandler));

const dist = path.join(__dirname, "dist");
app.use("/assets", express.static(path.join(dist, "assets"), {
  maxAge: "1y",
  immutable: true,
  etag: true
}));
app.use(express.static(dist, {
  maxAge: "1h",
  etag: true,
  index: false
}));

app.get("*splat", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Ganpati Mandal Locator running on port ${port}`);
});
