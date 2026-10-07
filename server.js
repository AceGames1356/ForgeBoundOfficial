'use strict';
// Forgebound server: accounts (email + age), saves, friends, chat, trading, gems shop, news, co-op tower.
// Connected to permanent Supabase PostgreSQL cloud storage using native JSONB.
const http = require('http'), path = require('path'), crypto = require('crypto'), { Pool } = require('pg');
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto'), { Pool } = require('pg');

const SHARED = String.raw`(function(root){
const P=[
@@ -41,8 +41,8 @@ A('c',1,'Toxic Core','',{e:'toxic',def:1,atk:2});A('c',2,'Magma Core','',{e:'fir
A('c',2,'Viper Core','',{e:'toxic',atk:3,crit:.08});A('c',3,'Tempest Core','',{e:'shock',atk:4,spd:.5});A('c',3,'Wraith Core','',{e:'void',crit:.15,atk:3});
A('c',3,'Leech Core','',{e:'blood',life:.15,atk:3});A('c',4,'Inferno Heart','',{e:'fire',atk:9,crit:.1});A('c',4,'Absolute Zero','',{e:'ice',atk:6,def:5,spd:.2});
A('c',4,'Plague Heart','',{e:'toxic',atk:7,life:.1,crit:.1});A('c',5,'Bloodstar','',{e:'blood',atk:11,life:.2,crit:.1});A('c',5,'Abyss Eye','',{e:'void',atk:10,crit:.3});
A('c',5,'Dragon Heart','',{e:'fire',atk:14,def:4,spd:.2});A('c',5,'Stormheart','',{e:'shock',atk:11,spd:.6,crit:.08});A('c',5,'Permafrost Heart','',{e:'ice',atk:9,def:8,spd:.3});
A('c',5,'Blight Heart','',{e:'toxic',atk:12,life:.12,crit:.1});A('c',6,'Sunheart','',{e:'holy',atk:16,crit:.2,life:.1});A('c',6,'Genesis Core','',{e:'holy',atk:14,def:8,spd:.6,life:.08});
A('c',5,'Dragon Heart','',{e:'fire',atk:14,def:4,spd:.2});A('c',5,'Stormheart','',{e:'shock',atk:11,spd:.6,crit:.08});
A('c',5,'Permafrost Heart','',{e:'ice',atk:9,def:8,spd:.3});A('c',5,'Blight Heart','',{e:'toxic',atk:12,life:.12,crit:.1});A('c',6,'Sunheart','',{e:'holy',atk:16,crit:.2,life:.1});A('c',6,'Genesis Core','',{e:'holy',atk:14,def:8,spd:.6,life:.08});

const Z=(s,t,n,c,o)=>{o=Object.assign({},o);if(o.atk)o.atk=Math.round(o.atk*.55);if(o.def)o.def=Math.round(o.def*.55);P.push(Object.assign({s,n,t,c,wd:1},o))};
Z('h',2,'Dune Wrap','#d9b36a',{atk:7,def:6,spd:.2});Z('h',2,'Sand Cord','#c9b48a',{atk:5,def:5,spd:.5});
@@ -82,7 +82,7 @@ let n=pre[(k*2+si)%pre.length]+' '+noun[(t+k*2+si)%noun.length];while(taken.has(
const m=w==2?1.12:1,a=GB[s].a[t]*m,d=GB[s].d[t]*m,o={};let A=a,D=d;
if(arch=='brute'){A=a*1.3;D=d*.6}else if(arch=='tank'){A=a*.7;D=d*1.4}else if(arch=='swift'){A=a*.85;o.spd=+(.3+.07*t).toFixed(2)}else if(arch=='crit'){A=a*.9;o.crit=+(.05+.02*t).toFixed(2)}else if(arch=='vamp'){A=a*.9;o.life=+(.03+.02*t).toFixed(2)}
if(Math.round(A)>0)o.atk=Math.round(A);if(Math.round(D)>0)o.def=Math.round(D);
if(s=='b')o.sh={brute:[26+t, 5, 3],tank:[6, 4],swift:[34, 2, 6],crit:[32, 3, 7],vamp:[30, 4, 5],bal:[30, 3, 5]}[arch];
if(s=='b')o.sh={brute:[26+t,5,3],tank:[28,6,4],swift:[34,2,6],crit:[32,3,7],vamp:[30,4,5],bal:[30,3,5]}[arch];
if(s=='g'){o.w={tank:30,brute:26,swift:28,crit:28,vamp:26,bal:24}[arch];if(arch=='swift'||arch=='crit')o.dc='wing';else if(arch=='brute')o.dc='spike'}
if(s=='c')o.e=t==6?'holy':ELEM[(t+k+si)%6];
const col=s=='c'?'':tint(TCOL[t],{brute:-.15,tank:-.3,swift:.2,crit:.1,vamp:-.05,bal:0}[arch]);
@@ -103,6 +103,7 @@ P.forEach((p,i)=>p.id=i);
const W1BASE=[0,6,13,18],W2BASE=P.filter(p=>p.st).map(p=>p.id);
const TW=[{n:'Gloom Wraith',w:'fire',k:'#a97cf0'},{n:'Bone Colossus',w:'blood',k:'#e8e2c8'},{n:'Ember Drake',w:'ice',k:'#ff8a2b'},{n:'Tower Sentinel',w:'shock',k:'#9a9fae'}];
const SB=[{n:'Crystal Lich',w:'fire',k:'#5ff0e0'},{n:'Magma Golem',w:'ice',k:'#ff6b1a'},{n:'Clockwork Reaper',w:'shock',k:'#d9b24a'},{n:'Celestial Warden',w:'void',k:'#f4eec8'},{n:'Aether Titan',w:'toxic',k:'#4fe0c8'}];

const hpCost=l=>l<5?40*(l+1):null,hpCostD=l=>l<5?10*(l+1):null,maxHp=(l,w)=>(w==2?100+15*Math.min(l||0,5):100+10*Math.min(l||0,5));
const VERSION='2.0.0';
const BOSSES=[
@@ -111,15 +112,15 @@ const BOSSES=[
{n:'Venom Hydra',k:'#4fb04a',hp:560,r:19,w:'toxic'},{n:'Crimson Warlord',k:'#e0455a',hp:760,r:23,w:'blood'},
{n:'Abyss Leviathan',k:'#2d6fa8',hp:1000,r:28,w:'shock'},{n:'Solar Titan',k:'#e8b73a',hp:1350,r:34,w:'ice'},
{n:'Void Emperor',k:'#7a4be0',hp:1800,r:39,w:'fire'},{n:'Seraph Sentinel',k:'#f4eec8',hp:2500,r:43,w:'void'},{n:'The Final God',k:'#fff3b0',hp:3500,r:49,w:'toxic'}];

const WORLD2=[
{n:'Sand Golem',k:'#d9b36a',w:'ice'},{n:'Dune Stalker',k:'#c9a23a',w:'shock'},{n:'Scarab Matriarch',k:'#4fb04a',w:'fire'},{n:'Mirage Wraith',k:'#b99cff',w:'void'},{n:'Cactus King',k:'#4d8a4a',w:'fire'},
{n:'Thornback Boar',k:'#8a5a2b',w:'fire'},{n:'Elder Treant',k:'#3f7a3a',w:'fire'},{n:'Moss Hydra',k:'#6fbf5a',w:'shock'},{n:'Fae Queen',k:'#ff7ac8',w:'blood'},
{n:'Frost Yeti',k:'#cfe6ff',w:'fire'},{n:'Ice Drake',k:'#7fd6ff',w:'shock'},{n:'Blizzard Witch',k:'#8fa8ff',w:'blood'},{n:'Glacier Titan',k:'#9fd8ff',w:'toxic'},
{n:'Magma Serpent',k:'#ff6b1a',w:'ice'},{n:'Ash Colossus',k:'#6b6b78',w:'ice'},{n:'Cinder Lord',k:'#e0455a',w:'toxic'},{n:'Obsidian Dragon',k:'#3a3160',w:'ice'},
{n:'Void Walker',k:'#7a4be0',w:'blood'},{n:'Rift Devourer',k:'#5f6bff',w:'shock'},{n:'Dark Sovereign',k:'#3b2a6b',w:'toxic'},
{n:'ViLocity',k:'#fff3b0',w:'holy'}];
const R2=[20, 18, 19, 17, 18, 20, 20, 20, 19, 20, 20, 20, 20, 20, 20, 27, 25, 26, 30, 20],AGPW=28;
const W2HP=[60, 70, 85, 100, 120, 150, 190, 240, 300, 380, 470, 580, 720, 880, 1080, 1330, 1650, 2050, 2500, 3000, 6500],W2R=[7, 17, 21, 27, 36, 31, 30, 32, 39, 41, 36, 37, 47, 42, 43, 39, 50, 47, 34];
{n:'Void Walker',k:'#7a4be0',w:'blood'},{n:'Rift Devourer',k:'#5f6bff',w:'shock'},{n:'Dark Sovereign',k:'#3b2a6b',w:'toxic'},{n:'ViLocity',k:'#fff3b0',w:'holy'}];
const R2=[20, 18, 19, 17, 18, 20, 20, 20, 19, 20, 20, 20, 20, 20, 20, 27, 28, 25, 26, 30, 20],AGPW=28;
const W2HP=[60, 70, 85, 100, 120, 150, 190, 240, 300, 380, 470, 580, 720, 880, 1080, 1330, 1650, 2050, 2500, 3000, 6500],W2R=[7, 17, 21, 28, 29, 27, 36, 31, 30, 32, 39, 41, 36, 37, 47, 42, 43, 39, 50, 47, 34];
WORLD2.forEach((b,i)=>{b.hp=W2HP[i];b.r=W2R[i];b.fl=.1;b.coin=i==20?2500:120+45*i;b.dia=i==20?200:4+2*i});
WORLD2[20].aggr={pw:AGPW,every:3200,tele:1000};
const PRICE2=[null,6,14,30,65,150,null,null],CAP2=[1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6],MG_UNLOCK=[5,9,13];
@@ -157,16 +158,14 @@ const api={SLOTS,W1BASE,W2BASE,FX,GEM_PACKS,PATCH_NOTES,VERSION,WORLD2,PRICE2,CA
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Game=api;
})(typeof window!=='undefined'?window:globalThis);
`;

