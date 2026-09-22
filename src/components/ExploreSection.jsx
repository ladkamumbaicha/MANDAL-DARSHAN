import { ListFilter, Map, Search, Sparkles, SlidersHorizontal } from "lucide-react";
import MandalCard from "./MandalCard";

export default function ExploreSection({
  mandals,
  query,
  setQuery,
  area,
  setArea,
  areas,
  savedIds,
  toggleSaved,
  onOpen,
  showSaved,
  setShowSaved,
  loading
}) {
  return (
    <section className="section-shell content-section" id="explore-section">
      <div className="explore-hero-heading">
        <div className="explore-title-block">
          <span className="section-kicker"><Sparkles size={14} /> DARSHAN DIRECTORY</span>
          <h2>Discover Your Next<br /><em>Ganpati Darshan</em></h2>
          <p>Explore mandals by neighbourhood, save your favourites and open every listing for complete darshan details.</p>
        </div>
        <div className="explore-result-card">
          <strong>{mandals.length}</strong>
          <span>Mandals listed</span>
        </div>
      </div>

      <div className="filter-bar filter-bar-new"><div className="filter-heading"><SlidersHorizontal size={17} /> Find a mandal</div>
        <label className="filter-search">
          <Search size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mandals..."
          />
        </label>

        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">All areas</option>
          {areas.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <button
          className={`chip ${showSaved ? "chip-active" : ""}`}
          onClick={() => setShowSaved((v) => !v)}
        >
          ♡ Saved
        </button>

        <a className="chip map-chip-new" href="#map-section">
          <Map size={16} />
          Open map
        </a>
      </div>

      {loading ? (
        <div className="empty-state">Loading mandals…</div>
      ) : mandals.length ? (
        <div className="all-grid">
          {mandals.map((mandal) => (
            <MandalCard
              key={mandal.id}
              mandal={mandal}
              saved={savedIds.includes(mandal.id)}
              onSave={toggleSaved}
              onOpen={onOpen}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <ListFilter size={30} />
          <h3>No mandals found</h3>
          <p>Try another name, area, or turn off the Saved filter.</p>
        </div>
      )}
    </section>
  );
}
