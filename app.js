(() => {
'use strict';

/* ---------- Icons ---------- */
const P = {
  flash: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  flashOff: '<path d="M13 3 9.6 7.5M7.3 10.6 5 13.5h6L10 21l3.2-4.2M15.6 13.4 18 10.5h-6l.4-3"/><path d="m3 3 18 18"/>',
  flashAuto: '<path d="M11 3 4 12.5h5L8 20l7-9.5h-5z"/><path d="M16 21l2.5-7 2.5 7M16.8 19h3.4"/>',
  torch: '<path d="M8 3h8v4l-2 3v11h-4V10L8 7z"/><path d="M8 7h8M12 13v2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>',
  grid: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  flip: '<path d="M4 9a8 8 0 0 1 14.3-3.3L20 8M20 4v4h-4M20 15a8 8 0 0 1-14.3 3.3L4 16M4 20v-4h4"/>',
  move: '<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
  map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  pin: '<path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.3c1.6.6 2.7 2.2 3 4.7"/>',
  nav: '<path d="M20 4 3 11l7.5 2.5L13 21z"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 18 5-5 4 4 2.5-2.5L20 18"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="17.5" cy="5.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/><path d="m8.3 10.8 7-4M8.3 13.2l7 4"/>',
  more: '<circle cx="5.5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18.5" cy="12" r="1.3"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
  tap: '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11M12 10V8.5a1.5 1.5 0 0 1 3 0V11M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a6 6 0 0 1-5-2.7L4 15.2a1.5 1.5 0 0 1 2.4-1.8L9 16V11"/>',
  folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
  addUser: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5M18 8v6M15 11h6"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
  sub: '<path d="M6 4v8a3 3 0 0 0 3 3h10M15 11l4 4-4 4"/>',
  doc: '<path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z"/><path d="M14 3.5V8h4M9 12.5h6M9 16h6"/>'
};
const ic = (n, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/* ---------- Helpers ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const PIN_COLORS = ['#FF7A2F', '#2ED3B7', '#7C8CFF', '#FFC83D', '#FF5CA8', '#5CD3FF'];
const AV_COLORS = ['#FF7A2F', '#2ED3B7', '#7C8CFF', '#FFC83D', '#FF5CA8'];
const PAGE = 6;

const cityOfP = (p) => (p.addr && p.addr.city) || cityOf(p.address);
function cityOf(address) {
  const last = (address || '').split(',').pop().trim();
  return last.replace(/^\d{4,5}\s*/, '').trim();
}
function relTime(ts) {
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.round(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d = Math.round(h / 24);
  if (d < 7) return d === 1 ? 'gestern' : `vor ${d} Tagen`;
  return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}
const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join('') || '?';
const avatars = (members, max = 3) => `<div class="avs">${members.slice(0, max).map((m, i) => `<span class="av" style="background:${AV_COLORS[i % AV_COLORS.length]}">${esc(initials(m.name))}</span>`).join('')}</div>`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/* ---------- Storage (IndexedDB, falls back to memory) ---------- */
let idb = null;
function openDb() {
  return new Promise((res) => {
    try {
      const r = indexedDB.open('pinsnap', 1);
      r.onupgradeneeded = () => { r.result.createObjectStore('kv'); r.result.createObjectStore('blobs'); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch { res(null); }
  });
}
function tx(store, mode, fn) {
  return new Promise((res) => {
    if (!idb) return res(undefined);
    try {
      const t = idb.transaction(store, mode);
      const req = fn(t.objectStore(store));
      t.oncomplete = () => res(req && req.result);
      t.onerror = () => res(undefined);
    } catch { res(undefined); }
  });
}
const kvGet = (k) => tx('kv', 'readonly', (s) => s.get(k));
const kvSet = (k, v) => tx('kv', 'readwrite', (s) => s.put(v, k));
const blobSet = (k, v) => tx('blobs', 'readwrite', (s) => s.put(v, k));
const blobDel = (k) => tx('blobs', 'readwrite', (s) => s.delete(k));
function blobAll() {
  return new Promise((res) => {
    if (!idb) return res([]);
    try {
      const out = [];
      const t = idb.transaction('blobs', 'readonly');
      const c = t.objectStore('blobs').openCursor();
      c.onsuccess = () => { const cur = c.result; if (cur) { out.push([cur.key, cur.value]); cur.continue(); } };
      t.oncomplete = () => res(out);
      t.onerror = () => res(out);
    } catch { res([]); }
  });
}

/* ---------- State ---------- */
let projects = [];
const urls = new Map(); // photoId -> object URL
const photoSrc = (id) => urls.get(id) || '';
let saveTimer;
function persist() { clearTimeout(saveTimer); saveTimer = setTimeout(() => kvSet('projects', JSON.stringify(projects)), 150); }
const getP = (id) => projects.find((p) => p.id === id);
function touch(p) { p.updatedAt = Date.now(); persist(); }
const cover = (p) => p.photos[p.rootPhotoIds[0]];
const countPins = (p) => Object.values(p.photos).reduce((n, ph) => n + ph.pins.length, 0);

function createProject(name, address, location) {
  const now = Date.now();
  const p = { id: uid(), name: name.trim() || `Projekt ${new Date(now).toLocaleDateString('de-DE')}`, address: (address || '').trim(), location: location || null, createdAt: now, updatedAt: now, rootPhotoIds: [], photos: {}, members: [] };
  projects.unshift(p); persist();
  return p;
}
function addPhoto(p, { id, blob, w, h }, parent) {
  p.photos[id] = { id, w, h, notes: '', pins: [], parent: parent || null, createdAt: Date.now() };
  urls.set(id, URL.createObjectURL(blob));
  blobSet(id, blob);
  if (parent) { const pin = p.photos[parent.photoId]?.pins.find((x) => x.id === parent.pinId); pin && pin.photoIds.push(id); }
  else p.rootPhotoIds.push(id);
  touch(p);
}
function descendants(p, photoId, acc = new Set()) {
  if (acc.has(photoId)) return acc;
  acc.add(photoId);
  p.photos[photoId]?.pins.forEach((pin) => pin.photoIds.forEach((x) => descendants(p, x, acc)));
  return acc;
}
function dropPhotos(p, ids) {
  ids.forEach((id) => { delete p.photos[id]; blobDel(id); const u = urls.get(id); u && URL.revokeObjectURL(u); urls.delete(id); });
  Object.values(p.photos).forEach((ph) => ph.pins.forEach((pin) => { pin.photoIds = pin.photoIds.filter((x) => !ids.has(x)); }));
  p.rootPhotoIds = p.rootPhotoIds.filter((x) => !ids.has(x));
}
function deletePhoto(p, photoId) { dropPhotos(p, descendants(p, photoId)); touch(p); }
function deletePin(p, photoId, pinId) {
  const ph = p.photos[photoId]; const pin = ph?.pins.find((x) => x.id === pinId);
  if (!pin) return;
  const ids = new Set(); pin.photoIds.forEach((x) => descendants(p, x, ids));
  ph.pins = ph.pins.filter((x) => x.id !== pinId);
  dropPhotos(p, ids); touch(p);
}
function deleteProject(id) {
  const p = getP(id); if (!p) return;
  dropPhotos(p, new Set(Object.keys(p.photos)));
  projects = projects.filter((x) => x.id !== id); persist();
}
function addPin(p, photoId, x, y, label) {
  const ph = p.photos[photoId]; const n = ph.pins.length;
  const pin = { id: uid(), x, y, label: label.trim() || `Pin ${n + 1}`, color: PIN_COLORS[n % PIN_COLORS.length], photoIds: [], createdAt: Date.now() };
  ph.pins.push(pin); touch(p);
  return pin;
}
function trail(p, photoId) {
  const out = []; let cur = p.photos[photoId]; const seen = new Set();
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    const parent = cur.parent ? p.photos[cur.parent.photoId] : null;
    out.unshift({ photo: cur, pin: parent?.pins.find((x) => x.id === cur.parent.pinId), parentId: parent?.id });
    cur = parent;
  }
  return out;
}

/* ---------- Image processing ---------- */
function loadImage(src) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
}
async function processFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const im = await loadImage(url);
    const max = 2400; const s = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
    const w = Math.round(im.naturalWidth * s), h = Math.round(im.naturalHeight * s);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').drawImage(im, 0, 0, w, h);
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.85));
    return { blob: blob || file, w, h };
  } finally { URL.revokeObjectURL(url); }
}

/* ---------- Router (in-page history) ---------- */
let stack = [{ v: 'home', q: {} }];
const cur = () => stack[stack.length - 1];
const ui = { query: '', filter: 'all', city: null, visible: PAGE, placing: false, moving: null, active: 0, role: 'Bearbeiten', form: null, lastPos: null };
function go(v, q = {}) { stack.push({ v, q }); ui.placing = false; ui.moving = null; render(true); }
function replace(v, q = {}) { stack[stack.length - 1] = { v, q }; ui.placing = false; render(true); }
function back() { if (stack.length > 1) stack.pop(); ui.placing = false; ui.moving = null; render(true); }
function home() { stack = [{ v: 'home', q: {} }]; render(true); }
function toProject(id) { const i = stack.findIndex((s) => s.v === 'project' && s.q.id === id); if (i >= 0) { stack = stack.slice(0, i + 1); render(true); } else go('project', { id }); }

const $app = document.getElementById('app');
const $layer = document.getElementById('layer');
function render(scrollTop) {
  const { v, q } = cur();
  const html = (VIEWS[v] || VIEWS.home)(q);
  $app.innerHTML = html.body;
  $layer.innerHTML = html.bar ? `<div class="bar ${html.fade ? 'fade' : ''}"><div class="bar-inner ${html.split ? 'split' : ''}">${html.bar}</div></div>` : '';
  if (scrollTop) window.scrollTo(0, 0);
  html.after && html.after();
}

