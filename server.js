'use strict';
// Forgebound server: accounts (email + age), saves, friends, chat, trading, gems shop, news, co-op tower.
// No npm packages. Needs Node 18+.
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');

const SHARED = String.raw`(function(root){
const P=[
{s:'h',n:'Worn Grip',def:1,c:'#8a6d4b',t:0},{s:'h',n:'Leather Wrap',def:2,spd:.2,c:'#a5683a',t:1},
{s:'h',n:'Spider Silk',def:1,spd:.5,c:'#cfd5e0',t:1},{s:'h',n:'Bone Hilt',atk:3,def:1,c:'#e8e0c8',t:2},
{s:'h',n:'Iron Haft',atk:2,def:4,spd:-.2,c:'#6b7482',t:2},{s:'h',n:'Obsidian Shaft',atk:4,def:4,c:'#3a3160',t:3},
{s:'b',n:'Rust Blade',atk:6,c:'#9a6a4a',p:'M30 8L38 120L22 120Z',t:0},{s:'b',n:'Steel Edge',atk:9,spd:.1,c:'#b9c4d3',p:'M30 6L40 24L38 120L22 120L20 24Z',t:1},
{s:'b',n:'Rapier',atk:7,spd:.6,c:'#d5dde8',p:'M30 4L33 120L27 120Z',t:1},{s:'b',n:'Cleaver',atk:15,spd:-.3,c:'#8f9aab',p:'M30 20L52 40L44 120L18 120L18 40Z',t:2},
{s:'b',n:'Reaper Scythe',atk:13,crit:.1,c:'#9a86cc',p:'M22 120L26 30Q40 5 56 20Q38 22 36 50L38 120Z',t:3},
{s:'b',n:'Glass Fang',atk:19,def:-2,c:'#9fe9ff',p:'M30 6L40 60L34 120L26 120L20 60Z',t:3},{s:'b',n:'Greatblade',atk:24,spd:-.5,c:'#c9d2df',p:'M30 2L46 20L42 120L18 120L14 20Z',t:4},
{s:'g',n:'Bare Guard',w:14,c:'#777',t:0},{s:'g',n:'Buckler',def:3,w:24,c:'#8b93a0',t:1},{s:'g',n:'Spiked Guard',atk:3,def:1,w:26,c:'#b05555',t:2},
{s:'g',n:'Wing Guard',spd:.3,def:2,w:28,c:'#d6c27a',t:3},{s:'g',n:'Bulwark Guard',def:6,w:30,c:'#5d80a8',t:4},
{s:'c',n:'Dull Stone',e:'none',t:0},{s:'c',n:'Ember Core',e:'fire',atk:3,t:1},{s:'c',n:'Frost Core',e:'ice',def:2,t:1},
{s:'c',n:'Volt Core',e:'shock',spd:.4,t:2},{s:'c',n:'Vein Core',e:'blood',life:.2,t:2},{s:'c',n:'Void Core',e:'void',crit:.25,t:3}];

const A=(s,t,n,c,o)=>P.push(Object.assign({s,n,t,c},o));
A('h',1,'Oak Grip','#8a5a2b',{def:2,atk:1});A('h',1,'Rope Wrap','#c9b48a',{spd:.3,def:1});
A('h',2,'Wolf Fang Hilt','#d8d2c0',{atk:4,spd:.2});A('h',2,'Steel Tang','#7d8797',{def:3,atk:2,spd:.1});
A('h',3,'Dragonbone Haft','#e6dcc0',{atk:5,def:3,spd:.2});A('h',3,'Shadow Silk','#3b3552',{spd:.7,def:2,crit:.05});
A('h',4,'Sunforged Grip','#e0a63a',{atk:6,def:5,spd:.3});A('h',4,'Void Wrapped','#4a2b7a',{atk:5,def:4,crit:.1,spd:.2});
A('h',5,'Crimson Wyrmhide','#b3202f',{atk:9,def:7,spd:.4,life:.05});A('h',5,'Blood Moon Grip','#8c1230',{atk:8,def:6,spd:.6,crit:.1});
A('h',6,'Halo Shaft','#fff0a8',{atk:13,def:10,spd:.8,crit:.1,life:.08});A('h',6,'Aether Hilt','#fffbe0',{atk:12,def:11,spd:1,crit:.08});
A('b',0,'Bronze Dagger','#b98a52',{atk:5,spd:.4,sh:[18,2,3]});A('b',1,'Iron Sabre','#aab4c2',{atk:11,spd:.1,sh:[28,3,5]});
A('b',1,"Hunter's Knife",'#c3ccd8',{atk:8,spd:.5,sh:[20,2,4]});A('b',2,'Katana','#dfe6f0',{atk:14,spd:.3,crit:.05,sh:[30,2,6]});
A('b',2,'Bone Saw','#e8e0c8',{atk:16,spd:-.1,life:.05,sh:[26,4,3]});A('b',3,'Executioner','#8a94a6',{atk:24,spd:-.4,crit:.1,sh:[32,5,4]});
A('b',3,'Moonlit Edge','#b8c8ff',{atk:17,spd:.4,crit:.08,sh:[30,3,6]});A('b',4,'Dragonslayer','#9fb0c8',{atk:30,spd:-.5,def:1,sh:[36,6,5]});
A('b',4,'Stormcaller','#7fd6ff',{atk:22,spd:.5,crit:.1,sh:[32,3,7]});A('b',4,'Soul Reaver','#8be0a8',{atk:24,spd:.1,life:.1,sh:[34,4,6]});
A('b',5,'Crimson Ruin','#ff4a4a',{atk:38,spd:-.2,crit:.12,life:.06,sh:[36,5,5]});A('b',5,'Nightfall','#d02a3c',{atk:33,spd:.5,crit:.15,sh:[34,3,7]});
A('b',6,'Solaris','#fff3b0',{atk:50,spd:.2,crit:.15,life:.08,sh:[36,5,6]});A('b',6,'Worldsplitter','#fffbe0',{atk:58,spd:-.2,crit:.1,def:3,sh:[37,7,5]});
A('g',1,'Iron Cross','#8a919c',{def:2,atk:1,w:20});A('g',1,'Round Guard','#a06a3a',{def:4,spd:-.1,w:26});
A('g',2,'Hawk Wings','#c9b48a',{spd:.4,def:1,w:28,dc:'wing'});A('g',2,"Knight's Guard",'#6f7f95',{def:5,w:26});
A('g',3,'Thorn Guard','#4d8a4a',{atk:5,def:3,w:26,dc:'spike'});A('g',3,'Storm Wings','#7fd6ff',{spd:.6,def:2,w:30,dc:'wing'});
A('g',4,'Dragon Aegis','#c98a2a',{def:9,atk:2,w:30});A('g',4,'Blade Wings','#b9c4d3',{atk:5,spd:.5,def:3,w:30,dc:'wing'});
A('g',5,'Crimson Bastion','#b3202f',{def:13,atk:4,life:.05,w:30,dc:'spike'});A('g',5,'Reaper Wings','#8c1230',{atk:8,spd:.7,def:6,w:30,dc:'wing'});
A('g',6,'Halo Guard','#fff0a8',{def:18,atk:6,spd:.4,w:30});A('g',6,'Seraph Wings','#fffbe0',{atk:8,spd:.9,def:12,w:30,dc:'wing'});
A('c',1,'Toxic Core','',{e:'toxic',def:1,atk:2});A('c',2,'Magma Core','',{e:'fire',atk:5});A('c',2,'Glacier Core','',{e:'ice',def:3,atk:2});
A('c',2,'Viper Core','',{e:'toxic',atk:3,crit:.08});A('c',3,'Tempest Core','',{e:'shock',atk:4,spd:.5});A('c',3,'Wraith Core','',{e:'void',crit:.15,atk:3});
A('c',3,'Leech Core','',{e:'blood',life:.15,atk:3});A('c',4,'Inferno Heart','',{e:'fire',atk:9,crit:.1});A('c',4,'Absolute Zero','',{e:'ice',atk:6,def:5,spd:.2});
A('c',4,'Plague Heart','',{e:'toxic',atk:7,life:.1,crit:.1});A('c',5,'Bloodstar','',{e:'blood',atk:11,life:.2,crit:.1});A('c',5,'Abyss Eye','',{e:'void',atk:10,crit:.3});
A('c',5,'Dragon Heart','',{e:'fire',atk:14,def:4,spd:.2});A('c',5,'Stormheart','',{e:'shock',atk:11,spd:.6,crit:.08});A('c',5,'Permafrost Heart','',{e:'ice',atk:9,def:8,spd:.3});
A('c',5,'Blight Heart','',{e:'toxic',atk:12,life:.12,crit:.1});A('c',6,'Sunheart','',{e:'holy',atk:16,crit:.2,life:.1});A('c',6,'Genesis Core','',{e:'holy',atk:14,def:8,spd:.6,life:.08});

const Z=(s,t,n,c,o)=>{o=Object.assign({},o);if(o.atk)o.atk=Math.round(o.atk*.55);if(o.def)o.def=Math.round(o.def*.55);P.push(Object.assign({s,n,t,c,wd:1},o))};
Z('h',2,'Dune Wrap','#d9b36a',{atk:7,def:6,spd:.2});Z('h',2,'Sand Cord','#c9b48a',{atk:5,def:5,spd:.5});
Z('h',3,'Cactus Grip','#4d8a4a',{atk:10,def:8,spd:.2});Z('h',3,'Frost Hide','#cfe6ff',{atk:8,def:10,spd:.3,life:.04});
Z('h',4,'Magma Haft','#c2491d',{atk:14,def:12,spd:.3});Z('h',4,'Storm Silk','#7a8cff',{atk:12,def:10,spd:.8,crit:.06});
Z('h',5,'Ashen Grip','#ff4a4a',{atk:20,def:16,spd:.5,life:.05});Z('h',5,'Rift Wrap','#d02a3c',{atk:18,def:14,spd:.9,crit:.1});
Z('h',6,'Eclipse Haft','#ffffff',{atk:28,def:22,spd:1,crit:.1,life:.08});
Z('b',2,'Scimitar','#e0d2a8',{atk:30,spd:.3,sh:[30,3,6]});Z('b',2,'Desert Fang','#d9c08a',{atk:34,spd:.1,crit:.06,sh:[28,4,5]});
Z('b',3,'Bone Cleaver','#e8e0c8',{atk:46,spd:-.2,sh:[30,6,3]});Z('b',3,'Frostbrand','#9fd8ff',{atk:40,spd:.3,crit:.08,sh:[34,3,6]});
Z('b',4,'Magma Greatsword','#ff7a3d',{atk:62,spd:-.3,sh:[37,7,5]});Z('b',4,'Tempest Blade','#7fd6ff',{atk:50,spd:.5,crit:.1,sh:[34,3,7]});
Z('b',5,'Rift Reaver','#ff4a4a',{atk:82,spd:.1,crit:.15,life:.08,sh:[36,5,6]});Z('b',5,'Starfall','#d02a3c',{atk:74,spd:.6,crit:.18,sh:[35,3,7]});
Z('b',6,'Eternity Edge','#ffffff',{atk:120,spd:.3,crit:.2,life:.1,def:4,sh:[37,6,6]});
Z('g',2,'Scarab Guard','#c9a23a',{def:9,atk:2,w:26});Z('g',2,'Sand Wings','#e0d2a8',{def:4,spd:.4,w:28,dc:'wing'});
Z('g',3,'Frost Aegis','#9fd8ff',{def:14,w:28});Z('g',3,'Thorn Crown','#4d8a4a',{def:9,atk:8,w:26,dc:'spike'});
Z('g',4,'Magma Bulwark','#c2491d',{def:20,atk:4,w:30});Z('g',4,'Storm Wings','#7a8cff',{def:12,spd:.7,atk:6,w:30,dc:'wing'});
Z('g',5,'Rift Bastion','#b3202f',{def:28,atk:8,life:.05,w:30,dc:'spike'});Z('g',5,'Void Wings','#8c1230',{def:18,atk:12,spd:.9,w:30,dc:'wing'});
Z('g',6,'Eclipse Aegis','#ffffff',{def:38,atk:12,spd:.5,w:30});
Z('c',2,'Sand Heart','',{e:'fire',atk:10});Z('c',2,'Rime Shard','',{e:'ice',atk:5,def:5});
Z('c',3,'Thunder Shard','',{e:'shock',atk:9,spd:.5});Z('c',3,'Venom Shard','',{e:'toxic',atk:8,crit:.1});
Z('c',4,'Blood Shard','',{e:'blood',atk:14,life:.15,crit:.08});Z('c',4,'Null Shard','',{e:'void',atk:12,crit:.3});
Z('c',5,'Ruin Heart','',{e:'fire',atk:24,def:6,spd:.3});Z('c',5,'Absolute Rime','',{e:'ice',atk:16,def:14,spd:.3});
Z('c',6,'Oblivion Heart','',{e:'holy',atk:30,crit:.2,life:.1,spd:.5,def:10});
const Y=(s,n,c,o)=>P.push(Object.assign({s,n,t:4,c,an:1},o));
Y('h','Party Popper Grip','#ff7ac8',{atk:6,def:5,spd:.3});Y('b','Confetti Cutter','#ffe14d',{atk:30,spd:.2,crit:.1,sh:[34,4,6]});
Y('g','Cake Guard','#fff0a8',{def:9,atk:3,spd:.2,w:28,dc:'wing'});Y('c','Sparkler Core','',{e:'fire',atk:9,crit:.12,spd:.2});

const TCOL=['#a98c5a','#b9c4d3','#7fb0d8','#9a86e0','#e0a63a','#ff4a4a','#fff3b0'];
const tint=(c,f)=>{const n=parseInt(c.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,m=f>0?255:0,a=Math.abs(f),q=x=>Math.round(x+(m-x)*a);return '#'+[q(r),q(g),q(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
const NOUN={h:['Grip','Wrap','Haft','Hilt','Shaft','Cord','Handle'],b:['Blade','Sword','Saber','Edge','Fang','Cutter','Reaver'],g:['Guard','Aegis','Wings','Crown','Bulwark','Ward','Cross'],c:['Core','Heart','Shard','Gem','Orb','Spark','Soul']};
const PRE1=[['Pine','Reed','Clay','Cobble'],['Copper','Willow','Birch','Tin','Brass'],['Silver','Ash','Hawk','Granite','Amber'],['Onyx','Cobalt','Viper','Thunder','Jade'],['Dragon','Phoenix','Titan','Wyvern','Sun'],['Crimson','Blood','Scarlet','Ruby','Inferno'],['Celestial','Divine','Radiant','Halo','Seraph']];
const PRE2=[['Dust','Bone','Salt'],['Sand','Cactus','Dune','Oasis'],['Thorn','Moss','Fae','Bark'],['Frost','Glacier','Rime','Hail'],['Magma','Cinder','Obsidian','Slag'],['Void','Rift','Umbral','Eclipse'],['Genesis','Aether','Zenith','Omega']];
const GB={h:{a:[2,3,5,7,10,14,20],d:[1,3,5,8,11,15,22]},b:{a:[6,10,15,22,32,45,62],d:[0,0,0,0,0,0,0]},g:{a:[0,1,2,4,6,9,13],d:[1,3,6,9,14,20,28]},c:{a:[0,3,6,9,13,18,26],d:[0,0,0,0,0,0,0]}};
const ARCH=['brute','tank','swift','crit','vamp','bal'],ELEM=['fire','ice','shock','toxic','blood','void'],SLOTS=['h','b','g','c'];
const taken=new Set(P.map(p=>p.n));
function gen(w,t,k,s,si){const arch=ARCH[(t*3+k*2+si)%6],pre=(w==2?PRE2:PRE1)[t],noun=NOUN[s];
let n=pre[(k*2+si)%pre.length]+' '+noun[(t+k*2+si)%noun.length];while(taken.has(n))n+=' II';taken.add(n);
const m=w==2?1.12:1,a=GB[s].a[t]*m,d=GB[s].d[t]*m,o={};let A=a,D=d;
if(arch=='brute'){A=a*1.3;D=d*.6}else if(arch=='tank'){A=a*.7;D=d*1.4}else if(arch=='swift'){A=a*.85;o.spd=+(.3+.07*t).toFixed(2)}else if(arch=='crit'){A=a*.9;o.crit=+(.05+.02*t).toFixed(2)}else if(arch=='vamp'){A=a*.9;o.life=+(.03+.02*t).toFixed(2)}
if(Math.round(A)>0)o.atk=Math.round(A);if(Math.round(D)>0)o.def=Math.round(D);
if(s=='b')o.sh={brute:[26+t,5,3],tank:[28,6,4],swift:[34,2,6],crit:[32,3,7],vamp:[30,4,5],bal:[30,3,5]}[arch];
if(s=='g'){o.w={tank:30,brute:26,swift:28,crit:28,vamp:26,bal:24}[arch];if(arch=='swift'||arch=='crit')o.dc='wing';else if(arch=='brute')o.dc='spike'}
if(s=='c')o.e=t==6?'holy':ELEM[(t+k+si)%6];
const col=s=='c'?'':tint(TCOL[t],{brute:-.15,tank:-.3,swift:.2,crit:.1,vamp:-.05,bal:0}[arch]);
P.push(Object.assign({s,n,t,c:col},w==2?{wd:1}:{},o))}
const CNT1=[0,2,2,2,2,1,1],CNT2=[0,3,2,2,2,1,1];
for(let t=1;t<7;t++)SLOTS.forEach((s,si)=>{for(let k=0;k<CNT1[t];k++)gen(1,t,k,s,si)});
const ST=(s,n,c,o)=>P.push(Object.assign({s,n,t:0,c,wd:1,st:1},o));
ST('h','Bone Wrap','#c9b48a',{atk:2,def:1});ST('b','Bone Knife','#d8d2c0',{atk:7,sh:[22,3,4]});ST('g','Hide Guard','#a06a3a',{def:2,w:18});ST('c','Dull Shard','',{e:'none'});
for(let t=1;t<7;t++)SLOTS.forEach((s,si)=>{for(let k=0;k<CNT2[t];k++)gen(2,t,k,s,si)});
const Y2=(s,n,c,o)=>P.push(Object.assign({s,n,t:4,c,an:1,wd:1},o));
Y2('h','Party Bone Wrap','#ff7ac8',{atk:6,def:5,spd:.3});Y2('b','Confetti Fang','#ffe14d',{atk:32,spd:.2,crit:.1,sh:[34,4,6]});Y2('g','Cake Aegis','#fff0a8',{def:10,atk:3,spd:.2,w:28,dc:'wing'});Y2('c','Sparkle Shard','',{e:'fire',atk:10,crit:.12,spd:.2});
const GM=(s,n,c,g,o)=>P.push(Object.assign({s,n,t:7,c,gl:1,gp:g},o));
GM('h','Prism Grip','#7fe8ff',250,{atk:11,def:9,spd:.5,crit:.06});GM('h','Prism Wrap','#9fd8ff',250,{atk:7,def:15,spd:.3,life:.06});GM('h','Prism Cord','#c8f0ff',250,{atk:9,def:8,spd:1});
GM('b','Prism Edge','#7fe8ff',500,{atk:46,spd:.3,crit:.14,life:.05,sh:[36,5,6]});GM('b','Prism Reaver','#9fd8ff',500,{atk:52,spd:-.1,crit:.1,sh:[37,7,5]});GM('b','Prism Rapier','#c8f0ff',450,{atk:38,spd:.9,crit:.12,sh:[36,2,4]});
GM('g','Prism Aegis','#7fe8ff',350,{def:18,atk:6,spd:.2,w:30});GM('g','Prism Wings','#9fd8ff',350,{def:11,atk:8,spd:.8,w:30,dc:'wing'});GM('g','Prism Crown','#c8f0ff',350,{def:13,atk:11,life:.05,w:28,dc:'spike'});
GM('c','Prism Flame','',400,{e:'fire',atk:15,crit:.1,spd:.3});GM('c','Prism Frost','',400,{e:'ice',atk:11,def:9,spd:.3});GM('c','Prism Void','',400,{e:'void',atk:14,crit:.22,life:.05});
P.forEach((p,i)=>p.id=i);
const W1BASE=[0,6,13,18],W2BASE=P.filter(p=>p.st).map(p=>p.id);
const TW=[{n:'Gloom Wraith',w:'fire',k:'#a97cf0'},{n:'Bone Colossus',w:'blood',k:'#e8e2c8'},{n:'Ember Drake',w:'ice',k:'#ff8a2b'},{n:'Tower Sentinel',w:'shock',k:'#9a9fae'}];
const SB=[{n:'Crystal Lich',w:'fire',k:'#5ff0e0'},{n:'Magma Golem',w:'ice',k:'#ff6b1a'},{n:'Clockwork Reaper',w:'shock',k:'#d9b24a'},{n:'Celestial Warden',w:'void',k:'#f4eec8'},{n:'Aether Titan',w:'toxic',k:'#4fe0c8'}];

const hpCost=l=>l<5?40*(l+1):null,hpCostD=l=>l<5?10*(l+1):null,maxHp=(l,w)=>(w==2?100+15*Math.min(l||0,5):100+10*Math.min(l||0,5));
const VERSION='2.0.0';
const BOSSES=[
{n:'Slime King',k:'#4fd06a',hp:70,r:4,w:'fire'},{n:'Frost Warden',k:'#7fd6ff',hp:130,r:7,w:'shock'},
{n:'Hollow Knight',k:'#9aa3b5',hp:210,r:10,w:'blood'},{n:'Storm Wyrm',k:'#ffe14d',hp:300,r:13,w:'ice'},{n:'Anvil God',k:'#ff6b3d',hp:420,r:16,w:'void'},
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
const R2=[20, 18, 19, 17, 18, 20, 20, 20, 19, 20, 20, 20, 20, 20, 20, 27, 28, 25, 26, 30, 20],AGPW=28;
const W2HP=[60, 70, 85, 100, 120, 150, 190, 240, 300, 380, 470, 580, 720, 880, 1080, 1330, 1650, 2050, 2500, 3000, 6500],W2R=[7, 17, 21, 28, 29, 27, 36, 31, 30, 32, 39, 41, 36, 37, 47, 42, 43, 39, 50, 47, 34];
WORLD2.forEach((b,i)=>{b.hp=W2HP[i];b.r=W2R[i];b.fl=.1;b.coin=i==20?2500:120+45*i;b.dia=i==20?200:4+2*i});
WORLD2[20].aggr={pw:AGPW,every:3200,tele:1000};
const PRICE2=[null,6,14,30,65,150,null,null],CAP2=[1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6],MG_UNLOCK=[5,9,13];
function dropPool2(bi,owned){const cap=CAP2[bi],want=bi>=17?6:0;
const pool=P.filter(p=>p.wd&&!p.an&&!p.st&&!p.cu&&!p.gl&&!owned.includes(p.id)&&p.t<=cap).sort((a,b)=>(b.t+Math.random()*2.2)-(a.t+Math.random()*2.2));
const hi=want?pool.filter(p=>p.t>=want).sort(()=>Math.random()-.5)[0]:null;
return (hi?[hi,...pool.filter(x=>x!==hi).slice(0,2)]:pool.slice(0,3)).map(p=>p.id)}
const annYear=ms=>{const y=new Date(ms).getUTCFullYear();return ms>=Date.UTC(y,8,29,10)&&ms<Date.UTC(y,9,2,12)?y:0};
const ANN={coins:1000,dia:100};
const RN=['Common','Uncommon','Rare','Epic','Legendary','Mythic','God','Prism'];
const PRICE=[10,30,70,130,220,600,null],BOSS_COIN=[30,50,70,90,150,200,260,340,440,600,800,1200];
const CAP=[2,3,3,4,4,4,5,5,5,6,6,6];
function dropPool(bi,owned){const cap=CAP[bi],want=bi>=9?6:bi>=6?5:0;
const pool=P.filter(p=>!p.cu&&!p.wd&&!p.an&&!p.gl&&!p.st&&!owned.includes(p.id)&&p.t<=cap).sort((a,b)=>(b.t+Math.random()*2.2)-(a.t+Math.random()*2.2));
const hi=want?pool.filter(p=>p.t>=want).sort(()=>Math.random()-.5)[0]:null;
return (hi?[hi,...pool.filter(x=>x!==hi).slice(0,2)]:pool.slice(0,3)).map(p=>p.id)}
function towerPool(f,sp,owned){const cap=f>=10?5:f>=5?4:Math.min(3,1+Math.ceil(f/2)),god=sp&&f>=20;
const pool=P.filter(p=>!p.cu&&!p.wd&&!p.an&&!p.gl&&!p.st&&!owned.includes(p.id)&&(p.t<=cap||(god&&p.t==6))).sort((a,b)=>(b.t+Math.random()*2.2)-(a.t+Math.random()*2.2));
const hi=god?pool.filter(p=>p.t==6).sort(()=>Math.random()-.5)[0]:null;
return (hi?[hi,...pool.filter(x=>x!==hi).slice(0,2)]:pool.slice(0,3)).map(p=>p.id)}
function addCustom(d){const p={cu:1,id:d.id,s:d.s,n:String(d.n).slice(0,24),t:Math.max(0,Math.min(6,d.t|0)),c:/^#[0-9a-f]{6}$/i.test(d.c)?d.c:'#cccccc'};
for(const k of ['atk','spd','def','crit','life'])if(+d[k])p[k]=+d[k];if(d.e&&d.s=='c')p.e=d.e;if(d.s=='g'){p.w=Math.max(14,Math.min(30,+d.w||24));if(d.dc)p.dc=d.dc}if(d.s=='b')p.sh=Array.isArray(d.sh)?d.sh.map(Number):[30,3,5];if(d.wd)p.wd=1;P[p.id]=p;return p}
const DEFAULT_EQ={h:0,b:6,g:13,c:18};
function stats(eq){const o={atk:0,spd:1,def:0,crit:0,life:0,e:'none'};for(const k in eq){const p=P[eq[k]];if(!p)continue;o.atk+=p.atk||0;o.spd+=p.spd||0;o.def+=p.def||0;o.crit+=p.crit||0;o.life+=p.life||0;if(p.e)o.e=p.e}o.spd=Math.max(.3,o.spd);return o}
function bossFor(f,n){const sp=f%5==0,i=sp?(f/5-1)%SB.length:(f-1)%TW.length,m=sp?SB[i]:TW[i];return{n:m.n,i,sp,set:sp?1:2,w:m.w,k:m.k,hp0:Math.round((70+55*f)*(sp?2:1)*(1+.85*(n-1))),r:Math.round((4+1.3*f)*(sp?1.2:1)*(1+.15*(n-1)))}}
const recoil=(r,d,f)=>Math.max(Math.ceil(r*(f||.25)),r-d);
function dmg(s,weak,rnd){let d=s.atk*(.85+rnd()*.3),t=0;if(rnd()<s.crit){d*=2;t=1}if(s.e===weak){d*=1.8;t=1}return{d:Math.round(d),t}}
function validEq(eq,owned,w){const E={},D=w==2?W2BASE:W1BASE;SLOTS.forEach((k,i)=>{const id=eq&&eq[k],p=P[id];E[k]=p&&p.s===k&&owned.includes(id)&&(p.gl||!!p.wd==(w==2))?id:D[i]});return E}
const FX=[{id:'rainbow',n:'Rainbow Slash',c:'#ff7ac8',g:150},{id:'ember',n:'Ember Aura',c:'#ff7a3d',g:100},{id:'frost',n:'Frost Trail',c:'#7fd6ff',g:100},{id:'gold',n:'Golden Sparks',c:'#ffd84d',g:120},{id:'void',n:'Void Glow',c:'#a66bff',g:120},{id:'toxic',n:'Toxic Mist',c:'#7be04f',g:100},{id:'blood',n:'Blood Moon',c:'#e0345a',g:120},{id:'holy',n:'Holy Light',c:'#ffffff',g:200}];
const GEM_PACKS=[{id:'g100',gems:100,cents:99},{id:'g550',gems:550,cents:499},{id:'g1200',gems:1200,cents:999},{id:'g2600',gems:2600,cents:1999}];
const PATCH_NOTES=[
{v:'2.0.0',d:'Oct 2026',t:['New battle screens for boss fights and the co-op tower: big boss stage, health bars with numbers, a swing cooldown bar, and a Retreat button.','World 2 with its cutscene, diamonds, minigames, the ViLocity boss, the boss map, the anniversary event and the New run fix.','World 2 is now its own game: its own starter gear, parts, shop and health upgrades. Your World 1 items stay in World 1.','Travel between worlds any time from the Map. Repeat any boss you have beaten for coins, diamonds and part drops.','World 2 bosses are much easier early on, and ViLocity can be beaten.','124+ new weapon attachments across both worlds, plus Prism super items.','Friends: add friends, chat and trade parts (World 1 parts in World 1, World 2 parts in World 2).','Gems: buy with real money, spend on Prism items and effects that work in both worlds.','New home screen and a compact layout so you scroll less, new colour themes, and this news screen.','Accounts: email verification and date of birth. Co-op needs age 8+ and chat, trading and buying need age 13+.','Fixed co-op tower: a teammate could get stuck unable to attack.','Daily reward, How to play guide, tower leaderboard.']},
{v:'1.0.0',d:'Sep 2026',t:['Forgebound launches: forge weapons, 12 bosses, shop, accounts, admin panel and the co-op tower.']}];
const api={SLOTS,W1BASE,W2BASE,FX,GEM_PACKS,PATCH_NOTES,VERSION,WORLD2,PRICE2,CAP2,MG_UNLOCK,dropPool2,annYear,ANN,hpCostD,recoil,BOSSES,RN,CAP,dropPool,towerPool,addCustom,PRICE,BOSS_COIN,hpCost,maxHp,P,SB,TW,DEFAULT_EQ,stats,bossFor,dmg,validEq};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Game=api;
})(typeof window!=='undefined'?window:globalThis);
`;
const G = (() => { const m = { exports: {} }; new Function('module', 'window', SHARED)(m, undefined); return m.exports; })();

