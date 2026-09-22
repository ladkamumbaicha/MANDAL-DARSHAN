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
import DetailModal from "./components/DetailModal";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import Countdown from "./components/Countdown";
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

function smoothScrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const headerOffset = 92;
  const start = window.scrollY;
  const destination = Math.max(0, target.getBoundingClientRect().top + start - headerOffset);
  const distance = destination - start;
  const duration = Math.min(1550, Math.max(850, Math.abs(distance) * 0.85));
  const startTime = performance.now();
  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, start + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
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

  const scrollTo = smoothScrollTo;

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (sessionStorage.getItem("community-popup-dismissed") !== "1") {
        setShowCommunityPopup(true);
      }
    }, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  // Premium scroll-reveal system: animate sections/cards as they enter the viewport.
  useEffect(() => {
    const selector = [
      "main > section",
      ".mandal-card",
      ".mandal-card-v2",
      ".map-shell",
      ".countdown-section",
      ".stats",
      ".content-section",
      ".footer-grid > *",
      ".community-popup"
    ].join(",");

    const reveal = () => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;

      if (!("IntersectionObserver" in window)) {
        elements.forEach((el) => el.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -8% 0px"
        }
      );

      elements.forEach((el, index) => {
        el.classList.add("scroll-reveal");
        el.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
        observer.observe(el);
      });

      return () => observer.disconnect();
    };

    const cleanup = reveal();

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [mandals.length, filtered.length]);

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

        <Countdown />
      </main>

      <Footer />

      <BottomNav
        onHome={() => {
          const start = window.scrollY;
          const duration = Math.min(1500, Math.max(850, start * 0.85));
          const startTime = performance.now();
          const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const step = (now) => {
            const progress = Math.min(1, (now - startTime) / duration);
            window.scrollTo(0, start * (1 - ease(progress)));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }}
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -70px 0px' }
    );

    const observeVisibleElements = () => {
      document
        .querySelectorAll('.animate-section, .mandal-card, .mandal-card-v2, .glass-panel, .admin-card')
        .forEach((element) => observer.observe(element));
    };

    observeVisibleElements();
    const mutationObserver = new MutationObserver(observeVisibleElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const onHashClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      smoothScrollTo(id);
      history.replaceState(null, '', `#${id}`);
    };

    document.addEventListener('click', onHashClick);
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      document.removeEventListener('click', onHashClick);
    };
  }, [appReady]);

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