/* ---------- Pieces ---------- */
function topbar(title, right = '') {
  return `<div class="topbar"><button class="icon-btn plain" data-a="back" aria-label="Zurück">${ic('back', 22)}</button><h1>${esc(title)}</h1>${right}</div>`;
}
function empty(icon, title, text) {
  return `<div class="empty"><div class="ic">${ic(icon, 28)}</div><b>${esc(title)}</b><p>${esc(text)}</p></div>`;
}
function pinnedImage(p, ph, { placing = false, hl = null, labels = true, clickable = true, maxH = null } = {}) {
  const ar = ph.w && ph.h ? `${ph.w} / ${ph.h}` : '4 / 3';
  const style = maxH ? `aspect-ratio:${ar};height:${maxH}px;width:auto;margin:0 auto;` : `aspect-ratio:${ar};`;
  const pins = ph.pins.map((pin, i) => `
    <div class="pin ${hl && hl !== pin.id ? 'dim' : ''} ${hl === pin.id ? 'hl' : ''}" style="left:${pin.x * 100}%;top:${pin.y * 100}%">
      <span class="pulse" style="background:${pin.color}"></span>
      ${clickable ? `<button class="dot" style="background:${pin.color}" data-a="openPin" data-photo="${ph.id}" data-pin="${pin.id}" aria-label="Pin ${i + 1}: ${esc(pin.label)}">` : `<span class="dot" style="background:${pin.color}">`}${i + 1}${pin.photoIds.length ? `<span class="cnt">${pin.photoIds.length}</span>` : ''}${clickable ? '</button>' : '</span>'}
      ${labels ? `<span class="lbl">${esc(pin.label)}</span>` : ''}
    </div>`).join('');
  return `<div class="pimg ${placing ? 'placing' : ''}" style="${style}" ${placing ? `data-place="${ph.id}"` : ''}><img src="${photoSrc(ph.id)}" alt="">${pins}</div>`;
}
function crumbs(p, photoId, pinLabel) {
  const items = [`<button class="crumb" data-a="toProject" data-id="${p.id}">${ic('folder', 14)}<span>${esc(p.name)}</span></button>`];
  trail(p, photoId).forEach(({ pin, parentId }) => {
    if (pin) items.push(`<button class="crumb" data-a="openPin" data-photo="${parentId}" data-pin="${pin.id}"><i class="pdot" style="background:${pin.color};width:9px;height:9px;border-width:0"></i><span>${esc(pin.label)}</span></button>`);
  });
  if (pinLabel) items.push(`<span class="crumb cur"><span>${esc(pinLabel)}</span></span>`);
  return `<nav class="crumbs" aria-label="Pfad">${items.join(`<span class="sep">${ic('chev', 12)}</span>`)}</nav>`;
}