const PORT = process.env.PORT || 3000;
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data');
const FILE = path.join(DATA, 'db.json');
const ADMIN = String(process.env.ADMIN_USER || 'vilocity').toLowerCase();
const CFG = {
  PUBLIC_URL: (process.env.PUBLIC_URL || '').replace(/\/$/, ''),
  STRIPE_KEY: process.env.STRIPE_SECRET_KEY || '', STRIPE_WH: process.env.STRIPE_WEBHOOK_SECRET || '',
  RESEND: process.env.RESEND_API_KEY || '', FROM: process.env.EMAIL_FROM || 'Forgebound <onboarding@resend.dev>',
  DEV_CODE: process.env.DEV_SHOW_CODE === '1'
};
const MIN_COOP = 8, MIN_SOCIAL = 13, MIN_BUY = 13;
fs.mkdirSync(DATA, { recursive: true });

// ---------- storage (one JSON file, written atomically) ----------
let DB = { users: {}, sessions: {}, customs: {}, nextCustom: 1000, news: [], paid: {}, chats: {}, trades: {}, nextTrade: 1, emails: {} };
try { DB = Object.assign(DB, JSON.parse(fs.readFileSync(FILE, 'utf8'))); } catch (e) {}
for (const d of Object.values(DB.customs)) G.addCustom(d);
let dirty = false;
const persist = () => { dirty = true; };
function flush() { if (!dirty) return; dirty = false; const t = FILE + '.tmp'; fs.writeFileSync(t, JSON.stringify(DB)); fs.renameSync(t, FILE); }
setInterval(flush, 2000);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { flush(); process.exit(0); });
process.on('uncaughtException', e => console.error('uncaught', e));

