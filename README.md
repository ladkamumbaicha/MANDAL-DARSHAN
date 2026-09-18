# Ganpati Mandal Locator

Premium sacred-temple themed Ganpati Mandal discovery website.

## Local setup

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

## MongoDB

The MongoDB connection string is configured in `api/_lib/config.js` so Render does not need a `MONGODB_URI` environment variable.

**Security:** keep the GitHub repository private if you place a real MongoDB connection string in source code. Do not publish database credentials in a public repository.

Replace `PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE` in `api/_lib/config.js` with your real connection string before deployment. The app does **not** read `MONGODB_URI` from Render.

Because a real MongoDB URI contains database credentials, keep the GitHub repository **private**. Never publish the real URI in a public repository.

Admin login values (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`) can remain Render environment variables.
