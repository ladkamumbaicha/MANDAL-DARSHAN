import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import ExploreSection from "./components/ExploreSection";
import Countdown from "./components/Countdown";
import DetailModal from "./components/DetailModal";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import CommunityPopup from "./components/CommunityPopup";
import AdminPage from "./components/AdminPage";

import useMandals from "./hooks/useMandals";
import useSavedMandals from "./hooks/useSavedMandals";

const MapSection = lazy(() => import("./components/MapSection"));

/* -----------------------------
   Premium loading screen
----------------------------- */

function LoadingScreen({ minimumTime = 250 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, minimumTime);

    return () => clearTimeout(timer);
  }, [minimumTime]);

  if (!visible) return null;

  return (
    <div className="premium-loader" aria-label="Loading Ganpati Mandal Locator">
      <div className="loader-glow loader-glow-one" />
      <div className="loader-glow loader-glow-two" />

      <div className="loader-content">
        <div className="loader-logo-wrap">
          <div className="loader-ring loader-ring-one" />
          <div className="loader-ring loader-ring-two" />

          <div className="loader-logo">
            <img
              src="/icon.svg"
              alt="Ganpati Mandal Locator"
              width="90"
              height="90"
            />
          </div>
        </div>

        <h1>
          Ganpati <span>Mandal Locator</span>
        </h1>

        <p>Finding mandals near you...</p>

        <div className="loader-progress">
          <span />
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   Scroll reveal
----------------------------- */

function ScrollReveal({ children, className = "" }) {
  const [shown, setShown] = useState(false);
  const ref = useState(null)[0];

  useEffect(() => {
    // Sections already have their own CSS animations.
    // This helper intentionally avoids expensive observers.
    const timer = setTimeout(() => setShown(true), 20);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${className} ${shown ? "reveal-visible" : ""}`}>
      {children}
    </div>
  );
}

/* -----------------------------
   Public application
----------------------------- */

function PublicApp() {
  const { mandals, loading } = useMandals();
  const { savedIds, toggleSaved } = useSavedMandals();

  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);

  const areas = useMemo(
    () =>
      [...new Set(
        mandals
          .map((m) => m.area || m.location)
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b)),
    [mandals]
  );

  const popularAreas = areas.slice(0, 4);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return mandals.filter((m) => {
      const matchesQuery =
        !needle ||
        [m.name, m.nameMr, m.area, m.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle);

      const matchesArea =
        !area ||
        [m.area, m.location].includes(area);

      const matchesSaved =
        !showSaved ||
        savedIds.includes(m.id);

      return (
        matchesQuery &&
        matchesArea &&
        matchesSaved
      );
    });
  }, [
    mandals,
    query,
    area,
    showSaved,
    savedIds,
  ]);

  function scrollTo(id) {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (sessionStorage.getItem("community-popup-dismissed") !== "1") {
        setShowCommunityPopup(true);
      }
    }, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  function chooseArea(value) {
    setArea(value);
    scrollTo("explore-section");
  }

  function nearMe() {
    if (!navigator.geolocation) {
      alert("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => scrollTo("map-section"),
      () =>
        alert(
          "Allow location permission to use Nearby Mandals."
        )
    );
  }

  function savedView() {
    setShowSaved(true);
    scrollTo("explore-section");
  }

  return (
    <>
      <Navbar
        onExplore={() => scrollTo("explore-section")}
        onMap={() => scrollTo("map-section")}
        onAddMandal={() => setShowCommunityPopup(true)}
      />

      <main>
        <section className="animate-section animate-hero">
          <Hero
            query={query}
            setQuery={setQuery}
            onNearMe={nearMe}
            onMap={() => scrollTo("map-section")}
            popularAreas={popularAreas}
            onArea={chooseArea}
          />
        </section>

        <section className="animate-section animate-stats">
          <Stats
            count={mandals.length}
            areaCount={areas.length}
          />
        </section>
<Suspense
          fallback={
            <section
              className="map-section"
              id="map-section"
            >
              <div className="section-shell">
                <div className="map-loading">
                  <div className="map-loading-spinner" />
                  <span>Loading map...</span>
                </div>
              </div>
            </section>
          }
        >
          <MapSection
            mandals={mandals}
            onOpen={setSelected}
          />
        </Suspense>

        <section className="animate-section">
          <ExploreSection
            mandals={filtered}
            query={query}
            setQuery={setQuery}
            area={area}
            setArea={setArea}
            areas={areas}
            savedIds={savedIds}
            toggleSaved={toggleSaved}
            onOpen={setSelected}
            showSaved={showSaved}
            setShowSaved={setShowSaved}
            loading={loading}
          />
        </section>

        <section className="animate-section">
          <Countdown />
        </section>
      </main>

      <Footer />

      <BottomNav
        onHome={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        onExplore={() =>
          scrollTo("explore-section")
        }
        onMap={() => scrollTo("map-section")}
        onSaved={savedView}
      />

      <DetailModal
        mandal={selected}
        onClose={() => setSelected(null)}
      />

      <CommunityPopup
        open={showCommunityPopup}
        onClose={() => setShowCommunityPopup(false)}
      />
    </>
  );
}

/* -----------------------------
   App
----------------------------- */

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!appReady && <LoadingScreen />}

      <div className={appReady ? "app-ready" : "app-hidden"}>
        <Routes>
          <Route
            path="/admin"
            element={<AdminPage />}
          />

          <Route
            path="*"
            element={<PublicApp />}
          />
        </Routes>
      </div>
    </>
  );
}