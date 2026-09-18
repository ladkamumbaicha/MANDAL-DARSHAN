import { LocateFixed, Map, Search, Sparkles } from "lucide-react";

export default function Hero({
  query,
  setQuery,
  onNearMe,
  onMap,
  popularAreas,
  onArea
}) {
  return (
    <section className="hero section-shell">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15} /> Ganeshotsav 2026</div>
        <h1>
          Find Your <span>Bappa.</span>
        </h1>
        <p>
          Discover Ganpati mandals, aarti timings and directions across your city
          from one beautiful, mobile-first locator.
        </p>

        <div className="hero-search">
          <Search size={21} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mandal, area or location..."
            aria-label="Search mandals"
          />
        </div>

        <div className="hero-actions">
          <button className="button button-primary" onClick={onNearMe}>
            <LocateFixed size={18} />
            Near Me
          </button>
          <button className="button button-soft" onClick={onMap}>
            <Map size={18} />
            Explore Map
          </button>
        </div>

        <div className="popular-row">
          <span>Popular:</span>
          {popularAreas.map((area) => (
            <button key={area} onClick={() => onArea(area)}>{area}</button>
          ))}
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="ganpati-symbol">ॐ</div>
        <div className="floating-card floating-card-top">
          <span className="pin-dot" />
          <div>
            <small>Discover nearby</small>
            <strong>Ganpati Mandals</strong>
          </div>
        </div>
        <div className="floating-card floating-card-bottom">
          <Map size={20} />
          <div>
            <small>One tap</small>
            <strong>Get directions</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
