import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

function getParts(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
}

export default function Countdown() {
  // Change this date if you want a different festival/event target.
  const target = useMemo(() => new Date("2026-09-14T00:00:00+05:30").getTime(), []);
  const [parts, setParts] = useState(() => getParts(target));

  useEffect(() => {
    const timer = setInterval(() => setParts(getParts(target)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <section className="countdown-section section-shell">
      <div className="countdown-card">
        <div>
          <div className="eyebrow eyebrow-light"><Sparkles size={15} /> Ganeshotsav 2026</div>
          <h2>Bappa is coming.</h2>
          <p>Keep your darshan list ready and discover mandals before the celebrations begin.</p>
        </div>
        <div className="countdown-grid">
          {Object.entries(parts).map(([label, value]) => (
            <div key={label}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
