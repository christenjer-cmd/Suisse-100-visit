/* Suisse 100 — l'application. Les lieux, saisons, tags et fêtes sont dans data.js. */
"use strict";

/* ================= utilitaires ================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = n => String(n).padStart(2, "0");
const ymd = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());   // date LOCALE (jamais UTC)
const todayYmd = () => ymd(new Date());
const parseYmd = s => new Date(s + "T12:00:00");
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const dayDiff = (from, to) => Math.round((parseYmd(ymd(to)) - parseYmd(ymd(from))) / 86400000);
const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const loadJSON = (k, def = {}) => { try { const v = JSON.parse(localStorage.getItem(k)); return v && typeof v === "object" ? v : def; } catch(e){ return def; } };
const saveJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
const stripEmoji = s => s.replace(/^\S+\s/, "");

const MOIS = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
function fmtDate(iso, o){ return iso ? parseYmd(iso).toLocaleDateString("fr-CH", o || { day: "numeric", month: "long", year: "numeric" }) : ""; }
const fmtDay = iso => fmtDate(iso, { weekday: "long", day: "numeric", month: "long" });
const fmtDayShort = d => d.toLocaleDateString("fr-CH", { weekday: "short", day: "numeric", month: "short" });
function relDays(n){ return n === 0 ? "aujourd’hui" : n === 1 ? "demain" : n === 2 ? "après-demain" : n > 0 ? "dans " + n + " jours" : n === -1 ? "hier" : "il y a " + (-n) + " jours"; }
function fmtMin(m){ const h = Math.floor(m / 60), mm = Math.round(m % 60); return h ? h + " h " + pad(mm) : mm + " min"; }
const fmtDist = m => m < 1000 ? m + " m" : (m / 1000).toFixed(1).replace(".", ",") + " km";
function hav(a, b){                                         // a {lat,lng} · b [lat,lng] → km
  const R = 6371, r = x => x * Math.PI / 180, dLa = r(b[0] - a.lat), dLo = r(b[1] - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b[0])) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function estMin(from, it){                                  // estimation porte-à-porte en transports publics
  const km = hav(from, it.x) * 1.35;                        // détour ferroviaire moyen
  const v = km < 25 ? 45 : km < 80 ? 65 : 85;               // vitesse selon la distance
  let t = km / v * 60 + 25;                                 // + accès gare et attente
  if (it.c === "som") t += 40; else if (it.c === "ran" || it.c === "eau") t += 15;
  return Math.round(t / 5) * 5;
}

/* ================= état (localStorage, compatible avec les versions 1 à 12) ================= */
const KEY = "suisse100_v1";
const VERSION = "14";
const START = parseYmd("2026-07-16"), END = parseYmd("2028-07-16"), GOAL = 100;
const DEFAULT_HOME = { name: "La Chaux-de-Fonds", lat: 47.100, lng: 6.826 };
let state = loadJSON(KEY, {});
function normalizeState(){
  for (const k of ["done", "notes", "planned", "plannedMeta", "pack"]) if (!state[k] || typeof state[k] !== "object" || Array.isArray(state[k])) state[k] = {};
  for (const k of ["custom", "hidden"]) if (!Array.isArray(state[k])) state[k] = [];
  if (!state.votes || typeof state.votes !== "object") state.votes = {};
  for (const k of ["a", "b"]) if (!state.votes[k] || typeof state.votes[k] !== "object") state.votes[k] = {};
  if (!state.people || typeof state.people !== "object") state.people = { a: "", b: "", me: "a" };
  if (state.people.me !== "b") state.people.me = "a";
  if (!state.dec || typeof state.dec !== "object") state.dec = { dur: 120, moods: [] };
  if (!state.home){                                         // départ choisi dans l'ancien « Demain ? »
    const p = state.plan;
    if (p && p.from === "geo" && p.geo) state.home = { name: "Ma position", lat: p.geo.lat, lng: p.geo.lng, geo: true };
    else if (p && p.from !== undefined && p.from !== "" && STATIONS_V1[+p.from]){ const s = STATIONS_V1[+p.from]; state.home = { name: s[0], lat: s[1], lng: s[2] }; }
  }
}
normalizeState();
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){ toast("⚠️ Stockage plein : exportez une sauvegarde."); } }
const home = () => state.home || DEFAULT_HOME;
const homeKey = () => { const h = home(); return h.geo ? "g" + h.lat.toFixed(2) + "," + h.lng.toFixed(2) : "n:" + h.name; };

/* temps de trajet CFF réels et gares les plus proches, déjà en cache sur les téléphones */
const ttCache = loadJSON("suisse100_tt"), stCache = loadJSON("suisse100_st");
(function migrateTT(){
  let changed = false;
  for (const k of Object.keys(ttCache)){
    const m = k.match(/^s(\d+)\|(.+)$/);                    // ancien format : index de gare
    if (!m) continue;
    if (STATIONS_V1[+m[1]]){ const nk = "n:" + STATIONS_V1[+m[1]][0] + "|" + m[2]; if (ttCache[nk] == null) ttCache[nk] = ttCache[k]; }
    delete ttCache[k]; changed = true;
  }
  if (changed) saveJSON("suisse100_tt", ttCache);
})();

/* ================= lieux ================= */
const allItems = () => ITEMS.concat(state.custom).filter(it => !state.hidden.some(h => String(h) === String(it.i)));
const byId = id => ITEMS.find(o => String(o.i) === String(id)) || state.custom.find(o => String(o.i) === String(id));
const asId = v => (typeof v === "string" && /^\d+$/.test(v)) ? +v : v;
const isDone = it => !!state.done[it.i];
const isRainOk = it => RAIN_OK.has(it.i);
const isActive = it => it.c === "ran" || ACTIVE.has(it.i);
const isRomantic = it => ROMANTIC.has(it.i);
const isGourmand = it => it.c === "gas" || GOURMAND.has(it.i);
const isCulture = it => it.c === "cul" || it.c === "vil";
const tint = it => `color-mix(in srgb, var(--tint-${it.c}) 16%, transparent)`;
function travel(it){
  if (!it.x) return null;
  const real = ttCache[homeKey() + "|" + it.i];
  return real != null ? { min: real, real: true } : { min: estMin(home(), it), real: false };
}
const ttLabel = tr => tr ? (tr.real ? "🚆 " : "🚆 ~") + fmtMin(tr.min) : "";
function inSeason(it, d){ return !it.m || it.m.includes((d || new Date()).getMonth() + 1); }
function seasonLabel(m){
  if (!m || m.length >= 12) return "";
  const set = new Set(m), runs = [];
  for (let s = 1; s <= 12; s++){
    if (!set.has(s) || set.has(s === 1 ? 12 : s - 1)) continue;          // début de plage (gère nov.–févr.)
    let e = s, next = e === 12 ? 1 : e + 1;
    while (set.has(next) && next !== s){ e = next; next = e === 12 ? 1 : e + 1; }
    runs.push([s, e]);
  }
  return runs.map(([s, e]) => s === e ? MOIS[s - 1] : MOIS[s - 1] + "–" + MOIS[e - 1]).join(", ");
}
/* --- photos des lieux (images.js, vérifiées par coordonnées) --- */
const imgOf = it => (IMAGES[it.i] && IMAGES[it.i][0]) || null;
const imgSmall = u => u ? u.replace(/\/(\d+)px-([^/]+)$/, (m, w, f) => +w > 330 ? "/330px-" + f : m) : null;
const imgTag = (u, eager) => u ? `<img src="${esc(u)}" alt="" ${eager ? "" : `loading="lazy" `}decoding="async" onerror="this.remove()">` : "";
function imgSource(it){
  const m = IMAGES[it.i]; if (!m) return null;
  const page = encodeURIComponent(m[1].replace(/ /g, "_"));
  return m[2] === "commons" ? { href: "https://commons.wikimedia.org/wiki/" + page, label: "Wikimedia Commons" }
    : { href: `https://${m[2]}.wikipedia.org/wiki/${page}`, label: m[1] + " (Wikipédia)" };
}
const lead = (it, size) => imgOf(it)
  ? `<span class="thumb"${size ? ` style="width:${size}px;height:${size}px"` : ""}>${imgTag(imgSmall(imgOf(it)))}<span class="mini">${CATS[it.c][0]}</span></span>`
  : `<span class="emo" style="background:${tint(it)}">${CATS[it.c][0]}</span>`;
function nearby(it, n = 3){                                 // à vol d'oiseau, pour combiner dans la journée
  return allItems()
    .filter(o => String(o.i) !== String(it.i) && o.x && !isDone(o))
    .map(o => ({ o, km: Math.round(hav({ lat: it.x[0], lng: it.x[1] }, o.x)) }))
    .filter(e => e.km <= 25).sort((a, b) => a.km - b.km).slice(0, n);
}

/* ================= fêtes à date ================= */
const isEventItem = it => !!EVENT_RULES[it.i];
function eventWindows(it, y){ const r = EVENT_RULES[it.i]; return r ? r.when(y).map(([s, e]) => ({ s, e, approx: !!r.approx, note: r.note || "" })) : []; }
function eventOn(it, d){ const t = +parseYmd(ymd(d)); return eventWindows(it, d.getFullYear()).find(w => +w.s <= t && t <= +w.e) || null; }
function nextEvent(it, from = new Date()){
  const t = +parseYmd(ymd(from));
  for (const y of [from.getFullYear(), from.getFullYear() + 1])
    for (const w of eventWindows(it, y).sort((a, b) => a.s - b.s)) if (+w.e >= t) return w;
  return null;
}
function upcomingEvents(days = 75){
  const t1 = +addDays(parseYmd(todayYmd()), days), out = [];
  for (const it of allItems()){ if (!isEventItem(it) || isDone(it)) continue; const w = nextEvent(it); if (w && +w.s <= t1) out.push(Object.assign({ it }, w)); }
  return out.sort((a, b) => a.s - b.s);
}
const feasibleOn = (it, d) => isEventItem(it) ? !!eventOn(it, d) : inSeason(it, d);   // fêtes : à leur date ; sinon : saison
const fmtWin = w => +w.s === +w.e ? fmtDayShort(w.s) : fmtDayShort(w.s) + " → " + fmtDayShort(w.e);

/* ================= à deux : prénoms, envies, sorties prévues ================= */
const me = () => state.people.me;
const other = () => (me() === "a" ? "b" : "a");
const nameOf = k => (state.people[k] || "").trim() || (k === me() ? "Moi" : "Toi");
const hasNames = () => !!((state.people.a || "").trim() && (state.people.b || "").trim());
const vote = (k, id) => state.votes[k][id] || 0;           // −1 bof · 1 envie · 2 absolument
const myVote = id => vote(me(), id);
const otherVote = id => vote(other(), id);
const isMatch = it => vote("a", it.i) > 0 && vote("b", it.i) > 0;
const VOTE_LBL = { "-1": "✕ bof", "1": "❤️ envie", "2": "⭐ absolument" };
function setVote(id, v){ const m = state.votes[me()]; if (v) m[id] = v; else delete m[id]; save(); }
const plannedDate = it => state.planned[it.i] || null;
const plannedMeta = it => state.plannedMeta[it.i] || null;
const isSurpriseForMe = it => { const m = plannedMeta(it); return !!(m && m.surprise && m.by && m.by !== me()); };
function setPlanned(id, date, meta){
  if (date){ state.planned[id] = date; state.plannedMeta[id] = Object.assign({ by: me(), at: Date.now() }, meta || {}); }
  else { delete state.planned[id]; delete state.plannedMeta[id]; }
  save();
}

/* ================= réseau ================= */
async function fetchJSON(url, opts = {}, ms = 15000){
  const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
  try { const r = await fetch(url, Object.assign({}, opts, { signal: c.signal })); if (!r.ok) throw new Error("HTTP " + r.status); return await r.json(); }
  finally { clearTimeout(t); }
}

/* --- horaires CFF (transport.opendata.ch) --- */
const CFF = "https://transport.opendata.ch/v1";
async function stationNear(lat, lng, key){
  if (stCache[key]) return stCache[key];
  const j = await fetchJSON(`${CFF}/locations?x=${lat}&y=${lng}&type=station`);
  const s = (j.stations || []).find(o => o && o.name);
  if (!s) throw new Error("station introuvable");
  stCache[key] = s.name; saveJSON("suisse100_st", stCache);
  return s.name;
}
const homeStation = () => { const h = home(); return stationNear(h.lat, h.lng, "h" + homeKey()); };
const itemStation = it => stationNear(it.x[0], it.x[1], "i" + it.i);
const parseDur = s => { const m = s && s.match(/(\d+)d(\d+):(\d+)/); return m ? (+m[1]) * 1440 + (+m[2]) * 60 + (+m[3]) : null; };
const hm = ts => { const d = new Date(ts * 1000); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };
async function connections(from, to, date, time, limit = 3, arrival = false){
  const j = await fetchJSON(`${CFF}/connections?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&time=${time}&limit=${limit}${arrival ? "&isArrivalTime=1" : ""}`, {}, 20000);
  return (j.connections || []).map(c => ({
    dep: c.from && c.from.departureTimestamp, arr: c.to && c.to.arrivalTimestamp,
    min: parseDur(c.duration), tr: c.transfers || 0,
    prod: (c.products || []).filter(Boolean).slice(0, 4).join(" · ")
  })).filter(c => c.dep && c.arr);
}
async function realMin(it){                                  // durée réelle d'un aller (demain, 8 h), mise en cache
  const k = homeKey() + "|" + it.i;
  if (ttCache[k] != null) return ttCache[k];
  const [from, to] = await Promise.all([homeStation(), itemStation(it)]);
  let min;
  if (from === to) min = 15;
  else {
    const cs = await connections(from, to, ymd(addDays(new Date(), 1)), "08:00", 1);
    if (!cs.length || cs[0].min == null) throw new Error("pas de liaison");
    min = cs[0].min;
  }
  ttCache[k] = min; saveJSON("suisse100_tt", ttCache);
  return min;
}
const gmapsTransit = it => it.x
  ? `https://www.google.com/maps/dir/?api=1&origin=${home().lat},${home().lng}&destination=${it.x[0]},${it.x[1]}&travelmode=transit`
  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.t + " " + (it.p || "") + " Suisse")}`;

/* --- météo (Open-Meteo, gratuit, sans clé) --- */
const WX = "https://api.open-meteo.com/v1/forecast";
const wxCache = new Map();
const wxK = (lat, lng, date) => lat.toFixed(2) + "," + lng.toFixed(2) + "|" + date;
async function weatherFor(points, date){
  const ahead = dayDiff(new Date(), parseYmd(date));
  if (ahead < 0 || ahead > 15) return points.map(() => null);
  const need = [], seen = new Set();
  for (const p of points){ const k = wxK(p.lat, p.lng, date); if (!wxCache.has(k) && !seen.has(k)){ seen.add(k); need.push(p); } }
  for (let i = 0; i < need.length; i += 60){
    const part = need.slice(i, i + 60);
    const url = `${WX}?latitude=${part.map(p => p.lat.toFixed(3)).join(",")}&longitude=${part.map(p => p.lng.toFixed(3)).join(",")}`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Europe%2FZurich&start_date=${date}&end_date=${date}`;
    const j = await fetchJSON(url);
    (Array.isArray(j) ? j : [j]).forEach((o, ix) => {
      const d = o && o.daily;
      if (!d || !d.weather_code || d.weather_code[0] == null) return;
      wxCache.set(wxK(part[ix].lat, part[ix].lng, date), {
        c: d.weather_code[0], tmax: Math.round(d.temperature_2m_max[0]), tmin: Math.round(d.temperature_2m_min[0]),
        pp: d.precipitation_probability_max ? d.precipitation_probability_max[0] : null,
        rise: ((d.sunrise && d.sunrise[0]) || "").slice(11, 16), set: ((d.sunset && d.sunset[0]) || "").slice(11, 16)
      });
    });
  }
  return points.map(p => wxCache.get(wxK(p.lat, p.lng, date)) || null);
}
const wxEmo = c => c == null ? "" : c === 0 ? "☀️" : c <= 2 ? "🌤️" : c === 3 ? "☁️" : c <= 48 ? "🌫️"
  : c <= 57 ? "🌦️" : c <= 67 ? "🌧️" : c <= 77 ? "🌨️" : c <= 82 ? "🌧️" : c <= 86 ? "🌨️" : "⛈️";
const wxTxt = c => c == null ? "" : c === 0 ? "grand beau" : c <= 2 ? "plutôt ensoleillé" : c === 3 ? "couvert" : c <= 48 ? "brouillard"
  : c <= 57 ? "bruine" : c <= 67 ? "pluie" : c <= 77 ? "neige" : c <= 82 ? "averses" : c <= 86 ? "averses de neige" : "orages";
const wxRain = w => !!w && ((w.c >= 51 && w.c <= 67) || (w.c >= 80 && w.c <= 82) || w.c >= 95 || (w.pp != null && w.pp >= 65));
const wxSnow = w => !!w && ((w.c >= 71 && w.c <= 77) || w.c === 85 || w.c === 86);
const wxSunny = w => !!w && w.c <= 1 && !(w.pp >= 40);
const wxGrey = w => !!w && (w.c === 3 || w.c === 45 || w.c === 48);