/* ---------- Views ---------- */
const VIEWS = {
  home() {
    const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);
    const cities = [...new Set(projects.map(cityOfP).filter(Boolean))].sort();
    const q = ui.query.trim().toLowerCase();
    const filtered = sorted.filter((p) =>
      !(ui.filter === 'shared' && !p.members.length) && !(ui.filter === 'gps' && !p.location) &&
      !(ui.city && cityOfP(p) !== ui.city) && !(q && !`${p.name} ${p.address}`.toLowerCase().includes(q)));
    const isF = !!q || ui.filter !== 'all' || !!ui.city;
    const photos = projects.reduce((n, p) => n + Object.keys(p.photos).length, 0);
    const pins = projects.reduce((n, p) => n + countPins(p), 0);

    const hero = (p) => {
      const c = cover(p);
      return `<button class="hero" data-a="toProject" data-id="${p.id}">
        ${c ? `<img src="${photoSrc(c.id)}" alt="">` : `<div class="ph">${ic('camera', 40)}</div>`}
        <div class="shade"></div>
        <div class="top"><span class="row" style="gap:6px"><span class="pill"><span style="color:var(--accent)">${ic('pin', 13)}</span>${countPins(p)}</span>${p.demo ? '<span class="pill tag-demo">Beispiel</span>' : ''}</span>${p.members.length ? avatars(p.members) : ''}</div>
        <div class="bottom"><div class="name">${esc(p.name)}</div><div class="meta">${esc(p.address || 'Keine Adresse')} · ${relTime(p.updatedAt)}</div></div>
      </button>`;
    };
    const rowItem = (p) => {
      const c = cover(p);
      return `<button class="prow" data-a="toProject" data-id="${p.id}">
        <div class="thumb">${c ? `<img src="${photoSrc(c.id)}" alt="">` : ic('image', 22)}</div>
        <div class="grow"><div class="t">${esc(p.name)}</div><div class="a">${esc(p.address || 'Keine Adresse')}</div>
          <div class="metas"><span>${ic('image', 13)}${Object.keys(p.photos).length}</span><span>${ic('pin', 13)}${countPins(p)}</span>${p.members.length ? `<span style="color:var(--teal)">${ic('users', 13)}${p.members.length}</span>` : ''}${p.location ? `<span>${ic('nav', 13)}GPS</span>` : ''}</div></div>
        <span style="color:var(--faint)">${ic('chev', 18)}</span>
      </button>`;
    };

    const body = `<div class="stack" style="padding-top:8px">
      <div class="row between"><div><h1 class="brand">Pin<span>Snap</span></h1><div class="sub">${plural(projects.length, 'Projekt', 'Projekte')} · ${plural(photos, 'Foto', 'Fotos')} · ${plural(pins, 'Pin', 'Pins')}</div></div>
        <button class="icon-btn" data-a="quickShot" aria-label="Schnell-Foto">${ic('camera', 22)}</button></div>
      <label class="search">${ic('search', 18)}<input id="q" type="search" placeholder="Projekt, Adresse oder Ort suchen" value="${esc(ui.query)}" autocomplete="off"></label>
      <div class="chips">
        <button class="chip ${ui.filter === 'all' && !ui.city ? 'on' : ''}" data-a="filter" data-f="all">Alle</button>
        <button class="chip ${ui.filter === 'shared' ? 'on' : ''}" data-a="filter" data-f="shared">${ic('users', 14)}Geteilt</button>
        <button class="chip ${ui.filter === 'gps' ? 'on' : ''}" data-a="filter" data-f="gps">${ic('nav', 14)}Mit GPS</button>
        ${cities.map((c) => `<button class="chip ${ui.city === c ? 'on' : ''}" data-a="city" data-c="${esc(c)}">${ic('pin', 14)}${esc(c)}</button>`).join('')}
      </div>
      ${!projects.length ? empty('image', 'Noch keine Projekte', 'Erstelle dein erstes Projekt, mach ein Foto und markiere Details mit Pins.') : `
        ${!isF ? `<h2 class="section">Zuletzt bearbeitet</h2><div class="carousel">${sorted.slice(0, 5).map(hero).join('')}</div>` : ''}
        <h2 class="section" style="margin-top:12px">${isF ? plural(filtered.length, 'Treffer', 'Treffer') : 'Alle Projekte'}</h2>
        ${filtered.length ? `<div class="stack" style="gap:10px">${filtered.slice(0, ui.visible).map(rowItem).join('')}</div>` : empty('search', 'Nichts gefunden', 'Passe Suche oder Filter an.')}
        ${filtered.length > ui.visible ? `<button class="btn secondary" data-a="more">Mehr anzeigen (${filtered.length - ui.visible})</button>` : ''}`}
      <button class="btn ghost" data-a="examples" style="margin-top:8px;color:var(--dim);font-weight:600">${ic('image', 16)}Beispielprojekte hinzufügen</button>
    </div>`;
    return {
      body, fade: true,
      bar: `<button class="btn primary big" data-a="newProject">${ic('plus', 22)}Neues Projekt</button>`,
      after() {
        const el = document.getElementById('q');
        el.addEventListener('input', () => { ui.query = el.value; ui.visible = PAGE; const pos = el.selectionStart; render(); const n = document.getElementById('q'); n.focus(); try { n.setSelectionRange(pos, pos); } catch {} });
      }
    };
  },

  newProject() {
    const body = `${topbar('Neues Projekt')}<div class="stack">
      <p class="muted" style="margin:0;font-size:15px">Gib deinem Projekt einen Namen oder leg direkt mit der Kamera los.</p>
      ${addrFormHtml()}
    </div>`;
    return {
      body,
      bar: `<button class="btn primary big" data-a="startNew">${ic('camera', 22)}Start: Kamera öffnen</button><button class="btn ghost" data-a="startSkip">Ohne Angaben direkt zur Kamera</button>`,
      after: bindAddrForm
    };
  },

  editProject({ id }) {
    const p = getP(id);
    if (!p) return { body: topbar('Bearbeiten') + empty('folder', 'Projekt nicht gefunden', '') };
    return {
      body: `${topbar('Projekt bearbeiten')}<div class="stack">${addrFormHtml()}</div>`,
      bar: `<button class="btn primary big" data-a="saveEdit">${ic('check', 22)}Speichern</button>`,
      after: bindAddrForm
    };
  },

  project({ id }) {
    const p = getP(id);
    if (!p) return { body: topbar('') + empty('folder', 'Projekt nicht gefunden', 'Es wurde vielleicht gelöscht.') };
    const roots = p.rootPhotoIds.map((x) => p.photos[x]).filter(Boolean);
    const idx = Math.min(ui.active, Math.max(0, roots.length - 1));
    const c = roots[idx];
    const tree = [];
    const seen = new Set();
    const walk = (ph, d) => { if (!ph || seen.has(ph.id)) return; seen.add(ph.id); ph.pins.forEach((pin) => { tree.push({ pin, ph, d }); pin.photoIds.forEach((x) => walk(p.photos[x], d + 1)); }); };
    roots.forEach((r) => walk(r, 0));

    const body = `${topbar('', `<button class="icon-btn" data-a="share" data-id="${p.id}" aria-label="Teilen">${ic('share', 20)}</button><button class="icon-btn" data-a="projectMenu" data-id="${p.id}" aria-label="Mehr">${ic('more', 20)}</button>`)}
    <div class="stack">
      <div class="stack" style="gap:6px">
        <div class="row" style="gap:8px">${p.demo ? '<span class="pill tag-demo">Beispiel</span>' : ''}</div>
        <h1 class="h-title">${esc(p.name)}</h1>
        <div class="row" style="gap:6px;color:var(--teal);font-weight:600;font-size:14px">${ic(p.location ? 'nav' : 'pin', 14)}<span class="grow" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.address || (p.location ? 'GPS-Standort' : 'Keine Adresse'))}</span></div>
        ${p.location ? `<div class="mono faint">${p.location.source === 'gps' ? 'GPS' : 'Position'} ${p.location.latitude.toFixed(5)}, ${p.location.longitude.toFixed(5)}</div>` : ''}
      </div>
      ${p.location ? mapHtml(p.location, 140) : ''}
      <div class="stats">
        <div class="stat"><b>${Object.keys(p.photos).length}</b><small>Fotos</small></div>
        <div class="stat"><b>${countPins(p)}</b><small>Pins</small></div>
        <button class="team" data-a="share" data-id="${p.id}">${p.members.length ? avatars(p.members, 4) : `${ic('addUser', 16)}Team`}</button>
      </div>
      ${c ? `
        ${pinnedImage(p, c)}
        <div class="row between"><span class="faint grow">${c.pins.length ? 'Tippe auf einen Pin, um die Detailfotos zu sehen.' : 'Noch keine Pins auf diesem Foto.'}</span>
          <button class="row" style="gap:4px;color:var(--accent);font-weight:700;font-size:13px" data-a="openPhoto" data-photo="${c.id}">${ic('edit', 14)}Pins & Notizen</button></div>
        ${c.notes ? `<div class="note-box">${esc(c.notes)}</div>` : ''}` :
        `<div class="dashed">${empty('camera', 'Noch kein Foto', 'Das erste Foto wird zum Titelbild des Projekts.')}</div>`}
      ${roots.length > 1 ? `<div class="stack" style="gap:10px"><span class="label">Hauptfotos (${roots.length})</span><div class="thumbs">${roots.map((r, i) => `<button class="rthumb ${i === idx ? 'on' : ''}" data-a="activeRoot" data-i="${i}" aria-label="Hauptfoto ${i + 1}"><img src="${photoSrc(r.id)}" alt="">${r.pins.length ? `<span class="b">${r.pins.length}</span>` : ''}</button>`).join('')}</div></div>` : ''}
      ${tree.length ? `<div class="stack" style="gap:8px"><span class="label">Alle Markierungen</span>${tree.map(({ pin, ph, d }) => {
        const f = pin.photoIds[0];
        return `<button class="pinrow" style="margin-left:${d * 18}px;width:calc(100% - ${d * 18}px)" data-a="openPin" data-photo="${ph.id}" data-pin="${pin.id}">
          ${d ? `<span style="color:var(--faint)">${ic('sub', 14)}</span>` : ''}<i class="pdot" style="background:${pin.color}"></i><span class="t">${esc(pin.label)}</span>
          ${f ? `<img class="mini" src="${photoSrc(f)}" alt="">` : '<span class="faint">kein Foto</span>'}<span class="muted" style="font-weight:700;min-width:14px;text-align:right">${pin.photoIds.length}</span></button>`;
      }).join('')}</div>` : ''}
      <p class="faint" style="text-align:center;margin:8px 0 0">Zuletzt geändert ${relTime(p.updatedAt)}</p>
    </div>`;
    return {
      body,
      bar: `<button class="btn primary big" data-a="shoot" data-id="${p.id}">${ic('camera', 22)}${roots.length ? 'Weiteres Hauptfoto' : 'Erstes Foto aufnehmen'}</button>`
    };
  },

  photo({ projectId, photoId, fresh }) {
    const p = getP(projectId); const ph = p?.photos[photoId];
    if (!ph) return { body: topbar('Foto') + empty('image', 'Foto nicht gefunden', 'Es wurde vielleicht gelöscht.') };
    const body = `${topbar(fresh ? 'Neues Foto' : 'Foto', `<button class="icon-btn plain" style="color:var(--danger)" data-a="delPhoto" aria-label="Foto löschen">${ic('trash', 20)}</button>`)}
    <div class="stack">
      ${crumbs(p, photoId)}
      ${fresh && !ui.placing && !ph.pins.length ? `<div class="hint teal"><span style="color:var(--teal)">${ic('check', 18)}</span><span>Foto gespeichert. Füge Notizen hinzu oder markiere Details mit „Pins hinzufügen“.</span></div>` : ''}
      ${pinnedImage(p, ph, { placing: ui.placing || !!ui.moving, hl: ui.moving })}
      ${ui.moving ? `<div class="hint"><span style="color:var(--accent)">${ic('move', 18)}</span><span>Tippe auf die neue Position für „${esc(ph.pins.find((x) => x.id === ui.moving)?.label || '')}“.</span></div>` : ui.placing ? `<div class="hint"><span style="color:var(--accent)">${ic('tap', 18)}</span><span>Tippe auf die Stelle im Bild, die du markieren möchtest.</span></div>` :
        `<p class="muted" style="text-align:center;margin:0">Aufgenommen ${relTime(ph.createdAt)} · ${plural(ph.pins.length, 'Pin', 'Pins')}</p>`}
      <div class="card stack" style="gap:6px"><span class="label row" style="gap:6px">${ic('edit', 14)}Notizen</span>
        <textarea class="notes" id="notes" placeholder="Was ist auf dem Foto zu sehen? Mängel, Maße, To-dos …">${esc(ph.notes)}</textarea></div>
      ${ph.pins.length ? `<div class="stack" style="gap:8px"><span class="label">Pins auf diesem Foto</span>${ph.pins.map((pin, i) => `
        <button class="pinrow" data-a="openPin" data-photo="${ph.id}" data-pin="${pin.id}"><span class="pnum" style="background:${pin.color}">${i + 1}</span><span class="t">${esc(pin.label)}</span><span class="muted">${plural(pin.photoIds.length, 'Foto', 'Fotos')}</span><span style="color:var(--faint)">${ic('chev', 16)}</span></button>`).join('')}</div>` : ''}
    </div>`;
    return {
      body, split: true,
      bar: ui.moving ? `<button class="btn secondary" data-a="cancelMove">${ic('x', 18)}Verschieben abbrechen</button>` : `<button class="btn ${ui.placing ? 'secondary' : 'primary'}" data-a="togglePlace">${ic(ui.placing ? 'check' : 'pin', 18)}${ui.placing ? 'Fertig' : 'Pins hinzufügen'}</button>
            <button class="btn secondary" data-a="shootSame">${ic('camera', 18)}${ph.parent ? 'Weiteres Detail' : 'Weiteres Foto'}</button>`,
      after() {
        const t = document.getElementById('notes'); let tm;
        t.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { ph.notes = t.value; touch(p); }, 400); });
        t.addEventListener('blur', () => { if (ph.notes !== t.value) { ph.notes = t.value; touch(p); } });
      }
    };
  },

  pin({ projectId, photoId, pinId }) {
    const p = getP(projectId); const host = p?.photos[photoId]; const pin = host?.pins.find((x) => x.id === pinId);
    if (!pin) return { body: topbar('Pin') + empty('pin', 'Pin nicht gefunden', 'Er wurde vielleicht gelöscht.') };
    const n = host.pins.indexOf(pin) + 1;
    const details = pin.photoIds.map((x) => p.photos[x]).filter(Boolean);
    const body = `${topbar(pin.label, `<button class="icon-btn plain" data-a="movePin" aria-label="Pin verschieben">${ic('move', 20)}</button><button class="icon-btn plain" data-a="renamePin" aria-label="Umbenennen">${ic('edit', 20)}</button><button class="icon-btn plain" style="color:var(--danger)" data-a="delPin" aria-label="Pin löschen">${ic('trash', 20)}</button>`)}
    <div class="stack" style="gap:18px">
      ${crumbs(p, photoId, pin.label)}
      <div class="row" style="gap:14px"><span class="pnum" style="background:${pin.color};width:44px;height:44px;font-size:18px;border:3px solid var(--white)">${n}</span><h1 class="h-title grow" style="font-size:26px">${esc(pin.label)}</h1></div>
      <div role="button" tabindex="0" data-a="openPhoto" data-photo="${photoId}" style="cursor:pointer" aria-label="Ausgangsfoto öffnen">
        ${pinnedImage(p, host, { hl: pin.id, labels: false, clickable: false, maxH: 220 })}
        <span class="faint" style="display:block;text-align:center;margin-top:8px">Position auf dem Ausgangsfoto · antippen zum Öffnen</span></div>
      <span class="label">${plural(details.length, 'Detailfoto', 'Detailfotos')}</span>
      ${details.length ? `<div class="grid2">${details.map((d) => `<button class="tile" data-a="openPhoto" data-photo="${d.id}"><img src="${photoSrc(d.id)}" alt=""><span class="info">${d.pins.length ? `<span class="pill"><span style="color:var(--accent)">${ic('pin', 11)}</span>${plural(d.pins.length, 'Unter-Pin', 'Unter-Pins')}</span>` : ''}${d.notes ? `<span class="note">${esc(d.notes)}</span>` : ''}</span></button>`).join('')}</div>`
        : empty('camera', 'Noch keine Detailfotos', 'Fotografiere diese Stelle aus der Nähe. Auf Detailfotos kannst du wieder Unter-Pins setzen.')}
    </div>`;
    return { body, bar: `<button class="btn primary big" data-a="shootPin">${ic('camera', 22)}Foto an dieser Stelle aufnehmen</button>` };
  },

  share({ id }) {
    const p = getP(id);
    if (!p) return { body: topbar('Teilen') + empty('share', 'Projekt nicht gefunden', '') };
    const body = `${topbar('Teilen & Team')}<div class="stack" style="gap:22px">
      <div class="card stack" style="gap:10px">
        <b style="font-family:var(--display);font-size:18px">Kollegen einladen</b>
        <input class="input" id="mName" placeholder="Name" autocomplete="off">
        <input class="input" id="mContact" placeholder="E-Mail oder Telefon (optional)" autocomplete="off" inputmode="email">
        <div class="roles">${['Bearbeiten', 'Ansehen'].map((r) => `<button class="role ${ui.role === r ? 'on' : ''}" data-a="role" data-r="${r}">${ic(r === 'Bearbeiten' ? 'edit' : 'eye', 16)}Darf ${r.toLowerCase()}</button>`).join('')}</div>
        <button class="btn primary" data-a="addMember">${ic('addUser', 18)}Zum Team hinzufügen</button>
      </div>
      <div class="stack" style="gap:10px"><span class="label">Team (${p.members.length})</span>
        ${p.members.length ? p.members.map((m, i) => `<div class="member"><span class="av" style="background:${AV_COLORS[i % AV_COLORS.length]}">${esc(initials(m.name))}</span><div class="grow"><b>${esc(m.name)}</b><div class="muted">${esc(m.role)}${m.contact ? ` · ${esc(m.contact)}` : ''}</div></div><button class="icon-btn plain" data-a="rmMember" data-m="${m.id}" aria-label="${esc(m.name)} entfernen">${ic('x', 18)}</button></div>`).join('') : '<p class="muted" style="margin:0">Noch niemand im Team.</p>'}
      </div>
      <button class="btn primary" data-a="shareNative">${ic('share', 18)}Projekt senden (WhatsApp, Mail …)</button>
      <div class="card stack" style="gap:10px">
        <div class="row between"><b class="row" style="gap:8px">${ic('doc', 18)}Projektbericht</b><button class="btn secondary auto" style="height:38px" data-a="copyReport">${ic('copy', 16)}Kopieren</button></div>
        <pre class="report" id="report">${esc(report(p))}</pre>
        <span class="faint">Kopieren und in WhatsApp, Mail oder Teams einfügen.</span>
      </div>
      <div class="hint teal"><span style="color:var(--teal)">${ic('users', 18)}</span><span style="font-weight:500">Live-Zusammenarbeit auf mehreren Handys kommt mit dem Cloud-Konto in der installierten App.</span></div>
    </div>`;
    return { body };
  }
};

