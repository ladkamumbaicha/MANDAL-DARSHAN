import { Instagram, MapPinned } from "lucide-react";

export default function Footer() {
  return (
    <footer id="about">
      <div className="section-shell footer-grid">
        <div>
          <div className="footer-brand">
            <span className="brand-mark">ॐ</span>
            <div>
              <strong>Mandal Darshan</strong>
              <span>Find Bappa. Find Your Way.</span>
            </div>
          </div>
          <p>
            A modern Ganpati mandal discovery platform built for faster darshan planning,
            directions and festival information.
          </p>
        </div>

        <div className="footer-links">
          <a href="#explore-section">Explore</a>
          <a href="#map-section">Map</a>
          <a href="#about">About</a>
          <a href="https://forms.gle/h7WQ3UutEH3kbo339" target="_blank" rel="noreferrer">
            Add Mandal
          </a>
        </div>

        <div className="footer-social">
          <a href="https://instagram.com/ladka_mumbai_cha" target="_blank" rel="noreferrer">
            <Instagram size={18} />
            @ladka_mumbai_cha
          </a>
          <span><MapPinned size={18} /> Mumbai, Maharashtra</span>
        </div>
      </div>

      <div className="footer-bottom section-shell">
        <span>Made with 🧡 & devotion by Ladka Mumbai Cha</span>
        <span>© 2026 Mandal Darshan</span>
      </div>
    </footer>
  );
}
