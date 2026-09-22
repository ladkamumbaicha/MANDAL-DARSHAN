import { Download, Plus, Search } from "lucide-react";
import usePWAInstall from "../hooks/usePWAInstall";

export default function Navbar({ onExplore, onMap, onAddMandal }) {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();
  return (
    <header className="navbar-v2">
      <nav>
        <button className="brand-v2" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
          <span className="brand-v2-symbol">ॐ</span>
          <span><b>MANDAL</b><small>DARSHAN</small></span>
        </button>
        <div className="nav-v2-links">
          <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Home</button>
          <button onClick={onExplore}>Directory</button>
          <button onClick={onMap}>Map</button>
          <a href="#about">About</a>
        </div>
        <div className="nav-v2-actions">
          {canInstall && <button className="nav-install-v2" onClick={promptInstall}><Download size={16}/> Install</button>}
          {isInstalled && <span className="nav-installed">Installed</span>}
          <button className="nav-add-v2" onClick={onAddMandal}><Plus size={17}/> Add your Mandal</button>
        </div>
      </nav>
    </header>
  );
}
