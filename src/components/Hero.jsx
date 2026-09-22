import { ArrowDown, LocateFixed, Map, Search, Sparkles } from "lucide-react";

export default function Hero({ query, setQuery, onNearMe, onMap, popularAreas, onArea }) {
  return (
    <section className="hero-v2">
      <div className="hero-v2-grid">
        <div className="hero-v2-copy">
          <div className="hero-v2-kicker"><span>ॐ</span> GANPATI DARSHAN • MUMBAI</div>
          <h1>One city.<br /><em>Many Bappas.</em><br />One place to find them.</h1>
          <p>Plan your darshan with verified mandal locations, aarti timings, routes, social links and festival information — all in one place.</p>

          <div className="hero-v2-search">
            <Search size={21} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by mandal, area or landmark..." aria-label="Search mandals" />
            <button onClick={() => document.getElementById("explore-section")?.scrollIntoView({behavior:"smooth"})}>Search</button>
          </div>

          <div className="hero-v2-actions">
            <button className="hero-primary" onClick={onNearMe}><LocateFixed size={18} /> Find near me</button>
            <button className="hero-secondary" onClick={onMap}><Map size={18} /> Open live map</button>
          </div>

          <div className="hero-v2-popular">
            <span>Try an area</span>
            {popularAreas.map((area) => <button key={area} onClick={() => onArea(area)}>{area}</button>)}
          </div>
        </div>

        <div className="hero-v2-visual" aria-hidden="true">
          <div className="hero-sun"></div>
          <div className="hero-temple">
            <div className="temple-top">ॐ</div>
            <div className="temple-dome"></div>
            <div className="temple-pillars"><i></i><i></i><i></i><i></i></div>
            <div className="temple-door"></div>
          </div>
          <div className="hero-orbit-card hero-orbit-one"><Sparkles size={16}/><b>Darshan ready</b><small>Timings • Routes • Details</small></div>
          <div className="hero-orbit-card hero-orbit-two"><span className="hero-live-dot"></span><b>Explore Mumbai</b><small>Find mandals around you</small></div>
          <div className="hero-scroll"><ArrowDown size={15}/> Scroll to explore</div>
        </div>
      </div>
    </section>
  );
}
