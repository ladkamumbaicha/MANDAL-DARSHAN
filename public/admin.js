let token = null;
let edit = null;
let all = [];

const $ = (id) => document.getElementById(id);
const v = (id) => ($(id)?.value || "").trim();
const set = (id, value) => { if ($(id)) $(id).value = value ?? ""; };
const esc = (x) => String(x ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

async function login() {
  const r = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: v("user"), password: v("pass") })
  });
  const x = await r.json();
  if (!r.ok || !x.success) return alert(x.message || "Login failed");
  token = x.token;
  sessionStorage.setItem("mandal-admin-token", token);
  $("login").style.display = "none";
  $("dash").style.display = "block";
  load();
}

function headers() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function load() {
  const r = await fetch("/api/admin/mandals", { headers: headers() });
  const x = await r.json();
  if (r.status === 401) return logout();
  all = x.data || [];
  $("list").innerHTML = all.map(m => `<div class="item"><div><b>${esc(m.name)}</b><br>${esc(m.location)}<br><small>${m.latitude}, ${m.longitude}</small></div><div><button class="secondary-button" onclick="editM('${m._id}')">Edit</button> <button class="primary-button" onclick="delM('${m._id}')">Delete</button></div></div>`).join("");
}

async function save() {
  const body = {
    name: v("name"), location: v("location"), address: v("address"),
    latitude: Number(v("lat")), longitude: Number(v("lng")),
    category: v("category") || "Ganpati Mandal", darshanTime: v("time"),
    year: Number(v("year")) || 2027, image: v("image"), description: v("desc"),
    social: { instagram: v("instagram"), youtube: v("youtube"), facebook: v("facebook"), whatsapp: v("whatsapp") }
  };
  const url = edit ? `/api/admin/mandals/${edit}` : "/api/admin/mandals";
  const r = await fetch(url, { method: edit ? "PUT" : "POST", headers: headers(), body: JSON.stringify(body) });
  const x = await r.json();
  if (!r.ok || !x.success) return alert(x.message || "Unable to save Mandal");
  clearForm();
  load();
}

function editM(id) {
  const m = all.find(x => x._id === id);
  if (!m) return;
  edit = id;
  set("name", m.name); set("location", m.location); set("address", m.address);
  set("lat", m.latitude); set("lng", m.longitude); set("category", m.category);
  set("time", m.darshanTime); set("year", m.year); set("image", m.image); set("desc", m.description);
  set("instagram", m.social?.instagram); set("youtube", m.social?.youtube);
  set("facebook", m.social?.facebook); set("whatsapp", m.social?.whatsapp);
  scrollTo({ top: 0, behavior: "smooth" });
}

async function delM(id) {
  if (!confirm("Delete this Mandal?")) return;
  const r = await fetch(`/api/admin/mandals/${id}`, { method: "DELETE", headers: headers() });
  if (r.status === 401) return logout();
  load();
}

function clearForm() {
  edit = null;
  ["name", "location", "address", "lat", "lng", "category", "time", "image", "desc", "instagram", "youtube", "facebook", "whatsapp"].forEach(x => set(x, ""));
  set("year", 2027);
}

function logout() {
  token = null;
  sessionStorage.removeItem("mandal-admin-token");
  $("login").style.display = "block";
  $("dash").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  token = sessionStorage.getItem("mandal-admin-token");
  if (token) {
    $("login").style.display = "none";
    $("dash").style.display = "block";
    load();
  }
});
