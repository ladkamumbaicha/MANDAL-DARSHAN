import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Eye,
  ImagePlus,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import { api } from "../lib/api";

const blank = {
  name: "",
  nameMr: "",
  area: "",
  location: "",
  instagram: "",
  morningAarti: "",
  eveningAarti: "",

  // Aagman
  aagamanDate: "",
  aagamanTime: "",

  description: "",
  mapsUrl: "",
  lat: "",
  lng: "",
  image: "",
};

export default function AdminPage() {
  const [logged, setLogged] = useState(
    Boolean(localStorage.getItem("mandal-admin-token"))
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState(blank);

  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [showPassword, setShowPassword] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("");

    try {
      const data = await api("/api/mandals");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      if (
        error.message?.toLowerCase().includes("session") ||
        error.message?.toLowerCase().includes("unauthorized")
      ) {
        setLogged(false);
      }

      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (logged) {
      load();
    }
  }, [logged]);

  async function login(event) {
    event.preventDefault();

    setBusy(true);
    setMessage("");

    try {
      const data = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem(
        "mandal-admin-token",
        data.token
      );

      setPassword("");
      setLogged(true);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem("mandal-admin-token");

    setLogged(false);
    setItems([]);
    setForm(blank);
    setEditing(null);
  }

  function setField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setEditing(null);
    setForm(blank);
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();

    setBusy(true);
    setMessage("");

    try {
      const payload = {
        ...form,

        lat:
          form.lat === ""
            ? ""
            : Number(form.lat),

        lng:
          form.lng === ""
            ? ""
            : Number(form.lng),

        instagram: String(
          form.instagram || ""
        ).replace(/^@/, ""),
      };

      /*
       * IMPORTANT:
       * Keep Aagman fields exactly as entered.
       *
       * Empty date/time are intentionally sent as empty
       * strings so the public website knows that Aagman
       * has not been configured.
       */
      payload.aagamanDate =
        String(form.aagamanDate || "").trim();

      payload.aagamanTime =
        String(form.aagamanTime || "").trim();

      /*
       * Remove older duplicate field names so a cleared
       * Aagman date/time cannot accidentally remain visible.
       */
      delete payload.aagmanDate;
      delete payload.aagmanTime;
      delete payload.aagman_date;
      delete payload.aagman_time;
      delete payload.aagaman_date;
      delete payload.aagaman_time;

      if (editing) {
        await api(
          `/api/mandals/${editing}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        await api("/api/mandals", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      const wasEditing = Boolean(editing);

      resetForm();

      await load();

      setMessage(
        wasEditing
          ? "Mandal updated successfully."
          : "Mandal added successfully."
      );

      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (
      !confirm(
        "Delete this mandal permanently?"
      )
    ) {
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      await api(
        `/api/mandals/${id}`,
        {
          method: "DELETE",
        }
      );

      await load();

      setMessage("Mandal deleted.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  }

  function edit(mandal) {
    /*
     * Support both the new field names and older
     * records already stored in MongoDB.
     */
    const existingDate =
      mandal.aagamanDate ??
      mandal.aagmanDate ??
      mandal.aagaman_date ??
      mandal.aagman_date ??
      "";

    const existingTime =
      mandal.aagamanTime ??
      mandal.aagmanTime ??
      mandal.aagaman_time ??
      mandal.aagman_time ??
      "";

    setEditing(
      mandal._id ||
      mandal.id
    );

    setForm({
      ...blank,
      ...mandal,

      lat:
        mandal.lat ??
        "",

      lng:
        mandal.lng ??
        "",

      /*
       * Normalize old records into the fields used
       * by the current form.
       */
      aagamanDate:
        existingDate,

      aagamanTime:
        existingTime,
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const filtered = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return items.filter((mandal) => {
      if (!query) {
        return true;
      }

      return [
        mandal.name,
        mandal.nameMr,
        mandal.area,
        mandal.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [items, search]);


  /*
   * LOGIN PAGE
   */

  if (!logged) {
    return (
      <main className="admin-page admin-login-page">
        <div className="admin-login-wrap">

          <div className="admin-brand">
            <div className="admin-brand-icon">
              ॐ
            </div>

            <div>
              <strong>
                Mandal Darshan
              </strong>

              <span>
                Secure administration
              </span>
            </div>
          </div>

          <form
            className="admin-card admin-login"
            onSubmit={login}
          >
            <div>
              <span className="section-kicker">
                <ShieldCheck size={15} />
                Private admin
              </span>

              <h1>
                Welcome back
              </h1>

              <p>
                Sign in to manage your Ganpati
                mandal directory.
              </p>
            </div>

            <label>
              Email address

              <input
                type="email"
                autoComplete="username"
                placeholder="Admin email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
              />
            </label>

            <label>
              Password

              <div className="password-wrap">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </label>

            <button
              className="button button-primary admin-login-button"
              disabled={busy}
            >
              {busy ? (
                <RefreshCw
                  className="spin"
                  size={18}
                />
              ) : (
                <ShieldCheck size={18} />
              )}

              {busy
                ? "Signing in…"
                : "Sign in securely"}
            </button>

            {message && (
              <div className="admin-alert error">
                {message}
              </div>
            )}

            <small>
              Admin access is protected by
              a server-side signed session.
            </small>
          </form>
        </div>
      </main>
    );
  }

  /*
   * ADMIN DASHBOARD
   */

  return (
    <main className="admin-page">

      <header className="admin-top">
        <div className="admin-title">

          <div className="admin-avatar">
            ॐ
          </div>

          <div>
            <span className="section-kicker">
              Control center
            </span>

            <h1>
              Mandal Dashboard
            </h1>

            <p>
              Manage locations, event
              locations, timings and festival information.
            </p>
          </div>
        </div>

        <div className="admin-top-actions">

          <button
            className="button button-outline"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw
              className={
                loading
                  ? "spin"
                  : ""
              }
              size={17}
            />

            Refresh
          </button>

          <button
            className="button button-dark"
            onClick={logout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </header>

      <section className="admin-stats">

        <div>
          <span>
            Total Mandals
          </span>

          <strong>
            {items.length}
          </strong>

          <BarChart3 size={20} />
        </div>

        <div>
          <span>
            Areas Covered
          </span>

          <strong>
            {
              new Set(
                items
                  .map(
                    (item) =>
                      item.area ||
                      item.location
                  )
                  .filter(Boolean)
              ).size
            }
          </strong>

          <Eye size={20} />
        </div>

      </section>

      <form
        className="admin-card admin-form"
        onSubmit={save}
      >

        <div className="admin-form-heading">

          <div>
            <span className="section-kicker">
              {editing
                ? "Editing record"
                : "New record"}
            </span>

            <h2>
              {editing
                ? "Edit Mandal"
                : "Add a New Mandal"}
            </h2>
          </div>

          {editing && (
            <button
              type="button"
              className="icon-button"
              onClick={resetForm}
              title="Cancel editing"
            >
              <X size={18} />
            </button>
          )}

        </div>

        <div className="admin-grid">

          <label>
            Mandal Name *

            <input
              value={form.name}
              onChange={(event) =>
                setField(
                  "name",
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Marathi Name

            <input
              value={form.nameMr}
              onChange={(event) =>
                setField(
                  "nameMr",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Area

            <input
              value={form.area}
              onChange={(event) =>
                setField(
                  "area",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Location

            <input
              value={form.location}
              onChange={(event) =>
                setField(
                  "location",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Latitude *

            <input
              type="number"
              step="any"
              value={form.lat}
              onChange={(event) =>
                setField(
                  "lat",
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Longitude *

            <input
              type="number"
              step="any"
              value={form.lng}
              onChange={(event) =>
                setField(
                  "lng",
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Morning Aarti

            <input
              value={form.morningAarti}
              onChange={(event) =>
                setField(
                  "morningAarti",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Evening Aarti

            <input
              value={form.eveningAarti}
              onChange={(event) =>
                setField(
                  "eveningAarti",
                  event.target.value
                )
              }
            />
          </label>

          {/* =========================
              AAGMAN DATE
          ========================= */}

          <label className="aagman-admin-field">
            Aagman Date

            <input
              type="date"
              value={
                form.aagamanDate || ""
              }
              onChange={(event) =>
                setField(
                  "aagamanDate",
                  event.target.value
                )
              }
            />

            <small>
              Leave empty if the Aagman
              date has not been announced.
            </small>
          </label>

          {/* =========================
              AAGMAN TIME
          ========================= */}

          <label className="aagman-admin-field">
            Aagman Starting Time

            <input
              type="time"
              value={
                form.aagamanTime || ""
              }
              onChange={(event) =>
                setField(
                  "aagamanTime",
                  event.target.value
                )
              }
            />

            <small>
              Leave empty if the Aagman
              starting time has not been announced.
            </small>
          </label>

          <label>
            Instagram

            <input
              value={form.instagram}
              onChange={(event) =>
                setField(
                  "instagram",
                  event.target.value
                )
              }
              placeholder="username"
            />
          </label>

        </div>

        <label>
          Maps URL

          <input
            value={form.mapsUrl}
            onChange={(event) =>
              setField(
                "mapsUrl",
                event.target.value
              )
            }
            placeholder="Optional external directions URL"
          />
        </label>

        <label>
          Description

          <textarea
            rows="4"
            value={form.description}
            onChange={(event) =>
              setField(
                "description",
                event.target.value
              )
            }
            placeholder="Short description about this mandal..."
          />
        </label>

        <label>
          Image URL

          <input
            value={form.image}
            onChange={(event) =>
              setField(
                "image",
                event.target.value
              )
            }
            placeholder="https://..."
          />
        </label>

        <div className="admin-actions">

          <button
            className="button button-primary"
            disabled={busy}
          >
            {busy ? (
              <RefreshCw
                className="spin"
                size={17}
              />
            ) : editing ? (
              <Pencil size={17} />
            ) : (
              <Plus size={17} />
            )}

            {busy
              ? "Saving…"
              : editing
              ? "Update Mandal"
              : "Add Mandal"}
          </button>

          {editing && (
            <button
              type="button"
              className="button button-outline"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </div>

        {message && (
          <div
            className={`admin-alert ${messageType}`}
          >
            {message}
          </div>
        )}

      </form>

      <section className="admin-card admin-records">

        <div className="records-heading">

          <div>
            <span className="section-kicker">
              Directory
            </span>

            <h2>
              All Mandals{" "}
              <span>
                {filtered.length}
              </span>
            </h2>
          </div>

          <div className="admin-search">

            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search mandals or areas..."
            />

          </div>

        </div>

        {loading ? (
          <div className="admin-empty">
            <RefreshCw
              className="spin"
              size={24}
            />

            Loading mandals…
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">

            <ImagePlus size={28} />

            <strong>
              {search
                ? "No matching mandals"
                : "No mandals yet"}
            </strong>

            <span>
              {search
                ? "Try a different search."
                : "Add your first mandal using the form above."}
            </span>

          </div>
        ) : (
          <div className="admin-list">

            {filtered.map((mandal) => {

              const date =
                mandal.aagamanDate ??
                mandal.aagmanDate ??
                "";

              const time =
                mandal.aagamanTime ??
                mandal.aagmanTime ??
                "";

              return (
                <article
                  className="admin-row"
                  key={
                    mandal._id ||
                    mandal.id
                  }
                >

                  {mandal.image ? (
                    <img
                      src={mandal.image}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <div className="admin-thumb">
                      ॐ
                    </div>
                  )}

                  <div className="admin-row-main">

                    <div className="admin-row-title">

                      <strong>
                        {mandal.name}
                      </strong>


                    </div>

                    <span>
                      {mandal.area ||
                        mandal.location ||
                        "Location not set"}
                    </span>

                    {date && time && (
                      <small>
                        Aagman: {date} at {time}
                      </small>
                    )}

                  </div>

                  <div className="admin-row-actions">

                    <button
                      onClick={() =>
                        edit(mandal)
                      }
                      title="Edit"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() =>
                        remove(
                          mandal._id ||
                          mandal.id
                        )
                      }
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}