/* ---------- Address search (OpenStreetMap / Photon), GPS, map preview ---------- */
const PHOTON = 'https://photon.komoot.io';
function featToAddr(f) {
  const pr = f.properties || {}; const [lon, lat] = f.geometry?.coordinates || [];
  const isStreet = pr.osm_key === 'highway' || pr.type === 'street';
  const street = pr.street || (isStreet ? pr.name : '') || '';
  const nr = pr.housenumber || '';
  const city = pr.city || pr.town || pr.village || pr.locality || pr.district || pr.county || '';
  const poi = !isStreet && pr.name && pr.name !== street ? pr.name : '';
  const line1 = [street, nr].filter(Boolean).join(' ') || pr.name || '';
  const line2 = [[pr.postcode, city].filter(Boolean).join(' '), pr.country].filter(Boolean).join(', ');
  return { street: street || (poi ? '' : pr.name || ''), nr, plz: pr.postcode || '', city, poi, lat, lon, line1: poi && street ? `${poi}, ${line1}` : line1, line2, kind: nr ? 'house' : isStreet ? 'street' : pr.type || 'place' };
}
async function geoSearch(q, signal) {
  const loc = ui.form?.loc || ui.lastPos;
  const bias = loc ? `&lat=${loc.latitude}&lon=${loc.longitude}&location_bias_scale=0.3` : '';
  const r = await fetch(`${PHOTON}/api/?q=${encodeURIComponent(q)}&lang=de&limit=7${bias}`, { signal });
  if (!r.ok) throw new Error('http');
  const j = await r.json(); const seen = new Set();
  return (j.features || []).map(featToAddr).filter((a) => { const k = a.line1 + '|' + a.line2; if (seen.has(k) || !a.line1) return false; seen.add(k); return true; });
}
async function geoReverse(lat, lon) {
  const r = await fetch(`${PHOTON}/reverse?lat=${lat}&lon=${lon}&lang=de&limit=1`);
  if (!r.ok) throw new Error('http');
  const j = await r.json(); return j.features?.[0] ? featToAddr(j.features[0]) : null;
}
function composeAddr(f) {
  const l1 = [f.street, f.nr].filter(Boolean).join(' ');
  const l2 = [f.plz, f.city].filter(Boolean).join(' ');
  return [l1, l2].filter(Boolean).join(', ');
}
function mapHtml(loc, h = 170) {
  const z = 17, n = 2 ** z;
  const xt = ((loc.longitude + 180) / 360) * n;
  const rad = (loc.latitude * Math.PI) / 180;
  const yt = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
  const x0 = Math.floor(xt) - 1, y0 = Math.floor(yt) - 1;
  const px = (xt - x0) * 256, py = (yt - y0) * 256;
  let tiles = '';
  for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++)
    tiles += `<img src="https://tile.openstreetmap.org/${z}/${x0 + dx}/${y0 + dy}.png" style="left:${dx * 256}px;top:${dy * 256}px" alt="" loading="lazy">`;
  const link = `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`;
  return `<div class="map" style="height:${h}px"><div class="tiles" style="left:calc(50% - ${px}px);top:calc(50% - ${py}px)">${tiles}</div>
    <span class="map-pin">${ic('pin', 30)}</span>
    <a class="map-open" href="${link}" target="_blank" rel="noopener">${ic('map', 14)}In Karten öffnen</a>
    <span class="map-attr">© OpenStreetMap</span></div>`;
}

function addrFormHtml() {
  const f = ui.form;
  const needNr = f.street && !f.nr;
  return `
    <label class="field"><span class="label">Projektname</span><input class="input" id="fName" placeholder="z. B. Hausrenovierung" value="${esc(f.name)}" autocomplete="off"></label>
    <div class="field"><span class="label">Adresse suchen</span>
      <div class="search-wrap"><label class="search">${ic('search', 18)}<input id="fQ" type="search" placeholder="Straße, Ort oder Firma eintippen" value="${esc(f.q)}" autocomplete="off" enterkeyhint="search"></label>
      <div id="sugg" class="sugg" hidden></div></div>
    </div>
    <div class="addr-grid">
      <label class="field street"><span class="label">Straße</span><input class="input" id="fStreet" value="${esc(f.street)}" autocomplete="off"></label>
      <label class="field nr"><span class="label">Nr.</span><input class="input ${needNr ? 'need' : ''}" id="fNr" value="${esc(f.nr)}" placeholder="12a" autocomplete="off" inputmode="text"></label>
    </div>
    <div class="addr-grid second">
      <label class="field plz"><span class="label">PLZ</span><input class="input" id="fPlz" value="${esc(f.plz)}" inputmode="numeric" autocomplete="off"></label>
      <label class="field city"><span class="label">Ort</span><input class="input" id="fCity" value="${esc(f.city)}" autocomplete="off"></label>
    </div>
    <p id="nrHint" class="nr-hint" ${needNr ? '' : 'hidden'}>${ic('edit', 14)}Im Vorschlag fehlt die Hausnummer. Trag sie oben bei „Nr.“ ein.</p>
    <div class="gps">
      <div class="ic ${f.loc ? 'ok' : ''}">${ic(f.loc ? 'check' : 'nav', 20)}</div>
      <div class="grow"><b>${f.loc ? (f.locSource === 'gps' ? 'GPS-Standort erfasst' : 'Position aus Adresse') : 'GPS-Standort'}</b>
        <div class="muted ${f.loc ? 'mono' : ''}">${f.loc ? `${f.loc.latitude.toFixed(5)}, ${f.loc.longitude.toFixed(5)}${f.loc.accuracy ? ` · ±${Math.round(f.loc.accuracy)} m` : ''}` : 'Erfasst deine Position und füllt die Adresse aus.'}</div></div>
      <button class="btn secondary auto" data-a="gps">${f.loc && f.locSource === 'gps' ? 'Neu' : 'Erfassen'}</button>
    </div>
    ${f.gpsMsg ? `<div class="hint">${ic('nav', 18)}<span>${esc(f.gpsMsg)}</span></div>` : ''}
    ${f.loc ? mapHtml(f.loc) + `<button class="btn ghost" data-a="gpsClear" style="height:36px">${ic('x', 16)}Position entfernen</button>` : ''}`;
}
function bindAddrForm() {
  const f = ui.form; const $ = (id) => document.getElementById(id);
  const bindField = (id, key) => $(id).addEventListener('input', (e) => {
    f[key] = e.target.value;
    if (key === 'nr' || key === 'street') { const need = f.street && !f.nr; $('fNr').classList.toggle('need', !!need); $('nrHint').hidden = !need; }
  });
  bindField('fName', 'name'); bindField('fStreet', 'street'); bindField('fNr', 'nr'); bindField('fPlz', 'plz'); bindField('fCity', 'city');
  const q = $('fQ'), box = $('sugg');
  let tm, ctrl, results = [];
  const show = (html) => { box.innerHTML = html; box.hidden = !html; };
  q.addEventListener('input', () => {
    f.q = q.value; clearTimeout(tm); ctrl && ctrl.abort();
    const text = q.value.trim();
    if (text.length < 3) { show(''); return; }
    show(`<div class="sugg-msg"><span class="spin sm"></span>Suche …</div>`);
    tm = setTimeout(async () => {
      ctrl = new AbortController();
      try {
        results = await geoSearch(text, ctrl.signal);
        show(results.length ? results.map((a, i) => `<button class="sugg-item" data-i="${i}"><span class="sugg-ic">${ic(a.kind === 'house' ? 'home' : a.kind === 'street' ? 'map' : 'pin', 16)}</span><span class="grow"><b>${esc(a.line1)}</b><small>${esc(a.line2)}</small></span>${a.nr ? '' : '<em>ohne Nr.</em>'}</button>`).join('') + '<div class="sugg-attr">Daten © OpenStreetMap</div>'
          : `<div class="sugg-msg">Keine Treffer. Du kannst die Adresse unten auch von Hand eintragen.</div>`);
      } catch (e) { if (e.name !== 'AbortError') show(`<div class="sugg-msg">Adresssuche gerade nicht erreichbar. Trag die Adresse unten von Hand ein.</div>`); }
    }, 300);
  });
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); box.querySelector('.sugg-item')?.click(); } });
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.sugg-item'); if (!it) return;
    const a = results[+it.dataset.i];
    Object.assign(f, { street: a.street, nr: a.nr, plz: a.plz, city: a.city, q: '' });
    if (a.poi && !f.name) f.name = a.poi;
    if (a.lat != null && f.locSource !== 'gps') { f.loc = { latitude: a.lat, longitude: a.lon }; f.locSource = 'adresse'; }
    render();
    if (!a.nr && a.street) { const nr = document.getElementById('fNr'); nr.focus(); nr.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  });
}
function freshForm(p) {
  const a = p?.addr || {};
  ui.form = { name: p?.name || '', q: '', street: a.street || '', nr: a.nr || '', plz: a.plz || '', city: a.city || '', loc: p?.location || null, locSource: p?.location?.source || '', gpsMsg: '' };
  if (p && !p.addr && p.address) { ui.form.street = p.address; } // old free-text address
}
function formToProject(p) {
  const f = ui.form;
  p.name = f.name.trim() || p.name || `Projekt ${new Date().toLocaleDateString('de-DE')}`;
  p.addr = { street: f.street.trim(), nr: f.nr.trim(), plz: f.plz.trim(), city: f.city.trim() };
  p.address = composeAddr(p.addr);
  p.location = f.loc ? { ...f.loc, source: f.locSource || 'gps' } : null;
}

