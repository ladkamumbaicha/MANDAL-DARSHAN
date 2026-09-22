import { CalendarDays, Clock3, MapPin, Sparkles, Flag } from "lucide-react";

const EVENTS = [
  ["01", "Mandal discovery", "Save the mandals you want to visit and plan your route.", Sparkles],
  ["02", "Aagman & preparation", "Check arrival details, special events and important timings.", CalendarDays],
  ["03", "Darshan & Aarti", "Keep morning and evening aarti timings ready before you leave.", Clock3],
  ["04", "Route planning", "Use the map, coordinates and directions to reach your mandal.", MapPin],
  ["05", "Share the celebration", "Follow mandals online and share your darshan journey.", Flag],
];

export default function FestivalTimeline() {
  return (
    <section className="festival-timeline" id="festival-timeline" aria-labelledby="timeline-title">
      <div className="section-shell">
        <div className="timeline-heading">
          <span className="section-kicker">DARSHAN JOURNEY</span>
          <h2 id="timeline-title">Plan your Ganpati visit.</h2>
          <p>Everything from discovery to darshan, organized into one simple journey.</p>
        </div>
        <div className="timeline-track">
          {EVENTS.map(([number, title, text, Icon]) => (
            <article className="timeline-item" key={number}>
              <div className="timeline-dot"><Icon size={17} /></div>
              <span className="timeline-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
