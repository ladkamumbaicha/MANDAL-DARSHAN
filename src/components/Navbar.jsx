import { Download, Plus, Instagram } from "lucide-react";
import usePWAInstall from "../hooks/usePWAInstall";

export default function Navbar({ onExplore, onMap, onAddMandal }) {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="brand-mark">ॐ</span>
          <span>
            <strong>Mandal Darshan</strong>
            <small>Ganpati Mandal Locator</small>
          </span>
        </button>

        <div className="nav-links">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</button>
          <button onClick={onExplore}>Explore</button>
          <button onClick={onMap}>Map</button>
          <a href="#about">About</a>\n          <button className="nav-add-mandal" onClick={onAddMandal}><Plus size={16} /> Add Mandal</button>
        </div>

        {canInstall && (
          <button
            className="button button-primary nav-install"
            onClick={promptInstall}
          >
            <Download size={17} />
            Install App
          </button>
        )}
        
        {isInstalled && (
          <button className="button button-primary nav-install" disabled>
            <Download size={17} />
            Installed
          </button>
        )}
      </nav>
    </header>
  );
}
