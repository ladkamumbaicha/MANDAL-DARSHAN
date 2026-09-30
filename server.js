import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import loginHandler from "./api/login.js";
import mandalsHandler from "./api/mandals.js";
import mandalByIdHandler from "./api/mandals/[id].js";
import uploadHandler from "./api/upload.js";

import { connectMongoDB } from "./mongo.js";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const app = express();

const port =
  process.env.PORT || 10000;

app.disable("x-powered-by");

/* =========================
   SECURITY
========================= */

app.use((req, res, next) => {

  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  res.setHeader(
    "X-Frame-Options",
    "SAMEORIGIN"
  );

  res.setHeader(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  res.setHeader(
    "Permissions-Policy",
    "geolocation=(self), camera=(), microphone=(), payment=()"
  );

  if (
    req.path === "/admin" ||
    req.path.startsWith("/api/")
  ) {
    res.setHeader(
      "X-Robots-Tag",
      "noindex, nofollow"
    );
  }

  next();
});

/* =========================
   BODY
========================= */

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: false
  })
);

/* =========================
   API WRAPPER
========================= */

const adapt = (handler) =>
  async (req, res) => {

    try {

      await handler(
        req,
        res
      );

    } catch (error) {

      console.error(
        "API ERROR:",
        error
      );

      if (!res.headersSent) {

        res.status(500).json({
          error:
            "Internal server error"
        });
      }
    }
  };

/* =========================
   API
========================= */

app.all(
  "/api/login",
  adapt(loginHandler)
);

app.all(
  "/api/mandals",
  adapt(mandalsHandler)
);

app.all(
  "/api/mandals/:id",
  adapt(mandalByIdHandler)
);

app.all(
  "/api/upload",
  adapt(uploadHandler)
);

/* =========================
   FRONTEND
========================= */

const dist =
  path.join(
    __dirname,
    "dist"
  );

app.use(
  "/assets",
  express.static(
    path.join(
      dist,
      "assets"
    ),
    {
      maxAge: "1y",
      immutable: true,
      etag: true
    }
  )
);

app.use(
  express.static(
    dist,
    {
      maxAge: "1h",
      etag: true,
      index: false
    }
  )
);

/* =========================
   API 404
========================= */

app.use(
  "/api",
  (req, res) => {

    res.status(404).json({
      error:
        "API endpoint not found"
    });
  }
);

/* =========================
   FRONTEND FALLBACK
   EXPRESS 5
========================= */

app.get(
  "*splat",
  (req, res) => {

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.sendFile(
      path.join(
        dist,
        "index.html"
      )
    );
  }
);

/* =========================
   START
========================= */

async function start() {

  await connectMongoDB();

  app.listen(
    port,
    "0.0.0.0",
    () => {

      console.log(
        "================================"
      );

      console.log(
        `Ganpati Mandal Locator running on port ${port}`
      );

      console.log(
        "MongoDB connected"
      );

      console.log(
        "================================"
      );
    }
  );
}

start();