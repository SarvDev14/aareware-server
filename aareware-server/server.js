// Aare-Ware Coastal Drive: room server.
// One Node service does everything: it serves the game page (frontend) and runs the
// room + voice-signalling WebSocket (backend). No database, no accounts.
//   npm install && npm start     ->  http://localhost:3000
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const MAX_PER_ROOM = 8;
const TICK_MS = 25;          // relay tick: 40 batches per second (each carries only the states that changed)
const STALE_MS = 15000;      // drop a socket that has been silent this long
const ROOM_RE = /^[A-Z0-9]{4,8}$/;

// STUN lets most home / Wi-Fi connections find each other for voice. For strict mobile
// networks add a TURN relay: set ICE_SERVERS to a JSON array (see README).
let ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
if (process.env.ICE_SERVERS) {
  try { const v = JSON.parse(process.env.ICE_SERVERS); if (Array.isArray(v) && v.length) ICE = v; else console.warn('ICE_SERVERS must be a non-empty JSON array; using default STUN'); }
  catch (e) { console.warn('ICE_SERVERS is not valid JSON; using default STUN'); }
}

const pagePath = path.join(__dirname, 'public', 'index.html');
let page = '';
try { page = fs.readFileSync(pagePath, 'utf8').replace('<!--AW_SERVER-->', '<script>window.AW_WS=1</script>'); }
catch (e) { console.error('Missing public/index.html'); process.exit(1); }

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (url === '/healthz') { res.writeHead(200, { 'content-type': 'text/plain' }); res.end('ok'); return; }
  if (url === '/ice') { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify({ iceServers: ICE })); return; }
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' });
    res.end(page); return;
  }
  if (url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found');
});

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 16384 });
// room: { players: Map(id -> {ws, state, name, last, muted, vseq, tokens, tAt}), host, vseq, muteNew }
const rooms = new Map();
let nextId = 1;

const num = (v, lo, hi, d = 0) => (typeof v === 'number' && isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d);
function clean(s, name) {
  if (!s || typeof s !== 'object') return null;
  return {
    n: name,
    c: Math.round(num(s.c, 0, 9)), p: Math.round(num(s.p, 0, 15)),
    x: num(s.x, -1400, 1500), y: num(s.y, -50, 300), z: num(s.z, -3400, 3000), h: num(s.h, -10, 10),
    vx: num(s.vx, -150, 150), vz: num(s.vz, -150, 150), w: num(s.w, -12, 12), tc: Math.round(num(s.tc, 0, 255)),
    q: Math.round(num(s.q, 0, 2e9)), ct: num(s.ct, 0, 4e12),     // sequence number + the sender's own clock: lets clients interpolate smoothly
    v: num(s.v, -120, 120), st: num(s.st, -1, 1), rp: Math.round(num(s.rp, 0, 12000)), th: num(s.th, 0, 1),
    l: s.l ? 1 : 0, e: s.e ? 1 : 0, b: s.b ? 1 : 0,
    ts: Math.round(num(s.ts, 0, 20)), tt: num(s.tt, 0, 4e12),
  };
}
const cleanName = (n) => String(n || 'Driver').replace(/[^\p{L}\p{N} _.\-]/gu, '').trim().slice(0, 14) || 'Driver';
const send = (ws, o) => { if (ws.readyState === 1) { try { ws.send(JSON.stringify(o)); } catch (e) { /* closed */ } } };
const broadcast = (r, o, exceptId) => { const m = JSON.stringify(o); for (const [id, p] of r.players) if (id !== exceptId && p.ws.readyState === 1) { try { p.ws.send(m); } catch (e) { /* closed */ } } };

// token bucket per socket: stops a client from flooding signalling
function allow(pl, cost = 1) {
  const now = Date.now();
  pl.tokens = Math.min(160, pl.tokens + ((now - pl.tAt) / 1000) * 40);
  pl.tAt = now;
  if (pl.tokens < cost) return false;
  pl.tokens -= cost; return true;
}