/* --- « Sur place » : lieux utiles autour (OpenStreetMap via Overpass) --- */
/* serveur suisse d'abord (rapide, couvre tout le pays), serveur mondial en secours */
const OVERPASS = ["https://overpass.osm.ch/api/interpreter", "https://overpass-api.de/api/interpreter"];
const spCache = new Map(), spLoading = new Set();
function spGroup(t){
  if (t.shop) return "courses";
  if (t.amenity === "toilets" || t.amenity === "drinking_water" || t.tourism === "picnic_site" || t.leisure === "picnic_table") return "utile";
  if (["restaurant", "cafe", "fast_food", "bar", "pub", "biergarten"].includes(t.amenity)) return "manger";
  if (t.tourism === "viewpoint" || t.tourism === "attraction" || t.natural === "peak") return "voir";
  return "culture";
}
function spType(t){
  if (t.amenity === "toilets") return { type: "Toilettes", emo: "🚻" };
  if (t.amenity === "drinking_water") return { type: "Eau potable", emo: "🚰" };
  if (t.tourism === "picnic_site" || t.leisure === "picnic_table") return { type: "Pique-nique", emo: "🧺" };
  if (t.amenity === "restaurant") return { type: "Restaurant" + (t.cuisine ? " · " + t.cuisine.replace(/[_;]/g, " ") : ""), emo: "🍴" };
  if (t.amenity === "cafe") return { type: "Café", emo: "☕" };
  if (t.amenity === "fast_food") return { type: "Fast-food", emo: "🍔" };
  if (["bar", "pub", "biergarten"].includes(t.amenity)) return { type: "Bar / pub", emo: "🍺" };
  if (t.shop === "bakery") return { type: "Boulangerie", emo: "🥐" };
  if (t.shop === "supermarket") return { type: "Supermarché", emo: "🛒" };
  if (t.shop === "convenience") return { type: "Épicerie", emo: "🛒" };
  if (t.shop === "deli") return { type: "Traiteur", emo: "🧀" };
  if (t.shop === "greengrocer") return { type: "Primeur", emo: "🥬" };
  if (t.shop === "butcher") return { type: "Boucherie", emo: "🥩" };
  if (t.tourism === "museum") return { type: "Musée", emo: "🏛️" };
  if (t.tourism === "gallery") return { type: "Galerie", emo: "🖼️" };
  if (t.tourism === "artwork") return { type: "Œuvre d’art", emo: "🎨" };
  if (t.tourism === "viewpoint") return { type: "Point de vue", emo: "👁️" };
  if (t.tourism === "attraction") return { type: "Attraction", emo: "⭐" };
  if (t.natural === "peak") return { type: "Sommet", emo: "⛰️" };
  if (t.amenity === "place_of_worship" || t.historic === "church") return { type: "Église / lieu de culte", emo: "⛪" };
  if (t.historic === "castle") return { type: "Château", emo: "🏰" };
  if (t.historic === "ruins") return { type: "Ruines", emo: "🏚️" };
  if (t.historic === "monument" || t.historic === "memorial") return { type: "Monument", emo: "🗿" };
  return { type: "Point d’intérêt", emo: "📍" };
}
async function overpassAll(lat, lng, r){
  const A = `(around:${r},${lat},${lng})`;
  const ql = `[out:json][timeout:25];(`
    + `nwr["amenity"~"^(toilets|drinking_water|restaurant|cafe|fast_food|bar|pub|biergarten|place_of_worship)$"]${A};`
    + `nwr["tourism"~"^(picnic_site|museum|gallery|artwork|viewpoint|attraction)$"]${A};`
    + `nwr["leisure"="picnic_table"]${A};`
    + `nwr["shop"~"^(bakery|supermarket|convenience|deli|greengrocer|butcher)$"]${A};`
    + `nwr["historic"~"^(castle|monument|memorial|ruins|church)$"]${A};`
    + `nwr["natural"="peak"]${A};`
    + `);out center 200;`;
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++){            // les serveurs Overpass ont souvent des pannes passagères
    if (attempt > 1) await new Promise(res => setTimeout(res, 1200 * attempt));
    try {
      const j = await fetchJSON(OVERPASS[attempt % OVERPASS.length], { method: "POST", body: "data=" + encodeURIComponent(ql), headers: { "Content-Type": "application/x-www-form-urlencoded" } }, 15000);
      const from = { lat, lng };
      return (j.elements || []).map(el => {
        const la = el.lat != null ? el.lat : (el.center && el.center.lat);
        const lo = el.lon != null ? el.lon : (el.center && el.center.lon);
        if (la == null || lo == null) return null;
        const t = el.tags || {};
        return Object.assign({ name: t.name || "", grp: spGroup(t), lat: la, lng: lo, dist: Math.round(hav(from, [la, lo]) * 1000) }, spType(t));
      }).filter(Boolean)
        .filter((p, i, a) => a.findIndex(q => q.name === p.name && Math.abs(q.lat - p.lat) < 1e-4 && Math.abs(q.lng - p.lng) < 1e-4) === i)
        .sort((a, b) => a.dist - b.dist);
    } catch(e){ lastErr = e; }
  }
  throw lastErr;
}
const SP_ORDER = [["utile", "🚻", "Utile (WC, eau, pique-nique)"], ["manger", "🍴", "Manger"], ["courses", "🛒", "Courses"], ["culture", "🏛️", "Culture & sites"], ["voir", "👁️", "Points de vue & nature"]];
function spRow(p){
  const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent((p.name ? p.name + " " : "") + p.lat + "," + p.lng);
  return `<a class="sprow" href="${maps}" target="_blank" rel="noopener"><span class="spemo">${p.emo}</span>`
    + `<span class="spt">${esc(p.name || p.type)}<small>${esc(p.name ? p.type : "")}</small></span><span class="spd">${fmtDist(p.dist)}</span></a>`;
}
function spHTML(list, r, per, sel, id){
  if (!list.length) return `<p class="spmsg">Rien trouvé dans ${r < 1000 ? r + " m" : r / 1000 + " km"} autour.`
    + (r < 5000 ? ` <button data-act="spwide" data-i="${esc(id)}" data-sel="${sel}" data-r="5000">Chercher plus loin (5 km)</button>` : "") + `</p>`;
  let h = "";
  for (const [g, emo, lab] of SP_ORDER){
    const grp = list.filter(p => p.grp === g);
    if (!grp.length) continue;
    h += `<div class="spgrp">${emo} ${lab}<small>${grp.length}</small></div>` + grp.slice(0, per).map(spRow).join("");
  }
  return h;
}
function loadSurPlace(it, sel, r = 1500, per = 5){
  const el = () => document.querySelector(sel);
  if (!el() || !it.x) return;
  if (!navigator.onLine){ el().innerHTML = `<p class="spmsg">Hors ligne — disponible avec une connexion.</p>`; return; }
  const key = it.i + "|" + r;
  const show = list => { const e = el(); if (e) e.innerHTML = spHTML(list, r, per, sel, it.i); };
  if (spCache.has(key)) return show(spCache.get(key));
  el().innerHTML = `<p class="spmsg">🧭 Recherche des lieux autour…</p>`;
  if (spLoading.has(key)) return;
  spLoading.add(key);
  overpassAll(it.x[0], it.x[1], r)
    .then(list => { spCache.set(key, list); show(list); })
    .catch(() => { const e = el(); if (e) e.innerHTML = `<p class="spmsg">Lieux indisponibles pour l’instant. <button data-act="spretry" data-i="${esc(it.i)}" data-sel="${sel}" data-r="${r}">Réessayer</button></p>`; })
    .finally(() => spLoading.delete(key));
}

