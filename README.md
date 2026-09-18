# Ganpati Mandal Locator

## Map
This project uses Leaflet with OpenStreetMap tiles for the interactive map. It does not require a Google Maps API key or a paid Google Maps billing account.

OpenStreetMap tiles are free to use subject to the tile provider's usage policy. Do not present this as an unlimited commercial tile service.

## Environment variables
Copy `.env.example` to `.env` for local server configuration. Keep secrets only on the server and never commit `.env`.

Required backend variables:
- `MONGODB_URI`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`

Optional variables:
- `MONGODB_DB` defaults to `ganpati_locator`
- `MONGODB_COLLECTION` defaults to `mandals`
- `PORT` defaults to `10000` when running the included server
