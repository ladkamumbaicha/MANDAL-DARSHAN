import { useEffect, useState } from "react";

const KEY = "mandal-darshan-saved";

export default function useSavedMandals() {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  function toggleSaved(id) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return { savedIds, toggleSaved };
}
