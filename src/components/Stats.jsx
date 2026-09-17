export default function Stats({ count, areaCount }) {
  const stats = [
    [count || "50+", "Mandals"],
    [areaCount || "20+", "Areas"],
    ["2026", "Ganeshotsav"],
    ["Free", "For Everyone"]
  ];

  return (
    <section className="stats section-shell">
      {stats.map(([value, label]) => (
        <div className="stat" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
