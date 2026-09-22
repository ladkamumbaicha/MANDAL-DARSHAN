import React from "react";
import { MapPin, ArrowUpRight, Sparkles, Navigation, Clock3 } from "lucide-react";

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

  const timing = mandal.darshanTiming || mandal.aartiTiming || "Darshan timings available";
  const areaText = mandal.area || mandal.location || "Mumbai";

  return (
    <article className="mandal-card mandal-card-new">
      <div className="mandal-card-image-wrap">
        <button type="button" className="card-image-button" onClick={openMandal} aria-label={`Open ${mandal.name || "Ganpati Mandal"}`}>
          {image ? (
            <img className="card-image" src={image} alt={`${mandal.name || "Ganpati Mandal"} Ganpati`} loading="lazy" decoding="async" />
          ) : (
            <div className="card-image-fallback"><Sparkles size={42} /><span>Ganpati Mandal</span></div>
          )}
        </button>
        <div className="mandal-image-shade" />
        <div className="mandal-photo-label"><Sparkles size={13} /> Ganpati Darshan</div>
        <div className="mandal-photo-count">DARSHAN</div>
      </div>

      <div className="mandal-card-content">
        <div className="mandal-card-eyebrow">{areaText}</div>
        <div className="mandal-title-row">
          <div className="mandal-title-content">
            <h3>{mandal.name || "Ganpati Mandal"}</h3>
            {mandal.nameMr && <p className="marathi-name">{mandal.nameMr}</p>}
          </div>
        </div>

        {address && (
          <div className="mandal-address mandal-address-new">
            <MapPin size={16} />
            <span>{address}</span>
          </div>
        )}

        <div className="mandal-meta-row">
          <span><Clock3 size={15} /> {timing}</span>
          <span><Navigation size={15} /> {areaText}</span>
        </div>

        <div className="card-actions mandal-card-actions-new">
          <button type="button" className="mandal-open-button" onClick={openMandal}>
            Explore Mandal <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}