// ---------- helpers ----------
const P = G.P;
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const scrypt = (pw, salt) => new Promise((res, rej) => crypto.scrypt(pw, salt, 32, (e, k) => e ? rej(e) : res(k)));
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
const fail = (res, code, msg) => json(res, code, { error: msg });
const NUM = (v, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(+v) ? +v : 0));
function readBody(req, limit) {
  return new Promise((res, rej) => { let b = ''; req.on('data', c => { b += c; if (b.length > limit) { rej(new Error('too big')); req.destroy(); } }); req.on('end', () => res(b)); req.on('error', rej); });
}
const body = async req => { const t = await readBody(req, 30000); try { return t ? JSON.parse(t) : {}; } catch (e) { return {}; } };
const hits = new Map();
function limited(req, max) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim(), now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < 600000); h.push(now); hits.set(ip, h); return h.length > (max || 30);
}
const eqOf = a => ({ h: a[0], b: a[1], g: a[2], c: a[3] });
const newSave = () => ({ owned: [...G.W1BASE], eq: eqOf(G.W1BASE), owned2: [...G.W2BASE], eq2: eqOf(G.W2BASE), boss: 0, b2: 0, clears: 0, tb: 0, coins: 0, dia: 0,
  hpup: 0, hpup2: 0, world: 1, cl1: 0, perm: [], ann: 0, gems: 0, gl: [], fxo: [], fx: '', rev: 0, daily: '', streak: 0 });
