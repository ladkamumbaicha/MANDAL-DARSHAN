// ============================================================
// GANPATI MANDAL LOCATOR - SERVER CONFIGURATION
// ============================================================
// IMPORTANT:
// 1. This file is SERVER-ONLY.
// 2. Never import this file from src/.
// 3. No Render Environment Variables are required.
// 4. Replace the placeholder values below with your new values.
// ============================================================

export const config = {
  // ----------------------------------------------------------
  // MONGODB
  // ----------------------------------------------------------
  mongodbUri:
    "mongodb+srv://dakshbudhel123_db_user:0H9Pq18uMFuVo1tk@cluster0.ljj9xq8.mongodb.net/ganpati_locatormongodb+srv://dakshbudhel123_db_user:0H9Pq18uMFuVo1tk@cluster0.ljj9xq8.mongodb.net/ganpati_locator",

  mongodbDb: "ganpati_locator",

  mongodbCollection: "mandals",

  // ----------------------------------------------------------
  // ADMIN LOGIN
  // ----------------------------------------------------------
  adminEmail: "dakshbudhel123@gmail.com",

  adminPassword: "ladkamumbaicha",

  // ----------------------------------------------------------
  // JWT SECRET
  // ----------------------------------------------------------
  // Use a long random string.
  jwtSecret:
    "gml-2026-8f0a4c9d2e7b1a6f5c3d9e8b7a2f4c6d1e5a9b3c7d8f2e6a4b9c1d5f7e3a8"
};