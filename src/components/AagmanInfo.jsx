import {
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";

import {
  formatAagmanDate,
  formatAagmanTime,
  getAagmanDateTime,
  getAagmanStatus,
} from "../utils/aagman";

export default function AagmanInfo({
  mandal,
  compact = false,
}) {
  const date =
    formatAagmanDate(mandal);

  const time =
    formatAagmanTime(mandal);

  const hasAagman =
    Boolean(
      getAagmanDateTime(mandal)
    );

  /*
   * IMPORTANT:
   *
   * Aagman is optional.
   *
   * If either date OR time is missing,
   * absolutely nothing is rendered.
   */
  if (
    !hasAagman ||
    !date ||
    !time
  ) {
    return null;
  }

  const status =
    getAagmanStatus(mandal);

  return (
    <div
      className={`aagman-glass ${
        compact
          ? "aagman-compact"
          : ""
      }`}
    >

      <div className="aagman-header">

        <div className="aagman-icon">
          <Sparkles size={15} />
        </div>

        <div>

          <span className="aagman-label">
            Ganpati Aagman
          </span>

          <strong>
            {status.text}
          </strong>

        </div>

      </div>

      <div className="aagman-details">

        <div className="aagman-detail">

          <CalendarDays size={15} />

          <div>

            <small>
              Date
            </small>

            <strong>
              {date}
            </strong>

          </div>

        </div>

        <div className="aagman-detail">

          <Clock3 size={15} />

          <div>

            <small>
              Starting Time
            </small>

            <strong>
              {time}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}