function migrate(sv) {
  const d = newSave(); if (!sv) return d;
  if (sv.owned2 === undefined) { // v2 -> v3: split the single inventory into World 1 and World 2
    const all = sv.owned || [];
    sv.owned2 = [...new Set([...G.W2BASE, ...all.filter(i => P[i] && P[i].wd)])];
    sv.owned = all.filter(i => P[i] && !P[i].wd);
    const e = sv.eq || {}, e1 = { ...d.eq }, e2 = { ...d.eq2 };
    for (const k of G.SLOTS) { const p = P[e[k]]; if (p && p.wd) e2[k] = e[k]; else if (p) e1[k] = e[k]; }
    sv.eq = e1; sv.eq2 = e2;
    const hp = sv.hpup || 0; sv.hpup = Math.min(hp, 5); sv.hpup2 = Math.max(0, hp - 5);
  }
  for (const k in d) if (sv[k] === undefined) sv[k] = d[k];
  return sv;
}
for (const r of Object.values(DB.users)) r.save = migrate(r.save);

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
  if (b.reset) { // New run: wipes the run (including admin gifts and custom items) but keeps purchases, permanent items and records
    const o1 = [...new Set([...G.W1BASE, ...old.perm.filter(i => P[i] && !P[i].wd)])], o2 = [...new Set([...G.W2BASE, ...old.perm.filter(i => P[i] && P[i].wd)])];
    return Object.assign({}, old, { owned: o1, owned2: o2, eq: G.validEq(null, o1, 1), eq2: G.validEq(null, o2, 2), boss: 0, b2: 0, world: 1, cl1: 0, coins: 0, dia: 0, hpup: 0, hpup2: 0, rev: old.rev + 1 });
  }
  const stale = (+b.rev || 0) < old.rev;
  const ok = (i, w) => Number.isInteger(i) && P[i] && !P[i].cu && !P[i].an && !P[i].gl && !P[i].st && !!P[i].wd === (w === 2);
  const claim = (a, w) => stale ? [] : (Array.isArray(a) ? a : []).map(Number).filter(i => ok(i, w));
  const owned = [...new Set([...G.W1BASE, ...old.owned, ...claim(b.owned, 1)])];
  const owned2 = [...new Set([...G.W2BASE, ...old.owned2, ...claim(b.owned2, 2)])];
  const cl1 = (b.cl1 || old.cl1) ? 1 : 0;
  const fx = (b.fx === '' || old.fxo.includes(b.fx)) ? String(b.fx || '') : old.fx;
  return Object.assign({}, old, {
    owned, owned2, eq: G.validEq(b.eq, [...owned, ...old.gl], 1), eq2: G.validEq(b.eq2, [...owned2, ...old.gl], 2),
    boss: int(b.boss, 12), b2: int(b.b2, 21), clears: int(b.clears, 9999), coins: (inRoom || stale) ? old.coins : int(b.coins, 999999), dia: stale ? old.dia : int(b.dia, 999999),
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

// ---------- ages, email, caps ----------
function ageOf(dob) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob || ''); if (!m) return null;
  const now = new Date(); let a = now.getUTCFullYear() - +m[1];
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

// ---------- co-op rooms ----------
const rooms = new Map(), userRoom = new Map();
const CODE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
const newCode = () => { let c; do { c = Array.from({ length: 5 }, () => CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]).join(''); } while (rooms.has(c)); return c; };
function snapshot(room, u) {
  const rec = DB.users[u];
  return {
    code: room.code, cap: room.cap, host: room.host, phase: room.phase, floor: room.floor, n: room.n,
    boss: room.boss, bossHp: room.bossHp, bossMax: room.bossMax,
    players: room.players.map(p => ({ u: p.u, nm: p.nm, eq: p.eq, hp: p.hp, mx: p.mx, dead: p.dead, dealt: p.dealt, off: p.off, picked: p.picked })),
    cu: customsFor([...new Set(room.players.flatMap(p => Object.values(p.eq)))]), ev: room.ev, evs: room.evs, gain: room.gain || 0,
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
    const sv = DB.users[p.u].save;
    room.rew[p.u] = G.towerPool(room.floor, room.boss.sp, sv.owned);
    sv.tb = Math.max(sv.tb || 0, room.floor); sv.coins = (sv.coins || 0) + room.gain;
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
  room.players.splice(i, 1); userRoom.delete(u);
  if (!room.players.length) { rooms.delete(room.code); return; }
  if (room.host === u) room.host = room.players[0].u;
  if (room.phase === 'fight' && room.players.every(q => q.dead)) room.phase = 'over';
  checkReward(room); broadcast(room);
}
function roomOf(user, res) {
  const room = rooms.get(userRoom.get(user.u));
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
