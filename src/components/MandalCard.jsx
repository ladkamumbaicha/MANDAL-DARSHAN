import {
  ArrowUpRight,
  Bookmark,
  Clock3,
  Facebook,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Youtube,
} from "lucide-react";

function socialUrl(value, type) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (type === "whatsapp") {
    const digits = raw.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : "";
  }
  if (type === "website") return `https://${raw}`;
  return `https://${type}.com/${raw.replace(/^@/, "")}`;
}

export default function MandalCard({ mandal, savedIds = [], toggleSaved, onOpen }) {
  if (!mandal) return null;
  const image = mandal.image || mandal.imageUrl || mandal.photo || mandal.imageURL || "";
  const id = mandal.id || mandal._id;
  const saved = savedIds.includes(id);
  const area = mandal.area || mandal.location || "Mumbai";
  const address = mandal.address || mandal.fullAddress || mandal.location || area;
  const description = mandal.description || mandal.desc || "Discover darshan information, timings, routes and social links for this Ganpati mandal.";
  const timing = mandal.darshanTiming || mandal.aartiTiming || mandal.eveningAarti || "Check details";

  const socials = [
    [Instagram, "instagram", "Instagram", mandal.instagram],
    [Facebook, "facebook", "Facebook", mandal.facebook],
    [Youtube, "youtube", "YouTube", mandal.youtube],
    [MessageCircle, "whatsapp", "WhatsApp", mandal.whatsapp],
    [Globe, "website", "Website", mandal.website],
  ].filter(([, type, , value]) => socialUrl(value, type));

  return (
    <article className="mandal-card-v2 mandal-card-solid">
      <div className="mandal-card-v2-media">
        {image ? (
          <img src={image} alt={`${mandal.name || "Ganpati Mandal"} Ganpati`} loading="lazy" />
        ) : (
          <div className="mandal-placeholder"><span>ॐ</span><small>GANPATI DARSHAN</small></div>
        )}
        <div className="mandal-card-v2-badge">DARSHAN</div>
        <button
          type="button"
          className={`mandal-save ${saved ? "saved" : ""}`}
          onClick={(e) => { e.stopPropagation(); toggleSaved?.(id); }}
          aria-label={saved ? "Remove saved mandal" : "Save mandal"}
        >
          <Bookmark size={17} />
        </button>
      </div>

      <div className="mandal-card-v2-body">
        <div className="mandal-card-v2-topline">
          <span><MapPin size={14} /> {area}</span>
          <span className="mandal-status"><i /> Active listing</span>
        </div>
        <h3>{mandal.name || "Ganpati Mandal"}</h3>
        {mandal.nameMr && <div className="mandal-marathi-v2">{mandal.nameMr}</div>}
        <p className="mandal-description">{description}</p>

        <div className="mandal-info-grid">
          <div><MapPin size={16} /><span><b>Address</b>{address}</span></div>
          <div><Clock3 size={16} /><span><b>Darshan / Aarti</b>{timing}</span></div>
          {mandal.morningAarti && <div><Clock3 size={16} /><span><b>Morning Aarti</b>{mandal.morningAarti}</span></div>}
          {mandal.eveningAarti && <div><Clock3 size={16} /><span><b>Evening Aarti</b>{mandal.eveningAarti}</span></div>}
        </div>

        {socials.length > 0 && (
          <div className="mandal-card-socials" aria-label="Mandal social media">
            {socials.map(([Icon, type, label, value]) => (
              <a key={type} href={socialUrl(value, type)} target="_blank" rel="noopener noreferrer" title={label} onClick={(e) => e.stopPropagation()}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        )}

        <button type="button" className="mandal-explore-v2" onClick={() => onOpen?.(mandal)}>
          View full mandal details <ArrowUpRight size={18} />
        </button>
      </div>
    </article>
  );
}
