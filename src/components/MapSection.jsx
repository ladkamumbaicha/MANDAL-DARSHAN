import { useEffect, useRef, useState } from "react";
import { LocateFixed, Navigation, MapPin } from "lucide-react";

const DEFAULT_CENTER = [19.2813, 72.8685];

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);

  return new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-leaflet="1"]')) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      css.dataset.leaflet = "1";
      document.head.appendChild(css);
    }

    const existing = document.querySelector('script[data-leaflet="1"]');
    if (existing) {
      if (window.L) {
        resolve(window.L);
        return;
      }

      existing.addEventListener("load", () => resolve(window.L), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.leaflet = "1";
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.head.appendChild(script);
  });
}

function positionOf(mandal) {
  const lat = Number(mandal?.lat ?? mandal?.latitude);
  const lng = Number(mandal?.lng ?? mandal?.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return [lat, lng];
}

function safeText(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

export default function MapSection({ mandals = [], onOpen }) {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const watchRef = useRef(null);

  const [status, setStatus] = useState("Loading map...");
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    let disposed = false;
    let resizeTimer = null;

    async function initializeMap() {
      try {
        const L = await loadLeaflet();
        if (disposed || !mapElement.current) return;

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        const validLocations = mandals.map(positionOf).filter(Boolean);
        const initialCenter = validLocations[0] || DEFAULT_CENTER;

        const map = L.map(mapElement.current, {
          center: initialCenter,
          zoom: 13,
          minZoom: 4,
          maxZoom: 19,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          dragging: true,
          touchZoom: true,
          attributionControl: true,
          fadeAnimation: true,
          zoomAnimation: true,
          markerZoomAnimation: false,
          inertia: true,
          inertiaDeceleration: 3000,
          inertiaMaxSpeed: 1200,
          easeLinearity: 0.2,
          worldCopyJump: true,
        });

        mapRef.current = map;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
          crossOrigin: true,
          updateWhenIdle: true,
          keepBuffer: 3,
        }).addTo(map);

        const mandalIcon = L.divIcon({
          className: "ganpati-map-marker-static",
          html: `
            <div class="map-pin-static" aria-hidden="true">
              <span class="map-pin-symbol">ॐ</span>
            </div>
          `,
          iconSize: [42, 50],
          iconAnchor: [21, 48],
          popupAnchor: [0, -43],
        });

        const bounds = [];
        let markerCount = 0;

        mandals.forEach((mandal) => {
          const position = positionOf(mandal);
          if (!position) return;

          markerCount += 1;
          bounds.push(position);

          const marker = L.marker(position, {
            icon: mandalIcon,
            keyboard: true,
            title: mandal.name || "Ganpati Mandal",
            riseOnHover: true,
            riseOffset: 120,
          }).addTo(map);

          const place =
            mandal.address || mandal.fullAddress || mandal.area || mandal.location || "";

          marker.bindPopup(
            `
              <div class="map-popup map-popup-modern">
                <div class="map-popup-icon"><span>ॐ</span></div>
                <strong>${safeText(mandal.name || "Ganpati Mandal")}</strong>
                ${place ? `<span>${safeText(place)}</span>` : ""}
                <button type="button" class="map-popup-button">View Mandal</button>
              </div>
            `,
            {
              closeButton: true,
              autoPan: true,
              autoPanPadding: [30, 30],
            }
          );

          marker.on("popupopen", () => {
            const button = marker.getPopup()?.getElement()?.querySelector(".map-popup-button");
            if (button) {
              button.onclick = () => {
                if (typeof onOpen === "function") onOpen(mandal);
                marker.closePopup();
              };
            }
          });
        });

        if (bounds.length > 1) {
          map.fitBounds(bounds, {
            padding: [48, 48],
            maxZoom: 14,
            animate: false,
          });
        } else if (bounds.length === 1) {
          map.setView(bounds[0], 14, { animate: false });
        }

        setStatus(markerCount ? "" : "No mandal locations available.");

        resizeTimer = window.setTimeout(() => {
          if (!disposed) map.invalidateSize({ animate: false });
        }, 180);
      } catch (error) {
        console.error("Leaflet map error:", error);
        if (!disposed) setStatus("Unable to load map. Please try again.");
      }
    }

    initializeMap();

    return () => {
      disposed = true;

      if (resizeTimer) window.clearTimeout(resizeTimer);

      if (watchRef.current !== null) {
        navigator.geolocation?.clearWatch(watchRef.current);
        watchRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      userMarkerRef.current = null;
    };
  }, [mandals, onOpen]);

  function startTracking() {
    if (!navigator.geolocation) {
      window.alert("Location is not supported by this browser.");
      return;
    }

    const map = mapRef.current;
    if (!map) {
      window.alert("Map is still loading. Please try again.");
      return;
    }

    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }

    watchRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const L = window.L;
        const activeMap = mapRef.current;
        if (!L || !activeMap) return;

        const position = [coords.latitude, coords.longitude];

        if (!userMarkerRef.current) {
          userMarkerRef.current = L.circleMarker(position, {
            radius: 8,
            weight: 3,
            color: "#ffffff",
            fillColor: "#ff6b18",
            fillOpacity: 1,
            className: "user-location-static",
          })
            .addTo(activeMap)
            .bindTooltip("Your location", { direction: "top", offset: [0, -8] });
        } else {
          userMarkerRef.current.setLatLng(position);
        }

        activeMap.flyTo(position, Math.max(activeMap.getZoom(), 15), {
          animate: true,
          duration: 0.85,
          easeLinearity: 0.2,
        });

        setTracking(true);
      },
      () => {
        window.alert("Please allow location permission to use live tracking.");
        setTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );
  }

  return (
    <section
      className="map-section animated-map-section"
      id="map-section"
      aria-labelledby="map-title"
    >
      <div className="section-shell">
        <div className="section-heading map-heading">
          <div>
            <span className="section-kicker">Nearby Mandals</span>
            <h2 id="map-title">Explore Mandals Near You</h2>
            <p>Discover Ganpati mandals around you on a smooth OpenStreetMap.</p>
          </div>

          <div className="map-actions">
            <button className="button button-primary" onClick={startTracking} type="button">
              <LocateFixed size={18} />
              {tracking ? "Tracking Live" : "My Live Location"}
            </button>
          </div>
        </div>

        <div className="map-shell premium-map-shell">
          <div
            ref={mapElement}
            className="leaflet-map"
            aria-label="Interactive Ganpati mandal map"
          />

          {status && (
            <div className="map-status">
              <Navigation size={20} />
              <span>{status}</span>
            </div>
          )}

          <div className="map-floating-badge">
            <MapPin size={15} />
            <span>Ganpati Mandals</span>
          </div>
        </div>
      </div>
    </section>
  );
}
