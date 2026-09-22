import { ListFilter, Map, Search, SlidersHorizontal } from "lucide-react";
import MandalCard from "./MandalCard";

export default function ExploreSection({ mandals, query, setQuery, area, setArea, areas, savedIds, toggleSaved, onOpen, showSaved, setShowSaved, loading }) {
  return (
    <section className="directory-v2" id="explore-section">
      <div className="directory-v2-head">
        <div>
          <span className="directory-label">THE DARSHAN DIRECTORY</span>
          <h2>Choose your<br/><em>next darshan.</em></h2>
          <p>Every listing is built to answer the questions you need before you leave home — where it is, when aarti happens, what to expect and how to get there.</p>
        </div>
        <div className="directory-number"><strong>{mandals.length}</strong><span>mandals<br/>to explore</span></div>
      </div>

      <div className="directory-toolbar">
        <div className="toolbar-title"><SlidersHorizontal size={18}/><span>Refine your search</span></div>
        <label className="directory-search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search mandal, area, landmark..." /></label>
        <select value={area} onChange={e=>setArea(e.target.value)}><option value="">All areas</option>{areas.map(item=><option key={item} value={item}>{item}</option>)}</select>
        <button className={`directory-chip ${showSaved ? "active":""}`} onClick={()=>setShowSaved(v=>!v)}><span>♡</span> Saved</button>
        <a className="directory-chip" href="#map-section"><Map size={16}/> Map</a>
      </div>

      {loading ? <div className="directory-empty">Loading the darshan directory…</div> : mandals.length ? (
        <div className="mandal-grid-v2">{mandals.map(m=><MandalCard key={m.id || m._id} mandal={m} savedIds={savedIds} toggleSaved={toggleSaved} onOpen={onOpen}/>)}</div>
      ) : (
        <div className="directory-empty"><ListFilter size={34}/><h3>No mandal found</h3><p>Try another search or clear your filters.</p></div>
      )}
    </section>
  );
}
