import { Grid2X2, ListFilter, Map, Search } from "lucide-react";
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
      <div className="section-heading">
        <div>
          <span className="section-kicker">Browse</span>
          <h2>Explore All Mandals</h2>
        </div>
        <span className="result-count">{mandals.length} results</span>
      </div>

      <div className="filter-bar">
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

        <a className="chip" href="#map-section">
          <Map size={16} />
          Map
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
