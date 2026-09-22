import { useEffect, useMemo, useState } from "react";
import {
  BarChart3, CheckCircle2, Eye, Facebook, Globe, ImagePlus, Instagram,
  LogOut, MessageCircle, Pencil, Plus, RefreshCw, Search, ShieldCheck,
  Trash2, Youtube, X, MapPin, Clock3, CalendarDays
} from "lucide-react";
import { api } from "../lib/api";

const blank = {
  name: "", nameMr: "", area: "", location: "", address: "", description: "",
  darshanTiming: "", aartiTiming: "", morningAarti: "", eveningAarti: "",
  aagamanDate: "", aagamanTime: "", mapsUrl: "", lat: "", lng: "", image: "",
  instagram: "", facebook: "", youtube: "", whatsapp: "", website: ""
};

const socialFields = [
  ["instagram", "Instagram", Instagram, "username or full URL"],
  ["facebook", "Facebook", Facebook, "page URL or username"],
  ["youtube", "YouTube", Youtube, "channel URL or @handle"],
  ["whatsapp", "WhatsApp", MessageCircle, "phone number with country code"],
  ["website", "Official Website", Globe, "https://example.com"]
];

function normalise(item = {}) {
  const out = { ...blank };
  Object.keys(out).forEach((key) => { out[key] = item[key] ?? ""; });
  out.aagamanDate = item.aagamanDate ?? item.aagmanDate ?? "";
  out.aagamanTime = item.aagamanTime ?? item.aagmanTime ?? "";
  return out;
}