const G = (() => { const m = { exports: {} }; new Function('module', 'window', SHARED)(m, undefined); return m.exports; })();

const PORT = process.env.PORT || 3000;
const ADMIN = String(process.env.ADMIN_USER || 'vilocity').toLowerCase();
const CFG = {
  PUBLIC_URL: (process.env.PUBLIC_URL || '').replace(/\/$/, ''),
  STRIPE_KEY: process.env.STRIPE_SECRET_KEY || '', 
  STRIPE_WH: process.env.STRIPE_WEBHOOK_SECRET || '',
  RESEND: process.env.RESEND_API_KEY || '', 
  FROM: process.env.EMAIL_FROM || 'Forgebound onboarding@resend.dev',
  STRIPE_KEY: process.env.STRIPE_SECRET_KEY || '', STRIPE_WH: process.env.STRIPE_WEBHOOK_SECRET || '',
  RESEND: process.env.RESEND_API_KEY || '', FROM: process.env.EMAIL_FROM || 'Forgebound <onboarding@resend.dev>',
  DEV_CODE: process.env.DEV_SHOW_CODE === '1'
};
const MIN_COOP = 8, MIN_SOCIAL = 13, MIN_BUY = 13;
@@ -222,7 +221,6 @@ const scrypt = (pw, salt) => new Promise((res, rej) => crypto.scrypt(pw, salt, 3
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
const fail = (res, code, msg) => json(res, code, { error: msg });
const NUM = (v, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(+v) ? +v : 0));

function readBody(req, limit) {
  return new Promise((res, rej) => { let b = ''; req.on('data', c => { b += c; if (b.length > limit) { rej(new Error('too big')); req.destroy(); } }); req.on('end', () => res(b)); req.on('error', rej); });
}
@@ -232,14 +230,12 @@ function limited(req, max) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim(), now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < 600000); h.push(now); hits.set(ip, h); return h.length > (max || 30);
}

