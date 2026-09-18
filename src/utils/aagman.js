// src/utils/aagman.js

function readCanonicalOrLegacy(mandal, canonicalKey, legacyKeys = []) {
  if (!mandal) return "";

  if (Object.prototype.hasOwnProperty.call(mandal, canonicalKey)) {
    return String(mandal[canonicalKey] || "").trim();
  }

  for (const key of legacyKeys) {
    if (Object.prototype.hasOwnProperty.call(mandal, key)) {
      return String(mandal[key] || "").trim();
    }
  }

  return "";
}

export function getAagmanDate(mandal) {
  return readCanonicalOrLegacy(mandal, "aagamanDate", [
    "aagmanDate",
    "aagaman_date",
    "aagman_date",
    "date",
  ]);
}

export function getAagmanTime(mandal) {
  return readCanonicalOrLegacy(mandal, "aagamanTime", [
    "aagmanTime",
    "aagaman_time",
    "aagman_time",
    "time",
  ]);
}

export function getAagmanDateTime(mandal) {
  const date = getAagmanDate(mandal);
  const time = getAagmanTime(mandal);

  if (!date || !time) return null;

  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatAagmanDate(mandal) {
  const date = getAagmanDateTime(mandal);
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatAagmanTime(mandal) {
  const date = getAagmanDateTime(mandal);
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function getAagmanStatus(mandal) {
  const target = getAagmanDateTime(mandal);
  if (!target) return { type: "unknown", text: "" };

  const difference = target.getTime() - Date.now();
  if (difference <= 0) {
    return { type: "started", text: "Aagman has started" };
  }

  const minutes = Math.floor(difference / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  if (days > 0) {
    return {
      type: "upcoming",
      text: days === 1 ? "Aagman starts tomorrow" : `Aagman starts in ${days} days`,
    };
  }

  if (hours > 0) {
    return { type: "upcoming", text: `Aagman starts in ${hours}h ${mins}m` };
  }

  return {
    type: "soon",
    text: mins > 0 ? `Aagman starts in ${mins} minutes` : "Aagman starts now",
  };
}

function googleCalendarDate(date) {
  const pad = (value) => String(value).padStart(2, "0");

  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function buildGoogleCalendarUrl(mandal, start) {
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const name = mandal?.name || "Ganpati Mandal";
  const location =
    mandal?.address ||
    mandal?.fullAddress ||
    mandal?.location ||
    mandal?.area ||
    "";

  const details = [
    `Ganpati Aagman of ${name}.`,
    mandal?.description ? String(mandal.description).trim() : "",
    "Added from Ganpati Mandal Locator.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${name} - Ganpati Aagman`,
    dates: `${googleCalendarDate(start)}/${googleCalendarDate(end)}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Opens the calendar add-event screen without downloading an .ics file.
 *
 * Android Chrome: tries the installed Google Calendar app first.
 * Other browsers/devices: opens the Google Calendar add-event screen.
 */
export function addCalendarReminder(mandal) {
  const start = getAagmanDateTime(mandal);

  if (!start) {
    window.alert("Aagman date and starting time are not available for this mandal.");
    return;
  }

  const calendarUrl = buildGoogleCalendarUrl(mandal, start);
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isChromeLike = /Chrome|CriOS/i.test(ua);

  if (isAndroid && isChromeLike) {
    const withoutScheme = calendarUrl.replace(/^https:\/\//, "");
    const intentUrl =
      `intent://${withoutScheme}` +
      `#Intent;scheme=https;package=com.google.android.calendar;` +
      `S.browser_fallback_url=${encodeURIComponent(calendarUrl)};end`;

    window.location.href = intentUrl;
    return;
  }

  const popup = window.open(calendarUrl, "_blank", "noopener,noreferrer");

  if (!popup) {
    window.location.href = calendarUrl;
  }
}