/* --- géolocalisation d'un lieu ajouté à la main (Nominatim / OpenStreetMap) --- */
async function geocode(q){
  const j = await fetchJSON(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=ch&limit=1&accept-language=fr&q=${encodeURIComponent(q)}`, {}, 10000);
  return Array.isArray(j) && j[0] ? [Math.round(+j[0].lat * 1000) / 1000, Math.round(+j[0].lon * 1000) / 1000] : null;
}
const geoNow = () => new Promise((res, rej) => {
  if (!navigator.geolocation) return rej(new Error("indisponible"));
  navigator.geolocation.getCurrentPosition(p => res([p.coords.latitude, p.coords.longitude]), rej, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
});

/* ================= photos (IndexedDB, inchangé depuis la v1) ================= */
let _db = null;
function db(){
  if (_db) return Promise.resolve(_db);
  return new Promise((res, rej) => {
    const q = indexedDB.open("suisse100", 1);
    q.onupgradeneeded = e => { const st = e.target.result.createObjectStore("photos", { keyPath: "pid", autoIncrement: true }); st.createIndex("item", "item"); };
    q.onsuccess = e => { _db = e.target.result; res(_db); };
    q.onerror = () => rej(q.error);
  });
}
const store = mode => db().then(d => d.transaction("photos", mode).objectStore("photos"));
const req = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const photoIdx = new Map();                                  // itemId (str) -> [pid…]
const urlCache = new Map();                                  // pid -> objectURL
function idxAdd(item, pid){ const k = String(item); if (!photoIdx.has(k)) photoIdx.set(k, []); photoIdx.get(k).push(pid); }
const nPhotos = it => (photoIdx.get(String(it.i)) || []).length;
async function loadPhotoIndex(){
  try {
    const st = await store("readonly");
    await new Promise(res => {
      const cur = st.index("item").openKeyCursor();
      cur.onsuccess = e => { const c = e.target.result; if (c){ idxAdd(c.key, c.primaryKey); c.continue(); } else res(); };
      cur.onerror = () => res();
    });
  } catch(e){ console.warn("IndexedDB indisponible", e); }
}
async function photoURL(pid){
  if (urlCache.has(pid)) return urlCache.get(pid);
  const rec = await req((await store("readonly")).get(pid));
  if (!rec) return null;
  const u = URL.createObjectURL(rec.blob);
  urlCache.set(pid, u);
  return u;
}
async function shrink(file){
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const cv = document.createElement("canvas");
    cv.width = Math.round(bmp.width * s); cv.height = Math.round(bmp.height * s);
    cv.getContext("2d").drawImage(bmp, 0, 0, cv.width, cv.height);
    return (await new Promise(r => cv.toBlob(r, "image/jpeg", 0.82))) || file;
  } catch(e){ return file; }
}
async function addPhotos(item, files){
  for (const f of files){
    const blob = await shrink(f);
    const rec = { item: String(item), date: (state.done[item] && state.done[item].date) || todayYmd(), blob };
    const pid = await req((await store("readwrite")).add(rec));
    idxAdd(item, pid);
  }
}
async function removePhoto(pid, item){
  await req((await store("readwrite")).delete(pid));
  const arr = photoIdx.get(String(item)) || [], j = arr.indexOf(pid);
  if (j >= 0) arr.splice(j, 1);
  if (urlCache.has(pid)){ URL.revokeObjectURL(urlCache.get(pid)); urlCache.delete(pid); }
}
async function fillStrip(el){
  if (!el) return;
  const id = el.dataset.ph, pids = photoIdx.get(String(id)) || [];
  if (!pids.length){ el.innerHTML = `<span class="none">Pas encore de photo.</span>`; return; }
  el.innerHTML = "";
  for (const pid of pids){
    const u = await photoURL(pid);
    if (!u) continue;
    const img = document.createElement("img");
    img.src = u; img.loading = "lazy"; img.alt = "photo";
    img.addEventListener("click", ev => { ev.stopPropagation(); openLightbox(pids, pids.indexOf(pid), id); });
    el.appendChild(img);
  }
}
const lb = { pids: [], idx: 0, item: null };
async function openLightbox(pids, idx, item){
  lb.pids = pids; lb.idx = idx; lb.item = item;
  $("#lbimg").src = (await photoURL(pids[idx])) || "";
  $("#lb").showModal();
}
async function lbShow(delta){
  if (!lb.pids.length) return;
  lb.idx = (lb.idx + delta + lb.pids.length) % lb.pids.length;
  $("#lbimg").src = (await photoURL(lb.pids[lb.idx])) || "";
}
$("#lbclose").addEventListener("click", () => $("#lb").close());
$("#lbprev").addEventListener("click", () => lbShow(-1));
$("#lbnext").addEventListener("click", () => lbShow(1));
$("#lbdel").addEventListener("click", async () => {
  if (!confirm("Supprimer cette photo ?")) return;
  await removePhoto(lb.pids[lb.idx], lb.item);
  if (!lb.pids.length) $("#lb").close();
  else { lb.idx %= lb.pids.length; $("#lbimg").src = (await photoURL(lb.pids[lb.idx])) || ""; }
  refresh();
});

/* ================= interface : toast, vues, rafraîchissement ================= */
let toastT;
function toast(msg, label, fn, ms = 4500){
  const el = $("#toast");
  el.innerHTML = `<span>${esc(msg)}</span>` + (label ? `<button type="button">${esc(label)}</button>` : "");
  if (label) el.querySelector("button").onclick = () => { el.classList.remove("on"); fn(); };
  el.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), ms);
}
let view = "home";
function go(v){
  view = v;
  $$(".view").forEach(s => s.classList.toggle("on", s.id === "v-" + v));
  $$("#tabbar button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
  window.scrollTo({ top: 0 });
  renderView();
}
function renderView(){
  renderPill();
  ({ home: renderHome, explore: renderExplore, map: renderMap, couple: renderCouple, souv: renderSouv })[view]();
  focusable();
}
const focusable = (root = document) => $$("[data-act]:not(button):not(a):not([tabindex])", root).forEach(el => { el.tabIndex = 0; el.setAttribute("role", "button"); });
document.addEventListener("keydown", e => {                  // Entrée / espace sur une carte = clic
  if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-act][role=button]")){ e.preventDefault(); e.target.click(); }
});
function refresh(){                                         // après tout changement d'état
  renderView();
  if ($("#dlgItem").open) renderSheet();
}
const closeDialogs = () => $$("dialog[open]").forEach(d => d.close());
function renderPill(){
  const n = allItems().filter(isDone).length;
  $("#pill").innerHTML = `<b>${n}</b> / ${GOAL}`;
  const pending = hasNames() && allItems().some(it => !isDone(it) && otherVote(it.i) > 0 && !myVote(it.i));
  $("#coupleIcon").classList.toggle("dot", pending);
}

/* ================= accueil ================= */
const MOODS = [["calme", "😌 Tranquille"], ["actif", "🥾 Sportif"], ["gourmand", "🍽️ Gourmand"], ["culture", "🏛️ Culture"], ["romantique", "💕 Romantique"], ["gratuit", "🎫 Inclus AG"]];
const DURS = [[60, "≤ 1 h"], [120, "≤ 2 h"], [180, "≤ 3 h"], [600, "Peu importe"]];
function defaultOutingDate(){                               // le week-end par défaut, aujourd'hui si on y est déjà
  const t = new Date(), wd = t.getDay();
  if (wd === 6 || wd === 0) return ymd(t);
  return ymd(addDays(t, 6 - wd));
}
const dec = { mode: state.dec.mode === "wk" ? "wk" : "day", date: defaultOutingDate(), dur: state.dec.dur || 120,
  wk: null, wkDur: state.dec.wkDur || 240, moods: new Set(state.dec.moods || []), jit: new Map() };
const WK_DURS = [[120, "≤ 2 h"], [180, "≤ 3 h"], [240, "≤ 4 h"], [600, "Peu importe"]];
function weekendOptions(){                                  // samedis des 4 prochains week-ends
  const t = new Date(), wd = t.getDay(), sat = addDays(t, wd === 6 ? 0 : wd === 0 ? 6 : 6 - wd), out = [];
  for (let i = 0; i < 4; i++){
    const a = addDays(sat, 7 * i), b = addDays(a, 1);
    out.push({ k: ymd(a), l: i === 0 ? "Ce week-end" : i === 1 ? "Le suivant" : a.getDate() + "–" + b.getDate() + " " + MOIS[b.getMonth()] });
  }
  return out;
}
const dayName = d => { const s = d.toLocaleDateString("fr-CH", { weekday: "long" }); return s.charAt(0).toUpperCase() + s.slice(1); };
function wkRange(d1s){                                      // « 24–25 octobre » ou « 31 octobre – 1 novembre »
  const a = parseYmd(d1s), b = addDays(a, 1), mo = d => d.toLocaleDateString("fr-CH", { month: "long" });
  return a.getMonth() === b.getMonth() ? `${a.getDate()}–${b.getDate()} ${mo(b)}` : `${a.getDate()} ${mo(a)} – ${b.getDate()} ${mo(b)}`;
}
function whenOptions(){
  const t = new Date(), opts = [{ k: ymd(t), l: "Aujourd’hui" }, { k: ymd(addDays(t, 1)), l: "Demain" }];
  for (const wd of [6, 0]){
    let d = addDays(t, 1);
    while (d.getDay() !== wd) d = addDays(d, 1);
    const k = ymd(d);
    if (!opts.some(o => o.k === k)) opts.push({ k, l: (wd === 6 ? "Samedi " : "Dimanche ") + d.getDate() });
  }
  return opts;
}
function dateChips(cur, attr, inputId){
  const opts = whenOptions(), known = opts.some(o => o.k === cur);
  return opts.map(o => `<button class="chip${o.k === cur ? " on" : ""}" ${attr}="${o.k}">${o.l}</button>`).join("")
    + `<span class="chip date${known ? "" : " on"}">📅 ${known ? "Autre date" : fmtDate(cur, { weekday: "short", day: "numeric", month: "short" })}`
    + `<input type="date" id="${inputId}" min="${todayYmd()}" value="${cur}" aria-label="Choisir une date"></span>`;
}

function renderHome(){
  const items = allItems(), n = items.filter(isDone).length, total = items.length, today = new Date();
  const expected = Math.max(0, Math.min(GOAL, Math.round(GOAL * (today - START) / (END - START))));
  const diff = n - expected;
  let pace;
  if (today < START) pace = "Le compte à rebours démarre le 16 juillet 2026.";
  else if (n >= GOAL) pace = `🏆 Objectif atteint ! Encore ${total - n} idées pour tout finir.`;
  else if (diff >= 2) pace = `<b>${diff} d’avance</b> sur le rythme pour 100 avant juillet 2028 🚀`;
  else if (diff <= -2) pace = `<b>${-diff} à rattraper</b> pour 100 avant juillet 2028 — on s’y met ? 😉`;
  else pace = `Pile <b>dans les temps</b> pour 100 avant juillet 2028 ✔`;
  const C = 2 * Math.PI * 42, pct = Math.min(1, n / GOAL);
  const hello = (state.people[me()] || "").trim() ? "Salut " + esc(nameOf(me())) + " 👋" : "On part où ?";
  $("#v-home").innerHTML = `
    <div class="hero">
      <div class="ring" role="img" aria-label="${n} aventures sur ${GOAL}">
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="var(--soft)" stroke-width="9"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--red)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - pct)).toFixed(1)}"/></svg>
        <div class="n"><b>${n}</b><small>sur ${GOAL}</small></div>
      </div>
      <div><h1>${hello}</h1><p>${pace}</p></div>
    </div>
    <svg class="mountains" viewBox="0 0 800 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 60 L70 26 L130 46 L210 10 L280 44 L350 22 L420 50 L500 6 L570 40 L640 24 L710 46 L800 14 L800 60 Z" fill="var(--soft)"/>
      <path d="M0 60 L90 40 L170 54 L260 30 L340 52 L430 34 L520 54 L610 38 L700 52 L800 40 L800 60 Z" fill="var(--line)" opacity=".8"/>
    </svg>
    ${backupNoticeHTML()}${pastPlannedHTML()}${nextOutingHTML()}${inspirationHTML()}${deciderHTML()}${eventsHTML()}${matchesHTML()}`;
  runDecider();
}

/* --- « Cet automne, près de chez vous » : un carrousel qui donne envie --- */
const seasonName = (d = new Date()) => { const m = d.getMonth() + 1; return m === 12 || m <= 2 ? ["❄️", "Cet hiver"] : m <= 5 ? ["🌸", "Ce printemps"] : m <= 8 ? ["☀️", "Cet été"] : ["🍂", "Cet automne"]; };
const dayHash = s => { let h = 2166136261; for (const ch of String(s)){ h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
function inspirationHTML(){
  const now = new Date(), t = todayYmd(), [se, sl] = seasonName(now), cand = [];
  for (const it of allItems()){
    if (isDone(it) || !imgOf(it) || !it.x || myVote(it.i) < 0) continue;
    const tr = travel(it);
    if (tr.min > 180) continue;
    let s = dayHash(it.i + t) * 14, tag = "";                  // un mélange différent chaque jour
    if (isEventItem(it)){
      const w = nextEvent(it); if (!w) continue;
      const n = dayDiff(now, w.s); if (n > 45) continue;
      s += 25; tag = n <= 0 ? "🎉 en ce moment" : "🎉 " + relDays(n);
    } else if (!inSeason(it)) continue;
    else if (it.m && it.m.length <= 6){ s += 12; tag = se + " c’est le moment"; }
    if (isMatch(it)){ s += 22; tag = "💞 envie commune"; }
    else if (myVote(it.i) > 0 || otherVote(it.i) > 0) s += 10;
    if (isRomantic(it)) s += 6;
    s -= tr.min / 12;
    cand.push({ it, tr, s, tag });
  }
  const top = cand.sort((a, b) => b.s - a.s).slice(0, 10);
  if (!top.length) return "";
  return `<div class="boxhead" style="margin:18px 0 6px"><h2 class="h">${se} ${sl}, pas loin</h2><button class="link" data-go="explore">Tout explorer</button></div>
    <div class="carousel">${top.map(o => { const it = o.it, liked = myVote(it.i) > 0;
      return `<div class="insp" data-act="open" data-i="${it.i}">${imgTag(imgOf(it))}
        ${o.tag ? `<span class="tag">${esc(o.tag)}</span>` : ""}
        <button class="heart${liked ? " on" : ""}" data-act="heart" data-i="${it.i}" aria-label="${liked ? "Retirer de nos envies" : "J’en ai envie"}">${liked ? "❤️" : "🤍"}</button>
        <div class="ov"><b>${esc(it.t)}</b><small>${esc(it.p || "")} · ${ttLabel(o.tr)}</small></div></div>`; }).join("")}</div>`;
}

function pastPlannedHTML(){
  const t = todayYmd();
  const it = allItems().filter(o => !isDone(o) && plannedDate(o) && plannedDate(o) < t).sort((a, b) => plannedDate(b).localeCompare(plannedDate(a)))[0];
  if (!it) return "";
  const reveal = isSurpriseForMe(it) ? "🎁 La surprise était… " : "";
  return `<div class="box next"><div class="kicker">Alors, c’était bien ?</div>
    <div class="ttl">${reveal}${CATS[it.c][0]} ${esc(it.t)}</div>
    <div class="meta">Prévu ${fmtDay(plannedDate(it))}</div>
    <div class="btnrow"><button class="btn ok sm" data-act="didit" data-i="${it.i}">✓ C’est fait !</button>
      <button class="btn sm" data-act="day" data-i="${it.i}">📅 Reporter</button>
      <button class="btn ghost sm" data-act="unplan" data-i="${it.i}">On ne l’a pas fait</button></div></div>`;
}
function nextOutingHTML(){
  const t = todayYmd();
  const up = allItems().filter(o => !isDone(o) && plannedDate(o) && plannedDate(o) >= t).sort((a, b) => plannedDate(a).localeCompare(plannedDate(b)));
  if (!up.length) return "";
  const it = up[0], d = plannedDate(it), n = dayDiff(new Date(), parseYmd(d));
  const more = up.length > 1 ? `<button class="link" data-go="souv">+ ${up.length - 1} autre${up.length > 2 ? "s" : ""} sortie${up.length > 2 ? "s" : ""} prévue${up.length > 2 ? "s" : ""}</button>` : "";
  if (isSurpriseForMe(it)){
    const m = plannedMeta(it);
    return `<div class="box next surprise"><div class="kicker">🎁 Sortie surprise · ${relDays(n)}</div>
      <div class="ttl">${esc(nameOf(m.by))} t’a préparé une surprise</div>
      <div class="meta">${fmtDay(d)}${m.time ? " · départ vers " + esc(m.time) : ""} · destination secrète 🤫</div>
      <div class="why"><span>🎒 Prévois : ${esc(packFor(it, null, d).slice(0, 3).map(stripEmoji).join(", "))}</span></div>${more}</div>`;
  }
  const m = plannedMeta(it) || {};
  if (m.wkid){                                              // un week-end prévu : toutes ses étapes ensemble
    const wkItems = up.filter(o => (plannedMeta(o) || {}).wkid === m.wkid), rest = up.length - wkItems.length;
    return `<div class="box next"><div class="kicker">🧳 Week-end · ${relDays(n)}</div>
      <div class="ttl">${esc(m.wk || "Escapade")}</div>
      <div class="meta">${fmtDay(d)}${m.time ? " · départ " + esc(m.time) : ""}</div>
      <div class="nearrow" style="margin-top:9px">${wkItems.map(o => `<button class="near" data-act="open" data-i="${o.i}">${CATS[o.c][0]} ${esc(o.t)}</button>`).join("")}</div>
      <div class="btnrow"><button class="btn primary sm" data-act="day" data-i="${it.i}" data-date="${d}">🗓️ Préparer le départ</button>
        ${rest ? `<button class="link" data-go="souv">+ ${rest} autre${rest > 1 ? "s" : ""} sortie${rest > 1 ? "s" : ""}</button>` : ""}</div></div>`;
  }
  const tr = travel(it);
  return `<div class="box next"><div class="kicker">Prochaine sortie · ${relDays(n)}</div>
    <div class="ttl">${CATS[it.c][0]} ${esc(it.t)}</div>
    <div class="meta">${fmtDay(d)} · ${esc(it.p || "")}${tr ? " · " + ttLabel(tr) : ""}${(plannedMeta(it) || {}).surprise ? " · 🎁 surprise" : ""}</div>
    <div class="btnrow"><button class="btn primary sm" data-act="day" data-i="${it.i}" data-date="${d}">🗓️ Préparer la journée</button>
      <button class="btn sm" data-act="open" data-i="${it.i}">Fiche</button>${more}</div></div>`;
}
function deciderHTML(){
  const wkm = dec.mode === "wk", wopts = weekendOptions();
  if (!dec.wk || !wopts.some(o => o.k === dec.wk)) dec.wk = wopts[0].k;
  return `<div class="box decide" id="decide">
    <div class="boxhead"><h2 class="h">✨ On fait quoi ?</h2><button class="link" data-act="shuffle">🎲 D’autres idées</button></div>
    <div class="modeseg" id="decMode"><button data-mode="day" class="${wkm ? "" : "on"}">☀️ Une journée</button><button data-mode="wk" class="${wkm ? "on" : ""}">🧳 Un week-end</button></div>
    ${wkm
      ? `<div class="row"><span>Quel week-end</span><div class="chips" id="decWk">${wopts.map(o => `<button class="chip${o.k === dec.wk ? " on" : ""}" data-wk="${o.k}">${o.l}</button>`).join("")}</div></div>
         <div class="row"><span>Trajet max jusqu’à l’étape</span><div class="chips" id="decWkDur">${WK_DURS.map(([v, l]) => `<button class="chip${dec.wkDur === v ? " on" : ""}" data-wkdur="${v}">${l}</button>`).join("")}</div></div>`
      : `<div class="row"><span>Quand</span><div class="chips" id="decWhen">${dateChips(dec.date, "data-when", "decDate")}</div></div>
         <div class="row"><span>Trajet max (aller)</span><div class="chips" id="decDur">${DURS.map(([v, l]) => `<button class="chip${dec.dur === v ? " on" : ""}" data-dur="${v}">${l}</button>`).join("")}</div></div>`}
    <div class="row"><span>Envie du jour</span><div class="chips wrapok" id="decMood">${MOODS.map(([k, l]) => `<button class="chip${dec.moods.has(k) ? " on" : ""}" data-mood="${k}">${l}</button>`).join("")}</div></div>
    <div class="fromline">Départ : <button data-act="editHome">${esc(home().name)} ✎</button></div>
    <p class="status" id="decStatus"></p>
    <div id="decRes"></div></div>`;
}
function eventsHTML(){
  const ev = upcomingEvents(75).slice(0, 5);
  if (!ev.length) return "";
  const t0 = new Date();
  return `<div class="box"><div class="boxhead"><h2 class="h">🎉 Bientôt en Suisse</h2></div>
    ${ev.map(e => { const n = dayDiff(t0, e.s), on = n <= 0, tr = travel(e.it);
      return `<div class="evrow" data-act="day" data-i="${e.it.i}" data-date="${ymd(on ? t0 : e.s)}">
        <div class="cal"><i>${MOIS[e.s.getMonth()]}</i><b>${e.s.getDate()}</b></div>
        <div class="m"><b>${esc(e.it.t)}</b><small>${esc(e.it.p || "")} · ${fmtWin(e)}${e.approx ? " ≈" : ""}${tr ? " · " + ttLabel(tr) : ""}</small></div>
        <div class="r">${on ? "en cours !" : relDays(n)}</div>
        <button class="bell" data-act="remind" data-i="${e.it.i}" aria-label="Me rappeler ${esc(e.it.t)}" title="Me rappeler (agenda)">🔔</button></div>`; }).join("")}
    <p class="sub" style="margin-top:8px">🔔 = rappel dans votre agenda une semaine avant. ≈ date habituelle, à confirmer sur le programme officiel.</p></div>`;
}
function matchesHTML(){
  if (!hasNames()) return `<div class="box"><div class="boxhead"><h2 class="h">💞 À deux</h2></div>
    <p class="sub">Chacun note ses envies sur son téléphone, puis vous synchronisez : l’app trouve ce qui vous fait plaisir <b>à tous les deux</b> et le met en avant ici.</p>
    <div class="btnrow"><button class="btn sm" data-go="couple">Commencer</button></div></div>`;
  const ms = allItems().filter(it => !isDone(it) && isMatch(it)).sort((a, b) => (vote("a", b.i) + vote("b", b.i)) - (vote("a", a.i) + vote("b", a.i))).slice(0, 4);
  if (!ms.length) return "";
  return `<div class="box"><div class="boxhead"><h2 class="h">💞 Vos envies communes</h2><button class="link" data-go="couple">Tout voir</button></div>${ms.map(it => miniRow(it)).join("")}</div>`;
}
function miniRow(it, right){
  return `<div class="minirow" data-act="open" data-i="${it.i}"><span class="tmb" style="background:${tint(it)}">${CATS[it.c][0]}${imgTag(imgSmall(imgOf(it)))}</span>`
    + `<span class="m"><b>${esc(it.t)}</b><small>${esc(it.p || "")}${it.k ? " · " + esc(it.k) : ""}</small></span>`
    + `<span class="r">${right != null ? right : ttLabel(travel(it))}</span></div>`;
}

/* --- « On fait quoi ? » : le moteur de suggestions --- */
let decGen = 0;
async function runDecider(){
  if (dec.mode === "wk") return runWeekend();
  const gen = ++decGen, date = dec.date, d = parseYmd(date), H = home();
  const lastDone = allItems().filter(isDone).sort((a, b) => (state.done[b.i].date || "").localeCompare(state.done[a.i].date || ""))[0];
  const pool = [];
  for (const it of allItems()){
    if (!it.x || isDone(it)) continue;
    const pd = plannedDate(it);
    if (pd && pd !== date) continue;                        // déjà prévu un autre jour
    if (!feasibleOn(it, d)) continue;
    const tr = travel(it);
    if (tr.min > dec.dur + (tr.real ? 0 : 10)) continue;
    const mv = myVote(it.i), ov = otherVote(it.i);
    if (mv < 0 && ov < 0) continue;
    if (!dec.jit.has(it.i)) dec.jit.set(it.i, Math.random() * 6);
    pool.push({ it, tr, ev: isEventItem(it) ? eventOn(it, d) : null, mv, ov, pd, wx: null });
  }
  let homeWx = null;
  const rescore = () => { pool.forEach(o => scoreSugg(o, homeWx, lastDone)); pool.sort((a, b) => b.s - a.s); showSugg(pool, gen); };
  const status = t => { const e = $("#decStatus"); if (e && gen === decGen) e.textContent = t; };
  rescore();
  if (!pool.length){ status(""); return; }
  const ahead = dayDiff(new Date(), d), online = navigator.onLine;
  if (online && ahead >= 0 && ahead <= 15){
    status("☁️ Météo en cours…");
    try {
      const top = pool.slice(0, 50);
      const w = await weatherFor([{ lat: H.lat, lng: H.lng }].concat(top.map(o => ({ lat: o.it.x[0], lng: o.it.x[1] }))), date);
      if (gen !== decGen) return;
      homeWx = w[0]; top.forEach((o, i) => { o.wx = w[i + 1]; });
      rescore();
    } catch(e){}
  }
  if (online){
    const cand = pool.slice(0, 6).filter(o => !o.tr.real);
    if (cand.length){
      status("🚆 Horaires CFF en cours…");
      await Promise.all(cand.map(async o => { try { o.tr = { min: await realMin(o.it), real: true }; } catch(e){} }));
      if (gen !== decGen) return;
      for (let i = pool.length - 1; i >= 0; i--) if (pool[i].tr.real && pool[i].tr.min > dec.dur) pool.splice(i, 1);
      rescore();
    }
  }
  status(`${pool.length} idée${pool.length > 1 ? "s" : ""} possible${pool.length > 1 ? "s" : ""} ${relDays(ahead) === "aujourd’hui" ? "aujourd’hui" : "ce jour-là"}`
    + (ahead > 15 ? " · météo disponible 16 jours avant" : "") + (online ? "" : " · hors ligne"));
}
function scoreSugg(o, homeWx, lastDone){
  const it = o.it, w = o.wx, m = dec.moods, why = [];
  let s = 50 + (dec.jit.get(it.i) || 0);
  if (o.pd){ s += 40; why.push({ t: "📅 déjà prévu ce jour-là", k: "a" }); }
  if (o.ev){ s += 55; why.push({ t: o.ev.approx ? "🎉 a lieu à cette période" : "🎉 c’est ce jour-là !", k: "p" }); }
  if (o.mv > 0 && o.ov > 0){ s += 30; why.push({ t: "💞 envie commune", k: "p" }); }
  else if (o.ov > 0){ s += 14; why.push({ t: "❤️ envie de " + nameOf(other()), k: "p" }); }
  else if (o.mv > 0){ s += 10; why.push({ t: hasNames() ? "❤️ envie de " + nameOf(me()) : "❤️ dans vos envies", k: "p" }); }
  if (o.mv === 2) s += 8;
  if (o.ov === 2) s += 8;
  if (o.mv < 0 || o.ov < 0) s -= 35;
  if (w){
    if (wxRain(w)){
      if (isRainOk(it)){ s += 22; why.push({ t: "☔ parfait s’il pleut", k: "g" }); }
      else { s -= 30; why.push({ t: "🌧️ pluie prévue", k: "a" }); }
    } else if (wxSnow(w) && (isActive(it) || it.c === "som" || it.c === "ran")){ s -= 20; why.push({ t: "🌨️ neige prévue", k: "a" }); }
    else if (wxSunny(w) && !isRainOk(it)){
      s += 12;
      if (homeWx && wxGrey(homeWx) && ["som", "ran", "eau"].includes(it.c)){ s += 16; why.unshift({ t: "☀️ soleil là-bas, gris chez vous", k: "g" }); }
      else why.push({ t: "☀️ " + w.tmax + "°", k: "g" });
    }
  }
  if (m.has("calme")){ if (isActive(it)) s -= 18; else s += 6; }
  if (m.has("actif")){ if (isActive(it) || it.c === "som"){ s += 16; why.push({ t: "🥾 de quoi bouger" }); } else s -= 8; }
  if (m.has("gourmand")){ if (isGourmand(it)){ s += 20; why.push({ t: "🍽️ gourmand" }); } else s -= 5; }
  if (m.has("culture")){ if (isCulture(it)){ s += 16; why.push({ t: "🏛️ culture" }); } else s -= 5; }
  if (m.has("romantique") && isRomantic(it)){ s += 20; why.push({ t: "💕 romantique", k: "p" }); }
  if (m.has("gratuit")){ if (it.g === "inc"){ s += 12; why.push({ t: "🎫 inclus dans l’AG", k: "g" }); } else if (it.g === "pay") s -= 20; else if (it.g === "red") s -= 6; }
  s -= o.tr.min / 9;                                        // plus c'est près, mieux c'est
  if (lastDone && lastDone.c === it.c) s -= 5;              // varier les plaisirs
  o.s = s; o.why = why;
}
function showSugg(pool, gen){
  const el = $("#decRes");
  if (!el || gen !== decGen) return;
  if (!pool.length){ el.innerHTML = `<p class="empty">Rien qui colle ce jour-là. Allongez le trajet ou retirez une envie.</p>`; return; }
  const top = pool.slice(0, 3), more = pool.slice(3, 9);
  el.innerHTML = top.map((o, i) => suggCard(o, i)).join("")
    + (more.length ? `<div class="part"><h4>Autres bonnes idées</h4>${more.map(o => miniRow(o.it,
        ttLabel(o.tr) + (o.wx ? "<br>" + wxEmo(o.wx.c) + " " + o.wx.tmax + "°" : ""))).join("")}</div>` : "");
}
function suggCard(o, i){
  const it = o.it, why = o.why.slice(0, 4).map(w => `<span class="${w.k || ""}">${esc(w.t)}</span>`).join("");
  const banner = i === 0 && imgOf(it);
  return `<div class="sugg${i === 0 ? " top" : ""}">${i === 0 ? `<span class="rank">Notre meilleure idée</span>` : ""}
    ${banner ? `<div class="banner">${imgTag(imgOf(it), true)}</div>` : ""}
    <div class="h1">${banner ? `<span class="emo" style="background:${tint(it)}">${CATS[it.c][0]}</span>` : lead(it, 48)}
      <div style="flex:1;min-width:0"><div class="t">${esc(it.t)}</div>
      <div class="p">${esc(it.p || "")}${it.k ? " · " + esc(it.k) : ""} · ${ttLabel(o.tr)}${o.wx ? " · " + wxEmo(o.wx.c) + " " + o.wx.tmax + "°" : ""}</div></div></div>
    ${why ? `<div class="why">${why}</div>` : ""}
    <div class="btnrow"><button class="btn primary sm" data-act="day" data-i="${it.i}" data-date="${dec.date}">🗓️ On y va</button>
      <button class="btn sm" data-act="open" data-i="${it.i}">Voir la fiche</button></div></div>`;
}
/* --- « Un week-end » : escapades de deux jours autour d'une ville-étape --- */
let wkShown = [];
async function runWeekend(){
  const gen = ++decGen, d1s = dec.wk, d1 = parseYmd(d1s), d2 = addDays(d1, 1), d2s = ymd(d2), H = home();
  const status = t => { const e = $("#decStatus"); if (e && gen === decGen) e.textContent = t; };
  const pool = [];
  for (const it of allItems()){
    if (!it.x || isDone(it)) continue;
    const pd = plannedDate(it);
    if (pd && pd !== d1s && pd !== d2s) continue;
    const ok1 = feasibleOn(it, d1), ok2 = feasibleOn(it, d2);
    if (!ok1 && !ok2) continue;
    const mv = myVote(it.i), ov = otherVote(it.i);
    if (mv < 0 && ov < 0) continue;
    const tr = travel(it);
    if (tr.min > dec.wkDur + 40) continue;
    if (!dec.jit.has(it.i)) dec.jit.set(it.i, Math.random() * 6);
    const o = { it, tr, ev: isEventItem(it) ? (eventOn(it, d1) || eventOn(it, d2)) : null, mv, ov, pd, wx: null, ok1, ok2 };
    scoreSugg(o, null, null);
    o.s += tr.min / 9;                                        // en week-end, l'éloignement n'est pas un défaut
    pool.push(o);
  }
  // une escapade = 3 à 4 idées à moins de 28 km les unes des autres, près d'une ville où dormir
  const clusters = [];
  const fromHome = o => hav(H, o.it.x);                      // ce qui se fait en une journée depuis chez vous n'a pas besoin d'une nuit
  const far = pool.filter(o => fromHome(o) >= 45);
  for (const a of far.filter(o => fromHome(o) >= 60).sort((x, y) => y.s - x.s).slice(0, 70)){
    // l'étape la plus proche du lieu phare (plutôt que du centre du groupe : évite de dormir de l'autre côté d'une montagne)
    const base = BASES.map(b => ({ b, km: hav({ lat: a.it.x[0], lng: a.it.x[1] }, [b[1], b[2]]) })).sort((x, y) => x.km - y.km)[0];
    if (!base || base.km > 30) continue;
    const bx = { lat: base.b[1], lng: base.b[2] };
    const group = far.filter(o => hav({ lat: a.it.x[0], lng: a.it.x[1] }, o.it.x) <= 22 && hav(bx, o.it.x) <= 32).sort((x, y) => y.s - x.s);
    if (group.length < 3) continue;
    const day1 = [], day2 = [];
    for (const o of group){
      const c1 = o.ok1 && day1.length < 2, c2 = o.ok2 && day2.length < 2;
      if (c1 && (!c2 || day1.length <= day2.length)) day1.push(o); else if (c2) day2.push(o);
      if (day1.length === 2 && day2.length === 2) break;
    }
    const all = day1.concat(day2);
    if (all.length < 3) continue;
    const cx = [all.reduce((s, o) => s + o.it.x[0], 0) / all.length, all.reduce((s, o) => s + o.it.x[1], 0) / all.length];
    const toBase = estMin(H, { x: [base.b[1], base.b[2]], c: "vil" });
    if (toBase > dec.wkDur + 15 || hav(H, [base.b[1], base.b[2]]) < 55) continue;
    clusters.push({ base: base.b, day1, day2, all, cx, toBase, real: false, w1: null, w2: null,
      score: all.reduce((s, o) => s + o.s, 0) / all.length * 2 + all.length * 6 - toBase / 15 });
  }
  clusters.sort((a, b) => b.score - a.score);
  const picked = [];
  for (const c of clusters){
    if (picked.some(p => p.base[0] === c.base[0] || hav({ lat: p.cx[0], lng: p.cx[1] }, c.cx) < 35)) continue;
    picked.push(c);
    if (picked.length === 6) break;
  }
  showWeekends(picked, gen);
  if (!picked.length){ status(""); return; }
  const ahead = dayDiff(new Date(), d1);
  if (navigator.onLine && ahead >= 0 && ahead <= 14){
    status("☁️ Météo du week-end…");
    try {
      const pts = picked.map(c => ({ lat: c.cx[0], lng: c.cx[1] }));
      const [w1, w2] = await Promise.all([weatherFor(pts, d1s), weatherFor(pts, d2s)]);
      if (gen !== decGen) return;
      picked.forEach((c, i) => {
        c.w1 = w1[i]; c.w2 = w2[i];
        const sunny = [c.w1, c.w2].filter(wxSunny).length, rainy = [c.w1, c.w2].filter(wxRain).length;
        c.score += sunny * 6 - rainy * c.all.filter(o => !isRainOk(o.it)).length * 3;
      });
      picked.sort((a, b) => b.score - a.score);
      showWeekends(picked, gen);
    } catch(e){}
  }
  if (navigator.onLine){
    status("🚆 Horaires CFF…");
    const from = await homeStation().catch(() => null);
    if (from) await Promise.all(picked.slice(0, 3).map(async c => {
      try {
        const to = await stationNear(c.base[1], c.base[2], "b" + c.base[0]);
        const cs = await connections(from, to, d1s, "08:00", 1);
        if (cs[0] && cs[0].min != null){ c.toBase = cs[0].min; c.real = true; c.dep = cs[0]; }
      } catch(e){}
    }));
    if (gen !== decGen) return;
    showWeekends(picked, gen);
  }
  const nDest = new Set(clusters.map(c => c.base[0])).size;
  status(`${nDest} destination${nDest > 1 ? "s" : ""} possible${nDest > 1 ? "s" : ""} · ${wkRange(d1s)}`
    + (ahead > 14 ? " · météo disponible deux semaines avant" : ""));
}
function showWeekends(list, gen){
  const el = $("#decRes");
  if (!el || gen !== decGen) return;
  wkShown = list.slice(0, 3);
  el.innerHTML = wkShown.length ? wkShown.map(wkCard).join("")
    : `<p class="empty">Pas d’escapade qui colle à ces critères. Allongez le trajet ou retirez une envie.</p>`;
  focusable(el);
}
function wkLabel(c){ return "Autour de " + c.base[0]; }
function wkCard(c, i){
  const d1 = parseYmd(dec.wk), d2 = addDays(d1, 1), imgs = c.all.filter(o => imgOf(o.it)).slice(0, 2);
  const nMatch = c.all.filter(o => o.mv > 0 && o.ov > 0).length, ev = c.all.find(o => o.ev);
  const why = [nMatch ? `<span class="p">💞 ${nMatch} envie${nMatch > 1 ? "s" : ""} commune${nMatch > 1 ? "s" : ""}</span>` : "",
    ev ? `<span class="p">🎉 ${esc(ev.it.t)}</span>` : "",
    c.all.some(o => o.mv > 0 || o.ov > 0) && !nMatch ? `<span class="p">❤️ dans vos envies</span>` : "",
    c.all.every(o => o.it.g === "inc") ? `<span class="g">🎫 tout inclus dans l’AG</span>` : ""].join("");
  const row = (d, arr) => arr.length ? `<div class="day"><b>${dayName(d)}</b><span class="its">${arr.map(o => `<button data-act="open" data-i="${o.it.i}">${CATS[o.it.c][0]} ${esc(o.it.t)}</button>`).join("")}</span></div>` : "";
  const wx = (lbl, w) => w ? ` · ${lbl} ${wxEmo(w.c)} ${w.tmax}°` : "";
  return `<div class="wk">
    <div class="wkimgs">${[0, 1].map(k => { const o = imgs[k] || c.all[k] || c.all[0];
      return `<span style="background:${tint(o.it)}">${CATS[o.it.c][0]}${imgs[k] ? imgTag(imgSmall(imgOf(o.it))) : ""}</span>`; }).join("")}</div>
    <div class="wkbody">
      <div class="kicker">${i === 0 ? "🧳 Notre meilleure escapade" : "🧳 Escapade"} · dodo à ${esc(c.base[0])}</div>
      <div class="t">${esc(wkLabel(c))}</div>
      <div class="p">${c.real ? "🚆 " : "🚆 ~"}${fmtMin(c.toBase)} jusqu’à ${esc(c.base[0])}${c.dep ? " (départ " + hm(c.dep.dep) + ")" : ""}${wx("sam.", c.w1)}${wx("dim.", c.w2)}</div>
      <div class="days">${row(d1, c.day1)}${row(d2, c.day2)}</div>
      ${why ? `<div class="why">${why}</div>` : ""}
      <div class="btnrow"><button class="btn primary sm" data-act="wkplan" data-k="${i}">📅 On le prévoit</button>
        <button class="btn sm" data-act="wkshare" data-k="${i}">💬 Envoyer</button>
        <button class="btn sm" data-act="wkics" data-k="${i}" aria-label="Ajouter à l’agenda">📆</button>
        <a class="btn sm" href="https://www.google.com/maps/search/${encodeURIComponent("hôtel " + c.base[0])}" target="_blank" rel="noopener">🛏️ Dormir</a></div>
    </div></div>`;
}
function wkText(c){
  const d1 = parseYmd(dec.wk), d2 = addDays(d1, 1);
  return [`🧳 Week-end Suisse 100 — ${wkRange(dec.wk)}`,
    `📍 ${wkLabel(c)} (🚆 ${c.real ? "" : "~"}${fmtMin(c.toBase)} depuis ${home().name}${c.dep ? ", départ " + hm(c.dep.dep) : ""})`,
    c.day1.length ? `${dayName(d1)} : ${c.day1.map(o => o.it.t).join(", ")}` : "",
    c.day2.length ? `${dayName(d2)} : ${c.day2.map(o => o.it.t).join(", ")}` : "",
    [c.w1 && `${wxEmo(c.w1.c)} sam. ${c.w1.tmax}°`, c.w2 && `${wxEmo(c.w2.c)} dim. ${c.w2.tmax}°`].filter(Boolean).join(" · "),
    `🛏️ Dormir à ${c.base[0]}`, "— Suisse 100"].filter(Boolean).join("\n");
}
function wkPlan(c){
  const d1s = dec.wk, d2s = ymd(addDays(parseYmd(d1s), 1)), wkid = "wk" + Date.now(), label = wkLabel(c);
  for (const o of c.day1) setPlanned(o.it.i, d1s, { wk: label, wkid, time: c.dep ? hm(c.dep.dep) : "08:00" });
  for (const o of c.day2) setPlanned(o.it.i, d2s, { wk: label, wkid });
  refresh();
  toast(`🧳 Week-end prévu : ${label}`, "Envoyer", () => shareText(wkText(c)), 6500);
}
function wkICS(c){
  const s = parseYmd(dec.wk); s.setHours(0, 0, 0, 0);
  saveICS(makeICS({ uid: "s100-wk-" + dec.wk + "-" + norm(c.base[0]).replace(/[^a-z]+/g, ""), title: "🧳 Week-end : " + wkLabel(c), location: c.base[0],
    desc: wkText(c), start: s, end: addDays(s, 2), allDay: true,
    alarms: [{ before: 2 * 1440 + 300, text: "Pensez à réserver où dormir à " + c.base[0] }, { before: 240, text: "Demain : week-end " + wkLabel(c).toLowerCase() }] }),
    "suisse100-weekend-" + dec.wk + ".ics", "📆 Week-end dans l’agenda (ouvrez le fichier) — rappels le mercredi et la veille");
}
async function shareText(text){
  try { if (navigator.share){ await navigator.share({ text }); return; } }
  catch(e){ if (e && e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(text); toast("📋 Copié — collez-le dans votre messagerie"); }
  catch(e){ prompt("Copiez le texte :", text); }
}

$("#v-home").addEventListener("click", e => {
  const w = e.target.closest("[data-when]"), du = e.target.closest("[data-dur]"), mo = e.target.closest("[data-mood]");
  const md = e.target.closest("[data-mode]"), wk = e.target.closest("[data-wk]"), wd = e.target.closest("[data-wkdur]");
  if (md){ if (dec.mode !== md.dataset.mode){ dec.mode = md.dataset.mode; state.dec.mode = dec.mode; save();
    $("#decide").outerHTML = deciderHTML(); runDecider(); } return; }
  if (wk){ dec.wk = wk.dataset.wk; $$("#decWk .chip").forEach(c => c.classList.toggle("on", c === wk)); runDecider(); return; }
  if (wd){ dec.wkDur = +wd.dataset.wkdur; state.dec.wkDur = dec.wkDur; save(); $$("#decWkDur .chip").forEach(c => c.classList.toggle("on", c === wd)); runDecider(); return; }
  if (w){ dec.date = w.dataset.when; $("#decWhen").innerHTML = dateChips(dec.date, "data-when", "decDate"); runDecider(); }
  else if (du){ dec.dur = +du.dataset.dur; state.dec.dur = dec.dur; save(); $$("#decDur .chip").forEach(c => c.classList.toggle("on", c === du)); runDecider(); }
  else if (mo){ const k = mo.dataset.mood; dec.moods.has(k) ? dec.moods.delete(k) : dec.moods.add(k); state.dec.moods = [...dec.moods]; save(); mo.classList.toggle("on"); runDecider(); }
});
$("#v-home").addEventListener("change", e => {
  if (e.target.id === "decDate" && e.target.value){ dec.date = e.target.value < todayYmd() ? todayYmd() : e.target.value; $("#decWhen").innerHTML = dateChips(dec.date, "data-when", "decDate"); runDecider(); }
});

/* ================= explorer ================= */
const filt = { s: "all", c: null, r: null, q: "", season: false, rain: false, love: false, dur: null };
let sortMode = "cat", randOrder = null;
function matches(it){
  if (filt.c && it.c !== filt.c) return false;
  if (filt.r && it.r !== filt.r) return false;
  if (filt.season && !inSeason(it)) return false;
  if (filt.rain && !isRainOk(it)) return false;
  if (filt.love && !(myVote(it.i) > 0 || otherVote(it.i) > 0)) return false;
  if (filt.dur){ const tr = travel(it); if (!tr || tr.min > filt.dur) return false; }
  const done = isDone(it);
  if (filt.s === "todo" && done) return false;
  if (filt.s === "done" && !done) return false;
  if (filt.s === "plan" && (done || !plannedDate(it) || isSurpriseForMe(it))) return false;
  if (filt.q){
    const hay = norm([it.t, it.p, it.k, it.d, REGS[it.r], CATS[it.c][1], it.kw].join(" "));
    if (!norm(filt.q).split(/\s+/).filter(Boolean).every(t => hay.includes(t))) return false;
  }
  return true;
}
function cardHTML(it){
  const done = state.done[it.i], pd = !done && plannedDate(it) && !isSurpriseForMe(it) ? plannedDate(it) : null;
  const tr = travel(it), nPh = nPhotos(it);
  const ev = isEventItem(it) && !done ? nextEvent(it) : null, evSoon = ev && dayDiff(new Date(), ev.s) <= 120;
  const mv = myVote(it.i), ov = otherVote(it.i), hearts = mv > 0 && ov > 0 ? "💞" : (mv > 0 || ov > 0) ? "❤️" : "";
  return `<article class="card${done ? " done" : ""}" data-act="open" data-i="${it.i}">
    <div class="top">
      ${lead(it)}
      <div class="mid">
        <div class="t">${esc(it.t)}</div>
        <div class="meta">
          ${it.p ? `<span class="badge">${esc(it.p)}</span>` : ""}${it.k ? `<span class="badge k">${esc(it.k)}</span>` : ""}
          ${it.g ? `<span class="badge ${GA[it.g][1]}">${GA[it.g][0]}</span>` : ""}
          ${tr ? `<span class="badge tt${tr.real ? " real" : ""}">${ttLabel(tr)}</span>` : ""}
          ${evSoon ? `<span class="badge ev">🎉 ${fmtDayShort(ev.s)}</span>` : it.m ? `<span class="badge${inSeason(it) ? "" : " off"}">🗓️ ${seasonLabel(it.m)}</span>` : ""}
          ${hearts ? `<span class="badge v">${hearts}</span>` : ""}${nPh ? `<span class="badge">📷 ${nPh}</span>` : ""}
        </div>
        <div class="d">${esc(it.d || "")}</div>
        ${done && done.date ? `<div class="when">✓ Fait le ${fmtDate(done.date)}</div>` : ""}
        ${pd ? `<div class="when plan">📅 Prévu ${fmtDay(pd)}</div>` : ""}
      </div>
      <button class="check" data-act="check" data-i="${it.i}" aria-label="${done ? "Décocher" : "Marquer comme fait"}" title="${done ? "Décocher" : "Marquer comme fait"}">✓</button>
    </div></article>`;
}
function renderExplore(){
  const items = allItems();
  $("#catChips").innerHTML = Object.keys(CATS).map(c => {
    const sub = items.filter(it => it.c === c);
    return `<button class="chip${filt.c === c ? " on" : ""}" data-c="${c}">${CATS[c][0]} ${CATS[c][1]}<small>${sub.filter(isDone).length}/${sub.length}</small></button>`;
  }).join("");
  $("#moreChips").innerHTML = [[60, "⏱ ≤ 1 h"], [120, "⏱ ≤ 2 h"], [180, "⏱ ≤ 3 h"]].map(([v, l]) => `<button class="chip${filt.dur === v ? " on" : ""}" data-fdur="${v}">${l}</button>`).join("")
    + `<button class="chip${filt.season ? " on" : ""}" data-f="season">🗓️ De saison</button>`
    + `<button class="chip${filt.rain ? " on" : ""}" data-f="rain">☔ Même s’il pleut</button>`
    + `<button class="chip${filt.love ? " on" : ""}" data-f="love">❤️ Nos envies</button>`
    + Object.keys(REGS).map(r => `<button class="chip${filt.r === r ? " on" : ""}" data-r="${r}">${REGS[r]}</button>`).join("");
  const shown = items.filter(matches);
  $("#expCount").textContent = shown.length + " idée" + (shown.length > 1 ? "s" : "") + (shown.length !== items.length ? " sur " + items.length : "") + " · départ " + home().name;
  const list = $("#list");
  if (!shown.length){ list.innerHTML = `<p class="empty">Rien ne correspond — essayez d’élargir les filtres.</p>`; return; }
  let h = "";
  if (sortMode === "cat"){
    for (const c of Object.keys(CATS)){
      const sub = shown.filter(it => it.c === c);
      if (!sub.length) continue;
      const all = items.filter(it => it.c === c);
      h += `<div class="sec"><span class="dot" style="background:var(--tint-${c})"></span><h3>${CATS[c][1]}</h3><span>${all.filter(isDone).length}/${all.length}</span></div>` + sub.map(cardHTML).join("");
    }
  } else if (sortMode === "dist"){
    const bands = [[60, "Moins d’une heure"], [120, "1 à 2 heures"], [180, "2 à 3 heures"], [1e6, "Plus de 3 heures"], [Infinity, "Sans localisation"]];
    let cur = -1;
    for (const it of shown.slice().sort((a, b) => (travel(a) ? travel(a).min : Infinity) - (travel(b) ? travel(b).min : Infinity))){
      const tr = travel(it), b = bands.findIndex(x => (tr ? tr.min : Infinity) <= x[0]);
      if (b !== cur){ cur = b; h += `<div class="sec"><span class="dot" style="background:var(--red)"></span><h3>${bands[b][1]}</h3></div>`; }
      h += cardHTML(it);
    }
  } else {
    if (!randOrder) randOrder = new Map(ITEMS.concat(state.custom).map(it => [String(it.i), Math.random()]));
    h = shown.slice().sort((a, b) => (randOrder.get(String(a.i)) || 0) - (randOrder.get(String(b.i)) || 0)).map(cardHTML).join("");
  }
  list.innerHTML = h;
}
$("#q").addEventListener("input", debounce(e => { filt.q = e.target.value; renderExplore(); }, 140));
$("#segStatus").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  filt.s = b.dataset.s; $$("#segStatus button").forEach(x => x.classList.toggle("on", x === b)); renderExplore();
});
$("#catChips").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (!b) return; filt.c = filt.c === b.dataset.c ? null : b.dataset.c; renderExplore(); });
$("#moreChips").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  if (b.dataset.fdur) filt.dur = filt.dur === +b.dataset.fdur ? null : +b.dataset.fdur;
  else if (b.dataset.f) filt[b.dataset.f] = !filt[b.dataset.f];
  else if (b.dataset.r) filt.r = filt.r === b.dataset.r ? null : b.dataset.r;
  renderExplore();
});
$("#sortSel").addEventListener("change", e => { sortMode = e.target.value; if (sortMode === "rand") randOrder = null; renderExplore(); });

/* ================= carte ================= */
let map = null, markers = null, homeMarker = null;
const markersById = new Map();
function renderMap(){
  const el = $("#map");
  if (typeof L === "undefined"){
    el.innerHTML = `<p class="empty" style="padding-top:22vh">La carte a besoin d’une connexion (première visite).</p>`;
    window.addEventListener("load", () => { if (view === "map" && typeof L !== "undefined"){ el.innerHTML = ""; renderMap(); } }, { once: true });
    return;
  }
  if (!map){
    map = L.map(el);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
    markers = L.layerGroup().addTo(map);
    map.fitBounds([[45.75, 5.9], [47.85, 10.55]]);
  }
  markers.clearLayers(); markersById.clear();
  for (const it of allItems()){
    if (!it.x || !matches(it)) continue;
    const done = isDone(it), pd = !done && plannedDate(it) && !isSurpriseForMe(it), match = !done && isMatch(it), tr = travel(it);
    const col = done ? "#2f7d38" : pd ? "#d99a26" : match ? "#c2457c" : "#d52b1e";
    const m = L.circleMarker(it.x, { radius: pd || match ? 8.5 : 7, weight: 1.5, color: "#ffffff", fillColor: col, fillOpacity: .95 })
      .bindPopup((imgOf(it) ? `<img class="popimg" src="${esc(imgSmall(imgOf(it)))}" alt="" onerror="this.remove()">` : "") + `<b>${CATS[it.c][0]} ${esc(it.t)}</b><br>${esc(it.p || "")}${it.k ? " · " + esc(it.k) : ""}${tr ? "<br>" + ttLabel(tr) : ""}<br>`
        + (done ? `<span style="color:#2f7d38;font-weight:600">✓ fait le ${fmtDate(state.done[it.i].date)}</span><br>` : "")
        + `<button class="pop-open" onclick="S100.open('${String(it.i).replace(/[^\w-]/g, "")}')">Voir la fiche</button>`);
    markers.addLayer(m); markersById.set(String(it.i), m);
  }
  const H = home();
  if (homeMarker) homeMarker.remove();
  homeMarker = L.marker([H.lat, H.lng], { icon: L.divIcon({ className: "homepin", html: "🏠", iconSize: [24, 24], iconAnchor: [12, 12] }), zIndexOffset: 1000 })
    .bindPopup(`<b>🏠 Point de départ</b><br>${esc(H.name)}`).addTo(map);
  setTimeout(() => map.invalidateSize(), 80);
}
function showOnMap(id){
  closeDialogs(); go("map");
  setTimeout(() => {
    const it = byId(id); if (!map || !it || !it.x) return;
    map.setView(it.x, 12, { animate: false });
    const m = markersById.get(String(id)); if (m) m.openPopup();
  }, 160);
}
window.S100 = { open: id => openItem(asId(id)) };

/* ================= fiche d'un lieu (panneau) ================= */
let sheetId = null;
function openItem(id){
  const it = byId(id); if (!it) return;
  const changed = String(sheetId) !== String(it.i);
  sheetId = it.i;
  renderSheet();
  const dlg = $("#dlgItem");
  if (!dlg.open) dlg.showModal();
  if (changed){ const b = $(".shbody", dlg); if (b) b.scrollTop = 0; }
}
function renderSheet(){
  const dlg = $("#dlgItem"), it = byId(sheetId);
  if (!it){ if (dlg.open) dlg.close(); return; }
  const scroll = $(".shbody", dlg) ? $(".shbody", dlg).scrollTop : 0;
  const done = state.done[it.i], pd = plannedDate(it), surprise = isSurpriseForMe(it);
  const tr = travel(it), mv = myVote(it.i), ov = otherVote(it.i);
  const ev = isEventItem(it) && !done ? nextEvent(it) : null, near = it.x ? nearby(it) : [];
  const im = imgOf(it), src = imgSource(it), sub = `${esc(it.p || "")}${it.k ? " · " + esc(it.k) : ""} · ${REGS[it.r] || ""}`;
  dlg.innerHTML = (im
    ? `<div class="hero-img">${imgTag(im, true)}<button class="x" data-close aria-label="Fermer">✕</button>
        <div class="ov"><h3>${esc(it.t)}</h3><p>${CATS[it.c][0]} ${sub}</p></div></div>`
    : `<div class="shhead"><span class="emo" style="background:${tint(it)}">${CATS[it.c][0]}</span>
        <div class="tt"><h3>${esc(it.t)}</h3><p>${sub}</p></div><button class="x" data-close aria-label="Fermer">✕</button></div>`) + `
    <div class="shbody">
      <div class="meta" style="margin-top:12px">
        ${it.g ? `<span class="badge ${GA[it.g][1]}">${GA[it.g][0]}</span>` : ""}
        ${tr ? `<span class="badge tt${tr.real ? " real" : ""}">${ttLabel(tr)} depuis ${esc(home().name)}</span>` : ""}
        ${it.m ? `<span class="badge${inSeason(it) ? "" : " off"}">🗓️ ${seasonLabel(it.m)}</span>` : ""}
        ${isRainOk(it) ? `<span class="badge">☔ ok s’il pleut</span>` : ""}${isRomantic(it) ? `<span class="badge v">💕 romantique</span>` : ""}
      </div>
      <p class="d">${esc(it.d || "")}</p>
      ${src ? `<p class="credit">📷 Photo : <a href="${esc(src.href)}" target="_blank" rel="noopener">${esc(src.label)}</a></p>` : ""}
      ${ev ? `<div class="evnote">🎉 Prochaine édition : ${fmtWin(ev)}${ev.approx ? " (date habituelle, à vérifier)" : ""}${ev.note ? " — " + esc(ev.note) : ""}
        <div class="btnrow" style="margin-top:8px"><button class="btn sm" data-act="remind" data-i="${it.i}">🔔 Me rappeler</button></div></div>` : ""}
      ${IMAGES[it.i] && IMAGES[it.i][2] !== "commons" ? `<div class="part" id="wiki-${it.i}"></div>` : ""}
      ${it.x ? `<div class="minimap" id="miniSlot" title="Voir sur la grande carte"></div>` : ""}
      <div class="btnrow">
        <button class="btn primary sm" data-act="day" data-i="${it.i}">🗓️ Préparer une sortie</button>
        <a class="btn sm" href="${gmapsTransit(it)}" target="_blank" rel="noopener">🧭 Itinéraire</a>
        ${it.x ? `<button class="btn sm" data-act="onmap" data-i="${it.i}">🗺️ Carte</button>` : ""}
      </div>
      <div class="part"><h4>💞 Envie ?${hasNames() ? ` <small>${esc(nameOf(me()))}</small>` : ""}</h4>
        <div class="votes">
          <button data-act="vote" data-v="-1" data-i="${it.i}" class="${mv === -1 ? "on no" : ""}">✕ Bof</button>
          <button data-act="vote" data-v="1" data-i="${it.i}" class="${mv === 1 ? "on" : ""}">❤️ Envie</button>
          <button data-act="vote" data-v="2" data-i="${it.i}" class="${mv === 2 ? "on" : ""}">⭐ Absolument</button>
          ${hasNames() ? `<span class="other">${esc(nameOf(other()))} : ${ov ? VOTE_LBL[ov] : "pas encore noté"}${mv > 0 && ov > 0 ? " — 💞 envie commune !" : ""}</span>` : ""}
        </div></div>
      <div class="part"><h4>${done ? "✓ C’est fait" : "Et vous ?"}</h4>
        ${done ? `<label class="lb" for="pDone">Fait le</label><input type="date" class="field" id="pDone" value="${esc(done.date || "")}" max="${todayYmd()}">`
          : pd && !surprise ? `<p class="sub">📅 Prévu ${fmtDay(pd)} · <button class="link" data-act="day" data-i="${it.i}" data-date="${pd}">préparer</button> · <button class="link" data-act="unplan" data-i="${it.i}">annuler</button></p>` : ""}
        <div class="btnrow">${done ? `<button class="btn primary sm" data-act="card" data-i="${it.i}">📸 Carte souvenir à partager</button>` : ""}
          <button class="btn ${done ? "" : "ok"} sm" data-act="check" data-i="${it.i}">${done ? "↩︎ Décocher" : "✓ C’est fait !"}</button></div></div>
      <div class="part"><h4>📝 Notes</h4><textarea class="field" id="pNote" placeholder="Idées, resto, souvenirs…">${esc(state.notes[it.i] || "")}</textarea></div>
      <div class="part"><h4>📷 Photos <small><button class="link" data-act="addph" data-i="${it.i}">＋ Ajouter</button></small></h4><div class="photos" data-ph="${it.i}"></div></div>
      ${near.length ? `<div class="part"><h4>💡 À combiner dans la journée</h4><div class="nearrow">${near.map(e => `<button class="near" data-act="open" data-i="${e.o.i}">${CATS[e.o.c][0]} ${esc(e.o.t)} · ${e.km} km</button>`).join("")}</div></div>` : ""}
      ${it.x ? `<div class="part"><h4>🧭 Sur place <small>© OpenStreetMap</small></h4><div id="sp-${it.i}"></div></div>` : ""}
      <div class="part"><button class="btn ghost sm" data-act="del" data-i="${it.i}">🗑 Retirer de la liste</button></div>
    </div>`;
  const body = $(".shbody", dlg); if (body) body.scrollTop = scroll;
  if (it.x){ mountMini(it); loadSurPlace(it, "#sp-" + it.i); }
  fillStrip($(".photos", dlg));
  loadWikiInto(it);
  focusable(dlg);
}

/* --- « En savoir plus » : résumé Wikipédia (en français si possible) + site officiel via Wikidata --- */
const wikiCache = loadJSON("suisse100_wiki");
async function wikiFor(it){
  const m = IMAGES[it.i];
  if (!m || m[2] === "commons") return null;
  if (wikiCache[it.i]) return wikiCache[it.i];
  let lang = m[2];
  const summary = (l, t) => fetchJSON(`https://${l}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t.replace(/ /g, "_"))}`, {}, 10000);
  let s = await summary(lang, m[1]);
  const q = s.wikibase_item;
  if (lang !== "fr" && q){                                  // l'article existe-t-il en français ?
    try {
      const j = await fetchJSON(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&origin=*&ids=${q}&props=sitelinks&sitefilter=frwiki`, {}, 8000);
      const fr = j.entities && j.entities[q] && j.entities[q].sitelinks && j.entities[q].sitelinks.frwiki;
      if (fr){ s = await summary("fr", fr.title); lang = "fr"; }
    } catch(e){}
  }
  const title = s.title || m[1];
  const out = { x: (s.extract || "").trim(), t: title, l: lang, w: null,
    u: (s.content_urls && s.content_urls.mobile && s.content_urls.mobile.page) || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}` };
  if (q){
    try {
      const claim = async p => { const j = await fetchJSON(`https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&entity=${q}&property=${p}`, {}, 8000);
        return ((j.claims || {})[p] || []).map(c => c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value).filter(Boolean); };
      const [web, kinds] = await Promise.all([claim("P856"), claim("P31")]);
      const commune = kinds.some(k => k && k.id === "Q70208");            // site d'une commune : utile seulement pour un village
      if (web[0] && /^https?:\/\//i.test(String(web[0])) && (it.c === "vil" || !commune)) out.w = String(web[0]);
    } catch(e){}
  }
  wikiCache[it.i] = out; saveJSON("suisse100_wiki", wikiCache);
  return out;
}
function loadWikiInto(it){
  const sel = "#wiki-" + it.i, el = () => document.querySelector(sel);
  if (!el()) return;
  const show = w => {
    const e = el(); if (!e) return;
    if (!w || !w.x){ e.remove(); return; }
    let host = ""; try { host = w.w ? new URL(w.w).hostname.replace(/^www\./, "") : ""; } catch(err){}
    const LANGS = { de: "en allemand", it: "en italien", en: "en anglais" }, fr = w.l === "fr";
    e.innerHTML = `<h4>📖 En savoir plus <small>${esc(w.t)}</small></h4>${fr ? `<p class="wikix">${esc(w.x)}</p>` : ""}
      <div class="btnrow"><a class="btn sm" href="${esc(w.u)}" target="_blank" rel="noopener">${fr ? "Lire la suite sur Wikipédia" : "Article Wikipédia " + (LANGS[w.l] || "")}</a>
      ${w.w ? `<a class="btn sm" href="${esc(w.w)}" target="_blank" rel="noopener">🌐 Site officiel${host ? " · " + esc(host) : ""}</a>` : ""}</div>`;
  };
  if (wikiCache[it.i]) return show(wikiCache[it.i]);
  if (!navigator.onLine){ el().remove(); return; }
  el().innerHTML = `<h4>📖 En savoir plus</h4><p class="spmsg">Chargement…</p>`;
  wikiFor(it).then(show).catch(() => { const e = el(); if (e) e.remove(); });
}

/* ================= carte souvenir à partager ================= */
const loadImg = src => new Promise((res, rej) => { const im = new Image(); if (/^https?:/.test(src)) im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = rej; im.src = src; });
function wrapLines(g, text, maxW, maxLines){
  const words = text.split(/\s+/), lines = [];
  let cur = "";
  for (const w of words){ const t = cur ? cur + " " + w : w; if (!cur || g.measureText(t).width <= maxW) cur = t; else { lines.push(cur); cur = w; } }
  if (cur) lines.push(cur);
  if (lines.length > maxLines){ lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…"; }
  return lines;
}
async function makeCard(it){
  const W = 1080, H = 1350, cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d");
  try { await Promise.all(['900 96px "Fraunces"', 'italic 800 52px "Fraunces"', '600 36px "Outfit"', '700 36px "Outfit"'].map(f => document.fonts.load(f))); } catch(e){}
  let img = null, credit = "";                              // votre photo d'abord, sinon celle du lieu
  const pids = photoIdx.get(String(it.i)) || [];
  try {
    if (pids.length) img = await loadImg(await photoURL(pids[0]));
    else if (imgOf(it)){ img = await loadImg(imgOf(it).replace(/\/\d+px-([^/]+)$/, "/1280px-$1")); credit = "Photo : Wikimedia Commons"; }
  } catch(e){ img = null; credit = ""; }
  if (img){ const r = Math.max(W / img.width, H / img.height), w = img.width * r, h = img.height * r; g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h); }
  else {
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#d5301f"); bg.addColorStop(1, "#6e160a");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.font = "280px serif"; g.textAlign = "center"; g.fillText(CATS[it.c][0], W / 2, H * .44); g.textAlign = "left";
  }
  const shade = g.createLinearGradient(0, H * .3, 0, H);
  shade.addColorStop(0, "rgba(0,0,0,0)"); shade.addColorStop(.5, "rgba(0,0,0,.55)"); shade.addColorStop(1, "rgba(0,0,0,.88)");
  g.fillStyle = shade; g.fillRect(0, 0, W, H);
  const topShade = g.createLinearGradient(0, 0, 0, 260); topShade.addColorStop(0, "rgba(0,0,0,.5)"); topShade.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = topShade; g.fillRect(0, 0, W, 260);
  const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  // logo « Suisse 100 »
  g.fillStyle = "#d5301f"; rr(64, 64, 84, 84, 22); g.fill();
  g.fillStyle = "#fff"; g.fillRect(99, 82, 14, 48); g.fillRect(82, 99, 48, 14);
  g.font = '900 54px "Fraunces"'; g.fillText("Suisse", 172, 126);
  const sw = g.measureText("Suisse ").width;
  g.font = 'italic 800 54px "Fraunces"'; g.fillStyle = "#ff8f80"; g.fillText("100", 172 + sw, 126);
  // compteur
  const n = allItems().filter(isDone).length, cnt = `${n} / ${GOAL}`;
  g.font = '700 38px "Outfit"';
  const cw = g.measureText(cnt).width + 56;
  g.fillStyle = "rgba(255,253,248,.94)"; rr(W - 64 - cw, 72, cw, 70, 35); g.fill();
  g.fillStyle = "#221d15"; g.fillText(cnt, W - 64 - cw + 28, 120);
  // textes du bas
  const X = 72, MW = W - 144;
  g.fillStyle = "rgba(255,255,255,.28)"; rr(X, H - 84, MW, 12, 6); g.fill();
  g.fillStyle = "#e8402e"; rr(X, H - 84, Math.max(12, MW * Math.min(1, n / GOAL)), 12, 6); g.fill();
  const doneDate = state.done[it.i] && state.done[it.i].date ? fmtDate(state.done[it.i].date) : fmtDate(todayYmd());
  let y = H - 122;
  g.font = '600 34px "Outfit"'; g.fillStyle = "rgba(255,255,255,.86)";
  g.fillText([doneDate, hasNames() ? state.people.a + " & " + state.people.b + " ❤️" : ""].filter(Boolean).join("   ·   "), X, y);
  y -= 64;
  g.font = '600 38px "Outfit"'; g.fillStyle = "rgba(255,255,255,.95)";
  g.fillText(CATS[it.c][0] + "  " + [it.p, it.k].filter(Boolean).join(" · "), X, y);
  let size = 70, lines = null;
  for (const s of [104, 92, 80, 70]){ g.font = `900 ${s}px "Fraunces"`; const l = wrapLines(g, it.t, MW, 3); if (l.length <= 2){ size = s; lines = l; break; } }
  if (!lines){ g.font = '900 70px "Fraunces"'; lines = wrapLines(g, it.t, MW, 3); }
  g.font = `900 ${size}px "Fraunces"`; g.fillStyle = "#ffffff";
  y -= 34;
  for (let i = lines.length - 1; i >= 0; i--){ g.fillText(lines[i], X, y); y -= Math.round(size * 1.06); }
  g.font = '700 36px "Outfit"'; g.fillStyle = "#ffd36e";
  g.fillText("✓  ON L’A FAIT !", X, y - 4);
  if (credit){ g.font = '500 22px "Outfit"'; g.fillStyle = "rgba(255,255,255,.55)"; g.textAlign = "right"; g.fillText(credit, W - 64, H - 34); g.textAlign = "left"; }
  return await new Promise((res, rej) => cv.toBlob(b => b ? res(b) : rej(new Error("image")), "image/jpeg", 0.9));
}
let cardBlob = null, cardUrl = null, cardName = "";
async function openCard(id){
  const it = byId(id); if (!it) return;
  const d = $("#dlgCard");
  d.innerHTML = `<div class="shhead"><div class="tt"><h3>📸 Carte souvenir</h3><p>${esc(it.t)}</p></div><button class="x" data-close aria-label="Fermer">✕</button></div>
    <div class="shbody"><p class="spmsg">Création de la carte…</p></div>`;
  if (!d.open) d.showModal();
  try {
    cardBlob = await makeCard(it);
    if (cardUrl) URL.revokeObjectURL(cardUrl);
    cardUrl = URL.createObjectURL(cardBlob);
    cardName = "suisse100-" + norm(it.t).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".jpg";
    $(".shbody", d).innerHTML = `<img src="${cardUrl}" alt="Carte souvenir : ${esc(it.t)}"><p class="sub" style="margin-top:10px">${nPhotos(it) ? "Avec votre première photo du lieu." : "Ajoutez vos photos dans la fiche : la carte utilisera la vôtre."}</p>`;
    d.insertAdjacentHTML("beforeend", `<div class="shfoot"><button class="btn primary" data-act="cardShare">📤 Partager</button><button class="btn" data-act="cardSave">⬇ Enregistrer</button></div>`);
  } catch(e){ $(".shbody", d).innerHTML = `<p class="spmsg">Impossible de créer la carte pour l’instant.</p>`; }
}
async function shareCard(){
  if (!cardBlob) return;
  const file = new File([cardBlob], cardName, { type: "image/jpeg" });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })){ await navigator.share({ files: [file], title: "Suisse 100" }); return; } }
  catch(e){ if (e && e.name === "AbortError") return; }
  saveFile(cardBlob, cardName); toast("⬇ Image enregistrée");
}
$("#dlgItem").addEventListener("input", e => {
  if (e.target.id !== "pNote" || sheetId == null) return;
  const v = e.target.value.trim();
  if (v) state.notes[sheetId] = v; else delete state.notes[sheetId];
  save();
});
$("#dlgItem").addEventListener("change", e => {
  if (e.target.id === "pDone" && state.done[sheetId] && e.target.value){ state.done[sheetId].date = e.target.value; save(); renderView(); }
});
$("#dlgItem").addEventListener("close", () => { sheetId = null; });