export default function AdminPage() {
  const [logged, setLogged] = useState(Boolean(localStorage.getItem("mandal-admin-token")));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  async function load() {
    setLoading(true); setMessage("");
    try { setItems(await api("/api/mandals")); }
    catch (error) { if (/session|unauthorized/i.test(error.message)) setLogged(false); setMessage(error.message); setMessageType("error"); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (logged) load(); }, [logged]);

  async function login(e) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const data = await api("/api/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("mandal-admin-token", data.token); setPassword(""); setLogged(true);
    } catch (error) { setMessage(error.message); setMessageType("error"); }
    finally { setBusy(false); }
  }

  function logout() { localStorage.removeItem("mandal-admin-token"); setLogged(false); setItems([]); resetForm(); }
  function setField(key, value) { setForm((v) => ({ ...v, [key]: value })); }
  function resetForm() { setEditing(null); setForm({ ...blank }); }

  function edit(item) { setEditing(item._id || item.id); setForm(normalise(item)); setMessage(""); window.scrollTo({ top: 0, behavior: "smooth" }); }

  async function save(e) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const payload = { ...form,
        lat: form.lat === "" ? "" : Number(form.lat),
        lng: form.lng === "" ? "" : Number(form.lng),
        instagram: String(form.instagram || "").replace(/^@/, "")
      };
      if (editing) {
        await api(`/api/mandals/${editing}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("Mandal updated successfully.");
      } else {
        await api("/api/mandals", { method: "POST", body: JSON.stringify(payload) });
        setMessage("Mandal added successfully.");
      }
      setMessageType("success"); resetForm(); await load();
    } catch (error) { setMessage(error.message); setMessageType("error"); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this Mandal permanently?")) return;
    setBusy(true);
    try { await api(`/api/mandals/${id}`, { method: "DELETE" }); setMessage("Mandal deleted."); setMessageType("success"); if (editing === id) resetForm(); await load(); }
    catch (error) { setMessage(error.message); setMessageType("error"); }
    finally { setBusy(false); }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((m) => !q || [m.name, m.area, m.location, m.address].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [items, search]);

  if (!logged) return (
    <main className="admin-login-page">
      <div className="admin-login-orb orb-one" /><div className="admin-login-orb orb-two" />
      <form className="admin-login-card" onSubmit={login}>
        <div className="admin-login-icon"><ShieldCheck size={30} /></div>
        <span className="section-kicker">MANDAL DARSHAN • ADMIN</span>
        <h1>Control your Mandal directory.</h1>
        <p>Manage public listings, timings, locations and every social profile from one dashboard.</p>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        {message && <div className="admin-alert error">{message}</div>}
        <button className="button button-primary admin-login-submit" disabled={busy}>{busy ? <RefreshCw className="spin" size={18} /> : <ShieldCheck size={18} />}{busy ? "Signing in…" : "Open Admin Panel"}</button>
        <a className="admin-back-link" href="/">← Back to public website</a>
      </form>
    </main>
  );

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div className="admin-brand"><div className="admin-brand-icon">ॐ</div><div><span>Mandal Darshan</span><strong>Admin Control Center</strong></div></div>
        <div className="admin-top-actions"><a href="/" target="_blank" rel="noreferrer"><Eye size={17} /> View website</a><button onClick={logout}><LogOut size={17} /> Logout</button></div>
      </header>

      <div className="admin-shell">
        <section className="admin-welcome">
          <div><span className="section-kicker">PUBLIC DIRECTORY MANAGEMENT</span><h1>Build a better <em>darshan</em> directory.</h1><p>Edit every detail visitors see, including all social media accounts.</p></div>
          <div className="admin-live-pill"><CheckCircle2 size={16} /> Live dashboard</div>
        </section>

        <section className="admin-stats-grid">
          <div className="admin-stat-box"><BarChart3 /><strong>{items.length}</strong><span>Total Mandals</span></div>
          <div className="admin-stat-box"><MapPin /><strong>{new Set(items.map((m) => m.area || m.location).filter(Boolean)).size}</strong><span>Areas covered</span></div>
          <div className="admin-stat-box"><Instagram /><strong>{items.filter((m) => m.instagram).length}</strong><span>Instagram profiles</span></div>
          <div className="admin-stat-box"><Globe /><strong>{items.filter((m) => m.website).length}</strong><span>Websites added</span></div>
        </section>

        <div className="admin-main-grid">
          <form className="admin-editor-card" onSubmit={save}>
            <div className="admin-card-heading"><div><span className="section-kicker">{editing ? "EDIT LISTING" : "NEW LISTING"}</span><h2>{editing ? "Update Mandal" : "Add a Mandal"}</h2></div>{editing && <button type="button" className="icon-button" onClick={resetForm} aria-label="Cancel editing"><X size={19} /></button>}</div>

            <div className="admin-form-section"><h3>Identity & location</h3><div className="admin-form-grid">
              <label>Mandal Name *<input value={form.name} onChange={(e) => setField("name", e.target.value)} required /></label>
              <label>Marathi Name<input value={form.nameMr} onChange={(e) => setField("nameMr", e.target.value)} /></label>
              <label>Area<input value={form.area} onChange={(e) => setField("area", e.target.value)} /></label>
              <label>Location / Landmark<input value={form.location} onChange={(e) => setField("location", e.target.value)} /></label>
              <label className="full">Complete Address<textarea rows="2" value={form.address} onChange={(e) => setField("address", e.target.value)} /></label>
              <label>Latitude<input type="number" step="any" value={form.lat} onChange={(e) => setField("lat", e.target.value)} /></label>
              <label>Longitude<input type="number" step="any" value={form.lng} onChange={(e) => setField("lng", e.target.value)} /></label>
              <label className="full">Google Maps / Directions URL<input value={form.mapsUrl} onChange={(e) => setField("mapsUrl", e.target.value)} placeholder="https://maps.google.com/..." /></label>
            </div></div>

            <div className="admin-form-section"><h3><Clock3 size={18} /> Darshan & timings</h3><div className="admin-form-grid">
              <label>Darshan Timing<input value={form.darshanTiming} onChange={(e) => setField("darshanTiming", e.target.value)} placeholder="6:00 AM – 11:00 PM" /></label>
              <label>Aarti Timing<input value={form.aartiTiming} onChange={(e) => setField("aartiTiming", e.target.value)} /></label>
              <label>Morning Aarti<input value={form.morningAarti} onChange={(e) => setField("morningAarti", e.target.value)} /></label>
              <label>Evening Aarti<input value={form.eveningAarti} onChange={(e) => setField("eveningAarti", e.target.value)} /></label>
              <label>Aagman Date<input type="date" value={form.aagamanDate} onChange={(e) => setField("aagamanDate", e.target.value)} /></label>
              <label>Aagman Starting Time<input type="time" value={form.aagamanTime} onChange={(e) => setField("aagamanTime", e.target.value)} /></label>
            </div></div>

            <div className="admin-form-section"><h3>Story & media</h3><div className="admin-form-grid"><label className="full">About this Mandal<textarea rows="5" value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Tell visitors about the Mandal, history, theme, events or special attractions." /></label><label className="full">Main Image URL<input value={form.image} onChange={(e) => setField("image", e.target.value)} placeholder="https://..." /></label></div></div>

            <div className="admin-form-section social-admin-section"><h3>Social media & online presence</h3><p className="admin-help">Add every official account you want visitors to see. Each one can be edited later.</p><div className="admin-social-grid">
              {socialFields.map(([key, label, Icon, placeholder]) => <label key={key}><span className="social-field-label"><Icon size={17} /> {label}</span><input value={form[key]} onChange={(e) => setField(key, e.target.value)} placeholder={placeholder} /></label>)}
            </div></div>

            <div className="admin-form-actions"><button className="button button-primary" disabled={busy}>{busy ? <RefreshCw className="spin" size={18} /> : editing ? <Pencil size={18} /> : <Plus size={18} />}{busy ? "Saving…" : editing ? "Save Changes" : "Publish Mandal"}</button>{editing && <button type="button" className="button button-outline" onClick={resetForm}>Cancel</button>}</div>
            {message && <div className={`admin-alert ${messageType}`}>{message}</div>}
          </form>

          <aside className="admin-side-card"><div className="admin-side-icon"><CalendarDays /></div><span className="section-kicker">CONTENT CHECKLIST</span><h2>Complete listings feel better.</h2><ul><li>Strong photo and clear name</li><li>Full address + map link</li><li>Darshan and Aarti timings</li><li>About section</li><li>Instagram, Facebook, YouTube</li><li>WhatsApp and official website</li></ul><p>Everything entered here appears on the public Mandal profile.</p></aside>
        </div>

        <section className="admin-records-card"><div className="records-heading"><div><span className="section-kicker">DIRECTORY</span><h2>All Mandals <span>{filtered.length}</span></h2></div><div className="admin-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, area or address…" /><button type="button" onClick={load} title="Refresh"><RefreshCw className={loading ? "spin" : ""} size={17} /></button></div></div>
          {loading ? <div className="admin-empty"><RefreshCw className="spin" /> Loading mandals…</div> : filtered.length ? <div className="admin-list">{filtered.map((m) => <article className="admin-row" key={m._id || m.id}>{m.image ? <img src={m.image} alt="" loading="lazy" /> : <div className="admin-thumb">ॐ</div>}<div className="admin-row-main"><strong>{m.name || "Unnamed Mandal"}</strong><span>{m.area || m.location || "Location not set"}</span><small>{[m.instagram && "Instagram", m.facebook && "Facebook", m.youtube && "YouTube", m.whatsapp && "WhatsApp", m.website && "Website"].filter(Boolean).join(" • ") || "No social links added"}</small></div><div className="admin-row-actions"><button type="button" onClick={() => edit(m)} title="Edit"><Pencil size={17} /></button><button type="button" onClick={() => remove(m._id || m.id)} title="Delete"><Trash2 size={17} /></button></div></article>)}</div> : <div className="admin-empty"><ImagePlus size={28} /><strong>No mandals found</strong><span>Add your first listing or change the search.</span></div>}
        </section>
      </div>
    </main>
  );
}