function report(p) {
  const L = [p.name];
  if (p.address) L.push(`Adresse: ${p.address}`);
  if (p.location) L.push(`Karte: https://maps.google.com/?q=${p.location.latitude},${p.location.longitude}`);
  L.push(`${plural(Object.keys(p.photos).length, 'Foto', 'Fotos')} · ${plural(countPins(p), 'Pin', 'Pins')}`, '');
  const walk = (id, d) => {
    const ph = p.photos[id]; if (!ph) return;
    if (ph.notes) L.push(`${'  '.repeat(d)}Notiz: ${ph.notes}`);
    ph.pins.forEach((pin, i) => { L.push(`${'  '.repeat(d)}Pin ${i + 1}: ${pin.label} (${plural(pin.photoIds.length, 'Foto', 'Fotos')})`); pin.photoIds.forEach((x) => walk(x, d + 1)); });
  };
  p.rootPhotoIds.forEach((id, i) => { L.push(`Hauptfoto ${i + 1}`); walk(id, 1); });
  return L.join('\n');
}

/* ---------- Modals & toast ---------- */
let modalEl = null;
function modal(html, after) {
  closeModal();
  modalEl = document.createElement('div');
  modalEl.className = 'scrim';
  modalEl.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
  document.body.appendChild(modalEl);
  after && after(modalEl);
}
function closeModal() { modalEl && modalEl.remove(); modalEl = null; }
function confirmBox(title, text, ok, onOk) {
  modal(`<h2>${esc(title)}</h2><p class="muted" style="margin:0 0 6px">${esc(text)}</p><button class="btn danger" id="okB">${ic('trash', 18)}${esc(ok)}</button><button class="btn ghost" id="noB">Abbrechen</button>`,
    (m) => { m.querySelector('#okB').onclick = () => { closeModal(); onOk(); }; m.querySelector('#noB').onclick = closeModal; });
}
let toastT;
function toast(msg) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2200);
}

/* ---------- Camera via the phone's own camera app ---------- */
const camIn = document.getElementById('camIn');
const galIn = document.getElementById('galIn');
let target = null; // { projectId|null, parent|null }
function openCamera(t) { Cam.open(t); }
async function onFile(input) {
  const file = input.files && input.files[0];
  if (!file || !target) return;
  await handleBlob(file);
}
async function handleBlob(file) {
  if (!target) return;
  const busy = document.createElement('div'); busy.className = 'busy'; busy.innerHTML = '<div><div class="spin"></div>Foto wird gespeichert …</div>'; document.body.appendChild(busy);
  try {
    const { blob, w, h } = await processFile(file);
    const p = (target.projectId && getP(target.projectId)) || createProject('', '');
    const id = uid();
    addPhoto(p, { id, blob, w, h }, target.parent);
    try { navigator.vibrate && navigator.vibrate(30); } catch {}
    const q = { projectId: p.id, photoId: id, fresh: 1 };
    go('photo', q);
  } catch { toast('Das Foto konnte nicht gelesen werden.'); }
  finally { busy.remove(); target = null; }
}
camIn.addEventListener('change', () => onFile(camIn));
galIn.addEventListener('change', () => onFile(galIn));