server.on('connection', (sock) => { try { sock.setNoDelay(true); } catch (e) { /* ignore */ } });   // no Nagle delay on small frames
wss.on('connection', (ws) => {
  let room = null, id = null;
  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw.toString()); } catch (e) { return; }
    if (!m || typeof m.t !== 'string') return;
    if (m.t === 'ping') { send(ws, { t: 'pong', ts: m.ts }); const r0 = room && rooms.get(room); const p0 = r0 && r0.players.get(id); if (p0) p0.last = Date.now(); return; }

    if (m.t === 'join' && !room) {
      const code = String(m.room || '').toUpperCase();
      if (!ROOM_RE.test(code)) { send(ws, { t: 'err', msg: 'Room codes are 4 to 8 letters or digits.' }); return; }
      let r = rooms.get(code);
      if (!r) {
        if (!m.create) { send(ws, { t: 'err', msg: 'No room with code ' + code + '. Check the code, or create a new room.' }); return; }
        r = { players: new Map(), host: null, vseq: 0, muteNew: false }; rooms.set(code, r);
      }
      if (r.players.size >= MAX_PER_ROOM) { send(ws, { t: 'err', msg: 'That room is full (' + MAX_PER_ROOM + ' drivers).' }); return; }
      id = 'p' + (nextId++);
      room = code;
      const pl = { ws, state: null, name: cleanName(m.name), last: Date.now(), muted: false, vseq: 0, tokens: 160, tAt: Date.now() };
      if (!r.host) r.host = id;                       // the room creator is the host
      pl.muted = r.muteNew && r.host !== id;
      const others = [];
      for (const [pid, p] of r.players) others.push({ id: pid, name: p.name, muted: p.muted, voice: p.vseq });
      r.players.set(id, pl);
      send(ws, { t: 'joined', id, host: r.host, muted: pl.muted, peers: others });
      broadcast(r, { t: 'peer', id, name: pl.name, muted: pl.muted }, id);
      return;
    }

    const r = room && rooms.get(room); const pl = r && r.players.get(id);
    if (!pl) return;
    pl.last = Date.now();

    if (m.t === 's') {
      const s = clean(m.s, pl.name);
      if (s) { pl.state = s; pl.frag = JSON.stringify(id) + ':' + JSON.stringify(s); pl.dirty = true; }   // serialised once, reused for every recipient
      return;
    }

    // ---- voice: who has voice on, and WebRTC signalling relay (offer/answer/ICE)
    if (m.t === 'voice') {
      if (!allow(pl, 8)) return;
      pl.vseq = m.on ? ++r.vseq : 0;
      broadcast(r, { t: 'voice', id, seq: pl.vseq });   // includes the sender so it learns its own order
      return;
    }
    if (m.t === 'sig') {
      if (!allow(pl, 1)) return;
      const target = r.players.get(String(m.to));
      if (!target || target === pl) return;
      let d = m.d; if (!d || typeof d !== 'object') return;
      if (JSON.stringify(d).length > 12000) return;
      send(target.ws, { t: 'sig', from: id, d });
      return;
    }

    // ---- host powers: mute / unmute other drivers' microphones
    if (m.t === 'mute') {
      if (r.host !== id) { send(ws, { t: 'err2', msg: 'Only the room host can do that.' }); return; }
      if (!allow(pl, 4)) return;
      const muted = !!m.muted;
      if (m.id === '*') {
        r.muteNew = muted;
        for (const [pid, p] of r.players) if (pid !== r.host) p.muted = muted;
        broadcast(r, { t: 'muted', all: true, muted, host: r.host });
      } else {
        const target = r.players.get(String(m.id));
        if (!target || String(m.id) === r.host) return;
        target.muted = muted;
        broadcast(r, { t: 'muted', id: String(m.id), muted });
      }
      return;
    }
  });

  const leave = () => {
    if (!room) return;
    const r = rooms.get(room);
    const code = room; room = null;
    if (!r) return;
    r.players.delete(id);
    if (r.players.size === 0) { rooms.delete(code); return; }
    broadcast(r, { t: 'left', id });
    if (r.host === id) {                              // host left: the longest-present driver takes over
      r.host = r.players.keys().next().value;
      const nh = r.players.get(r.host);
      if (nh && nh.muted) { nh.muted = false; broadcast(r, { t: 'muted', id: r.host, muted: false }); }   // a host is never muted
      broadcast(r, { t: 'host', id: r.host });
    }
  };
  ws.on('close', leave);
  ws.on('error', leave);
});

// relay loop: every tick, each driver receives the states that changed since the last tick (never their own).
// Clients rebuild smooth motion from the timestamps inside the states, so this only has to be prompt and even.
setInterval(() => {
  const now = Date.now();
  for (const r of rooms.values()) {
    const fresh = [];
    for (const [pid, p] of r.players) {
      if (now - p.last > STALE_MS) { try { p.ws.terminate(); } catch (e) { /* ignore */ } continue; }
      if (p.dirty && p.frag) fresh.push([pid, p]);
    }
    if (!fresh.length) continue;
    for (const [rid, rp] of r.players) {
      if (rp.ws.readyState !== 1 || rp.ws.bufferedAmount > 65536) continue;   // skip a client that cannot keep up
      const parts = [];
      for (const [pid, p] of fresh) if (pid !== rid) parts.push(p.frag);
      if (parts.length) { try { rp.ws.send('{"t":"snap","s":{' + parts.join(',') + '}}'); } catch (e) { /* closed */ } }
    }
    for (const f of fresh) f[1].dirty = false;
  }
}, TICK_MS);

server.listen(PORT, () => console.log('Aare-Ware Coastal Drive running on http://localhost:' + PORT));
