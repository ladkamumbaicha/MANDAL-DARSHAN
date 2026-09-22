import { ArrowUpRight, Bookmark, Clock3, MapPin, Navigation, Sparkles } from "lucide-react";

export default function MandalCard({ mandal, savedIds = [], toggleSaved, onOpen }) {
  if (!mandal) return null;
  const image = mandal.image || mandal.imageUrl || mandal.photo || mandal.imageURL || "";
  const id = mandal.id || mandal._id;
  const saved = savedIds.includes(id);
  const area = mandal.area || mandal.location || "Mumbai";
  const address = mandal.address || mandal.fullAddress || mandal.location || area;
  const timing = mandal.darshanTiming || mandal.aartiTiming || mandal.eveningAarti || "Timings available";
  const morning = mandal.morningAarti || "";
  const evening = mandal.eveningAarti || "";
  const description = mandal.description || mandal.desc || "Discover darshan information, timings and route details for this Ganpati mandal.";

  return (
    <article className="mandal-card-v2">
      <div className="mandal-card-v2-media">
        {image ? <img src={image} alt={`${mandal.name || "Ganpati Mandal"} Ganpati`} loading="lazy"/> : <div className="mandal-placeholder"><span>ॐ</span><small>GANPATI DARSHAN</small></div>}
        <div className="mandal-card-v2-badge"><Sparkles size={13}/> DARSHAN</div>
        <button className={`mandal-save ${saved ? "saved" : ""}`} onClick={(e) => {e.stopPropagation(); toggleSaved?.(id);}} aria-label={saved ? "Remove saved mandal" : "Save mandal"}><Bookmark size={17}/></button>
        <div className="mandal-image-gradient"/>
      </div>

      <div className="mandal-card-v2-body">
        <div className="mandal-card-v2-topline"><span>{area}</span><span className="mandal-status"><i/> Listed</span></div>
        <h3>{mandal.name || "Ganpati Mandal"}</h3>
        {mandal.nameMr && <div className="mandal-marathi-v2">{mandal.nameMr}</div>}
        <p className="mandal-description">{description}</p>

        <div className="mandal-info-grid">
          <div><MapPin size={16}/><span><b>Location</b>{address}</span></div>
          <div><Clock3 size={16}/><span><b>Darshan</b>{timing}</span></div>
          {morning && <div><Clock3 size={16}/><span><b>Morning Aarti</b>{morning}</span></div>}
          {evening && <div><Clock3 size={16}/><span><b>Evening Aarti</b>{evening}</span></div>}
        </div>

        <button className="mandal-explore-v2" onClick={() => onOpen?.(mandal)}>
          View full mandal details <ArrowUpRight size={18}/>
        </button>
      </div>
    </article>
  );
}