/* ---------- Live camera (lenses, zoom, flash, torch, focus, exposure, timer, grid) ---------- */
const Cam = (() => {
  const $c = document.getElementById('cam');
  const st = { stream: null, track: null, caps: {}, devices: [], deviceId: null, facing: 'environment', zoom: 1, digital: 1,
    flash: 'off', torch: false, grid: true, timer: 0, ev: 0, showEv: false, busy: false, error: '', virtualFactor: 1, lastThumb: null, open: false };
  const isFront = (d) => /front|vorder|user|selfie|facetime|frontal/i.test(d.label);
  function lensInfo(d, i) {
    const l = d.label.toLowerCase();
    if (/ultra|weitwinkel|0[.,]5|0[.,]6/.test(l)) return { name: '0.5×', rank: 0 };
    if (/tele/.test(l)) return { name: 'Tele', rank: 3 };
    if (/triple|dreifach/.test(l)) return { name: 'Auto', rank: 2.6, virtual: true };
    if (/dual wide|dual-weitwinkel|dualwide/.test(l)) return { name: 'Auto', rank: 2.5, virtual: true };
    if (/dual|duo/.test(l)) return { name: 'Dual', rank: 2.4, virtual: true };
    if (/back camera|rückkamera|rückseit|back$|main|haupt/.test(l)) return { name: '1×', rank: 1 };
    return { name: `Linse ${i + 1}`, rank: 1.5 + i / 100 };
  }
  const backs = () => st.devices.filter((d) => !isFront(d));
  const curLens = () => { const d = st.devices.find((x) => x.deviceId === st.deviceId); return d ? lensInfo(d, backs().indexOf(d)) : null; };

  async function listDevices() {
    try { st.devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput' && d.label !== undefined); } catch { st.devices = []; }
  }
  function stop() { st.stream && st.stream.getTracks().forEach((t) => t.stop()); st.stream = null; st.track = null; }

  async function start() {
    stop(); st.error = ''; st.caps = {}; st.digital = 1; st.torch = false;
    const size = { width: { ideal: 4032 }, height: { ideal: 3024 } };
    const video = st.deviceId ? { deviceId: { exact: st.deviceId }, ...size } : { facingMode: { ideal: st.facing }, ...size };
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('nomedia');
      st.stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
    } catch (e) {
      st.error = e && e.name === 'NotAllowedError'
        ? 'Kamera-Zugriff wurde verweigert. Erlaube die Kamera in den Browser-Einstellungen für diese Seite oder nutze die System-Kamera.'
        : 'Die Live-Kamera konnte nicht gestartet werden. Nutze die System-Kamera deines Handys.';
      draw(); return;
    }
    st.track = st.stream.getVideoTracks()[0];
    try { st.caps = st.track.getCapabilities ? st.track.getCapabilities() : {}; } catch { st.caps = {}; }
    const s = st.track.getSettings ? st.track.getSettings() : {};
    if (!st.deviceId && s.deviceId) st.deviceId = s.deviceId;
    if (s.facingMode) st.facing = s.facingMode === 'user' ? 'user' : 'environment';
    await listDevices();
    const lens = curLens();
    st.virtualFactor = lens && lens.virtual ? 2 : 1; // iOS virtual multi-cams: hardware zoom 1 = ultra wide (0.5×)
    st.zoom = st.caps.zoom ? Math.max(st.caps.zoom.min, Math.min(st.caps.zoom.max, (s.zoom || 1) * 1)) : 1;
    if (st.caps.zoom && st.virtualFactor === 2) setZoom(2);
    st.ev = s.exposureCompensation || 0;
    draw();
    const v = $c.querySelector('video'); v.srcObject = st.stream; v.play().catch(() => {});
  }

  /* zoom in "display" units (what the user sees, e.g. 0.5×, 1×, 2×) */
  const dispZoom = () => (st.caps.zoom ? st.zoom / st.virtualFactor : st.digital);
  function zoomRange() {
    if (st.caps.zoom) return { min: st.caps.zoom.min / st.virtualFactor, max: Math.min(st.caps.zoom.max / st.virtualFactor, 30) };
    return { min: 1, max: 8 };
  }
  let zoomRaf = 0, zoomPending = null;
  function setZoom(display) {
    const r = zoomRange(); const d = Math.max(r.min, Math.min(r.max, display));
    if (st.caps.zoom) {
      st.zoom = d * st.virtualFactor;
      zoomPending = st.zoom;
      if (!zoomRaf) zoomRaf = requestAnimationFrame(() => { zoomRaf = 0; st.track?.applyConstraints({ advanced: [{ zoom: zoomPending }] }).catch(() => {}); });
    } else {
      st.digital = d;
      const v = $c.querySelector('video'); if (v) v.style.transform = `scale(${d})${st.facing === 'user' ? ' scaleX(-1)' : ''}`;
    }
    const lbl = $c.querySelector('#zLbl'); if (lbl) lbl.textContent = fmtZ(dispZoom());
    const sl = $c.querySelector('#zSl'); if (sl && document.activeElement !== sl) sl.value = String(Math.log(dispZoom()));
    $c.querySelectorAll('[data-z]').forEach((b) => b.classList.toggle('on', Math.abs(+b.dataset.z - dispZoom()) < 0.05));
  }
  const fmtZ = (z) => `${z < 1 ? z.toFixed(1).replace('.', ',') : (Math.round(z * 10) / 10).toString().replace('.', ',')}×`;
  function presets() {
    const r = zoomRange(); const out = [];
    if (r.min < 0.95) out.push(Math.round(r.min * 10) / 10);
    [1, 2, 3, 5, 10].forEach((z) => { if (z >= r.min - 0.01 && z <= r.max + 0.01) out.push(z); });
    return out;
  }

  async function setTorch(on) {
    if (!st.caps.torch) return false;
    try { await st.track.applyConstraints({ advanced: [{ torch: on }] }); st.torch = on; return true; } catch { return false; }
  }
  async function focusAt(x, y) {
    const ring = document.createElement('div'); ring.className = 'focus-ring'; ring.style.left = `${x * 100}%`; ring.style.top = `${y * 100}%`;
    $c.querySelector('.cam-view').appendChild(ring); setTimeout(() => ring.remove(), 900);
    const adv = {};
    if (st.caps.pointsOfInterest || 'pointsOfInterest' in (st.track?.getConstraints?.() || {})) adv.pointsOfInterest = [{ x, y }];
    if (st.caps.focusMode?.includes('single-shot')) adv.focusMode = 'single-shot';
    if (st.caps.exposureMode?.includes('single-shot')) adv.exposureMode = 'single-shot';
    if (Object.keys(adv).length) st.track.applyConstraints({ advanced: [adv] }).catch(() => {});
  }

  async function grab() {
    const v = $c.querySelector('video');
    if (!v.videoWidth) await new Promise((r) => { v.addEventListener('loadeddata', r, { once: true }); setTimeout(r, 2500); });
    const useFlash = st.flash === 'on' || (st.flash === 'auto' && avgLight(v) < 60);
    let flashWithTorch = false;
    // Full-resolution photo where the browser supports it (Chrome on Android)
    if (typeof ImageCapture !== 'undefined' && st.digital === 1 && st.facing !== 'user') {
      try {
        const icap = new ImageCapture(st.track);
        let opts = {};
        try { const pc = await icap.getPhotoCapabilities(); if (useFlash && pc.fillLightMode?.includes('flash')) opts.fillLightMode = 'flash'; else if (pc.fillLightMode?.includes('off')) opts.fillLightMode = 'off'; } catch {}
        if (useFlash && !opts.fillLightMode?.includes('flash') && !st.torch) { flashWithTorch = await setTorch(true); if (flashWithTorch) await wait(350); }
        const blob = await icap.takePhoto(opts);
        if (flashWithTorch) setTorch(false);
        return blob;
      } catch { if (flashWithTorch) setTorch(false); }
    }
    if (useFlash && !st.torch) { flashWithTorch = await setTorch(true); if (flashWithTorch) await wait(400); }
    const w = v.videoWidth, h = v.videoHeight;
    const cw = Math.round(w / st.digital), ch = Math.round(h / st.digital);
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    c.getContext('2d').drawImage(v, (w - cw) / 2, (h - ch) / 2, cw, ch, 0, 0, cw, ch);
    if (flashWithTorch) setTorch(false);
    return new Promise((r) => c.toBlob(r, 'image/jpeg', 0.92));
  }
  function avgLight(v) {
    try { const c = document.createElement('canvas'); c.width = 16; c.height = 16; const x = c.getContext('2d'); x.drawImage(v, 0, 0, 16, 16); const d = x.getImageData(0, 0, 16, 16).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += (d[i] + d[i + 1] + d[i + 2]) / 3; return s / 256; } catch { return 255; }
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function shoot() {
    if (st.busy || !st.track) return;
    st.busy = true; $c.querySelector('.shutter')?.classList.add('busy');
    if (st.timer) {
      for (let s = st.timer; s > 0; s--) { const n = $c.querySelector('#count'); if (n) { n.textContent = s; n.hidden = false; } await wait(1000); }
      const n = $c.querySelector('#count'); if (n) n.hidden = true;
    }
    const fl = $c.querySelector('.shot-flash'); fl && (fl.classList.remove('go'), void fl.offsetWidth, fl.classList.add('go'));
    try { navigator.vibrate && navigator.vibrate(25); } catch {}
    try {
      const blob = await grab();
      if (!blob) throw new Error('empty');
      const t = target; close();
      target = t;
      await handleBlob(blob);
    } catch { st.busy = false; $c.querySelector('.shutter')?.classList.remove('busy'); toast('Foto konnte nicht aufgenommen werden. Versuch es noch einmal oder nutze die System-Kamera.'); }
  }

  function ctxLabel() {
    const p = target?.projectId && getP(target.projectId);
    const pin = target?.parent && p ? p.photos[target.parent.photoId]?.pins.find((x) => x.id === target.parent.pinId) : null;
    return `<span style="color:${pin ? pin.color : 'var(--accent)'}">${ic(pin ? 'pin' : 'folder', 13)}</span><span>${esc(p ? p.name : 'Neues Schnellprojekt')}${pin ? `  ›  ${esc(pin.label)}` : ''}</span>`;
  }

  function draw() {
    const lenses = backs().map((d, i) => ({ d, ...lensInfo(d, i) })).sort((a, b) => a.rank - b.rank);
    const hasLensChoice = st.facing !== 'user' && lenses.length > 1;
    const r = zoomRange();
    const pre = presets();
    const flashIcon = { off: 'flashOff', auto: 'flashAuto', on: 'flash' }[st.flash];
    $c.innerHTML = `
      <div class="cam-view">
        <video playsinline muted autoplay style="transform:scale(${st.digital})${st.facing === 'user' ? ' scaleX(-1)' : ''}"></video>
        ${st.grid ? '<div class="cam-grid"><i style="left:33.33%"></i><i style="left:66.66%"></i><b style="top:33.33%"></b><b style="top:66.66%"></b></div>' : ''}
        <div class="shot-flash"></div>
        <div id="count" class="count" hidden></div>
        ${st.error ? `<div class="cam-err"><div class="ic">${ic('camera', 28)}</div><p>${esc(st.error)}</p><button class="btn primary" data-c="system">${ic('camera', 18)}System-Kamera öffnen</button><button class="btn secondary" data-c="gallery">${ic('image', 18)}Aus Galerie wählen</button></div>` : ''}
      </div>
      <div class="cam-top">
        <button class="cbtn" data-c="close" aria-label="Schließen">${ic('x', 22)}</button>
        <div class="row" style="gap:8px">
          <button class="cbtn ${st.flash !== 'off' ? 'on' : ''}" data-c="flash" aria-label="Blitz: ${st.flash}">${ic(flashIcon, 20)}</button>
          ${st.caps.torch ? `<button class="cbtn ${st.torch ? 'on' : ''}" data-c="torch" aria-label="Taschenlampe">${ic('torch', 20)}</button>` : ''}
          ${st.caps.exposureCompensation ? `<button class="cbtn ${st.showEv ? 'on' : ''}" data-c="ev" aria-label="Belichtung">${ic('sun', 20)}</button>` : ''}
          <button class="cbtn ${st.timer ? 'on' : ''}" data-c="timer" aria-label="Selbstauslöser">${st.timer ? `<b style="font-size:13px">${st.timer}s</b>` : ic('timer', 20)}</button>
          <button class="cbtn ${st.grid ? 'on' : ''}" data-c="grid" aria-label="Raster">${ic('grid', 20)}</button>
        </div>
      </div>
      <div class="cam-ctx">${ctxLabel()}</div>
      ${st.flash !== 'off' ? `<div class="cam-chip-info">Blitz ${st.flash === 'auto' ? 'Auto' : 'An'}${st.caps.torch || typeof ImageCapture !== 'undefined' ? '' : ' (vom Browser nicht unterstützt)'}</div>` : ''}
      <div class="cam-bottom">
        ${st.showEv && st.caps.exposureCompensation ? `<label class="ev-row">${ic('sun', 16)}<input id="evSl" type="range" min="${st.caps.exposureCompensation.min}" max="${st.caps.exposureCompensation.max}" step="${st.caps.exposureCompensation.step || 0.1}" value="${st.ev}" aria-label="Belichtung"><span id="evLbl">${st.ev > 0 ? '+' : ''}${(+st.ev).toFixed(1)}</span></label>` : ''}
        ${hasLensChoice ? `<div class="lens-row" role="group" aria-label="Linse">${lenses.map((l) => `<button class="lens ${l.d.deviceId === st.deviceId ? 'on' : ''}" data-c="lens" data-id="${esc(l.d.deviceId)}" title="${esc(l.d.label)}">${esc(l.name)}</button>`).join('')}</div>` : ''}
        ${!st.error ? `<div class="zoom-row" role="group" aria-label="Zoom">${pre.map((z) => `<button class="zbtn ${Math.abs(z - dispZoom()) < 0.05 ? 'on' : ''}" data-c="zoom" data-z="${z}">${fmtZ(z)}</button>`).join('')}</div>
        <label class="zs-row"><span id="zLbl">${fmtZ(dispZoom())}</span><input id="zSl" type="range" min="${Math.log(r.min)}" max="${Math.log(r.max)}" step="0.01" value="${Math.log(dispZoom())}" aria-label="Zoom stufenlos"><span class="faint">${fmtZ(r.max)}</span></label>` : ''}
        <div class="shutter-row">
          <button class="cbtn big" data-c="system" aria-label="System-Kamera öffnen" title="System-Kamera">${ic('phone', 22)}</button>
          <button class="shutter ${st.busy ? 'busy' : ''}" data-c="shoot" aria-label="Foto aufnehmen" ${st.error ? 'disabled' : ''}><span></span></button>
          <button class="cbtn big" data-c="flip" aria-label="Kamera wechseln">${ic('flip', 22)}</button>
        </div>
        <div class="cam-links"><button data-c="gallery">${ic('image', 14)}Galerie</button><span>·</span><button data-c="system">${ic('phone', 14)}System-Kamera</button></div>
      </div>`;
    if (st.stream) { const v = $c.querySelector('video'); v.srcObject = st.stream; v.play().catch(() => {}); }
    const sl = $c.querySelector('#zSl'); sl && sl.addEventListener('input', () => setZoom(Math.exp(+sl.value)));
    const ev = $c.querySelector('#evSl'); ev && ev.addEventListener('input', () => { st.ev = +ev.value; $c.querySelector('#evLbl').textContent = `${st.ev > 0 ? '+' : ''}${st.ev.toFixed(1)}`; st.track?.applyConstraints({ advanced: [{ exposureMode: 'continuous', exposureCompensation: st.ev }] }).catch(() => {}); });
  }

  // pinch-to-zoom + tap-to-focus on the preview
  let pinch = null, tapStart = null;
  $c.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.cam-view')) return;
    if (e.touches.length === 2) { const [a, b] = e.touches; pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), z: dispZoom() }; tapStart = null; }
    else if (e.touches.length === 1) tapStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  $c.addEventListener('touchmove', (e) => {
    if (pinch && e.touches.length === 2) { e.preventDefault(); const [a, b] = e.touches; const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); setZoom(pinch.z * (d / pinch.d)); }
  }, { passive: false });
  $c.addEventListener('touchend', (e) => {
    if (pinch && e.touches.length < 2) pinch = null;
    if (tapStart && e.changedTouches.length && Date.now() - tapStart.t < 300) {
      const t = e.changedTouches[0]; const v = $c.querySelector('.cam-view').getBoundingClientRect();
      if (Math.hypot(t.clientX - tapStart.x, t.clientY - tapStart.y) < 10 && !st.error) focusAt((t.clientX - v.left) / v.width, (t.clientY - v.top) / v.height);
    }
    tapStart = null;
  });
  $c.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    const c = b.dataset.c;
    if (c === 'close') { close(); target = null; }
    else if (c === 'shoot') shoot();
    else if (c === 'flash') { st.flash = { off: 'auto', auto: 'on', on: 'off' }[st.flash]; draw(); }
    else if (c === 'torch') { await setTorch(!st.torch); draw(); }
    else if (c === 'ev') { st.showEv = !st.showEv; draw(); }
    else if (c === 'timer') { st.timer = { 0: 3, 3: 10, 10: 0 }[st.timer]; draw(); }
    else if (c === 'grid') { st.grid = !st.grid; draw(); }
    else if (c === 'zoom') setZoom(+b.dataset.z);
    else if (c === 'lens') { st.deviceId = b.dataset.id; await start(); }
    else if (c === 'flip') { st.facing = st.facing === 'user' ? 'environment' : 'user'; const list = st.devices.filter((d) => (st.facing === 'user') === isFront(d)); st.deviceId = st.facing === 'user' ? (list[0]?.deviceId || null) : null; await start(); }
    else if (c === 'system') { const t = target; close(); target = t; camIn.value = ''; camIn.click(); }
    else if (c === 'gallery') { const t = target; close(); target = t; galIn.value = ''; galIn.click(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && st.open) stop(); else if (!document.hidden && st.open && !st.stream) start(); });

  function open(t) {
    target = t; st.open = true; st.busy = false;
    $c.hidden = false; document.documentElement.classList.add('cam-open');
    draw(); start();
  }
  function close() { st.open = false; stop(); $c.hidden = true; $c.innerHTML = ''; document.documentElement.classList.remove('cam-open'); st.busy = false; }
  return { open, close, state: st, setZoom, dispZoom };
})();
function shotSheet(t) { Cam.open(t); }