const eqOf = a => ({ h: a[0], b: a[1], g: a[2], c: a[3] });
const newSave = () => ({ owned: [...G.W1BASE], eq: eqOf(G.W1BASE), owned2: [...G.W2BASE], eq2: eqOf(G.W2BASE), boss: 0, b2: 0, clears: 0, tb: 0, coins: 0, dia: 0,
hpup: 0, hpup2: 0, world: 1, cl1: 0, perm: [], ann: 0, gems: 0, gl: [], fxo: [], fx: '', rev: 0, daily: '', streak: 0 });

  hpup: 0, hpup2: 0, world: 1, cl1: 0, perm: [], ann: 0, gems: 0, gl: [], fxo: [], fx: '', rev: 0, daily: '', streak: 0 });
function migrate(sv) {
  const d = newSave(); if (!sv) return d;
  if (sv.owned2 === undefined) {
  if (sv.owned2 === undefined) { // v2 -> v3: split the single inventory into World 1 and World 2
    const all = sv.owned || [];
    sv.owned2 = [...new Set([...G.W2BASE, ...all.filter(i => P[i] && P[i].wd)])];
    sv.owned = all.filter(i => P[i] && !P[i].wd);
@@ -255,17 +251,15 @@ function migrate(sv) {
const tradable = (i, w) => P[i] && !P[i].cu && !P[i].an && !P[i].gl && !P[i].st && !G.W1BASE.includes(i) && !!P[i].wd === (w === 2);
const listOf = (sv, w) => w === 2 ? sv.owned2 : sv.owned;
function fixEq(sv) { sv.eq = G.validEq(sv.eq, [...sv.owned, ...sv.gl], 1); sv.eq2 = G.validEq(sv.eq2, [...sv.owned2, ...sv.gl], 2); }

function giveItem(sv, id) {
  const p = P[id]; if (!p) return;
  const L = p.gl ? sv.gl : p.wd ? sv.owned2 : sv.owned;
  if (!L.includes(id)) L.push(id); sv.rev++;
}

function cleanSave(b, old, inRoom) {
  old = migrate(old);
  const int = (v, max) => Math.max(0, Math.min(max, Number.isInteger(+v) ? +v : 0));
  if (b.reset) {
  if (b.reset) { // New run: wipes the run (including admin gifts and custom items) but keeps purchases, permanent items and records
    const o1 = [...new Set([...G.W1BASE, ...old.perm.filter(i => P[i] && !P[i].wd)])], o2 = [...new Set([...G.W2BASE, ...old.perm.filter(i => P[i] && P[i].wd)])];
    return Object.assign({}, old, { owned: o1, owned2: o2, eq: G.validEq(null, o1, 1), eq2: G.validEq(null, o2, 2), boss: 0, b2: 0, world: 1, cl1: 0, coins: 0, dia: 0, hpup: 0, hpup2: 0, rev: old.rev + 1 });
  }
@@ -282,7 +276,16 @@ function cleanSave(b, old, inRoom) {
    hpup: int(b.hpup, 5), hpup2: int(b.hpup2, 5), cl1, world: cl1 && b.world == 2 ? 2 : 1, fx
  });
}

function cleanCustom(d) {
  const s = ['h', 'b', 'g', 'c'].includes(d.s) ? d.s : 'b';
  const o = { s, n: String(d.n || 'Custom item').trim().slice(0, 24) || 'Custom item', t: Math.round(NUM(d.t, 0, 6)), c: /^#[0-9a-f]{6}$/i.test(d.c) ? d.c : '#cccccc',
    atk: NUM(d.atk, -50, 999), spd: NUM(d.spd, -0.5, 3), def: NUM(d.def, -50, 99), crit: NUM(d.crit, 0, 1), life: NUM(d.life, 0, 1) };
  if (+d.world === 2) o.wd = 1;
  if (s === 'c') o.e = ['fire', 'ice', 'shock', 'blood', 'void', 'toxic', 'holy'].includes(d.e) ? d.e : 'fire';
  if (s === 'g') { o.w = Math.round(NUM(d.w, 14, 30)); if (['spike', 'wing'].includes(d.dc)) o.dc = d.dc; }
  if (s === 'b') { const a = Array.isArray(d.sh) ? d.sh.map(Number) : [30, 3, 5]; o.sh = [Math.round(NUM(a[0], 10, 37)), Math.round(NUM(a[1], 1, 7)), Math.round(NUM(a[2], 1, 8))]; }
  return o;
}
const customsFor = ids => ids.filter(i => i >= 1000 && DB.customs[i]).map(i => DB.customs[i]);
const allCustoms = sv => customsFor([...sv.owned, ...sv.owned2, ...Object.values(sv.eq), ...Object.values(sv.eq2)]);

@@ -293,40 +296,34 @@ function ageOf(dob) {
  if (now.getUTCMonth() + 1 < +m[2] || (now.getUTCMonth() + 1 === +m[2] && now.getUTCDate() < +m[3])) a--;
  return a;
}

const isAdmin = u => u === ADMIN;
const caps = (rec, u) => { const a = ageOf(rec.dob), v = isAdmin(u) || rec.verified; return { coop: !!(isAdmin(u) || (v && a !== null && a >= MIN_COOP)), social: !!(isAdmin(u) || (v && a !== null && a >= MIN_SOCIAL)), buy: !!(isAdmin(u) || (v && a !== null && a >= MIN_BUY)) }; };
const userInfo = (rec, u) => ({ username: u, name: rec.name, verified: !!(rec.verified || isAdmin(u)), needsInfo: !isAdmin(u) && (!rec.email || !rec.dob), age: ageOf(rec.dob), caps: caps(rec, u) });

async function sendMail(to, subject, text) {
  if (CFG.RESEND) {
    try { const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + CFG.RESEND, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: CFG.FROM, to: [to], subject, text }) }); return r.ok; }
    catch (e) { return false; }
  }
  console.log('[mail:dev] to', to, '|', subject, '|', text); return null;
}

