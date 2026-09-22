import { useEffect, useRef } from "react";
import {
  MapPin,
  Clock3,
  BellRing,
  Navigation,
  Sparkles,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Globe,
} from "lucide-react";

import AagmanInfo from "./AagmanInfo";
import {
  getAagmanDateTime,
  formatAagmanDate,
  formatAagmanTime,
  addCalendarReminder,
} from "../utils/aagman";

const FIELD_KEYS = {
  latitude: ["lat", "latitude"],
  longitude: ["lng", "longitude"],
  image: ["image", "imageUrl", "photo", "imageURL"],
  nameMr: ["nameMr", "marathiName"],
  area: ["area"],
  location: ["location"],
  address: ["address", "fullAddress"],
  description: ["description", "desc", "about"],
  directions: ["mapsUrl", "googleMapsUrl", "mapUrl", "googleMapUrl"],
  instagram: ["instagram", "instagramUrl", "instagramURL"],
  facebook: ["facebook", "facebookUrl", "facebookURL"],
  youtube: ["youtube", "youtubeUrl", "youtubeURL"],
  whatsapp: ["whatsapp", "whatsappUrl", "whatsappURL"],
  website: ["website", "websiteUrl", "websiteURL"],
};

function readValue(mandal, keys) {
  for (const key of keys) {
    const value = mandal?.[key];
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return "";
}

function cleanSocialUrl(value, type) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  if (type === "whatsapp") {
    const digits = raw.replace(/[^0-9]/g, "");
    return digits ? `https://wa.me/${digits}` : "";
  }

  if (["instagram", "facebook", "youtube"].includes(type)) {
    return `https://${type}.com/${raw.replace(/^@/, "")}`;
  }

  return `https://${raw}`;
}

const SOCIALS = [
  { key: "instagram", label: "Instagram", className: "instagram", icon: Instagram },
  { key: "facebook", label: "Facebook", className: "facebook", icon: Facebook },
  { key: "youtube", label: "YouTube", className: "youtube", icon: Youtube },
  { key: "whatsapp", label: "WhatsApp", className: "whatsapp", icon: MessageCircle },
  { key: "website", label: "Website", className: "website", icon: Globe },
];

export default function DetailModal({ mandal, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!mandal) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      dialogRef.current?.focus({ preventScroll: true });
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [mandal, onClose]);

  if (!mandal) return null;

  const image = readValue(mandal, FIELD_KEYS.image);
  const name = String(mandal.name || "Ganpati Mandal").trim();
  const nameMr = readValue(mandal, FIELD_KEYS.nameMr);
  const area = readValue(mandal, FIELD_KEYS.area);
  const location = readValue(mandal, FIELD_KEYS.location);
  const address = readValue(mandal, FIELD_KEYS.address);
  const description = readValue(mandal, FIELD_KEYS.description);
  const directions = readValue(mandal, FIELD_KEYS.directions);
  const latitude = readValue(mandal, FIELD_KEYS.latitude);
  const longitude = readValue(mandal, FIELD_KEYS.longitude);

  const hasAagman = Boolean(getAagmanDateTime(mandal));
  const aagmanDate = formatAagmanDate(mandal);
  const aagmanTime = formatAagmanTime(mandal);

  const timings = [
    ["Darshan", mandal.darshanTiming],
    ["Aarti", mandal.aartiTiming],
    ["Morning Aarti", mandal.morningAarti],
    ["Evening Aarti", mandal.eveningAarti],
  ].filter(([, value]) => String(value || "").trim());

  const socialLinks = SOCIALS.map((social) => ({
    ...social,
    url: cleanSocialUrl(readValue(mandal, FIELD_KEYS[social.key]), social.key),
  })).filter((social) => social.url);

  function closeOnBackdrop(event) {
    if (event.target === event.currentTarget) onClose?.();
  }

  return (
    <div className="modal-backdrop" onMouseDown={closeOnBackdrop}>
      <div
        ref={dialogRef}
        className="detail-modal detail-modal-glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mandal-detail-title"
        tabIndex={-1}
      >
        <button type="button" className="modal-close modal-close-text" onClick={onClose} aria-label="Close mandal details">
          Close
        </button>

        {image ? (
          <img
            className="detail-image"
            src={image}
            alt={`${name} Ganpati`}
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="detail-image detail-image-fallback">ॐ</div>
        )}

        <div className="detail-content">
          <span className="section-kicker">Ganpati Mandal</span>
          <h2 id="mandal-detail-title">{name}</h2>
          {nameMr && <p className="detail-marathi">{nameMr}</p>}

          {(area || location || address) && (
            <div className="detail-location">
              <MapPin size={18} />
              <div>
                {area && <strong>{area}</strong>}
                {location && location !== area && <span>{location}</span>}
                {address && address !== location && <span>{address}</span>}
              </div>
            </div>
          )}

          <div className="detail-actions">
            {directions && (
              <a
                className="button button-primary"
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation size={17} />
                Get Directions
              </a>
            )}

            {hasAagman && (
              <button
                type="button"
                className="button button-dark reminder-button"
                onClick={() => addCalendarReminder(mandal)}
              >
                <BellRing size={17} />
                Add to Calendar
              </button>
            )}
          </div>

          {hasAagman && (
            <section className="detail-panel aagman-panel">
              <div className="detail-panel-heading">
                <div className="panel-heading-icon">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="panel-eyebrow">Special Event</span>
                  <h3>Ganpati Aagman</h3>
                </div>
              </div>

              <AagmanInfo mandal={mandal} />

              <div className="aagman-message">
                <BellRing size={17} />
                <p>
                  Aagman starts on <strong>{aagmanDate}</strong> at{" "}
                  <strong>{aagmanTime}</strong>. Tap Add to Calendar to open the
                  calendar event and save your reminder.
                </p>
              </div>
            </section>
          )}

          {description && (
            <section className="detail-panel">
              <h3>About this Mandal</h3>
              <p>{description}</p>
            </section>
          )}

          {timings.length > 0 && (
            <section className="detail-panel">
              <h3>
                <Clock3 size={18} />
                Timings
              </h3>
              <div className="timing-grid">
                {timings.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

          {socialLinks.length > 0 && (
            <section className="detail-panel">
              <h3>Connect With Mandal</h3>
              <div className="detail-social-grid">
                {socialLinks.map(({ url, label, className, icon: Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`detail-social-link ${className}`}
                  >
                    <Icon size={19} />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {(latitude || longitude) && (
            <section className="detail-panel">
              <h3>
                <MapPin size={18} />
                Location
              </h3>
              <div className="coordinates">
                {latitude && (
                  <div>
                    <span>Latitude</span>
                    <strong>{latitude}</strong>
                  </div>
                )}
                {longitude && (
                  <div>
                    <span>Longitude</span>
                    <strong>{longitude}</strong>
                  </div>
                )}
              </div>
            </section>
          )}

          <button type="button" className="button button-outline modal-bottom-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
