import { ArrowUpRight, Bookmark, MapPin, Sparkles } from "lucide-react";

export default function MandalCard({ mandal, savedIds = [], toggleSaved, onOpen }) {
  if (!mandal) return null;

  const image = mandal.image || mandal.imageUrl || mandal.photo || mandal.imageURL || "";
  const id = mandal.id || mandal._id;
  const saved = savedIds.includes(id);
  const area = mandal.area || mandal.location || "Mumbai";

  const openDetails = () => onOpen?.(mandal);

  return (
    <article
      className="mandal-card-v2 mandal-card-preview"
      tabIndex={0}
      role="button"
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetails();
        }
      }}
      aria-label={`Open details for ${mandal.name || "Ganpati Mandal"}`}
    >
      <div className="mandal-card-v2-media">
        {image ? (
          <img src={image} alt={`${mandal.name || "Ganpati Mandal"} Ganpati`} loading="lazy" />
        ) : (
          <div className="mandal-placeholder"><span>ॐ</span><small>GANPATI DARSHAN</small></div>
        )}
        <div className="mandal-card-v2-badge"><Sparkles size={13} /> DARSHAN</div>
        <button
          type="button"
          className={`mandal-save ${saved ? "saved" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            toggleSaved?.(id);
          }}
          aria-label={saved ? "Remove saved mandal" : "Save mandal"}
        >
          <Bookmark size={17} />
        </button>
      </div>

      <div className="mandal-card-v2-body mandal-card-preview-body">
        <span className="mandal-preview-kicker">GANPATI MANDAL</span>
        <h3>{mandal.name || "Ganpati Mandal"}</h3>
        {mandal.nameMr && <div className="mandal-marathi-v2">{mandal.nameMr}</div>}

        <div className="mandal-preview-location">
          <MapPin size={16} />
          <span>{area}</span>
        </div>

        <div className="mandal-preview-footer">
          <span>View all mandal information</span>
          <ArrowUpRight size={18} />
        </div>
      </div>
    </article>
  );
}
