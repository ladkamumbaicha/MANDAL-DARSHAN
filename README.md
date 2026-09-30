# Ganpati Mandal Locator

## Render
Build command:
`npm install && npm run build`

Start command:
`npm start`

## MongoDB
Edit `config.js` and replace the three placeholders:
- `YOUR_NEW_MONGODB_PASSWORD`
- `YOUR_NEW_ADMIN_PASSWORD`
- `YOUR_NEW_RANDOM_JWT_SECRET`

Database: `ganpati_locator`
Collection: `mandals`

The MongoDB `collection` option is deliberately NOT passed to `mongoose.connect()`. The collection name belongs to the Mongoose schema.

## Admin
Open `/admin` and log in with the configured admin email/password.

## SEO
Canonical domain: `https://ganpatimandallcator.dpdns.org/`
Sitemap: `/sitemap.xml`
Robots: `/robots.txt`
