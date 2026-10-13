# Ganpati Mandal Locator — static website

A responsive multi-page website built with semantic HTML5, CSS and vanilla JavaScript. No build process is required.

## Pages
- `index.html` — hero, search, featured mandals, OpenStreetMap, stats and community CTA
- `mandals.html` — searchable and filterable mandal directory
- `mandal.html?id=...` — mandal details, timings, social link and map
- `about.html` — project purpose
- `instagram.html` — social link and lightbox gallery
- `contact.html` — validated contact form demo and mandal submission link
- `admin.html` — browser-local CRUD, JSON import/export

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a current browser. For best results, run a simple static server such as VS Code Live Server.
3. Use `admin.html` to add/edit listings. Export a JSON backup before clearing browser data.

## Maps
The interactive map uses Leaflet and OpenStreetMap tiles, which avoids a Google Maps API key. Tile usage is subject to OpenStreetMap tile usage policies and attribution must remain visible. “Directions” opens Google Maps directions in a new tab; no embedded Google Maps API key is required for that link.

## MongoDB configuration template
- `.env.example` shows the `MONGODB_URI` setting for a future server-side Node.js backend. Copy it to `.env` on your own computer and replace the placeholder values.
- `.gitignore` excludes the real `.env` file from Git. Never publish MongoDB credentials in HTML, browser JavaScript, or a public repository.
- **This website is currently static HTML/CSS/JavaScript, so it cannot read `.env` or connect securely to MongoDB directly.** A backend/API is required to use MongoDB safely. Adding the connection string to frontend code would expose it to every visitor.

## Important production limitations
This is a static-only build, so admin changes are stored in **localStorage in the current browser only**. They do not sync to visitors, other devices or the deployed website. Client-side admin pages cannot securely authenticate users or write to a shared database without a backend/service. For a real public directory, connect a hosted database and secure authentication (or use a managed CMS) before relying on the admin page for live updates.

The contact form validates fields in the browser but does not send email. Connect a form service or backend before launch.

Starter mandal records are illustrative examples. Verify all names, addresses, coordinates, schedules and social URLs before public use. Replace placeholder gallery/team images with media you have permission to publish.

## External assets
Poppins (Google Fonts), Font Awesome icons, Leaflet, OpenStreetMap map tiles and sample Unsplash photos are loaded from external services and need an internet connection. For a strict offline site, download and self-host these assets and observe their respective licences/policies.

## Deploy
Upload the extracted folder to any static hosting provider (GitHub Pages, Netlify, Vercel static deployment, etc.). Keep all HTML files, `styles.css` and `app.js` together in the same directory.


## SEO setup for ganpatimandallocator.dpdns.org
The HTML pages include page-specific titles and descriptions, canonical URLs, robots directives, Open Graph and Twitter metadata. `sitemap.xml` and `robots.txt` are included. After deploying to the domain, verify the canonical URLs and submit `https://ganpatimandallocator.dpdns.org/sitemap.xml` in Google Search Console. Add a real `og-image.jpg` at the site root if you want a social-sharing preview image; it is referenced in metadata but is not included as a placeholder file. SEO tags do not guarantee rankings; indexing and ranking depend on crawlability, useful verified content, performance and external signals.

### Admin page lock
- The admin page now asks you to create a browser-local password the first time it is opened. Use at least 8 characters, then confirm it.
- The dashboard also has a **Lock dashboard** button and automatically locks after 10 minutes without activity.
- The password hash is stored in this browser only; unlocking is a front-end screen lock, **not secure server authentication**. A person who can edit the site files or browser storage can bypass it. It does not use `MONGODB_URI`, connect to MongoDB, or sync listings between visitors/devices.
- To reset the browser-local password, clear this site's local storage for the key `gml-admin-password-hash-v1`. This does not delete mandal data stored under `gml-mandals-v1` unless you clear all site data.
- For a public production admin, use server-side authentication and keep credentials in server environment variables; never put the MongoDB URI or an admin password in frontend files.


## Local admin PIN lock

- Open `admin-pin.js` and change `window.GML_ADMIN_PIN = "2580";` to your own 4–8 digit PIN before deploying.
- Keep the PIN numeric and between 4 and 8 digits.
- The admin page loads `admin-pin.js` and compares the entered PIN locally. It locks after 10 minutes of inactivity and when the page is left.
- **Security limitation:** because this is a static website, `admin-pin.js` is publicly downloadable and its PIN can be discovered by inspecting the source. Use this only as a basic local barrier, not to protect sensitive data. For real public admin security, use server-side authentication.


## Latest requested updates
- Added a live Ganeshotsav 2027 countdown to the homepage, targeting 4 September 2027.
- Mandal card and detail photos use a consistent 16:9 aspect ratio.
- Public navigation no longer links to the admin page or a separate Instagram page; the Instagram page was removed.
- Contact page shows only support email, Google Form, and Instagram account.
- Admin page is marked `noindex, nofollow` and remains accessible by direct URL for the owner.
