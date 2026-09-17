import React from "react";
import { MapPin, ArrowUpRight, Sparkles } from "lucide-react";

export default function MandalCard({
  mandal,
  savedIds = [],
  toggleSaved,
  onOpen,
}) {
  if (!mandal) return null;

  const image =
    mandal.image ||
    mandal.imageUrl ||
    mandal.photo ||
    mandal.imageURL ||
    "";

  const address =
    mandal.address ||
    mandal.fullAddress ||
    mandal.location ||
    mandal.area ||
    "";

  const openMandal = () => {
    if (typeof onOpen === "function") {
      onOpen(mandal);
    }
  };

  return (
    <article className="mandal-card mandal-card-modern">
      <div className="mandal-card-image-wrap">
        <button
          type="button"
          className="card-image-button"
          onClick={openMandal}
          aria-label={`Open ${
            mandal.name || "Ganpati Mandal"
          }`}
        >
          {image ? (
            <img
              className="card-image"
              src={image}
              alt={`${mandal.name || "Ganpati Mandal"} Ganpati`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="card-image-fallback">
              <Sparkles size={42} />
              <span>Ganpati Mandal</span>
            </div>
          )}
        </button>

        <div className="card-image-gradient" />

        <div className="card-top-badges">
          <span className="mandal-type-badge">
            <Sparkles size={13} />
            Ganpati Mandal
          </span>
</div>

        <button
          type="button"
          className="card-image-open"
          onClick={openMandal}
          aria-label="View mandal"
          title="View mandal"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="card-body">
        <div className="mandal-title-row">
          <div className="mandal-title-content">
            <h3>
              {mandal.name || "Ganpati Mandal"}
            </h3>

            {mandal.nameMr && (
              <p className="marathi-name">
                {mandal.nameMr}
              </p>
            )}
          </div>
        </div>

        {address && (
          <div className="mandal-address">
            <span className="address-icon">
              <MapPin size={16} />
            </span>

            <span className="address-text">
              {address}
            </span>
          </div>
        )}

        <div className="card-actions">
          <button
            type="button"
            className="button button-primary mandal-view-button"
            onClick={openMandal}
          >
            <span>View Mandal</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}