/* ---------- Actions ---------- */
const A = {
  back, home,
  toProject: (d) => { ui.active = 0; toProject(d.id); },
  newProject: () => { freshForm(null); go('newProject'); },
  examples: () => addExamples(true),
  quickShot: () => shotSheet({ projectId: null, parent: null }),
  filter: (d) => { ui.filter = d.f === ui.filter && d.f !== 'all' ? 'all' : d.f; if (d.f === 'all') ui.city = null; ui.visible = PAGE; render(); },
  city: (d) => { ui.city = ui.city === d.c ? null : d.c; ui.visible = PAGE; render(); },
  more: () => { ui.visible += PAGE; render(); },
  gps: () => {
    const f = ui.form; f.gpsMsg = 'Standort wird ermittelt …'; render();
    const fail = (e) => {
      f.gpsMsg = e && e.code === 1
        ? 'Standortzugriff ist blockiert. Erlaube den Standort für diese Seite in den Browser-Einstellungen (Schloss-Symbol neben der Adresse) und tippe erneut auf „Erfassen“.'
        : 'Der Standort konnte nicht ermittelt werden. Geh ans Fenster oder ins Freie und versuch es noch einmal.';
      render();
    };
    if (!navigator.geolocation) return fail();
    navigator.geolocation.getCurrentPosition(async (pos) => {
      if (ui.form !== f) return;
      f.loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy };
      f.locSource = 'gps'; ui.lastPos = f.loc; f.gpsMsg = 'Adresse wird gesucht …'; render();
      try {
        const a = await geoReverse(f.loc.latitude, f.loc.longitude);
        if (a) { f.street = a.street || f.street; f.nr = a.nr || ''; f.plz = a.plz || f.plz; f.city = a.city || f.city; f.gpsMsg = a.nr ? '' : 'Adresse übernommen. Prüf die Hausnummer und ergänze sie bei Bedarf.'; }
        else f.gpsMsg = 'Position erfasst, aber keine Adresse gefunden. Trag sie bitte von Hand ein.';
      } catch { f.gpsMsg = 'Position erfasst. Die Adresse konnte gerade nicht ermittelt werden.'; }
      render();
    }, fail, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  },
  gpsClear: () => { ui.form.loc = null; ui.form.locSource = ''; ui.form.gpsMsg = ''; render(); },
  startNew: () => { const p = createProject('', ''); formToProject(p); touch(p); stack.pop(); go('project', { id: p.id }); openCamera({ projectId: p.id, parent: null }); },
  startSkip: () => { const p = createProject('', ''); stack.pop(); go('project', { id: p.id }); openCamera({ projectId: p.id, parent: null }); },
  saveEdit: () => { const p = getP(cur().q.id); formToProject(p); p.demo = false; touch(p); back(); toast('Gespeichert'); },
  movePin: () => { const { projectId, photoId, pinId } = cur().q; ui.moving = pinId; go('photo', { projectId, photoId }); ui.moving = pinId; render(); },
  cancelMove: () => { ui.moving = null; render(); },
  shoot: (d) => shotSheet({ projectId: d.id, parent: null }),
  activeRoot: (d) => { ui.active = +d.i; render(); },
  openPhoto: (d) => { const q = cur().q; go('photo', { projectId: q.projectId || q.id, photoId: d.photo }); },
  openPin: (d) => { const q = cur().q; go('pin', { projectId: q.projectId || q.id, photoId: d.photo, pinId: d.pin }); },
  togglePlace: () => { ui.placing = !ui.placing; render(); },
  shootSame: () => {
    const { projectId, photoId } = cur().q; const ph = getP(projectId).photos[photoId];
    shotSheet({ projectId, parent: ph.parent || null });
  },
  shootPin: () => { const { projectId, photoId, pinId } = cur().q; shotSheet({ projectId, parent: { photoId, pinId } }); },
  delPhoto: () => {
    const { projectId, photoId } = cur().q;
    confirmBox('Foto löschen?', 'Alle Pins und Detailfotos dieses Fotos werden ebenfalls gelöscht.', 'Foto löschen', () => { deletePhoto(getP(projectId), photoId); back(); });
  },
  delPin: () => {
    const { projectId, photoId, pinId } = cur().q; const pin = getP(projectId).photos[photoId].pins.find((x) => x.id === pinId);
    confirmBox(`„${pin.label}“ löschen?`, 'Alle zugehörigen Detailfotos und Unter-Pins werden ebenfalls gelöscht.', 'Pin löschen', () => { deletePin(getP(projectId), photoId, pinId); back(); });
  },
  renamePin: () => {
    const { projectId, photoId, pinId } = cur().q; const p = getP(projectId); const pin = p.photos[photoId].pins.find((x) => x.id === pinId);
    modal(`<h2>Pin umbenennen</h2><input class="input" id="rn" value="${esc(pin.label)}"><button class="btn primary" id="rnOk">${ic('check', 18)}Speichern</button><button class="btn ghost" id="rnNo">Abbrechen</button>`, (m) => {
      const i = m.querySelector('#rn'); i.focus(); i.select();
      const ok = () => { pin.label = i.value.trim() || pin.label; touch(p); closeModal(); render(); };
      m.querySelector('#rnOk').onclick = ok; i.onkeydown = (e) => e.key === 'Enter' && ok(); m.querySelector('#rnNo').onclick = closeModal;
    });
  },
  projectMenu: (d) => {
    const p = getP(d.id);
    modal(`<h2>${esc(p.name)}</h2><button class="btn secondary" id="mEdit">${ic('edit', 18)}Name & Adresse bearbeiten</button><button class="btn danger" id="mDel">${ic('trash', 18)}Projekt löschen</button><button class="btn ghost" id="mNo">Abbrechen</button>`, (m) => {
      m.querySelector('#mNo').onclick = closeModal;
      m.querySelector('#mDel').onclick = () => confirmBox('Projekt wirklich löschen?', 'Alle Fotos, Pins und Notizen werden entfernt.', 'Endgültig löschen', () => { deleteProject(p.id); home(); toast('Projekt gelöscht'); });
      m.querySelector('#mEdit').onclick = () => { closeModal(); freshForm(p); go('editProject', { id: p.id }); };
    });
  },
  share: (d) => go('share', { id: d.id }),
  role: (d) => { ui.role = d.r; render(); },
  addMember: () => {
    const p = getP(cur().q.id); const n = document.getElementById('mName').value.trim(); const c = document.getElementById('mContact').value.trim();
    if (!n) { toast('Bitte einen Namen eingeben.'); document.getElementById('mName').focus(); return; }
    p.members.push({ id: uid(), name: n, contact: c, role: ui.role }); touch(p); render(); toast(`${n} ist jetzt im Team`);
  },
  shareNative: async () => {
    const p = getP(cur().q.id); const text = report(p); const c = cover(p);
    try {
      const data = { title: p.name, text };
      if (c && navigator.canShare) {
        const blob = await (await fetch(photoSrc(c.id))).blob();
        const file = new File([blob], `${p.name.replace(/[^\wäöüÄÖÜß -]/g, '')}.jpg`, { type: 'image/jpeg' });
        if (navigator.canShare({ files: [file] })) data.files = [file];
      }
      if (navigator.share) await navigator.share(data); else A.copyReport();
    } catch (e) { if (e && e.name !== 'AbortError') A.copyReport(); }
  },
  rmMember: (d) => { const p = getP(cur().q.id); p.members = p.members.filter((m) => m.id !== d.m); touch(p); render(); },
  copyReport: () => {
    const text = report(getP(cur().q.id));
    const sel = () => { const r = document.createRange(); r.selectNodeContents(document.getElementById('report')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Text markiert. Jetzt kopieren.'); };
    try { navigator.clipboard.writeText(text).then(() => toast('Bericht kopiert'), sel); } catch { sel(); }
  }
};

document.addEventListener('click', (e) => {
  const place = e.target.closest('[data-place]');
  if (place && ui.moving && !modalEl) {
    const r = place.getBoundingClientRect();
    const { projectId, photoId } = cur().q; const p = getP(projectId); const pin = p.photos[photoId].pins.find((x) => x.id === ui.moving);
    if (pin) { pin.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); pin.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)); touch(p); }
    ui.moving = null; render(); toast('Pin verschoben'); return;
  }
  if (place && ui.placing && !modalEl) {
    const r = place.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    pinDraft(x, y); return;
  }
  const el = e.target.closest('[data-a]');
  if (!el || (modalEl && !modalEl.contains(el))) return;
  const fn = A[el.dataset.a];
  if (fn) { e.preventDefault(); fn(el.dataset); }
});

