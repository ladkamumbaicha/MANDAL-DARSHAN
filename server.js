const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const {
  MONGODB_URI,
  DB_NAME,
  ADMIN
} = require("./config");

const Mandal = require("./models/Mandal");

const app = express();

const PORT = process.env.PORT || 10000;

/* =========================================================
   BASIC CONFIGURATION
========================================================= */

app.use(cors());

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb"
  })
);

/* =========================================================
   STATIC WEBSITE
========================================================= */

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

/* =========================================================
   MONGODB CONNECTION
========================================================= */

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME
    });

    console.log("=================================");
    console.log("MongoDB connected successfully");
    console.log("Database:", DB_NAME);
    console.log("=================================");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);

    process.exit(1);
  }
}

/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

function adminAuth(req, res, next) {
  const username =
    req.headers["x-admin-user"];

  const password =
    req.headers["x-admin-password"];

  if (
    username === ADMIN.username &&
    password === ADMIN.password
  ) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
}

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "running",
    mongodb:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

/* =========================================================
   PUBLIC MANDAL API
========================================================= */

/*
   Get all active Mandals
*/

app.get("/api/mandals", async (req, res) => {
  try {
    const mandals = await Mandal.find({
      active: true
    })
      .sort({
        createdAt: -1
      })
      .lean();

    res.json({
      success: true,
      data: mandals
    });
  } catch (error) {
    console.error(
      "GET /api/mandals error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to load Mandals"
    });
  }
});

/*
   Get one Mandal
*/

app.get(
  "/api/mandals/:id",
  async (req, res) => {
    try {
      const mandal =
        await Mandal.findById(
          req.params.id
        ).lean();

      if (!mandal) {
        return res.status(404).json({
          success: false,
          message: "Mandal not found"
        });
      }

      res.json({
        success: true,
        data: mandal
      });
    } catch (error) {
      console.error(
        "GET /api/mandals/:id error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to load Mandal"
      });
    }
  }
);

/* =========================================================
   ADMIN LOGIN
========================================================= */

app.post(
  "/api/admin/login",
  (req, res) => {
    const {
      username,
      password
    } = req.body;

    if (
      username === ADMIN.username &&
      password === ADMIN.password
    ) {
      return res.json({
        success: true,
        message: "Login successful"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }
);

/* =========================================================
   ADMIN - GET ALL MANDALS
========================================================= */

app.get(
  "/api/admin/mandals",
  adminAuth,
  async (req, res) => {
    try {
      const mandals =
        await Mandal.find()
          .sort({
            createdAt: -1
          })
          .lean();

      res.json({
        success: true,
        data: mandals
      });
    } catch (error) {
      console.error(
        "Admin GET error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to load Mandals"
      });
    }
  }
);

/* =========================================================
   ADMIN - ADD MANDAL
========================================================= */

app.post(
  "/api/admin/mandals",
  adminAuth,
  async (req, res) => {
    try {
      const mandal =
        await Mandal.create(
          req.body
        );

      res.status(201).json({
        success: true,
        data: mandal
      });
    } catch (error) {
      console.error(
        "Admin CREATE error:",
        error.message
      );

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

/* =========================================================
   ADMIN - UPDATE MANDAL
========================================================= */

app.put(
  "/api/admin/mandals/:id",
  adminAuth,
  async (req, res) => {
    try {
      const mandal =
        await Mandal.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!mandal) {
        return res.status(404).json({
          success: false,
          message: "Mandal not found"
        });
      }

      res.json({
        success: true,
        data: mandal
      });
    } catch (error) {
      console.error(
        "Admin UPDATE error:",
        error.message
      );

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

/* =========================================================
   ADMIN - DELETE MANDAL
========================================================= */

app.delete(
  "/api/admin/mandals/:id",
  adminAuth,
  async (req, res) => {
    try {
      const mandal =
        await Mandal.findByIdAndDelete(
          req.params.id
        );

      if (!mandal) {
        return res.status(404).json({
          success: false,
          message: "Mandal not found"
        });
      }

      res.json({
        success: true,
        message: "Mandal deleted successfully"
      });
    } catch (error) {
      console.error(
        "Admin DELETE error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Delete failed"
      });
    }
  }
);

/* =========================================================
   ADMIN PANEL
========================================================= */

app.get(
  "/admin",
  (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "public",
        "admin.html"
      )
    );
  }
);

/* =========================================================
   FRONTEND FALLBACK
========================================================= */

/*
   IMPORTANT:

   Do NOT use:

   app.get("*", ...)

   Express 5 throws:

   PathError:
   Missing parameter name at index 1: *

   Instead we use app.use() as the frontend
   fallback. This is compatible with Express 5.
*/

app.use(
  (req, res, next) => {
    /*
       If the request is for an API route that
       doesn't exist, return JSON instead of
       loading the homepage.
    */

    if (
      req.path.startsWith("/api/")
    ) {
      return res.status(404).json({
        success: false,
        message: "API endpoint not found"
      });
    }

    /*
       Otherwise serve the main website.
    */

    res.sendFile(
      path.join(
        __dirname,
        "public",
        "index.html"
      )
    );
  }
);

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
  (error, req, res, next) => {
    console.error(
      "Server error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
);

/* =========================================================
   START SERVER
========================================================= */

async function startServer() {
  await connectDatabase();

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log(
        "================================="
      );

      console.log(
        `Mandal Locator running on port ${PORT}`
      );

      console.log(
        "Website is ready"
      );

      console.log(
        "================================="
      );
    }
  );
}

startServer();