async function sendCode(rec, u) {
  const code = String(crypto.randomInt(100000, 1000000));
  rec.vc = { h: sha(code + u), exp: Date.now() + 15 * 60000, tries: 0, last: Date.now() }; persist();
  const sent = await sendMail(rec.email, 'Your Forgebound verification code', `Your Forgebound verification code is ${code}. It expires in 15 minutes. If you did not create this account, ignore this email.`);
  return { sent, devCode: CFG.DEV_CODE ? code : undefined };
}

const validEmail = e => /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 120;
const validDob = d => { const a = ageOf(d); return a !== null && a >= 3 && a <= 110 && !isNaN(Date.parse(d)); };

// ---------- anniversary + daily ----------
function grantPerm(sv, ids) { for (const i of ids) { if (!sv.perm.includes(i)) sv.perm.push(i); const L = P[i].wd ? sv.owned2 : sv.owned; if (!L.includes(i)) L.push(i); } }

function annGift(rec, force) {
  const y = force ? new Date().getUTCFullYear() : G.annYear(Date.now()), sv = rec.save; if (!y) return null;
  const parts = P.filter(p => p.an).map(p => p.id), missing = parts.filter(i => !sv.perm.includes(i)), full = force || (sv.ann || 0) < y;
  if (!full && !missing.length) return null;
  grantPerm(sv, parts); if (full) { sv.coins += G.ANN.coins; sv.dia += G.ANN.dia; if (!force) sv.ann = y; } sv.rev++; persist();
  return { year: y, coins: full ? G.ANN.coins : 0, dia: full ? G.ANN.dia : 0, parts: full ? parts : missing };
}