function pinDraft(x, y) {
  const { projectId, photoId } = cur().q; const p = getP(projectId); const ph = p.photos[photoId];
  // preview marker
  const box = document.querySelector('[data-place]');
  const g = document.createElement('div'); g.className = 'pin ghost'; g.style.left = `${x * 100}%`; g.style.top = `${y * 100}%`; g.innerHTML = `<span class="dot">${ph.pins.length + 1}</span>`; box.appendChild(g);
  modal(`<h2>Neuer Pin</h2><p class="muted" style="margin:0 0 4px">Wie heißt diese Stelle?</p>
    <input class="input" id="pl" placeholder="z. B. Haustür, 1. Stock … (Pin ${ph.pins.length + 1})" autocomplete="off" enterkeyhint="done">
    <button class="btn primary" id="pShot">${ic('camera', 18)}Pin setzen & Detailfoto machen</button>
    <button class="btn secondary" id="pOnly">${ic('pin', 18)}Nur Pin setzen</button>
    <button class="btn ghost" id="pNo">Abbrechen</button>`, (m) => {
    const i = m.querySelector('#pl'); setTimeout(() => i.focus(), 50);
    const make = () => { const pin = addPin(p, photoId, x, y, i.value); closeModal(); render(); return pin; };
    m.querySelector('#pOnly').onclick = make;
    i.onkeydown = (e) => { if (e.key === 'Enter') make(); };
    m.querySelector('#pShot').onclick = () => { const pin = make(); ui.placing = false; render(); openCamera({ projectId, parent: { photoId, pinId: pin.id } }); };
    m.querySelector('#pNo').onclick = () => { closeModal(); g.remove(); };
  });
}

/* ---------- Example project (drawn on canvas, marked "Beispiel") ---------- */
function drawHouse() {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 900; const x = c.getContext('2d');
  let g = x.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, '#9FC6E8'); g.addColorStop(1, '#E7EEF3'); x.fillStyle = g; x.fillRect(0, 0, 1200, 900);
  x.fillStyle = '#7FA36A'; x.fillRect(0, 720, 1200, 180);
  x.fillStyle = '#E9DFD0'; x.fillRect(300, 360, 600, 380);
  x.fillStyle = '#9A4B36'; x.beginPath(); x.moveTo(260, 370); x.lineTo(600, 150); x.lineTo(940, 370); x.closePath(); x.fill();
  x.fillStyle = '#6B3324'; x.fillRect(740, 190, 60, 120);
  x.fillStyle = '#C9BBA6'; x.fillRect(300, 540, 600, 8);
  x.fillStyle = '#5B4636'; x.fillRect(555, 590, 90, 150);
  x.fillStyle = '#D9A441'; x.beginPath(); x.arc(628, 668, 6, 0, 7); x.fill();
  const win = (wx, wy) => { x.fillStyle = '#FFFFFF'; x.fillRect(wx - 6, wy - 6, 112, 102); x.fillStyle = '#8FB8D9'; x.fillRect(wx, wy, 100, 90); x.fillStyle = '#FFFFFF'; x.fillRect(wx + 47, wy, 6, 90); x.fillRect(wx, wy + 42, 100, 6); };
  win(360, 410); win(740, 410); win(360, 590); win(740, 590); win(550, 410);
  x.fillStyle = '#B9AE9C'; x.fillRect(530, 740, 140, 14);
  return new Promise((r) => c.toBlob((b) => r(b), 'image/jpeg', 0.88));
}
function drawDoor() {
  const c = document.createElement('canvas'); c.width = 900; c.height = 1200; const x = c.getContext('2d');
  x.fillStyle = '#E9DFD0'; x.fillRect(0, 0, 900, 1200);
  x.fillStyle = '#4A382B'; x.fillRect(150, 100, 600, 1100);
  x.fillStyle = '#5B4636'; x.fillRect(180, 130, 540, 1070);
  x.strokeStyle = '#4A382B'; x.lineWidth = 10; x.strokeRect(240, 200, 420, 360); x.strokeRect(240, 640, 420, 440);
  x.fillStyle = '#D9A441'; x.fillRect(610, 600, 70, 26); x.beginPath(); x.arc(645, 680, 18, 0, 7); x.fill();
  x.fillStyle = '#2C2119'; x.fillRect(640, 672, 10, 22);
  x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 3; x.beginPath(); x.moveTo(320, 900); x.lineTo(380, 960); x.lineTo(360, 1010); x.stroke();
  return new Promise((r) => c.toBlob((b) => r(b), 'image/jpeg', 0.88));
}
async function seedExample() {
  const [house, door] = await Promise.all([drawHouse(), drawDoor()]);
  if (!house || !door) return;
  const p = createProject('Hausrenovierung', 'Lindenweg 12, 10115 Berlin', null);
  p.demo = true; p.addr = { street: 'Lindenweg', nr: '12', plz: '10115', city: 'Berlin' };
  p.members.push({ id: uid(), name: 'Anna Keller', contact: '', role: 'Bearbeiten' });
  const h = uid(); addPhoto(p, { id: h, blob: house, w: 1200, h: 900 });
  p.photos[h].notes = 'Fassade Nordseite. Putz unter dem Dach bröckelt, Fenster EG links schließt schlecht.';
  const tuer = addPin(p, h, 0.5, 0.74, 'Haustür');
  addPin(p, h, 0.5, 0.51, '1. Stock');
  addPin(p, h, 0.64, 0.3, 'Dach');
  const d = uid(); addPhoto(p, { id: d, blob: door, w: 900, h: 1200 }, { photoId: h, pinId: tuer.id });
  p.photos[d].notes = 'Kratzer unten links, Schloss klemmt.';
  addPin(p, d, 0.72, 0.56, 'Türschloss');
  addPin(p, d, 0.4, 0.79, 'Kratzer');
  touch(p);
}

/* Real photos from Wikimedia Commons (free licences, credited in the notes) */
const REAL = [
  { key: 'house', file: 'Altendorf Krötenpfuhl 4 (03).jpg' },
  { key: 'door', file: 'Alsfeld-Neurathhaus-Haustuer.jpg' },
  { key: 'beams', file: 'Bodenwerder-Fachwerk-Detail.jpg' },
  { key: 'nails', file: 'Holznägel - St. Marien (Veerßen).jpg' }
];
const stripHtml = (h) => { const d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); };
async function seedReal() {
  const titles = REAL.map((r) => 'File:' + r.file).join('|');
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1600&titles=${encodeURIComponent(titles)}`;
  const j = await (await fetch(api)).json();
  const norm = {}; (j.query.normalized || []).forEach((n) => (norm[n.to] = n.from));
  const info = {};
  Object.values(j.query.pages || {}).forEach((pg) => {
    const ii = pg.imageinfo && pg.imageinfo[0]; if (!ii) return;
    const orig = (norm[pg.title] || pg.title).replace(/^File:/, '');
    const r = REAL.find((x) => x.file === orig || x.file.replace(/ /g, '_') === orig.replace(/ /g, '_') || 'File:' + x.file === pg.title);
    if (!r) return;
    const m = ii.extmetadata || {};
    info[r.key] = { url: ii.thumburl || ii.url, w: ii.thumbwidth || ii.width, h: ii.thumbheight || ii.height,
      credit: `Foto: ${stripHtml(m.Artist?.value) || 'unbekannt'}, ${stripHtml(m.LicenseShortName?.value) || 'freie Lizenz'}, Wikimedia Commons`, page: ii.descriptionurl };
  });
  const blobs = {};
  await Promise.all(Object.entries(info).map(async ([k, v]) => { try { const r = await fetch(v.url); if (r.ok) blobs[k] = await r.blob(); } catch {} }));
  if (!blobs.house) throw new Error('no photos');
  const p = createProject('', '');
  Object.assign(p, { name: 'Fachwerkhaus Sanierung', addr: { street: 'Krötenpfuhl', nr: '4', plz: '53340', city: 'Meckenheim' }, demo: true, real: true, location: null });
  try { const hit = (await geoSearch('Krötenpfuhl 4, 53340 Meckenheim')).find((x) => x.city && /meckenheim/i.test(x.line2 + x.city)) ; if (hit) p.location = { latitude: hit.lat, longitude: hit.lon, source: 'adresse' }; } catch {}
  p.address = composeAddr(p.addr);
  p.members.push({ id: uid(), name: 'Mehmet Yıldız', contact: '', role: 'Bearbeiten' }, { id: uid(), name: 'Lena Brandt', contact: '', role: 'Ansehen' });
  const put = (k, parent, notes) => {
    if (!blobs[k]) return null;
    const id = uid(); addPhoto(p, { id, blob: blobs[k], w: info[k].w, h: info[k].h }, parent);
    p.photos[id].notes = `${notes}\n\n${info[k].credit}`;
    return id;
  };
  const h = put('house', null, 'Bestandsaufnahme Straßenseite. Tor und Fachwerk prüfen, Gefache teils gerissen.');
  const pTor = addPin(p, h, 0.5, 0.62, 'Tor / Eingang');
  const pFw = addPin(p, h, 0.3, 0.3, 'Fachwerk Obergeschoss');
  addPin(p, h, 0.8, 0.45, 'Fenster');
  const d = put('door', { photoId: h, pinId: pTor.id }, 'Beispiel für eine historische Haustür: Holz aufarbeiten, Beschläge erhalten.');
  if (d) { addPin(p, d, 0.5, 0.22, 'Schnitzerei'); addPin(p, d, 0.64, 0.56, 'Türgriff & Schloss'); }
  const b = put('beams', { photoId: h, pinId: pFw.id }, 'Detail Fachwerk: Holz auf Fäulnis prüfen, Verbindungen kontrollieren.');
  if (b) {
    const pN = addPin(p, b, 0.5, 0.5, 'Holznagel-Verbindung');
    put('nails', { photoId: b, pinId: pN.id }, 'Holznägel an der Verbindung. Lose Nägel ersetzen.');
  }
  p.updatedAt = Date.now() + 1; persist();
}
async function addExamples(manual) {
  const busy = manual ? (() => { const b = document.createElement('div'); b.className = 'busy'; b.innerHTML = '<div><div class="spin"></div>Beispielprojekte werden geladen …</div>'; document.body.appendChild(b); return b; })() : null;
  try {
    if (manual || !(await kvGet('seeded'))) { await seedExample(); kvSet('seeded', '1'); }
    if (manual || !(await kvGet('seededReal'))) {
      try { await seedReal(); kvSet('seededReal', '1'); }
      catch { toast('Die echten Beispielfotos konnten nicht geladen werden. Prüfe die Internetverbindung.'); }
    }
  } finally { busy && busy.remove(); render(); }
}

/* ---------- Boot ---------- */
(async () => {
  idb = await openDb();
  try { const raw = await kvGet('projects'); if (raw) projects = JSON.parse(raw); } catch { projects = []; }
  (await blobAll()).forEach(([k, b]) => urls.set(k, URL.createObjectURL(b)));
  render(true);
  addExamples(false);
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  if (!idb) toast('Speichern ist in diesem Browser nicht möglich. Fotos gehen beim Schließen verloren.');
})();
render(true);
})();
