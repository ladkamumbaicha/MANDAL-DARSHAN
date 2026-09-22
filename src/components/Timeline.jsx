import { CalendarDays, Clock3, Heart, MapPin, Sparkles } from "lucide-react";

const steps = [
  { icon: CalendarDays, label: "Plan", text: "Save the mandals you want to visit." },
  { icon: MapPin, label: "Explore", text: "Compare locations, routes and nearby areas." },
  { icon: Clock3, label: "Check timings", text: "See darshan and aarti timings before you leave." },
  { icon: Sparkles, label: "Experience", text: "Visit Bappa and enjoy your Ganeshotsav." },
  { icon: Heart, label: "Share", text: "Follow the mandal and share the darshan with friends." },
];

export default function Timeline() {
  return (
    <section className="timeline-section" aria-labelledby="timeline-title">
      <div className="section-shell">
        <div className="timeline-heading">
          <span className="section-kicker">DARSHAN JOURNEY</span>
          <h2 id="timeline-title">From search to <em>darshan.</em></h2>
          <p>Plan your visit in a simple five-step journey.</p>
        </div>

        <ol className="timeline-track">
          {steps.map(({ icon: Icon, label, text }, index) => (
            <li className="timeline-step" key={label} style={{ "--timeline-index": index }}>
              <div className="timeline-node" aria-hidden="true">
                <Icon size={21} strokeWidth={2.2} />
              </div>
              <div className="timeline-step-copy">
                <span>0{index + 1}</span>
                <h3>{label}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
