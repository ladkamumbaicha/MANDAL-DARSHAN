export function mandalMapUrl(mandal = {}) {
  const lat = Number(mandal.lat ?? mandal.latitude);
  const lng = Number(mandal.lng ?? mandal.longitude);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const zoom = 17;
    return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lng)}#map=${zoom}/${encodeURIComponent(lat)}/${encodeURIComponent(lng)}`;
  }

  const query = [mandal.name, mandal.area, mandal.location].filter(Boolean).join(" ");
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query || "Ganpati Mandal")}`;
}