const today = () => new Date().toISOString().slice(0, 10);
const extras = (rec) => ({ gift: annGift(rec), dailyReady: rec.save.daily !== today() });
const full = (rec, u) => ({ user: userInfo(rec, u), save: rec.save, customs: allCustoms(rec.save) });
@@ -335,7 +332,6 @@ const full = (rec, u) => ({ user: userInfo(rec, u), save: rec.save, customs: all
const rooms = new Map(), userRoom = new Map();
const CODE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
const newCode = () => { let c; do { c = Array.from({ length: 5 }, () => CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]).join(''); } while (rooms.has(c)); return c; };

function snapshot(room, u) {
  const rec = DB.users[u];
  return {
@@ -346,18 +342,15 @@ function snapshot(room, u) {
    coins: rec ? rec.save.coins : 0, rew: room.rew[u] || [], best: rec ? rec.save.tb || 0 : 0
  };
}

function broadcast(room) {
  room.ts = Date.now();
  for (const p of room.players) if (p.res && !p.off) { try { p.res.write('data: ' + JSON.stringify(snapshot(room, p.u)) + '\n\n'); } catch (e) { p.off = true; } }
}

function startFloor(room, f) {
  room.floor = f; room.boss = G.bossFor(f, room.n); room.bossMax = room.bossHp = room.boss.hp0;
  room.players.forEach(p => { p.hp = p.mx; p.dead = 0; p.dealt = 0; p.picked = false; });
  room.rew = {}; room.phase = 'fight';
}

function rollRewards(room) {
  room.gain = (20 + 8 * room.floor) * (room.boss.sp ? 2 : 1);
  for (const p of room.players) {
@@ -367,12 +360,10 @@ function rollRewards(room) {
  }
  persist();
}

function checkReward(room) {
  const active = room.players.filter(p => !p.off);
  if (room.phase === 'reward' && active.length && active.every(p => p.picked)) startFloor(room, room.floor + 1);
}

function removePlayer(room, u) {
  const i = room.players.findIndex(p => p.u === u); if (i < 0) return;
  const p = room.players[i]; if (p.res) { try { p.res.end(); } catch (e) {} } clearTimeout(p.timer);
@@ -382,9 +373,331 @@ function removePlayer(room, u) {
  if (room.phase === 'fight' && room.players.every(q => q.dead)) room.phase = 'over';
  checkReward(room); broadcast(room);
}

function roomOf(user, res) {
  const room = rooms.get(userRoom.get(user.u));
  if (!room) { fail(res, 404, 'You are not in a room'); return null; }
  if (!room) { fail(res, 404, 'You are not in a room.'); return null; }
  return room;
}
setInterval(() => { for (const r of rooms.values()) if (Date.now() - r.ts > 3600000) r.players.slice().forEach(p => removePlayer(r, p.u)); }, 60000);

// ---------- stripe ----------
function verifyStripe(raw, header, secret) {
  if (!header || !secret) return false;
  const parts = header.split(','), t = (parts.find(x => x.startsWith('t=')) || '').slice(2);
  const sig = crypto.createHmac('sha256', secret).update(t + '.' + raw).digest('hex');
  const ok = parts.filter(x => x.startsWith('v1=')).some(x => { const v = x.slice(3); return v.length === sig.length && crypto.timingSafeEqual(Buffer.from(v), Buffer.from(sig)); });
  return ok && Math.abs(Date.now() / 1000 - Number(t)) < 600;
}
function creditPayment(session) {
  if (!session || DB.paid[session.id] || session.payment_status !== 'paid') return false;
  const md = session.metadata || {}, rec = DB.users[md.user], pack = G.GEM_PACKS.find(x => x.id === md.pack);
  if (!rec || !pack || session.amount_total !== pack.cents) { console.error('payment mismatch', session.id); return false; }
  DB.paid[session.id] = { u: md.user, gems: pack.gems, t: Date.now() }; rec.save.gems += pack.gems; persist(); return true;
}

// ---------- API ----------
const gemItem = id => P[id] && P[id].gl ? P[id] : null;
async function handleApi(req, res, url) {
  const route = url.pathname;

  if (route === '/api/stripe/webhook') {
    const raw = await readBody(req, 200000);
    if (!verifyStripe(raw, req.headers['stripe-signature'], CFG.STRIPE_WH)) return fail(res, 400, 'Bad signature.');
    let ev; try { ev = JSON.parse(raw); } catch (e) { return fail(res, 400, 'Bad payload.'); }
    if (ev.type === 'checkout.session.completed' || ev.type === 'checkout.session.async_payment_succeeded') creditPayment(ev.data && ev.data.object);
    return json(res, 200, { received: true });
  }
  if (route === '/api/news') return json(res, 200, { news: DB.news.slice(-20).reverse(), patch: G.PATCH_NOTES, version: G.VERSION });
  if (route === '/api/top') {
    const top = Object.entries(DB.users).map(([u, r]) => ({ name: r.name, tb: r.save.tb || 0 })).filter(x => x.tb > 0).sort((a, b) => b.tb - a.tb).slice(0, 10);
    return json(res, 200, { top });
  }
  if (route === '/api/signup' || route === '/api/login') {
    if (limited(req)) return fail(res, 429, 'Too many attempts. Wait a few minutes.');
    const b = await body(req), u = String(b.username || '').toLowerCase(), pw = String(b.password || '');
    if (!/^[a-z0-9_]{3,16}$/.test(u)) return fail(res, 400, 'Username: 3 to 16 letters, numbers or underscores.');
    if (pw.length < 6 || pw.length > 100) return fail(res, 400, 'Password needs at least 6 characters.');
    let rec = DB.users[u], mail = null;
    if (route === '/api/signup') {
      const name = String(b.name || '').trim().slice(0, 20), email = String(b.email || '').trim().toLowerCase(), dob = String(b.dob || '');
      if (!name) return fail(res, 400, 'Enter your name.');
      if (rec) return fail(res, 409, 'That username is taken.');
      if (!isAdmin(u)) { if (!validEmail(email)) return fail(res, 400, 'Enter a valid email address.'); if (!validDob(dob)) return fail(res, 400, 'Enter your real date of birth.'); if (DB.emails[email]) return fail(res, 409, 'That email is already used.'); }
      const salt = crypto.randomBytes(16).toString('hex');
      rec = DB.users[u] = { name, salt, hash: (await scrypt(pw, salt)).toString('hex'), email: validEmail(email) ? email : '', dob: validDob(dob) ? dob : '', verified: isAdmin(u), vc: null, fr: { f: [], in: [], out: [] }, created: Date.now(), save: cleanSave(b.save || {}, newSave()) };
      if (rec.email) DB.emails[rec.email] = u;
      if (!rec.verified && rec.email) mail = await sendCode(rec, u);
      persist();
    } else {
      const ok = rec && crypto.timingSafeEqual(await scrypt(pw, rec.salt), Buffer.from(rec.hash, 'hex'));
      if (!ok) return fail(res, 401, 'Wrong username or password.');
    }
    const token = crypto.randomBytes(24).toString('hex');
    DB.sessions[sha(token)] = { u, t: Date.now() }; persist();
    return json(res, 200, Object.assign({ token }, full(rec, u), extras(rec), mail ? { devCode: mail.devCode, mailSent: mail.sent } : {}));
  }

  const t = (req.headers.authorization || '').replace('Bearer ', '') || url.searchParams.get('token') || '';
  const sess = t && DB.sessions[sha(t)];
  const rec = sess && Date.now() - sess.t < 60 * 86400000 ? DB.users[sess.u] : null;
  if (!rec) return fail(res, 401, 'Please log in.');
  const me = sess.u; rec.seen = Date.now(); const sv = rec.save;
  const cp = caps(rec, me);

  if (route === '/api/me') return json(res, 200, Object.assign(full(rec, me), extras(rec)));
  if (route === '/api/logout') { delete DB.sessions[sha(t)]; persist(); return json(res, 200, {}); }
  if (route === '/api/save') { const b = await body(req); rec.save = cleanSave(b, rec.save, userRoom.has(me)); persist(); return json(res, 200, { save: rec.save, customs: allCustoms(rec.save) }); }

  // ----- email verification and profile -----
  if (route === '/api/verify') {
    const b = await body(req), vc = rec.vc;
    if (rec.verified) return json(res, 200, { user: userInfo(rec, me) });
    if (!vc || Date.now() > vc.exp) return fail(res, 400, 'That code expired. Send a new one.');
    if (vc.tries >= 5) return fail(res, 429, 'Too many tries. Send a new code.');
    vc.tries++; if (sha(String(b.code || '').trim() + me) !== vc.h) { persist(); return fail(res, 400, 'Wrong code.'); }
    rec.verified = true; rec.vc = null; persist(); return json(res, 200, { user: userInfo(rec, me) });
  }
  if (route === '/api/verify/resend') {
    if (rec.verified || !rec.email) return fail(res, 400, 'Nothing to verify.');
    if (rec.vc && Date.now() - rec.vc.last < 60000) return fail(res, 429, 'Wait a minute before asking for another code.');
    const m = await sendCode(rec, me); return json(res, 200, { mailSent: m.sent, devCode: m.devCode });
  }
  if (route === '/api/profile') {
    const b = await body(req), email = String(b.email || '').trim().toLowerCase(), dob = String(b.dob || '');
    if (rec.email && rec.dob) return fail(res, 400, 'Your profile is already set.');
    if (!validEmail(email)) return fail(res, 400, 'Enter a valid email address.');
    if (!validDob(dob)) return fail(res, 400, 'Enter your real date of birth.');
    if (DB.emails[email] && DB.emails[email] !== me) return fail(res, 409, 'That email is already used.');
    rec.email = email; rec.dob = dob; rec.verified = false; DB.emails[email] = me; const m = await sendCode(rec, me);
    return json(res, 200, { user: userInfo(rec, me), mailSent: m.sent, devCode: m.devCode });
  }

  // ----- daily reward -----
  if (route === '/api/daily') {
    const d = today(); if (sv.daily === d) return fail(res, 409, 'You already claimed today.');
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    sv.streak = sv.daily === y ? sv.streak + 1 : 1; sv.daily = d;
    const coins = 50 + 25 * Math.min(sv.streak, 7), dia = sv.cl1 ? 2 * Math.min(sv.streak, 5) : 0;
    sv.coins += coins; sv.dia += dia; sv.rev++; persist();
    return json(res, 200, { coins, dia, streak: sv.streak, save: sv });
  }

  // ----- gems shop -----
  if (route === '/api/shop') return json(res, 200, { packs: G.GEM_PACKS, payments: !!(CFG.STRIPE_KEY && CFG.STRIPE_WH && CFG.PUBLIC_URL), canBuy: cp.buy });
  if (route === '/api/shop/checkout') {
    if (!cp.buy) return fail(res, 403, 'Buying needs a verified email and age 13 or older.');
    if (!(CFG.STRIPE_KEY && CFG.STRIPE_WH && CFG.PUBLIC_URL)) return fail(res, 503, 'Payments are not set up on this server yet.');
    const b = await body(req), pack = G.GEM_PACKS.find(x => x.id === b.pack); if (!pack) return fail(res, 400, 'Unknown pack.');
    const f = new URLSearchParams({ mode: 'payment', success_url: CFG.PUBLIC_URL + '/?paid=1', cancel_url: CFG.PUBLIC_URL + '/?paid=0', client_reference_id: me, 'metadata[user]': me, 'metadata[pack]': pack.id,
      'line_items[0][quantity]': '1', 'line_items[0][price_data][currency]': 'usd', 'line_items[0][price_data][unit_amount]': String(pack.cents), 'line_items[0][price_data][product_data][name]': pack.gems + ' Forgebound Gems' });
    try {
      const r = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: 'Bearer ' + CFG.STRIPE_KEY, 'Content-Type': 'application/x-www-form-urlencoded' }, body: f });
      const j = await r.json(); if (!r.ok || !j.url) return fail(res, 502, 'Could not start checkout.'); return json(res, 200, { url: j.url });
    } catch (e) { return fail(res, 502, 'Could not reach the payment provider.'); }
  }
  if (route === '/api/gems/buy') {
    if (!cp.buy) return fail(res, 403, 'Buying needs a verified email and age 13 or older.');
    const b = await body(req);
    if (b.kind === 'fx') {
      const f = G.FX.find(x => x.id === b.id); if (!f) return fail(res, 400, 'Unknown effect.'); if (sv.fxo.includes(f.id)) return fail(res, 409, 'You already own that.');
      if (sv.gems < f.g) return fail(res, 402, 'Not enough gems.'); sv.gems -= f.g; sv.fxo.push(f.id);
    } else {
      const it = gemItem(+b.id); if (!it) return fail(res, 400, 'Unknown item.'); if (sv.gl.includes(it.id)) return fail(res, 409, 'You already own that.');
      if (sv.gems < it.gp) return fail(res, 402, 'Not enough gems.'); sv.gems -= it.gp; sv.gl.push(it.id);
    }
    sv.rev++; persist(); return json(res, 200, { save: sv });
  }

  // ----- friends, chat, trading (verified, 13+) -----
  if (route.startsWith('/api/friends') || route.startsWith('/api/chat') || route.startsWith('/api/trade')) {
    if (!cp.social) return fail(res, 403, 'Friends, chat and trading need a verified email and age 13 or older.');
    const fr = rec.fr = rec.fr || { f: [], in: [], out: [] };
    const nm = u => (DB.users[u] || {}).name || u, online = u => Date.now() - ((DB.users[u] || {}).seen || 0) < 60000;
    const ok2 = u => DB.users[u] && caps(DB.users[u], u).social;
    if (route === '/api/friends') return json(res, 200, { friends: fr.f.map(u => ({ u, name: nm(u), online: online(u) })), incoming: fr.in.map(u => ({ u, name: nm(u) })), outgoing: fr.out.map(u => ({ u, name: nm(u) })) });
    const b = req.method === 'POST' ? await body(req) : {};
    if (route === '/api/friends/request') {
      const o = String(b.username || '').toLowerCase(), other = DB.users[o];
      if (!other || o === me) return fail(res, 404, 'No player with that username.');
      if (!ok2(o)) return fail(res, 403, 'That player cannot use friends.');
      if (fr.f.includes(o)) return fail(res, 409, 'You are already friends.');
      other.fr = other.fr || { f: [], in: [], out: [] };
      if (fr.in.includes(o)) { fr.in = fr.in.filter(x => x !== o); other.fr.out = other.fr.out.filter(x => x !== me); fr.f.push(o); other.fr.f.push(me); persist(); return json(res, 200, { accepted: true }); }
      if (!fr.out.includes(o)) { if (fr.out.length >= 30) return fail(res, 429, 'Too many pending requests.'); fr.out.push(o); other.fr.in.push(me); }
      persist(); return json(res, 200, { ok: true });
    }
    if (route === '/api/friends/accept' || route === '/api/friends/decline' || route === '/api/friends/remove') {
      const o = String(b.username || '').toLowerCase(), other = DB.users[o]; if (!other) return fail(res, 404, 'No such player.');
      other.fr = other.fr || { f: [], in: [], out: [] };
      if (route === '/api/friends/accept') { if (!fr.in.includes(o)) return fail(res, 400, 'No request from that player.'); fr.in = fr.in.filter(x => x !== o); other.fr.out = other.fr.out.filter(x => x !== me); fr.f.push(o); other.fr.f.push(me); }
      else if (route === '/api/friends/decline') { fr.in = fr.in.filter(x => x !== o); other.fr.out = other.fr.out.filter(x => x !== me); }
      else { fr.f = fr.f.filter(x => x !== o); other.fr.f = other.fr.f.filter(x => x !== me); }
      persist(); return json(res, 200, { ok: true });
    }
    if (route === '/api/friends/items') {
      const o = String(url.searchParams.get('with') || '').toLowerCase(), other = DB.users[o];
      if (!fr.f.includes(o) || !other) return fail(res, 403, 'You can only trade with friends.');
      const pick = (sv, w) => listOf(sv, w).filter(i => tradable(i, w));
      return json(res, 200, { mine: { w1: pick(sv, 1), w2: sv.cl1 ? pick(sv, 2) : [] }, theirs: { w1: pick(other.save, 1), w2: other.save.cl1 ? pick(other.save, 2) : [] } });
    }
    const ck = (a, c) => [a, c].sort().join('|');
    if (route === '/api/chat') {
      const o = String(url.searchParams.get('with') || '').toLowerCase(); if (!fr.f.includes(o)) return fail(res, 403, 'You can only chat with friends.');
      const since = +url.searchParams.get('since') || 0; return json(res, 200, { msgs: (DB.chats[ck(me, o)] || []).filter(m => m.t > since) });
    }
    if (route === '/api/chat/send') {
      const o = String(b.to || '').toLowerCase(), x = String(b.text || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 200);
      if (!fr.f.includes(o)) return fail(res, 403, 'You can only chat with friends.'); if (!x) return fail(res, 400, 'Type a message.');
      if (rec.lastChat && Date.now() - rec.lastChat < 800) return fail(res, 429, 'Slow down.'); rec.lastChat = Date.now();
      const k = ck(me, o), arr = DB.chats[k] = DB.chats[k] || []; arr.push({ f: me, t: Date.now(), x }); if (arr.length > 150) arr.splice(0, arr.length - 150); persist(); return json(res, 200, { ok: true });
    }
    if (route === '/api/trades') {
      const open = Object.values(DB.trades).filter(x => x.status === 'open' && (x.from === me || x.to === me)).map(x => ({ ...x, fromName: nm(x.from), toName: nm(x.to) }));
      return json(res, 200, { trades: open });
    }
    const chk = (t) => {
      const A = DB.users[t.from], Bq = DB.users[t.to]; if (!A || !Bq) return 'Player missing.';
      const la = listOf(A.save, t.world), lb = listOf(Bq.save, t.world);
      for (const i of t.give) if (!tradable(i, t.world) || !la.includes(i) || lb.includes(i)) return 'One of the offered items is no longer available.';
      for (const i of t.want) if (!tradable(i, t.world) || !lb.includes(i) || la.includes(i)) return 'One of the requested items is no longer available.';
      return null;
    };
    if (route === '/api/trade/offer') {
      const o = String(b.to || '').toLowerCase(), w = +b.world === 2 ? 2 : 1;
      if (!fr.f.includes(o)) return fail(res, 403, 'You can only trade with friends.'); if (!ok2(o)) return fail(res, 403, 'That player cannot trade.');
      const ids = a => [...new Set((Array.isArray(a) ? a : []).map(Number))].slice(0, 4);
      const tr = { id: DB.nextTrade++, from: me, to: o, world: w, give: ids(b.give), want: ids(b.want), t: Date.now(), status: 'open' };
      if (!tr.give.length && !tr.want.length) return fail(res, 400, 'Choose something to trade.');
      if (w === 2 && !sv.cl1) return fail(res, 403, 'You have not unlocked World 2.');
      const e = chk(tr); if (e) return fail(res, 400, e);
      if (Object.values(DB.trades).filter(x => x.status === 'open' && x.from === me).length >= 10) return fail(res, 429, 'Too many open offers.');
      DB.trades[tr.id] = tr; persist(); return json(res, 200, { id: tr.id });
    }
    if (route === '/api/trade/accept' || route === '/api/trade/cancel') {
      const tr = DB.trades[+b.id]; if (!tr || tr.status !== 'open') return fail(res, 404, 'That offer is gone.');
      if (route === '/api/trade/cancel') { if (tr.from !== me && tr.to !== me) return fail(res, 403, 'Not your offer.'); tr.status = 'cancelled'; persist(); return json(res, 200, { ok: true }); }
      if (tr.to !== me) return fail(res, 403, 'Only the player who received the offer can accept.');
      const e = chk(tr); if (e) { tr.status = 'cancelled'; persist(); return fail(res, 400, e); }
      const A = DB.users[tr.from].save, Bq = DB.users[tr.to].save, la = listOf(A, tr.world), lb = listOf(Bq, tr.world);
      for (const i of tr.give) { la.splice(la.indexOf(i), 1); lb.push(i); } for (const i of tr.want) { lb.splice(lb.indexOf(i), 1); la.push(i); }
      A.rev++; Bq.rev++; fixEq(A); fixEq(Bq); tr.status = 'done'; persist(); return json(res, 200, { save: Bq });
    }
    return fail(res, 404, 'Unknown route.');
  }

  // ----- admin -----
  if (route.startsWith('/api/admin/')) {
    if (me !== ADMIN) return fail(res, 403, 'Admins only.');
    if (route === '/api/admin/users') return json(res, 200, { users: Object.entries(DB.users).map(([u, r]) => ({ u, name: r.name })) });
    const b = await body(req);
    if (route === '/api/admin/news') {
      if (b.del) { DB.news = DB.news.filter(n => n.id !== +b.del); persist(); return json(res, 200, { ok: true }); }
      const title = String(b.title || '').trim().slice(0, 80), text = String(b.text || '').trim().slice(0, 600); if (!title) return fail(res, 400, 'Add a title.');
      DB.news.push({ id: Date.now(), t: Date.now(), title, text }); persist(); return json(res, 200, { ok: true });
    }
    const tu = String(b.username || '').toLowerCase(), target = DB.users[tu]; if (!target) return fail(res, 404, 'No such player.');
    const ts = target.save;
    if (route === '/api/admin/give') { const id = +b.part; if (!P[id]) return fail(res, 400, 'No such part.'); giveItem(ts, id); persist(); return json(res, 200, { ok: true }); }
    if (route === '/api/admin/custom') {
      const d = cleanCustom(b.part || {}); d.id = DB.nextCustom++; const p = G.addCustom(d); DB.customs[d.id] = p; giveItem(ts, d.id); persist(); return json(res, 200, { part: p });
    }
    if (route === '/api/admin/coins') { ts.coins = Math.max(0, Math.min(999999, ts.coins + Math.round(NUM(b.amount, -999999, 999999)))); ts.rev++; persist(); return json(res, 200, { coins: ts.coins }); }
    if (route === '/api/admin/diamonds') { ts.dia = Math.max(0, Math.min(999999, ts.dia + Math.round(NUM(b.amount, -999999, 999999)))); ts.rev++; persist(); return json(res, 200, { dia: ts.dia }); }
    if (route === '/api/admin/gems') { ts.gems = Math.max(0, Math.min(999999, ts.gems + Math.round(NUM(b.amount, -999999, 999999)))); persist(); return json(res, 200, { gems: ts.gems }); }
    if (route === '/api/admin/world') { ts.cl1 = 1; ts.rev++; persist(); return json(res, 200, { ok: true }); }
    if (route === '/api/admin/anniversary') { annGift(target, true); return json(res, 200, { ok: true }); }
    if (route === '/api/admin/verify') { target.verified = true; persist(); return json(res, 200, { ok: true }); }
    return fail(res, 404, 'Unknown route.');
  }

  // ----- co-op -----
  if (route === '/api/room/events') {
    const room = rooms.get(String(url.searchParams.get('code') || '').toLowerCase());
    const p = room && room.players.find(x => x.u === me);
    if (!p) return fail(res, 404, 'Room not found.');
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.on('error', () => {});
    if (p.res) { try { p.res.end(); } catch (e) {} }
    p.res = res; p.off = false; clearTimeout(p.timer);
    res.write('retry: 2000\n\n');
    const ping = setInterval(() => { try { res.write(': ping\n\n'); } catch (e) {} }, 20000);
    req.on('close', () => {
      clearInterval(ping);
      if (p.res !== res) return;
      p.off = true; p.res = null;
      p.timer = setTimeout(() => removePlayer(room, me), 20000);
      if (room.phase === 'fight' && room.players.every(q => q.dead)) room.phase = 'over';
      checkReward(room); broadcast(room);
    });
    broadcast(room); return;
  }
  if (route === '/api/room/create' || route === '/api/room/join') {
    if (!cp.coop) return fail(res, 403, 'Co-op needs a verified email and age 8 or older.');
    const b = await body(req);
    const old = rooms.get(userRoom.get(me)); if (old) removePlayer(old, me);
    let room;
    if (route === '/api/room/create') {
      const cap = [2, 3, 4].includes(+b.cap) ? +b.cap : 2;
      room = { code: newCode(), cap, host: me, phase: 'wait', players: [], floor: 0, n: 2, boss: null, bossHp: 0, bossMax: 0, seq: 0, ev: null, evs: [], rew: {}, ts: Date.now() };
      rooms.set(room.code, room);
    } else {
      room = rooms.get(String(b.code || '').toLowerCase());
      if (!room) return fail(res, 404, 'No room with that code.');
      if (room.phase !== 'wait') return fail(res, 409, 'That tower already started.');
      if (room.players.length >= room.cap) return fail(res, 409, 'That room is full.');
    }
    const mx = G.maxHp(sv.hpup, 1);
    room.players.push({ u: me, nm: rec.name, eq: G.validEq(sv.eq, [...sv.owned, ...sv.gl], 1), hp: mx, mx, dead: 0, dealt: 0, last: 0, picked: false, res: null, off: false, timer: null });
    userRoom.set(me, room.code); broadcast(room);
    return json(res, 200, { code: room.code });
  }
  const room = rooms.get(userRoom.get(me)); const rm = () => { if (!room) { fail(res, 404, 'You are not in a room.'); return null; } return room; };
  if (route.startsWith('/api/room/')) {
    if (!rm()) return;
    const mp = room.players.find(p => p.u === me);
    if (route === '/api/room/leave') { removePlayer(room, me); return json(res, 200, {}); }
    if (route === '/api/room/start') {
      if (room.host !== me || room.phase !== 'wait') return fail(res, 403, 'Only the host can start.');
      if (room.players.length < 2) return fail(res, 400, 'Need at least 2 players.');
      room.n = room.players.length; startFloor(room, 1); broadcast(room); return json(res, 200, {});
    }
    if (route === '/api/room/swing') {
      if (room.phase !== 'fight' || mp.dead) return fail(res, 409, 'You cannot swing right now.');
      const s = G.stats(mp.eq), now = Date.now();
      if (now - mp.last < Math.max(650, 1000 / s.spd) - 300) return fail(res, 429, 'Too fast.');
      mp.last = now;
      const { d, t } = G.dmg(s, room.boss.w, Math.random), rc = G.recoil(room.boss.r, s.def);
      room.bossHp = Math.max(0, room.bossHp - d); mp.dealt += d;
      if (s.life) mp.hp = Math.min(mp.mx, mp.hp + Math.min(Math.round(d * s.life), Math.floor(rc * 0.6)));
      mp.hp -= rc; if (mp.hp <= 0) { mp.hp = 0; mp.dead = 1; }
      room.ev = { seq: ++room.seq, by: mp.u, d, t, rec: rc }; room.evs.push(room.ev); if (room.evs.length > 12) room.evs.shift();
      if (room.bossHp <= 0) { room.phase = 'reward'; rollRewards(room); }
      else if (room.players.every(p => p.dead)) room.phase = 'over';
      broadcast(room); return json(res, 200, { ok: true, seq: room.seq });
    }
    if (route === '/api/room/reward') {
      const b = await body(req), id = +b.id;
      if (room.phase !== 'reward' || mp.picked) return fail(res, 409, 'Nothing to pick.');
      if (id !== -1 && !(room.rew[me] || []).includes(id)) return fail(res, 400, 'Invalid reward.');
      if (id !== -1 && !sv.owned.includes(id)) { sv.owned.push(id); sv.rev++; }
      mp.picked = true; persist(); checkReward(room); broadcast(room);
      return json(res, 200, { owned: sv.owned, rev: sv.rev });
    }
  }
  return fail(res, 404, 'Unknown route.');
}

// ---------- static: index.html and the shared rules ----------
function serveStatic(req, res, url) {
  if (url.pathname === '/shared.js') { res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-cache' }); return res.end(SHARED); }
  if (url.pathname !== '/' && url.pathname !== '/index.html') return fail(res, 404, 'Not found');
  fs.readFile(path.join(__dirname, 'index.html'), (e, data) => {
    if (e) return fail(res, 500, 'index.html is missing. Put it in the same folder as server.js.');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' }); res.end(data);
  });
}
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try { if (url.pathname.startsWith('/api/')) await handleApi(req, res, url); else serveStatic(req, res, url); }
  catch (e) { console.error(e); if (!res.headersSent) fail(res, 400, 'Bad request.'); }
}).listen(PORT, () => console.log('Forgebound ' + G.VERSION + ' running on port ' + PORT));
