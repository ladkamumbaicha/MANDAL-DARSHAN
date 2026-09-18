import { Instagram, Plus, X, Heart } from "lucide-react";

const FORM_URL = "https://forms.gle/h7WQ3UutEH3kbo339";
const INSTAGRAM_URL = "https://instagram.com/ladka_mumbai_cha";

export default function CommunityPopup({ open, onClose }) {
  if (!open) return null;

  const close = () => {
    sessionStorage.setItem("community-popup-dismissed", "1");
    onClose?.();
  };

  return (
    <div className="community-popup-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <section className="community-popup" role="dialog" aria-modal="true" aria-labelledby="community-popup-title">
        <button className="community-popup-close" onClick={close} aria-label="Close popup"><X size={20} /></button>
        <div className="community-popup-glow glow-a" />
        <div className="community-popup-glow glow-b" />
        <div className="community-popup-icon"><Heart size={24} fill="currentColor" /></div>
        <span className="section-kicker">Mandal community</span>
        <h2 id="community-popup-title">Help us add more Bappa Mandals</h2>
        <p>Know a Ganpati Mandal that should be on the locator? Share its details with us. You can also follow us for new mandals, updates and festival coverage.</p>
        <div className="community-popup-actions">
          <a className="button button-primary community-primary" href={FORM_URL} target="_blank" rel="noreferrer"><Plus size={18} /> Add Mandal</a>
          <a className="button button-glass" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={18} /> Follow on Instagram</a>
        </div>
        <small>Your contribution helps make Mandal Darshan more complete for everyone.</small>
      </section>
    </div>
  );
}
