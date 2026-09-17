import { useEffect, useState } from "react";

const normalize = (m) => ({
  ...m,
  id: m._id || m.id,
  nameMr: m.nameMr || "",
  morningAarti: m.morningAarti || "",
  eveningAarti: m.eveningAarti || "",
  aagamanDate: m.aagamanDate || "",
  mapsUrl: m.mapsUrl || "",
});

export default function useMandals() {
  const [mandals, setMandals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/mandals", { headers: { Accept: "application/json" } })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || `Mandal API returned ${res.status}`);
        return Array.isArray(data) ? data : [];
      })
      .then((data) => {
        if (!active) return;
        setMandals(data.map(normalize));
        setError("");
      })
      .catch((err) => {
        console.error("Mandal API:", err);
        if (!active) return;
        setMandals([]);
        setError(err.message || "Unable to load mandals");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, []);

  return { mandals, loading, error, source: "mongodb" };
}