/* mini-carte de la fiche : un seul conteneur Leaflet, déplacé d'une fiche à l'autre */
let miniMap = null, miniMarker = null;
const miniDiv = document.createElement("div");
function mountMini(it){
  const slot = $("#miniSlot");
  if (!slot) return;
  if (typeof L === "undefined"){ slot.remove(); return; }
  miniDiv.id = "miniSlot"; miniDiv.className = "minimap"; miniDiv.title = "Voir sur la grande carte";
  slot.replaceWith(miniDiv);
  if (!miniMap){
    miniMap = L.map(miniDiv, { zoomControl: false, dragging: false, scrollWheelZoom: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(miniMap);
    miniMarker = L.circleMarker([46.8, 8.2], { radius: 8, weight: 2, color: "#ffffff", fillColor: "#d5301f", fillOpacity: .95 }).addTo(miniMap);
    miniDiv.addEventListener("click", () => { if (sheetId != null) showOnMap(sheetId); });
  }
  miniMarker.setLatLng(it.x);
  miniMarker.setStyle({ fillColor: isDone(it) ? "#2f7d38" : "#d5301f" });
  miniMap.setView(it.x, 11, { animate: false });
  setTimeout(() => miniMap.invalidateSize(), 120);
}

/* ================= actions sur un lieu ================= */
const MILESTONES = { 10: "🎉 10 aventures !", 25: "🎉 25 — un quart du chemin !", 50: "🏔️ 50 — la moitié !", 75: "🎉 75 — le sprint final !", 100: "🏆 100 ! Objectif atteint !" };
const KANTONS = ["AG","AI","AR","BE","BL","BS","FR","GE","GL","GR","JU","LU","NE","NW","OW","SG","SH","SO","SZ","TG","TI","UR","VD","VS","ZG","ZH"];

/* --- badges : [clé, emoji, nom, objectif lisible, valeur(stats), seuil] --- */
const BADGES = [
  ["first", "🎒", "Premier pas", "1 aventure", s => s.n, 1],
  ["ten", "🔟", "Dix !", "10 aventures", s => s.n, 10],
  ["quarter", "🥉", "Un quart", "25 aventures", s => s.n, 25],
  ["half", "🥈", "À mi-chemin", "50 aventures", s => s.n, 50],
  ["hundred", "🏆", "Suisse 100", "100 aventures", s => s.n, 100],
  ["vil", "🏘️", "Flâneurs", "5 villages", s => s.cat.vil, 5],
  ["tra", "🚂", "Ferrovipathes", "5 trains", s => s.cat.tra, 5],
  ["som", "⛰️", "Tête en l’air", "5 sommets", s => s.cat.som, 5],
  ["eau", "💧", "Poissons d’eau douce", "5 lacs ou bains", s => s.cat.eau, 5],
  ["ran", "🥾", "Marcheurs", "5 randonnées", s => s.cat.ran, 5],
  ["fet", "🎭", "Folklore", "3 fêtes", s => s.cat.fet, 3],
  ["gas", "🧀", "Gourmets", "5 gourmandises", s => s.cat.gas, 5],
  ["cul", "🏛️", "Rats de musée", "5 visites", s => s.cat.cul, 5],
  ["ins", "🎢", "Insolites", "5 trucs fous", s => s.cat.ins, 5],
  ["k10", "🗺️", "Globe-trotters", "10 cantons", s => s.cantons, 10],
  ["k26", "🇨🇭", "Confédérés", "les 26 cantons", s => s.cantons, 26],
  ["regions", "🌐", "Röstigraben", "4 régions", s => ["al", "ro", "ti", "gr"].filter(r => s.reg[r]).length, 4],
  ["seasons", "🍂", "Quatre saisons", "une sortie par saison", s => s.seasons, 4],
  ["winter", "❄️", "Givrés", "2 sorties en hiver", s => s.winter, 2],
  ["rain", "☔", "Même pas peur", "3 idées « pluie »", s => s.rain, 3],
  ["romance", "💕", "Romantiques", "5 moments à deux", s => s.romantic, 5],
  ["match", "💞", "Même longueur d’onde", "3 envies communes vécues", s => s.match, 3],
  ["photos", "📷", "Paparazzis", "30 photos", s => s.photos, 30],
  ["streak", "🔥", "En série", "3 mois d’affilée", s => s.streak, 3]
];
function badgeStats(){
  const done = allItems().filter(isDone), cat = {}, reg = {}, months = new Set(), seasons = new Set(), K = new Set();
  for (const c of Object.keys(CATS)) cat[c] = 0;
  let winter = 0;
  for (const it of done){
    cat[it.c]++; reg[it.r] = (reg[it.r] || 0) + 1;
    if (KANTONS.includes(it.k)) K.add(it.k);
    const d = state.done[it.i].date;
    if (d){ const m = +d.slice(5, 7); months.add(d.slice(0, 7)); seasons.add(m === 12 || m <= 2 ? "h" : m <= 5 ? "p" : m <= 8 ? "e" : "a"); if (m === 12 || m <= 2) winter++; }
  }
  let streak = 0, cur = 0, prev = null;                       // plus longue série de mois consécutifs
  for (const m of [...months].sort()){ const [y, mo] = m.split("-").map(Number), k = y * 12 + mo; cur = prev != null && k === prev + 1 ? cur + 1 : 1; prev = k; streak = Math.max(streak, cur); }
  return { n: done.length, cat, reg, cantons: K.size, seasons: seasons.size, winter, streak,
    rain: done.filter(isRainOk).length, romantic: done.filter(isRomantic).length, match: done.filter(isMatch).length,
    photos: [...photoIdx.values()].reduce((s, a) => s + a.length, 0) };
}
function newBadges(){                                         // badges gagnés depuis la dernière fois
  const s = badgeStats(), now = BADGES.filter(b => b[4](s) >= b[5]).map(b => b[0]);
  if (!Array.isArray(state.badges)){ state.badges = now; save(); return []; }   // première fois : on ne fête pas l'existant
  const fresh = now.filter(k => !state.badges.includes(k));
  if (fresh.length){ state.badges = state.badges.concat(fresh); save(); }
  return fresh.map(k => BADGES.find(b => b[0] === k));
}
function confetti(){
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const E = ["🎉", "✨", "🇨🇭", "⛰️", "💛", "🎊"], W = innerWidth, H = innerHeight;
  for (let i = 0; i < 22; i++){
    const s = document.createElement("span");
    s.className = "confetti"; s.textContent = E[i % E.length];
    document.body.appendChild(s);
    const x0 = W / 2 + (Math.random() - .5) * 60, y0 = H - 120, x1 = x0 + (Math.random() - .5) * W * .9, y1 = y0 - 220 - Math.random() * H * .45;
    const r = (Math.random() - .5) * 720;
    s.animate([
      { transform: `translate(${x0}px,${y0}px) scale(.5) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${x1}px,${y1}px) scale(1.1) rotate(${r / 2}deg)`, opacity: 1, offset: .62 },
      { transform: `translate(${x1 + (Math.random() - .5) * 70}px,${y1 + 170}px) scale(1) rotate(${r}deg)`, opacity: 0 }
    ], { duration: 1300 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => s.remove();
  }
}
function toggleDone(id, date){
  const it = byId(id); if (!it) return;
  if (state.done[id]){
    const prev = state.done[id];
    delete state.done[id]; save(); refresh();
    toast("Décoché : " + it.t, "Annuler", () => { state.done[id] = prev; save(); refresh(); });
    return;
  }
  const prevPlan = state.planned[id], prevMeta = state.plannedMeta[id];
  state.done[id] = { date: date || todayYmd() };
  delete state.planned[id]; delete state.plannedMeta[id];
  save(); refresh(); confetti();
  const n = allItems().filter(isDone).length, fresh = newBadges();
  const msg = (MILESTONES[n] || `✓ ${it.t} — ${n} / ${GOAL}`) + (fresh.length ? ` · 🏅 ${fresh.map(b => b[1] + " " + b[2]).join(", ")}` : "");
  toast(msg, "Annuler", () => {
    delete state.done[id];
    if (prevPlan){ state.planned[id] = prevPlan; if (prevMeta) state.plannedMeta[id] = prevMeta; }
    save(); refresh();
  }, MILESTONES[n] || fresh.length ? 7000 : 4500);
}
function removeItem(id){
  const it = byId(id); if (!it || !confirm(`Retirer « ${it.t} » de la liste ?\n(Restaurable dans les réglages.)`)) return;
  const ci = state.custom.findIndex(x => String(x.i) === String(id));
  if (ci >= 0){ if (!confirm("C’est une idée que vous avez ajoutée : elle sera supprimée définitivement. Continuer ?")) return; state.custom.splice(ci, 1); }
  else state.hidden.push(it.i);
  delete state.planned[id]; delete state.plannedMeta[id];
  save(); closeDialogs(); refresh();
  toast("Idée retirée");
}
let photoTarget = null;
$("#filePhoto").addEventListener("change", async e => {
  const files = Array.from(e.target.files || []);
  e.target.value = "";
  if (!files.length || photoTarget == null) return;
  toast("📷 Enregistrement des photos…");
  await addPhotos(photoTarget, files);
  refresh();
  const fresh = newBadges();
  toast(`📷 ${files.length} photo${files.length > 1 ? "s" : ""} ajoutée${files.length > 1 ? "s" : ""}` + (fresh.length ? ` · 🏅 ${fresh.map(b => b[1] + " " + b[2]).join(", ")}` : ""));
});

/* ================= préparer une sortie (plan de journée) ================= */
let day = { id: null, date: null, time: "08:00", surprise: false, gen: 0 };
function openDay(id, date){
  const it = byId(id); if (!it) return;
  const meta = plannedMeta(it) || {};
  let d = date || plannedDate(it);
  if (!d && isEventItem(it)){ const w = nextEvent(it); if (w) d = ymd(+w.s < +parseYmd(todayYmd()) ? new Date() : w.s); }
  if (!d) d = dec.date;
  if (d < todayYmd()) d = todayYmd();
  day = { id: it.i, date: d, time: meta.time || "08:00", surprise: !!meta.surprise && meta.by === me(), gen: day.gen + 1 };
  renderDay();
  const dlg = $("#dlgDay");
  if (!dlg.open) dlg.showModal();
  $(".shbody", dlg).scrollTop = 0;
  loadDay();
}
function renderDay(){
  const it = byId(day.id), dlg = $("#dlgDay"), d = parseYmd(day.date);
  const ev = isEventItem(it) ? eventOn(it, d) : null, nev = isEventItem(it) && !ev ? nextEvent(it, d) : null;
  const planned = plannedDate(it) === day.date, near = it.x ? nearby(it) : [];
  const times = ["06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "11:00", "12:00", "13:00", "14:00"];
  dlg.innerHTML = `
    <div class="shhead"><span class="emo" style="background:${tint(it)}">${CATS[it.c][0]}</span>
      <div class="tt"><h3>Préparer la sortie</h3><p>${esc(it.t)}${it.p ? " · " + esc(it.p) : ""}</p></div>
      <button class="x" data-close aria-label="Fermer">✕</button></div>
    <div class="shbody">
      <div class="part" style="margin-top:12px"><h4>📅 Quand ?</h4>
        <div class="chips wrapok" id="dayWhen">${dateChips(day.date, "data-dday", "dayDate")}</div>
        <p class="sub" style="margin-top:6px">${fmtDay(day.date)} · ${relDays(dayDiff(new Date(), d))}</p>
        ${ev ? `<div class="evnote">🎉 C’est le bon jour : ${fmtWin(ev)}${ev.note ? " — " + esc(ev.note) : ""}${ev.approx ? " (≈ à vérifier)" : ""}</div>` : ""}
        ${nev ? `<div class="evnote" style="background:var(--amber-bg);color:var(--amber)">⚠️ La fête n’a pas lieu ce jour-là. Prochaine édition : ${fmtWin(nev)}${nev.approx ? " ≈" : ""}. <button class="link" data-dday="${ymd(nev.s)}">Choisir cette date</button></div>` : ""}
        ${!isEventItem(it) && !inSeason(it, d) ? `<div class="evnote" style="background:var(--amber-bg);color:var(--amber)">⚠️ Hors saison ce mois-là (${seasonLabel(it.m)}).</div>` : ""}
      </div>
      <div class="part"><h4>🌦️ Météo sur place</h4><div id="dayWx"><p class="spmsg">…</p></div></div>
      <div class="part"><h4>🚆 Aller <small>départ vers <select id="dayTime" aria-label="Heure de départ">${times.map(t => `<option${t === day.time ? " selected" : ""}>${t}</option>`).join("")}</select></small></h4>
        <p class="sub" style="margin:-2px 0 4px">depuis ${esc(home().name)} · <button class="link" data-act="editHome">changer</button></p><div id="dayGo"><p class="spmsg">…</p></div></div>
      <div class="part"><h4>🏠 Retour</h4><div id="dayBack"><p class="spmsg">…</p></div></div>
      <div class="part"><h4>🎒 À emporter</h4><div class="pack" id="dayPack"></div></div>
      ${it.x ? `<div class="part"><h4>🧭 Sur place <small>© OpenStreetMap</small></h4><div id="dsp-${it.i}"></div></div>` : ""}
      ${near.length ? `<div class="part"><h4>💡 À combiner</h4><div class="nearrow">${near.map(e => `<button class="near" data-act="open" data-i="${e.o.i}">${CATS[e.o.c][0]} ${esc(e.o.t)} · ${e.km} km</button>`).join("")}</div></div>` : ""}
      ${hasNames() ? `<div class="part"><label class="toggle"><input type="checkbox" id="daySurprise"${day.surprise ? " checked" : ""}>
        <span>🎁 C’est une surprise pour ${esc(nameOf(other()))}<small class="sub" style="display:block">Sur son téléphone, la destination reste cachée jusqu’au jour J — seuls la date, l’heure et quoi emporter s’affichent.</small></span></label></div>` : ""}
    </div>
    <div class="shfoot">
      <button class="btn ${planned ? "ok" : "primary"}" data-act="plan">${planned ? "✓ Prévu ce jour-là" : "📅 On le prévoit"}</button>
      <button class="btn" data-act="sharePlan">💬 Envoyer${hasNames() ? " à " + esc(nameOf(other())) : ""}</button>
      <button class="btn" data-act="ics">📆 Agenda</button>
    </div>`;
  renderPack();
  if (it.x) loadSurPlace(it, "#dsp-" + it.i, 1500, 2);
}
async function loadDay(){
  const gen = ++day.gen, it = byId(day.id), date = day.date, d = parseYmd(date), ahead = dayDiff(new Date(), d);
  day.wx = null; day.go = null; day.back = null; day.last = null;
  const put = (sel, h) => { const e = $(sel); if (e && gen === day.gen) e.innerHTML = h; };
  if (!it.x) put("#dayWx", `<p class="spmsg">Lieu sans coordonnées.</p>`);
  else if (ahead > 15) put("#dayWx", `<p class="spmsg">Les prévisions arrivent 16 jours avant (encore ${ahead - 15} jour${ahead - 15 > 1 ? "s" : ""}).</p>`);
  else if (!navigator.onLine) put("#dayWx", `<p class="spmsg">Hors ligne.</p>`);
  else weatherFor([{ lat: it.x[0], lng: it.x[1] }], date).then(([w]) => {
    if (gen !== day.gen) return;
    day.wx = w;
    put("#dayWx", w ? `<div class="wxbig"><span class="e">${wxEmo(w.c)}</span><div><b>${w.tmin}° / ${w.tmax}°</b> · ${wxTxt(w.c)}`
      + `<small>${w.pp != null ? "Risque de pluie " + w.pp + " %" : ""}${w.rise ? (w.pp != null ? " · " : "") + "🌅 " + w.rise + " · 🌇 " + w.set : ""}</small></div></div>`
      + (wxRain(w) && !isRainOk(it) ? `<p class="spmsg">🌧️ Pluie annoncée — gardez une idée « ☔ même s’il pleut » sous le coude.</p>` : "")
      : `<p class="spmsg">Météo indisponible.</p>`);
    renderPack();
  }).catch(() => put("#dayWx", `<p class="spmsg">Météo indisponible pour l’instant.</p>`));
  const fallback = `<a href="${gmapsTransit(it)}" target="_blank" rel="noopener">Itinéraire Google Maps</a>`;
  if (!it.x || !navigator.onLine){ const m = `<p class="spmsg">${!it.x ? "Lieu sans coordonnées." : "Hors ligne — horaires indisponibles."} ${fallback}</p>`; put("#dayGo", m); put("#dayBack", m); return; }
  try {
    const [from, to] = await Promise.all([homeStation(), itemStation(it)]);
    if (gen !== day.gen) return;
    day.from = from; day.to = to;
    if (from === to){ put("#dayGo", `<p class="spmsg">🏠 C’est juste à côté de chez vous (${esc(to)}) !</p>`); put("#dayBack", ""); return; }
    const [goC, backC, lastC] = await Promise.all([
      connections(from, to, date, day.time, 3).catch(() => null),
      connections(to, from, date, "16:30", 3).catch(() => null),
      connections(to, from, date, "23:59", 4, true).catch(() => null)
    ]);
    if (gen !== day.gen) return;
    const sameDay = c => ymd(new Date(c.dep * 1000)) === date;
    day.go = (goC || []).filter(sameDay);
    day.back = (backC || []).filter(sameDay);
    day.last = (lastC || []).filter(sameDay).sort((a, b) => b.dep - a.dep)[0] || null;
    put("#dayGo", day.go.length ? day.go.map(connRow).join("") + `<p class="sub" style="margin-top:6px">Arrêt d’arrivée : ${esc(to)}</p>` : `<p class="spmsg">Pas de liaison trouvée à cette heure. ${fallback}</p>`);
    put("#dayBack", (day.back.length ? day.back.map(connRow).join("") : `<p class="spmsg">Pas de retour trouvé après 16 h 30.</p>`)
      + (day.last ? `<div class="conn last"><span class="tm">${hm(day.last.dep)} → ${hm(day.last.arr)}</span><span class="dt">🌙 Dernier retour possible</span><span class="du">${day.last.min != null ? fmtMin(day.last.min) : ""}</span></div>` : ""));
  } catch(e){
    const m = `<p class="spmsg">Horaires CFF indisponibles pour l’instant. ${fallback}</p>`;
    put("#dayGo", m); put("#dayBack", m);
  }
}
const connRow = c => `<div class="conn"><span class="tm">${hm(c.dep)} → ${hm(c.arr)}</span><span class="dt">${c.tr ? c.tr + " changement" + (c.tr > 1 ? "s" : "") : "direct"}${c.prod ? " · " + esc(c.prod) : ""}</span><span class="du">${c.min != null ? fmtMin(c.min) : ""}</span></div>`;
function packFor(it, w, date){
  const mo = (date ? parseYmd(date) : new Date()).getMonth() + 1, txt = norm(it.d + " " + (it.kw || "")), out = [];
  const winter = mo === 12 || mo <= 3, summer = mo >= 6 && mo <= 9;
  if (BATHS.has(it.i)) out.push("🩱 Maillot, serviette et sandales");
  else if (it.c === "eau" && summer && /baign|bain/.test(txt)) out.push("🩱 Maillot de bain");
  if (isActive(it) || it.c === "ran") out.push("🥾 Chaussures de marche");
  if (it.c === "som" || isActive(it)) out.push("🧥 Une couche chaude — plus frais en altitude");
  if (CAVES.has(it.i)) out.push("🧥 Petite laine (≈ 10° dans la grotte)");
  if (NIGHT.has(it.i)) out.push("🔦 Lampe et habits chauds pour le soir");
  if ((winter || (w && (wxSnow(w) || w.tmax <= 7))) && !isRainOk(it)) out.push("🧤 Bonnet, gants et habits chauds");
  if (w && wxRain(w)) out.push("☂️ Veste de pluie");
  if (w && wxSunny(w) && !isRainOk(it)) out.push("🕶️ Lunettes et crème solaire");
  if (/cash/.test(txt)) out.push("💵 Du cash (souvent pas de carte)");
  if (/reserv/.test(txt)) out.push("📞 Réserver à l’avance");
  if (it.g === "red" || it.g === "pay") out.push("💳 Budget remontées ou entrée" + (it.g === "red" ? " (½ prix avec l’AG)" : ""));
  if (["eau", "ran", "som"].includes(it.c)) out.push("🧺 Pique-nique et gourde");
  if (it.c === "fet") out.push("🎉 Vérifier le programme exact");
  out.push("🎫 AG et pièce d’identité", "🔋 Téléphone chargé");
  return out;
}
function renderPack(){
  const it = byId(day.id), el = $("#dayPack"); if (!el || !it) return;
  const got = state.pack[it.i + "|" + day.date] || [];
  el.innerHTML = packFor(it, day.wx, day.date).map(t => `<label><input type="checkbox" data-pk="${esc(t)}"${got.includes(t) ? " checked" : ""}><span>${esc(t)}</span></label>`).join("");
}
function planText(){
  const it = byId(day.id), w = day.wx, g = day.go && day.go[0], b = day.back && day.back[0];
  const pack = packFor(it, w, day.date).slice(0, 4).map(stripEmoji).join(", ");
  const L = [];
  if (day.surprise){
    L.push(`🎁 Sortie surprise — ${fmtDay(day.date)} !`);
    if (g) L.push(`🚆 Départ ${hm(g.dep)} de ${day.from || home().name}`);
    L.push(`🎒 Prévois : ${pack}`, "Pour le reste… surprise 😘");
  } else {
    L.push(`🇨🇭 ${fmtDay(day.date)} : ${it.t}${it.p ? " (" + it.p + ")" : ""}`);
    if (w) L.push(`${wxEmo(w.c)} ${w.tmin}°/${w.tmax}°, ${wxTxt(w.c)}${w.set ? " · coucher du soleil " + w.set : ""}`);
    if (g) L.push(`🚆 Aller : ${hm(g.dep)} → ${hm(g.arr)} (${g.tr ? g.tr + " changement" + (g.tr > 1 ? "s" : "") : "direct"})`);
    if (b || day.last) L.push(`🏠 Retour : ${b ? hm(b.dep) : ""}${day.last ? (b ? " · " : "") + "dernier à " + hm(day.last.dep) : ""}`);
    L.push(`🎒 ${pack}`);
  }
  L.push("— Suisse 100");
  return L.join("\n");
}
const sharePlan = () => shareText(planText());

/* --- agenda (.ics) avec rappels : sans serveur, c'est l'agenda du téléphone qui notifie --- */
const icsDay = d => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
const icsTime = d => icsDay(d) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";      // heure locale « flottante »
const icsEsc = s => String(s).replace(/\\/g, "\\\\").replace(/[,;]/g, m => "\\" + m).replace(/\r?\n/g, "\\n");
const icsBefore = min => { const d = Math.floor(min / 1440), h = Math.floor(min % 1440 / 60), m = Math.round(min % 60);
  return "-P" + (d ? d + "D" : "") + (h || m || !d ? "T" + (h ? h + "H" : "") + (m || (!h && !d) ? m + "M" : "") : ""); };
function makeICS({ uid, title, location, desc, start, end, allDay, alarms = [] }){
  const fold = line => { const enc = new TextEncoder(); let out = "", cur = ""; for (const ch of line){ if (enc.encode(cur + ch).length > 73){ out += cur + "\r\n "; cur = ""; } cur += ch; } return out + cur; };
  const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Suisse 100//FR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    "UID:" + uid + "@suisse100", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""),
    allDay ? "DTSTART;VALUE=DATE:" + icsDay(start) : "DTSTART:" + icsTime(start),
    allDay ? "DTEND;VALUE=DATE:" + icsDay(end) : "DTEND:" + icsTime(end),
    "SUMMARY:" + icsEsc(title)];
  if (location) L.push("LOCATION:" + icsEsc(location));
  if (desc) L.push("DESCRIPTION:" + icsEsc(desc));
  for (const a of alarms) if (a.before > 0) L.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(a.text), "TRIGGER:" + icsBefore(a.before), "END:VALARM");
  L.push("END:VEVENT", "END:VCALENDAR");
  return L.map(fold).join("\r\n");
}
function saveICS(ics, name, msg){ saveFile(new Blob([ics], { type: "text/calendar" }), name); toast(msg || "📆 Fichier agenda téléchargé — ouvrez-le pour l’ajouter", null, null, 6500); }
function downloadICS(){                                      // la sortie préparée, avec rappel la veille et avant le départ
  const it = byId(day.id), g = day.go && day.go[0], d = parseYmd(day.date), what = day.surprise ? "sortie surprise 🎁" : it.t;
  const day0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const eve = new Date(day0); eve.setDate(eve.getDate() - 1); eve.setHours(20, 0, 0, 0);
  let start, end, alarms;
  if (g){
    start = new Date(g.dep * 1000); end = day.last ? new Date(day.last.arr * 1000) : new Date((g.dep + 9 * 3600) * 1000);
    const pack = packFor(it, day.wx, day.date).slice(0, 2).map(stripEmoji).join(", ").toLowerCase();
    alarms = [{ before: Math.round((start - eve) / 60000), text: `Demain : ${what} — départ ${hm(g.dep)}. N’oubliez pas : ${pack}` },
              { before: 60, text: `Départ dans 1 h (${hm(g.dep)} de ${day.from || home().name})` }];
  } else { start = day0; end = addDays(day0, 1); alarms = [{ before: 240, text: `Demain : ${what}` }]; }
  saveICS(makeICS({ uid: "s100-" + it.i + "-" + day.date, title: day.surprise ? "🎁 Sortie surprise" : "🇨🇭 " + it.t,
    location: day.surprise ? "" : (it.p || it.t), desc: planText(), start, end, allDay: !g, alarms }),
    "suisse100-" + day.date + ".ics", "📆 Ouvrez le fichier pour l’ajouter — rappels la veille à 20 h" + (g ? " et 1 h avant le départ" : ""));
}
function remindEvent(it){                                    // fête : rappel une semaine avant (10 h) et la veille (19 h)
  const w = nextEvent(it);
  if (!w){ toast("Pas de date connue pour cette fête"); return; }
  const s = new Date(w.s.getFullYear(), w.s.getMonth(), w.s.getDate()), e = addDays(new Date(w.e.getFullYear(), w.e.getMonth(), w.e.getDate()), 1);
  saveICS(makeICS({ uid: "s100-ev-" + it.i + "-" + ymd(w.s), title: "🎉 " + it.t + (w.approx ? " (date à confirmer)" : ""), location: it.p || "",
    desc: (it.d || "") + (w.note ? "\n" + w.note : "") + "\n— Suisse 100", start: s, end: e, allDay: true,
    alarms: [{ before: 6 * 1440 + 14 * 60, text: "Dans une semaine : " + it.t + " — on y va ?" }, { before: 300, text: "Demain : " + it.t }] }),
    "suisse100-" + norm(it.t).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".ics", "🔔 Ouvrez le fichier : rappels une semaine avant et la veille");
}
function saveFile(blob, name){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
$("#dlgDay").addEventListener("click", e => {
  const b = e.target.closest("[data-dday]"); if (!b) return;
  day.date = b.dataset.dday < todayYmd() ? todayYmd() : b.dataset.dday;
  renderDay(); loadDay();
});
$("#dlgDay").addEventListener("change", e => {
  const t = e.target;
  if (t.id === "dayDate" && t.value){ day.date = t.value < todayYmd() ? todayYmd() : t.value; renderDay(); loadDay(); }
  else if (t.id === "dayTime"){ day.time = t.value; if (plannedDate(byId(day.id)) === day.date) state.plannedMeta[day.id] = Object.assign({}, plannedMeta(byId(day.id)), { time: day.time, at: Date.now() }), save(); loadDay(); }
  else if (t.id === "daySurprise"){ day.surprise = t.checked; if (plannedDate(byId(day.id)) === day.date){ state.plannedMeta[day.id] = Object.assign({}, plannedMeta(byId(day.id)), { surprise: day.surprise, by: me(), at: Date.now() }); save(); refresh(); } }
  else if (t.dataset.pk){
    const k = day.id + "|" + day.date, arr = state.pack[k] || (state.pack[k] = []);
    if (t.checked){ if (!arr.includes(t.dataset.pk)) arr.push(t.dataset.pk); } else arr.splice(arr.indexOf(t.dataset.pk), 1);
    save();
  }
});
function planIt(){
  const it = byId(day.id);
  if (plannedDate(it) === day.date){ toast("Déjà prévu ce jour-là", "Annuler la sortie", () => { setPlanned(it.i, null); renderDay(); refresh(); }); return; }
  setPlanned(it.i, day.date, { time: day.time, surprise: day.surprise });
  renderDay(); refresh();
  toast(`📅 ${day.surprise ? "Surprise prévue" : it.t + " — prévu"} ${fmtDay(day.date)}`, hasNames() ? "Envoyer" : null, sharePlan, 6000);
}

/* ================= à deux ================= */
let deckCur = null;
const deckHist = [];
function namesHTML(){
  const p = state.people;
  return `<div class="names"><div class="twocol">
      <div><label class="lb" for="nA">Prénom 1</label><input class="field" id="nA" value="${esc(p.a)}" maxlength="20" placeholder="Prénom" autocomplete="off"></div>
      <div><label class="lb" for="nB">Prénom 2</label><input class="field" id="nB" value="${esc(p.b)}" maxlength="20" placeholder="Prénom" autocomplete="off"></div></div>
    <label class="lb">Ce téléphone est celui de…</label>
    <div class="who"><label><input type="radio" name="nMe" value="a"${p.me === "a" ? " checked" : ""}> <span>${esc(p.a || "Prénom 1")}</span></label>
      <label><input type="radio" name="nMe" value="b"${p.me === "b" ? " checked" : ""}> <span>${esc(p.b || "Prénom 2")}</span></label></div>
    <div class="btnrow"><button class="btn primary sm" data-act="saveNames">Enregistrer</button></div>
    <p class="sub" style="margin-top:8px">Sur l’autre téléphone, pas besoin de tout ressaisir : recevez simplement un code de synchro, les prénoms suivent.</p></div>`;
}
function renderCouple(){
  const items = allItems();
  const ms = items.filter(it => !isDone(it) && isMatch(it)).sort((a, b) => (vote("a", b.i) + vote("b", b.i)) - (vote("a", a.i) + vote("b", a.i)));
  const waiting = hasNames() ? items.filter(it => !isDone(it) && otherVote(it.i) > 0 && !myVote(it.i)).length : 0;
  $("#v-couple").innerHTML = `
    <div style="padding-top:8px"><h2 class="h">💞 À deux</h2>
      <p class="sub">${hasNames() ? esc(state.people.a) + " & " + esc(state.people.b) + (waiting ? ` · ${waiting} envie${waiting > 1 ? "s" : ""} de ${esc(nameOf(other()))} à découvrir` : "") : "Vos envies, vos matchs, et vos deux téléphones synchronisés."}</p></div>
    ${hasNames() ? "" : `<div class="box"><div class="boxhead"><h2 class="h">Qui êtes-vous ?</h2></div>${namesHTML()}</div>`}
    <div class="box"><div class="boxhead"><h2 class="h">Envie ou pas ?</h2><span class="sub">${esc(nameOf(me()))}</span></div>
      <p class="sub">Glissez à droite ❤️, à gauche ✕, vers le haut ⭐ (ou les boutons). Quand vous avez tous les deux envie, c’est un <b>match</b>.</p>
      <div class="deck" id="deck"></div>
      <div class="deckbtns"><button class="undo" data-act="dundo" aria-label="Revenir à la carte précédente">↩︎</button>
        <button class="no" data-act="dvote" data-v="-1" aria-label="Bof">✕</button>
        <button class="yes" data-act="dvote" data-v="1" aria-label="Envie">❤️</button>
        <button class="star" data-act="dvote" data-v="2" aria-label="Absolument">⭐</button></div>
      <p class="deckcount" id="deckCount"></p></div>
    <div class="box"><div class="boxhead"><h2 class="h">💞 Vos envies communes</h2><span class="sub">${ms.length}</span></div>
      ${ms.length ? ms.map(it => miniRow(it)).join("") : `<p class="sub">Pas encore de match. Notez quelques idées chacun de votre côté, puis synchronisez.</p>`}</div>
    ${syncBoxHTML()}
    ${hasNames() ? `<p class="sub" style="text-align:center"><button class="link" data-act="settings">Modifier les prénoms</button></p>` : ""}`;
  deckShow();
}
function deckPick(){
  const mine = state.votes[me()];
  const cand = allItems().filter(it => !isDone(it) && mine[it.i] == null);
  if (!cand.length) return null;
  const pri = cand.filter(it => otherVote(it.i) > 0);         // d'abord les envies de l'autre → plus de matchs
  const pool = pri.length ? pri : cand;
  return pool[Math.floor(Math.random() * pool.length)];
}
function deckShow(){
  const el = $("#deck"); if (!el) return;
  if (!deckCur || isDone(deckCur) || state.votes[me()][deckCur.i] != null || !byId(deckCur.i)) deckCur = deckPick();
  const voted = allItems().filter(it => state.votes[me()][it.i] != null).length, left = allItems().filter(it => !isDone(it) && state.votes[me()][it.i] == null).length;
  $("#deckCount").textContent = `${voted} idée${voted > 1 ? "s" : ""} notée${voted > 1 ? "s" : ""} · ${left} à découvrir`;
  if (!deckCur){ el.innerHTML = `<div class="dcard"><div class="big">🎉</div><h3>Tout est noté !</h3><p class="d">Vous avez donné votre avis sur toutes les idées. Synchronisez avec ${esc(nameOf(other()))} pour découvrir vos matchs.</p></div>`; return; }
  const it = deckCur, tr = travel(it), ov = otherVote(it.i), im = imgOf(it);
  el.innerHTML = `<div class="dcard withimg" id="dcard" data-i="${it.i}" style="touch-action:none">
    <div class="dimg"><span class="big">${CATS[it.c][0]}</span>${imgTag(im, true)}</div>
    <span class="stamp yes">ENVIE</span><span class="stamp no">BOF</span>
    <h3>${esc(it.t)}</h3>
    <div class="p">${esc(it.p || "")}${it.k ? " · " + esc(it.k) : ""}${tr ? " · " + ttLabel(tr) : ""}${it.g ? " · " + GA[it.g][0] : ""}</div>
    ${ov > 0 ? `<span class="hint">${ov === 2 ? "⭐" : "❤️"} ${esc(nameOf(other()))} en a envie</span>` : ""}
    <div class="d">${esc(it.d || "")}</div></div>`;
  bindSwipe($("#dcard"));
}
function deckVote(v){
  if (!deckCur) return;
  const it = deckCur;
  deckHist.push({ id: it.i, prev: state.votes[me()][it.i] });
  setVote(it.i, v);
  const card = $("#dcard");
  const next = () => {
    deckCur = null; deckShow(); renderPill();
    if (v > 0 && otherVote(it.i) > 0) toast("💞 Match : " + it.t + " !", "Préparer", () => openDay(it.i), 6000);
  };
  if (card){
    card.classList.remove("drag");
    card.style.transform = v === 2 ? "translateY(-130%)" : `translateX(${v > 0 ? 130 : -130}%) rotate(${v > 0 ? 16 : -16}deg)`;
    card.style.opacity = "0";
    setTimeout(next, 220);
  } else next();
}
function deckUndo(){
  const h = deckHist.pop(); if (!h) { toast("Rien à annuler"); return; }
  if (h.prev == null) delete state.votes[me()][h.id]; else state.votes[me()][h.id] = h.prev;
  save(); deckCur = byId(h.id); deckShow(); renderPill();
}
function bindSwipe(card){
  if (!card) return;
  let sx = 0, sy = 0, dx = 0, dy = 0, down = false;
  const yes = $(".stamp.yes", card), no = $(".stamp.no", card);
  card.addEventListener("pointerdown", e => { down = true; sx = e.clientX; sy = e.clientY; dx = dy = 0; card.classList.add("drag"); card.setPointerCapture(e.pointerId); });
  card.addEventListener("pointermove", e => {
    if (!down) return;
    dx = e.clientX - sx; dy = e.clientY - sy;
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 16}deg)`;
    yes.style.opacity = Math.max(0, Math.min(1, dx / 90)); no.style.opacity = Math.max(0, Math.min(1, -dx / 90));
  });
  const end = () => {
    if (!down) return;
    down = false; card.classList.remove("drag");
    if (dx > 90) deckVote(1);
    else if (dx < -90) deckVote(-1);
    else if (dy < -100) deckVote(2);
    else {
      card.style.transform = ""; yes.style.opacity = no.style.opacity = 0;
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) openItem(asId(card.dataset.i));
    }
  };
  card.addEventListener("pointerup", end);
  card.addEventListener("pointercancel", end);
}
function saveNames(btn){
  const root = btn.closest(".names");
  const a = $("#nA", root).value.trim(), b = $("#nB", root).value.trim(), r = $("input[name=nMe]:checked", root);
  if (!a || !b){ toast("Entrez vos deux prénoms"); return; }
  state.people.a = a; state.people.b = b; state.people.me = r ? r.value : "a"; state.peopleSet = true;
  save(); refresh();
  if ($("#dlgSettings").open) openSettings();
  toast(`💞 Ce téléphone est celui de ${nameOf(me())}`);
}
document.addEventListener("input", e => {                    // prénoms tapés → étiquettes du choix « ce téléphone »
  if (e.target.id !== "nA" && e.target.id !== "nB") return;
  const root = e.target.closest(".names"), spans = $$(".who span", root);
  if (spans.length === 2){ spans[0].textContent = $("#nA", root).value || "Prénom 1"; spans[1].textContent = $("#nB", root).value || "Prénom 2"; }
});

/* --- synchro entre les deux téléphones (code texte compressé, ou fichier avec photos) --- */
function syncBoxHTML(){
  const last = state.lastSync ? relDays(dayDiff(new Date(state.lastSync), new Date())).replace("aujourd’hui", "aujourd’hui").replace(/^dans/, "il y a") : "jamais";
  return `<div class="box" id="syncBox"><div class="boxhead"><h2 class="h">🔄 Synchroniser</h2></div>
    <p class="sub">Pas de serveur : vos données restent sur vos téléphones. Pour mettre en commun coches, notes, envies et sorties prévues,
      <b>envoyez votre code</b> à ${esc(nameOf(other()))} (WhatsApp, SMS…), qui le colle ici — puis faites l’inverse.</p>
    <div class="btnrow"><button class="btn primary sm" data-act="sendCode">📤 Envoyer mon code</button><button class="btn sm" data-act="pasteCode">📥 Coller un code reçu</button></div>
    <div id="codeZone"></div>
    <p class="sub" style="margin-top:10px">Dernière synchro : ${last}. Les photos voyagent en fichier : <button class="link" data-act="exportPh">exporter avec les photos</button>.</p></div>`;
}
function syncPayload(){
  return { app: "suisse100", v: 3, t: new Date().toISOString(), from: me(), people: state.people,
    done: state.done, notes: state.notes, custom: state.custom, hidden: state.hidden,
    planned: state.planned, plannedMeta: state.plannedMeta, votes: state.votes };
}
const b64u = bytes => { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const unb64u = str => { const s = atob(str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4)); const out = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i); return out; };
async function makeSyncCode(){
  let bytes = new TextEncoder().encode(JSON.stringify(syncPayload())), z = "0";
  if (window.CompressionStream){
    try { bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer()); z = "1"; } catch(e){}
  }
  return "S100" + z + ":" + b64u(bytes);
}
async function readSyncCode(text){
  const m = String(text).match(/S100([01]):([A-Za-z0-9_-]+)/);
  if (!m) throw new Error("code introuvable");
  let bytes = unb64u(m[2]);
  if (m[1] === "1") bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer());
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function sendCode(){
  const code = await makeSyncCode();
  const text = `💞 Code Suisse 100 de ${nameOf(me())} — copie tout ce message, puis dans l’app : À deux → « Coller un code reçu ».\n\n${code}`;
  try { if (navigator.share){ await navigator.share({ text }); toast("📤 Code envoyé — demandez le sien en retour !"); return; } }
  catch(e){ if (e && e.name === "AbortError") return; }
  $("#codeZone").innerHTML = `<div class="part"><h4>Votre code</h4><div class="codebox">${esc(code)}</div>
    <div class="btnrow"><button class="btn sm" data-act="copyCode">📋 Copier le message</button></div></div>`;
  $("#codeZone").dataset.text = text;
}
function pasteCodeUI(){
  $("#codeZone").innerHTML = `<div class="part"><h4>Coller le code reçu</h4>
    <textarea class="field" id="codeIn" rows="3" placeholder="Collez ici tout le message reçu (S100…)"></textarea>
    <div class="btnrow">${navigator.clipboard && navigator.clipboard.readText ? `<button class="btn sm" data-act="clipPaste">📋 Coller</button>` : ""}<button class="btn primary sm" data-act="mergeCode">🔄 Fusionner</button></div></div>`;
  $("#codeIn").focus();
}
async function mergeCode(){
  const txt = ($("#codeIn") || {}).value || "";
  try {
    const imp = await readSyncCode(txt);
    const st = await mergeImport(imp);
    $("#codeZone").innerHTML = "";
    refresh();
    toast("🔄 Synchro : " + summarize(st), null, null, 7000);
  } catch(e){ toast("❌ Code illisible — copiez bien tout le message (il commence par « S100 »)."); }
}
const summarize = st => [st.done && st.done + " coche" + (st.done > 1 ? "s" : ""), st.ideas && st.ideas + " idée" + (st.ideas > 1 ? "s" : ""), st.notes && st.notes + " note" + (st.notes > 1 ? "s" : ""),
  st.votes && st.votes + " envie" + (st.votes > 1 ? "s" : ""), st.planned && st.planned + " sortie" + (st.planned > 1 ? "s" : ""), st.photos && st.photos + " photo" + (st.photos > 1 ? "s" : "")]
  .filter(Boolean).join(", ") || "tout était déjà à jour 👍";
async function mergeImport(imp){
  if (!imp || imp.app !== "suisse100") throw new Error("format");
  const st = { done: 0, ideas: 0, notes: 0, votes: 0, planned: 0, photos: 0 };
  const src = imp.from || (imp.people && imp.people.me) || null;
  const who = src && imp.people && imp.people[src] ? imp.people[src] : "l’autre";
  if (imp.people){                                            // prénoms : on adopte ceux qui manquent
    if (!(state.people.a || "").trim() && imp.people.a) state.people.a = imp.people.a;
    if (!(state.people.b || "").trim() && imp.people.b) state.people.b = imp.people.b;
    if (src && src === me() && !state.peopleSet){             // ce téléphone est forcément l'autre personne :
      const o = src === "a" ? "b" : "a";                      // on y bascule tout ce qui a été fait avant
      [state.votes.a, state.votes.b] = [state.votes.b, state.votes.a];
      for (const id in state.plannedMeta){ const m = state.plannedMeta[id]; if (m && (m.by === "a" || m.by === "b")) m.by = m.by === "a" ? "b" : "a"; }
      state.people.me = o; state.peopleSet = true;
    } else if (src && src === me()) toast("⚠️ Vous avez choisi le même prénom sur les deux téléphones — corrigez dans les réglages.", null, null, 8000);
  }
  for (const id in imp.done || {}) if (!state.done[id] && imp.done[id]){ state.done[id] = imp.done[id]; delete state.planned[id]; delete state.plannedMeta[id]; st.done++; }
  for (const id in imp.notes || {}){                          // notes : on n'écrase jamais, on réunit
    const r = (imp.notes[id] || "").trim(), l = (state.notes[id] || "").trim();
    if (!r || l === r || l.includes(r)) continue;
    state.notes[id] = !l ? r : r.includes(l) ? r : l + "\n— " + who + " : " + r;
    st.notes++;
  }
  for (const it of imp.custom || []) if (it && it.i != null && !state.custom.some(x => String(x.i) === String(it.i))){ state.custom.push(it); st.ideas++; }
  for (const id of imp.hidden || []) if (!state.hidden.some(h => String(h) === String(id))) state.hidden.push(id);
  for (const id in imp.planned || {}){                       // sorties prévues : la plus récente gagne
    if (state.done[id]) continue;
    const rm = (imp.plannedMeta || {})[id], lm = state.plannedMeta[id];
    if (!state.planned[id] || (rm && rm.at && (!lm || !lm.at || rm.at > lm.at))){
      if (state.planned[id] !== imp.planned[id]) st.planned++;
      state.planned[id] = imp.planned[id];
      if (rm) state.plannedMeta[id] = rm;
    }
  }
  if (imp.votes && (src === "a" || src === "b") && src !== me()){   // les envies de l'autre font foi
    const v = imp.votes[src] || {};
    for (const id in v) if (state.votes[src][id] !== v[id]){ state.votes[src][id] = v[id]; st.votes++; }
  }
  if (Array.isArray(imp.photos)){                             // fichier avec photos
    const existing = await req((await store("readonly")).getAll());
    for (const p of imp.photos){
      if (existing.some(r => r.item === p.item && r.date === p.date && r.blob.size === p.size)) continue;
      const blob = await (await fetch(p.data)).blob();
      const pid = await req((await store("readwrite")).add({ item: p.item, date: p.date, blob }));
      idxAdd(p.item, pid); st.photos++;
    }
  }
  state.lastSync = new Date().toISOString();
  save();
  return st;
}

/* --- sauvegarde fichier (export / import, compatible avec les anciens fichiers) --- */
async function buildExportBlob(withPhotos){
  const payload = Object.assign({}, state, syncPayload(), { exported: new Date().toISOString() });
  if (withPhotos){
    const recs = await req((await store("readonly")).getAll());
    payload.photos = [];
    for (const r of recs){
      const data = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(r.blob); });
      payload.photos.push({ item: r.item, date: r.date, size: r.blob.size, data });
    }
  }
  return new Blob([JSON.stringify(payload)], { type: "application/json" });
}
const hasPhotos = () => [...photoIdx.values()].some(a => a.length);
async function exportData(withPhotos){
  if (withPhotos) toast("⏳ Préparation du fichier avec les photos…");
  const blob = await buildExportBlob(withPhotos);
  const name = "suisse100-" + todayYmd() + (withPhotos ? "-avec-photos" : "") + ".json";
  const file = new File([blob], name, { type: "application/json" });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })){ await navigator.share({ files: [file], title: "Suisse 100" }); markSaved(); return; }
  } catch(e){ if (e && e.name === "AbortError") return; }
  saveFile(blob, name); markSaved();
}
function markSaved(){ state.lastExport = new Date().toISOString(); save(); toast("💾 Sauvegarde prête"); if (view === "home") renderHome(); }
$("#fileImport").addEventListener("change", e => {
  const f = e.target.files[0]; e.target.value = "";
  if (!f) return;
  f.text().then(async txt => { const st = await mergeImport(JSON.parse(txt)); refresh(); toast("⬆ Import : " + summarize(st), null, null, 7000); })
    .catch(() => toast("❌ Fichier illisible : il faut un export « suisse100 » (.json)."));
});

/* --- rappel de sauvegarde : tout ne vit que sur ce téléphone --- */
const daysSince = iso => { if (!iso) return null; const d = new Date(iso); return isNaN(d) ? null : Math.floor((Date.now() - d) / 86400000); };
function backupNoticeHTML(){
  const hasData = Object.keys(state.done).length || Object.keys(state.notes).length || state.custom.length || hasPhotos();
  const dExp = daysSince(state.lastExport), dSnooze = daysSince(state.backupSnooze);
  if (!hasData || (dExp != null && dExp <= 21) || (dSnooze != null && dSnooze <= 7)) return "";
  return `<div class="notice"><span>💾 ${dExp == null ? "Coches, notes et photos ne vivent que sur ce téléphone — faites une <b>première sauvegarde</b>." : `Dernière sauvegarde il y a <b>${dExp} jours</b>.`}</span>
    <button class="btn sm" data-act="backupNow">⬇ Sauvegarder</button><button class="btn ghost sm" data-act="backupLater">Plus tard</button></div>`;
}

/* ================= souvenirs : bilan + journal + carnet ================= */
function renderSouv(){
  const items = allItems(), doneItems = items.filter(isDone), n = doneItems.length, total = items.length;
  const KANT = KANTONS, bs = badgeStats();
  const perK = {}; for (const k of KANT) perK[k] = { d: 0, t: 0 };
  for (const it of items) if (perK[it.k]){ perK[it.k].t++; if (isDone(it)) perK[it.k].d++; }
  const kVisited = KANT.filter(k => perK[k].d).length;
  const nPh = [...photoIdx.values()].reduce((s, a) => s + a.length, 0);
  const today = new Date(), months = [];
  for (let i = 11; i >= 0; i--){ const d = new Date(today.getFullYear(), today.getMonth() - i, 15); months.push({ key: ymd(d).slice(0, 7), lbl: MOIS[d.getMonth()].replace(".", ""), n: 0 }); }
  for (const it of doneItems){ const m = months.find(x => x.key === (state.done[it.i].date || "").slice(0, 7)); if (m) m.n++; }
  const mMax = Math.max(1, ...months.map(m => m.n));
  const bar = (label, d, t, col) => `<div class="brow"><span class="bl">${label}</span><span class="bt"><i style="width:${t ? 100 * d / t : 0}%;background:${col}"></i></span><span class="bn">${d}/${t}</span></div>`;
  const upcoming = items.filter(it => !isDone(it) && plannedDate(it)).sort((a, b) => plannedDate(a).localeCompare(plannedDate(b)));
  const journal = doneItems.slice().sort((a, b) => (state.done[b.i].date || "").localeCompare(state.done[a.i].date || ""));
  const dts = journal.map(it => state.done[it.i].date).filter(Boolean).sort();
  let h = `<div style="padding-top:8px" class="noprint"><h2 class="h">📖 Nos souvenirs</h2><p class="sub">Tout ce qu’on a déjà vécu, en chiffres et en images.</p></div>
    <div class="stats noprint">
      <div class="stat"><b>${n}</b><span>aventure${n > 1 ? "s" : ""} sur ${total}</span></div>
      <div class="stat"><b>${kVisited}<small>/26</small></b><span>cantons visités</span></div>
      <div class="stat"><b>${nPh}</b><span>photo${nPh > 1 ? "s" : ""}</span></div>
      <div class="stat"><b>${Object.values(state.done).filter(d => d && d.date && d.date >= ymd(addDays(today, -30))).length}</b><span>ces 30 derniers jours</span></div>
    </div>
    <div class="box noprint"><div class="boxhead"><h2 class="h">🏅 Nos badges</h2><span class="sub">${BADGES.filter(b => b[4](bs) >= b[5]).length}/${BADGES.length}</span></div>
      <div class="badges">${BADGES.map(b => { const v = Math.min(b[4](bs), b[5]), got = v >= b[5];
        return `<div class="bdg${got ? " got" : " lock"}" title="${esc(b[3])}"><i>${b[1]}</i><b>${esc(b[2])}</b><small>${got ? "✓ " + esc(b[3]) : v + " / " + b[5] + " · " + esc(b[3])}</small>${got ? "" : `<div class="pg"><span style="width:${Math.round(100 * v / b[5])}%"></span></div>`}</div>`; }).join("")}</div></div>
    <div class="box noprint"><div class="boxhead"><h2 class="h">Les 26 cantons</h2><span class="sub">${kVisited}/26</span></div>
      <div class="cantons">${KANT.map(k => `<div class="canton${perK[k].d ? " some" : ""}"><b>${k}</b><small>${perK[k].d}/${perK[k].t}</small></div>`).join("")}</div></div>
    <div class="box noprint"><div class="boxhead"><h2 class="h">Par catégorie</h2></div>
      ${Object.keys(CATS).map(c => bar(CATS[c][0] + " " + CATS[c][1], items.filter(it => it.c === c && isDone(it)).length, items.filter(it => it.c === c).length, `var(--tint-${c})`)).join("")}
      <div class="part"><h4>Par région</h4>${Object.keys(REGS).map(r => bar(REGS[r], items.filter(it => it.r === r && isDone(it)).length, items.filter(it => it.r === r).length, "var(--red)")).join("")}</div>
      <div class="part"><h4>Les 12 derniers mois</h4><div class="months">${months.map(m => `<div class="mcol${m.n ? "" : " zero"}"><b>${m.n || "&nbsp;"}</b><i style="height:${Math.max(3, Math.round(56 * m.n / mMax))}px"></i><small>${m.lbl}</small></div>`).join("")}</div></div></div>`;
  if (upcoming.length) h += `<div class="sec noprint"><span class="dot" style="background:var(--amber)"></span><h3>À venir</h3><span>${upcoming.length}</span></div>`
    + upcoming.map(it => isSurpriseForMe(it)
      ? `<div class="jentry up"><div class="jdate">${fmtDay(plannedDate(it))}</div><div class="jt">🎁 Sortie surprise</div><div class="jp">organisée par ${esc(nameOf(plannedMeta(it).by))} — chut !</div></div>`
      : `<div class="jentry up" data-act="day" data-i="${it.i}" data-date="${plannedDate(it)}"><div class="jdate">${fmtDay(plannedDate(it))}</div><div class="jt">${CATS[it.c][0]} ${esc(it.t)}</div><div class="jp">${esc(it.p || "")}${it.k ? " · " + esc(it.k) : ""} · toucher pour préparer</div></div>`).join("");
  if (!journal.length) h += `<p class="empty">Le carnet de route se remplira à votre première coche. En route ! 🚂</p>`;
  else h += `<div class="sec noprint"><span class="dot" style="background:var(--red)"></span><h3>Notre carnet de route</h3><span>${journal.length}</span></div>
    <button class="btn sm noprint" data-act="print" style="margin:2px 0 6px">🖨️ Imprimer notre carnet (ou PDF)</button>
    <div class="printcover"><span class="cross lg"></span><h2>Suisse <em>100</em></h2>
      <p>Notre carnet de route — ${journal.length} aventure${journal.length > 1 ? "s" : ""} à deux${hasNames() ? "<br>" + esc(state.people.a) + " & " + esc(state.people.b) : ""}${dts.length ? `<br>${fmtDate(dts[0])} — ${fmtDate(dts[dts.length - 1])}` : ""}</p></div>`
    + journal.map(it => { const d = state.done[it.i], note = state.notes[it.i];
      return `<div class="jentry" data-act="open" data-i="${it.i}"><div class="jdate">${fmtDate(d.date) || "date inconnue"}</div>
        <div class="jt">${CATS[it.c][0]} ${esc(it.t)}</div><div class="jp">${esc(it.p || "")}${it.k ? " · " + esc(it.k) : ""} · ${REGS[it.r] || ""}</div>
        ${note ? `<div class="jnote">${esc(note)}</div>` : ""}${nPhotos(it) ? `<div class="photos" data-ph="${it.i}"></div>` : ""}</div>`; }).join("");
  $("#v-souv").innerHTML = h;
  $$("#v-souv .photos[data-ph]").forEach(fillStrip);
}
async function printBook(){
  const imgs = $$("#v-souv .photos img");
  imgs.forEach(im => { im.loading = "eager"; });
  await Promise.all(imgs.map(im => im.complete ? null : new Promise(r => { im.onload = im.onerror = r; })));
  window.print();
}

/* ================= réglages ================= */
function openSettings(focus){
  const d = $("#dlgSettings"), H = home(), dExp = daysSince(state.lastExport);
  d.innerHTML = `<div class="shhead"><div class="tt"><h3>Réglages</h3><p>Suisse 100 · version ${VERSION}</p></div><button class="x" data-close aria-label="Fermer">✕</button></div>
    <div class="shbody">
      <div class="part"><h4>🏠 Point de départ</h4>
        <select class="field" id="sHome" aria-label="Gare de départ">${H.geo ? `<option value="__geo" selected>📍 Ma position</option>` : ""}${STATIONS.map(s => `<option${!H.geo && H.name === s[0] ? " selected" : ""}>${esc(s[0])}</option>`).join("")}</select>
        <div class="btnrow"><button class="btn sm" data-act="geoHome">📍 Utiliser ma position</button></div>
        <p class="sub" style="margin-top:6px">Sert aux temps de trajet, aux suggestions et aux horaires CFF.</p></div>
      <div class="part"><h4>💞 Prénoms</h4>${namesHTML()}</div>
      <div class="part"><h4>💾 Sauvegarde</h4>
        <p class="sub">Tout est stocké sur ce téléphone. Dernière sauvegarde : ${dExp == null ? "jamais" : relDays(-dExp)}.</p>
        <div class="btnrow"><button class="btn sm" data-act="export">⬇ Exporter</button><button class="btn sm" data-act="exportPh">⬇ Exporter avec photos</button><button class="btn sm" data-act="import">⬆ Importer un fichier</button></div></div>
      ${state.hidden.length ? `<div class="part"><h4>🗑 Idées retirées <small>${state.hidden.length}</small></h4><div class="btnrow"><button class="btn sm" data-act="restoreHidden">↩︎ Tout restaurer</button></div></div>` : ""}
      <div class="part"><h4>ℹ️ À propos</h4><p class="sub">Badges AG indicatifs (état 2026) — vérifiez avant de partir. Horaires : transport.opendata.ch (CFF). Météo : Open-Meteo.
        Lieux alentour et cartes : © contributeurs OpenStreetMap. Les dates marquées ≈ sont habituelles, à confirmer sur les programmes officiels.</p></div>
    </div>`;
  if (!d.open) d.showModal();
  if (focus === "home") setTimeout(() => $("#sHome").focus(), 50);
}
function setHome(h){
  state.home = h; save();
  dec.jit.clear(); spCache.clear();
  toast("🏠 Départ : " + h.name);
  refresh();
}
$("#dlgSettings").addEventListener("change", e => {
  if (e.target.id !== "sHome" || e.target.value === "__geo") return;
  const s = STATIONS.find(x => x[0] === e.target.value);
  if (s) setHome({ name: s[0], lat: s[1], lng: s[2] });
});

/* ================= ajouter une idée ================= */
let addGeo = null;
$("#fC").innerHTML = Object.keys(CATS).map(c => `<option value="${c}">${CATS[c][0]} ${CATS[c][1]}</option>`).join("");
$("#fR").innerHTML = Object.keys(REGS).map(r => `<option value="${r}">${REGS[r]}</option>`).join("");
$("#btnAdd").addEventListener("click", () => { addGeo = null; $("#fGeoTxt").textContent = "Sinon, on localise le lieu automatiquement."; $("#dlgAdd").showModal(); });
$("#fGeo").addEventListener("click", async () => {
  $("#fGeoTxt").textContent = "📍 Localisation…";
  try { addGeo = await geoNow(); $("#fGeoTxt").textContent = "📍 Position enregistrée ✓"; }
  catch(e){ addGeo = null; $("#fGeoTxt").textContent = "Position introuvable — on localisera le lieu par son nom."; }
});
$("#formAdd").addEventListener("submit", async e => {
  e.preventDefault();
  const t = $("#fT").value.trim(); if (!t) return;
  const p = $("#fP").value.trim();
  const it = { i: "c" + Date.now(), t, p, k: $("#fK").value.trim().toUpperCase(), c: $("#fC").value, r: $("#fR").value, d: $("#fD").value.trim() };
  if (addGeo) it.x = addGeo;
  else if (navigator.onLine && (p || t)){ try { const x = await geocode(p || t); if (x) it.x = x; } catch(err){} }
  state.custom.push(it); save();
  $("#dlgAdd").close(); $("#formAdd").reset();
  refresh();
  toast(`＋ « ${t} » ajouté${it.x ? "" : " (sans position sur la carte)"}`, "Voir", () => openItem(it.i));
});

/* ================= clics : un seul gestionnaire pour toute l'app ================= */
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g){ e.preventDefault(); closeDialogs(); go(g.dataset.go); return; }
  const c = e.target.closest("[data-close]");
  if (c){ const d = c.closest("dialog"); if (d) d.close(); return; }
  const a = e.target.closest("[data-act]");
  if (!a) return;
  const id = a.dataset.i != null ? asId(a.dataset.i) : null;
  switch (a.dataset.act){
    case "open": openItem(id); break;
    case "check": e.stopPropagation(); toggleDone(id); break;
    case "didit": toggleDone(id, plannedDate(byId(id))); break;
    case "day": openDay(id, a.dataset.date); break;
    case "unplan": { const it = byId(id), prev = state.planned[id], meta = state.plannedMeta[id];
      setPlanned(id, null); refresh(); toast("Sortie annulée : " + it.t, "Annuler", () => { state.planned[id] = prev; if (meta) state.plannedMeta[id] = meta; save(); refresh(); }); break; }
    case "vote": { const v = +a.dataset.v; setVote(id, myVote(id) === v ? 0 : v); refresh();
      if (v > 0 && otherVote(id) > 0 && myVote(id) === v) toast("💞 Envie commune avec " + nameOf(other()) + " !"); break; }
    case "heart": { const nv = myVote(id) > 0 ? 0 : 1; setVote(id, nv);
      a.classList.toggle("on", nv > 0); a.textContent = nv > 0 ? "❤️" : "🤍"; renderPill();
      if (nv > 0) toast(otherVote(id) > 0 ? "💞 Envie commune avec " + nameOf(other()) + " !" : "❤️ Ajouté à vos envies"); break; }
    case "random": { const pool = allItems().filter(it => !isDone(it) && matches(it));
      if (!pool.length){ toast("Rien à tirer au sort avec ces filtres"); break; }
      openItem(pool[Math.floor(Math.random() * pool.length)].i); break; }
    case "remind": remindEvent(byId(id)); break;
    case "card": openCard(id); break;
    case "cardShare": shareCard(); break;
    case "cardSave": if (cardBlob){ saveFile(cardBlob, cardName); toast("⬇ Image enregistrée"); } break;
    case "wkplan": case "wkshare": case "wkics": { const c = wkShown[+a.dataset.k]; if (!c) break;
      if (a.dataset.act === "wkplan") wkPlan(c); else if (a.dataset.act === "wkshare") shareText(wkText(c)); else wkICS(c); break; }
    case "addph": photoTarget = id; $("#filePhoto").click(); break;
    case "onmap": showOnMap(id); break;
    case "del": removeItem(id); break;
    case "shuffle": dec.jit.clear(); runDecider(); break;
    case "editHome": openSettings("home"); break;
    case "settings": openSettings(); break;
    case "geoHome": geoNow().then(([lat, lng]) => setHome({ name: "Ma position", lat, lng, geo: true }), () => toast("Position introuvable — choisissez une gare.")); break;
    case "plan": planIt(); break;
    case "sharePlan": sharePlan(); break;
    case "ics": downloadICS(); break;
    case "dvote": deckVote(+a.dataset.v); break;
    case "dundo": deckUndo(); break;
    case "saveNames": saveNames(a); break;
    case "sendCode": sendCode().catch(() => toast("❌ Impossible de créer le code.")); break;
    case "pasteCode": pasteCodeUI(); break;
    case "clipPaste": navigator.clipboard.readText().then(t => { $("#codeIn").value = t; }).catch(() => toast("Collez le code à la main dans le cadre")); break;
    case "mergeCode": mergeCode(); break;
    case "copyCode": navigator.clipboard.writeText($("#codeZone").dataset.text || "").then(() => toast("📋 Message copié — collez-le dans votre messagerie"), () => toast("Sélectionnez le code et copiez-le")); break;
    case "export": exportData(false); break;
    case "exportPh": exportData(hasPhotos()); break;
    case "import": $("#fileImport").click(); break;
    case "restoreHidden": state.hidden = []; save(); closeDialogs(); refresh(); toast("↩︎ Idées restaurées"); break;
    case "backupNow": exportData(hasPhotos() && confirm("Inclure les photos dans la sauvegarde ?\n\nOK = avec photos (fichier plus lourd)\nAnnuler = données seulement")); break;
    case "backupLater": state.backupSnooze = new Date().toISOString(); save(); renderHome(); break;
    case "print": printBook(); break;
    case "spretry": case "spwide": { const it = byId(id); if (it) loadSurPlace(it, a.dataset.sel, +a.dataset.r || 1500, a.dataset.sel.startsWith("#dsp") ? 2 : 5); break; }
  }
});
$("#tabbar").addEventListener("click", e => { const b = e.target.closest("button[data-v]"); if (b) go(b.dataset.v); });
$("#btnSettings").addEventListener("click", () => openSettings());
$$("dialog").forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); }));   // clic sur le fond = fermer

/* ================= service worker : hors ligne + mises à jour visibles ================= */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")){
  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("./sw.js").then(reg => {
    document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController){ hadController = true; return; }       // première installation : rien à recharger
    toast("✨ Nouvelle version de l’app disponible", "Mettre à jour", () => location.reload(), 20000);
  });
}

/* ================= démarrage ================= */
(async function boot(){
  const t = todayYmd();
  for (const k of Object.keys(state.pack)) if ((k.split("|")[1] || "") < t) delete state.pack[k];   // listes « à emporter » passées
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  await loadPhotoIndex();
  newBadges();                                                // première fois : mémorise les badges déjà mérités
  const v = new URLSearchParams(location.search).get("v");   // raccourcis de l'icône (manifest)
  if (["home", "explore", "map", "couple", "souv"].includes(v)) go(v); else renderView();
})();
