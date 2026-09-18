import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Sparkles } from "lucide-react";

// Ganesh Chaturthi 2027 in India/Mumbai: Saturday, 4 September 2027.
const NEXT_GANESHOTSAV = new Date("2027-09-04T00:00:00+05:30");

function getRemaining() {
  const diff = Math.max(0, NEXT_GANESHOTSAV.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function Countdown() {
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemaining());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const items = useMemo(
    () => [
      [remaining.days, "Days"],
      [remaining.hours, "Hours"],
      [remaining.minutes, "Minutes"],
      [remaining.seconds, "Seconds"],
    ],
    [remaining]
  );

  return (
    <section className="countdown-section animate-section" aria-label="Ganeshotsav countdown">
      <div className="section-shell">
        <div className="countdown-card glass-panel">
          <div className="countdown-copy">
            <div className="eyebrow eyebrow-light">
              <Sparkles size={15} />
              NEXT GANESHOTSAV
            </div>
            <h2>Bappa is coming.</h2>
            <p>
              Keep your darshan list ready. Discover mandals, plan your route,
              and get ready for the next Ganeshotsav.
            </p>
            <div className="countdown-date">
              <CalendarDays size={16} />
              Ganesh Chaturthi · 4 September 2027 · Mumbai
            </div>
          </div>

          <div className="countdown-grid">
            {items.map(([value, label]) => (
              <div className="countdown-unit" key={label}>
                <strong>{pad(value)}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
