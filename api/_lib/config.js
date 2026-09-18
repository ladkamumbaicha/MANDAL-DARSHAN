// Server-only configuration. Set these values in Vercel/Render environment variables.
export const config = {
  mongodbUri: process.env.MONGODB_URI || "",
  mongodbDb: process.env.MONGODB_DB || "ganpati_locator",
  mongodbCollection: process.env.MONGODB_COLLECTION || "mandals",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  jwtSecret: process.env.JWT_SECRET || ""
};
