import { Bookmark, Home, Map, Search } from "lucide-react";

export default function BottomNav({ onHome, onExplore, onMap, onSaved }) {
  return (
    <nav className="bottom-nav">
      <button onClick={onHome}><Home size={21} /><span>Home</span></button>
      <button onClick={onExplore}><Search size={21} /><span>Explore</span></button>
      <button onClick={onMap}><Map size={21} /><span>Map</span></button>
      <button onClick={onSaved}><Bookmark size={21} /><span>Saved</span></button>
    </nav>
  );
}
