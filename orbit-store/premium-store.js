(function buildStore(){
const games=[
{id:"flamingo",name:"Flamingo Apocalypse",icon:"🦩",genre:"Survival • Flug",tag:"ORBIT ORIGINAL",desc:"Sieben Welten, Höllenfeuer und ein Weltuntergang. Überlebe so lange du kannst.",color:["#ef4a9b","#ff842e"],url:"/website-1/flamingo-apocalypse/"},
{id:"drift",name:"Neon Drift X",icon:"🏎️",genre:"Racing • Nitro",tag:"FULL THROTTLE",desc:"Rase durch eine neonbeleuchtete Megacity, sammle Nitro und entkomme dem Verkehrschaos.",color:["#4d40cf","#1ad5ed"]},
{id:"runner",name:"Shadow Runner",icon:"🥷",genre:"Parkour • Action",tag:"CYBERPUNK",desc:"Doppelsprung und Slide. Springe durch eine regennasse Cyber-Stadt.",color:["#392060","#e149a5"]},
{id:"inferno",name:"Inferno Breaker",icon:"🔥",genre:"Arcade • Boss",tag:"HELLFIRE",desc:"Zerstöre glühende Festungen mit Laser-Powerups und kämpfe gegen einen Feuerkern.",color:["#941b24","#ff9b30"]},
{id:"astro",name:"Astro Defender",icon:"🚀",genre:"Space • Shooter",tag:"GALACTIC WAR",desc:"Laser, Drohnen, Explosionen und riesige Boss-Schiffe zwischen Sternenfeldern.",color:["#173e99","#a66aff"]},
{id:"maze",name:"Crystal Maze",icon:"💎",genre:"Adventure • Mystery",tag:"THE LOST CAVES",desc:"Erforsche leuchtende Kristallhöhlen, sammle Energiekristalle und meide Schattenwächter.",color:["#085a76","#48ebdb"]},
{id:"target",name:"Target Chaos",icon:"🎯",genre:"Reflex • Combo",tag:"HYPER ARENA",desc:"Triff rasende Holo-Ziele, verkette Combos und entschärfe gefährliche Minen.",color:["#6933c4","#ff60bc"]},
{id:"sky",name:"Sky Temple",icon:"☁️",genre:"Platform • Flight",tag:"ABOVE THE CLOUDS",desc:"Steige durch schwebende Ruinen, sammle Himmelskristalle und trotze dem Abgrund.",color:["#2d5eae","#efb664"]}
];
const school=[
{id:"lernlabor",name:"ORBIT Lernlabor",icon:"📘",genre:"Schule",desc:"Dein Schulplan und persönlicher Lernbereich.",url:"https://orbit-schulplan-test.kimi-gaertner.chatgpt.site",color:["#315a99","#5bdddb"]},
{id:"lernarena",name:"ORBIT Lernarena",icon:"🧠",genre:"Schule",desc:"Quiz, Wissenstraining und Lernfortschritt.",url:"https://orbit-lernarena-test.kimi-gaertner.chatgpt.site",color:["#5844a7","#ab76f6"]},
{id:"lerncoach",name:"Lerncoach Ultra",icon:"✨",genre:"Schule",desc:"Adaptive Lernfragen, Lernkarten und Wiederholungen.",url:"https://luke11w.github.io/project-orbit/website/coach.html",color:["#287a7d","#7bea9f"]},
{id:"orbitcut",name:"ORBIT CUT",icon:"🎬",genre:"Tools",desc:"Kostenloser Browser-Videoeditor.",url:"https://luke11w.github.io/website-1/orbit-cut/studio.html",color:["#54278d","#ee6bb5"]}
];
const items=[...games.map(g=>({...g,category:"games"})),...school.map(g=>({...g,category:g.genre==="Schule"?"school":"tools"}))];
const $=id=>document.getElementById(id),grid=$("catalog"),search=$("search");let filter="all",favorites={},bests={};
try{favorites=JSON.parse(localStorage.getItem("orbit-v3-favorites")||"{}");bests=JSON.parse(localStorage.getItem("orbit-v3-bests")||"{}")}catch{}
function save(){try{localStorage.setItem("orbit-v3-favorites",JSON.stringify(favorites));localStorage.setItem("orbit-v3-bests",JSON.stringify(bests))}catch{}}
function iconSVG(g){
 const id="c"+g.id,[a,b]=g.color;
 const scenes={
 flamingo:'<path d="M0 230Q180 140 340 235L340 290H0" fill="#221034"/><circle cx="270" cy="65" r="36" fill="#ffb65d"/><path d="M130 150Q165 103 205 136M203 134Q240 60 256 95" fill="none" stroke="#ffb0d8" stroke-width="16" stroke-linecap="round"/><ellipse cx="145" cy="158" rx="34" ry="25" fill="#ff6cb5"/><circle cx="258" cy="92" r="14" fill="#ffb6d3"/><path d="M269 90L292 98L270 104" fill="#111328"/>',
 drift:'<path d="M145 230L188 45H234L312 230Z" fill="#100c2a"/><path d="M167 230L201 40M290 230L217 40" stroke="#6df6ff" stroke-width="4"/><path d="M70 190L136 155L176 160L218 190L208 217H88Z" fill="#14152e" stroke="#76dfff" stroke-width="5"/><path d="M124 159L168 164L181 188H95Z" fill="#75defa"/><rect x="90" y="206" width="28" height="10" rx="3" fill="#f870d8"/><rect x="177" y="205" width="29" height="10" rx="3" fill="#f870d8"/>',
 runner:'<g fill="#080e29"><rect x="20" y="80" width="48" height="175"/><rect x="77" y="45" width="70" height="210"/><rect x="165" y="96" width="80" height="160"/><rect x="271" y="65" width="46" height="190"/></g><g stroke="#f95dbc" stroke-width="3"><path d="M21 100H65M78 74H143M165 125H244"/></g><circle cx="170" cy="95" r="12" fill="#141526" stroke="#f9cbe5" stroke-width="4"/><path d="M164 108L147 146L183 167M147 146L112 163M147 146L137 185M183 167L212 151" fill="none" stroke="#fa66ae" stroke-width="13" stroke-linecap="round"/>',
 inferno:'<path d="M0 250L45 160L82 198L126 95L175 189L222 105L280 190L340 85V270Z" fill="#411325"/><path d="M122 222Q70 159 132 115Q118 169 158 170Q216 97 203 45Q284 137 214 229Z" fill="#ff9d29"/><rect x="80" y="80" width="43" height="40" rx="5" fill="#ffb051" stroke="#fff1a3" stroke-width="4"/><rect x="133" y="80" width="43" height="40" rx="5" fill="#ff4b39" stroke="#fff1a3" stroke-width="4"/><circle cx="220" cy="172" r="35" fill="#ffc66d" stroke="#ff7338" stroke-width="10"/>',
 astro:'<g fill="#ffffff"><circle cx="48" cy="34" r="3"/><circle cx="201" cy="63" r="2"/><circle cx="288" cy="36" r="3"/></g><circle cx="262" cy="90" r="63" fill="#4c49a8" stroke="#ae88ff" stroke-width="3"/><path d="M136 185L170 80L202 185L175 168Z" fill="#dae6ff" stroke="#7eecff" stroke-width="7"/><path d="M145 181L135 223L171 193L206 223L195 180" fill="#fe8b53"/>',
 maze:'<path d="M0 237L40 120L88 185L140 60L196 182L255 95L340 237Z" fill="#08172b" stroke="#5eedff" stroke-width="4"/><path d="M92 195L131 84L154 195Z" fill="#50d8f5"/><path d="M200 206L243 104L271 206Z" fill="#b77eff"/><circle cx="175" cy="185" r="24" fill="#ffe7a0"/><path d="M165 220L175 171L185 220" stroke="#ffffff" stroke-width="9"/>',
 target:'<g stroke="#ff9de8" fill="none" stroke-width="5"><circle cx="170" cy="130" r="92"/><circle cx="170" cy="130" r="64"/><circle cx="170" cy="130" r="30"/></g><circle cx="170" cy="130" r="12" fill="#fff4b4"/><path d="M16 130H102M236 130H324M170 0V38M170 221V257" stroke="#9ff6ff" stroke-width="4"/>',
 sky:'<g fill="#ffffff91"><ellipse cx="78" cy="80" rx="73" ry="22"/><ellipse cx="278" cy="57" rx="79" ry="26"/><ellipse cx="195" cy="211" rx="99" ry="28"/></g><g fill="#d6c5b0" stroke="#fff1c9" stroke-width="4"><path d="M62 205L98 156H161L192 205Z"/><path d="M215 128L237 89H299L318 128Z"/></g><rect x="106" y="120" width="13" height="48" fill="#f4dea1"/><rect x="144" y="120" width="13" height="48" fill="#f4dea1"/><path d="M95 120L133 86L172 120Z" fill="#fbe6b2"/><circle cx="195" cy="108" r="17" fill="#fff3bc"/>'
 };
 return `<svg viewBox="0 0 340 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><radialGradient id="${id}glow"><stop stop-color="#ffffff" stop-opacity=".3"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs><rect width="340" height="250" fill="url(#${id})"/><circle cx="195" cy="95" r="150" fill="url(#${id}glow)"/>${scenes[g.id]||''}<g fill="#ffffff70"><circle cx="28" cy="26" r="2"/><circle cx="318" cy="210" r="2"/></g></svg>`;
}
function render(){
 const q=search.value.trim().toLowerCase(),list=items.filter(a=>(filter==="all"||filter==="favorites"&&favorites[a.id]||a.category===filter)&&[a.name,a.genre,a.desc].join(" ").toLowerCase().includes(q));
 $("heading").textContent=({all:"Für dich entdeckt",games:"Premium Games",school:"Schule & Lernen",tools:"Kreativ-Tools",favorites:"Deine Favoriten"})[filter];$("count").textContent=list.length+" Apps";grid.replaceChildren();
 for(const a of list){
  const card=document.createElement("article");card.className="game";const art=document.createElement("div");art.className="art";
  if(a.category==="games")art.innerHTML=iconSVG(a);
  else{art.style.background=`linear-gradient(120deg,${a.color[0]},${a.color[1]})`;const mark=document.createElement("div");mark.textContent=a.icon;mark.style.cssText="display:grid;place-items:center;height:100%;font-size:85px;text-shadow:0 12px 30px #0006";art.append(mark)}
  const ribbon=document.createElement("div");ribbon.className="ribbon";ribbon.textContent=a.tag||(a.category==="school"?"SCHULE":"TOOLS");art.append(ribbon);
  const body=document.createElement("div");body.className="gamebody";const genre=document.createElement("div");genre.className="tag";genre.textContent=a.genre;const title=document.createElement("h3");title.textContent=a.name;
  const desc=document.createElement("p");desc.textContent=a.desc;const info=document.createElement("div");info.className="smallinfo";const label=document.createElement("span");label.textContent=a.category==="games"?(a.url?"7 Eskalationsstufen":"Premium Arcade"):"ORBIT App";const best=document.createElement("span");best.textContent=a.category==="games"?"🏆 "+(bests[a.id]||0):"↗ Web";info.append(label,best);
  const actions=document.createElement("div");actions.className="actions";const launch=document.createElement(a.url?"a":"button");launch.className="launch";launch.textContent=a.category==="games"?"▶ SPIELEN":"ÖFFNEN ↗";
  if(a.url){launch.href=a.url;launch.target="_blank";launch.rel="noopener noreferrer"}else launch.onclick=()=>{if(window.ORBIT_ARCADE)window.ORBIT_ARCADE.open(a.id)};
  const fav=document.createElement("button");fav.className="fav";fav.type="button";fav.setAttribute("aria-label","Favorit umschalten");fav.textContent=favorites[a.id]?"★":"☆";fav.onclick=()=>{favorites[a.id]=!favorites[a.id];save();render()};actions.append(launch,fav);body.append(genre,title,desc,info,actions);card.append(art,body);grid.append(card);
 }
 if(!list.length){const msg=document.createElement("div");msg.className="empty";msg.textContent="Keine passenden Apps gefunden.";grid.append(msg)}
}
function category(next){filter=next;document.querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b.dataset.category===next));document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter===next));render()}
document.querySelectorAll("[data-category], [data-filter]").forEach(b=>b.onclick=()=>category(b.dataset.category||b.dataset.filter));
$("discover").onclick=()=>{category("games");$("search").scrollIntoView({behavior:"smooth",block:"start"})};$("schoolGo").onclick=()=>{category("school");$("search").scrollIntoView({behavior:"smooth",block:"start"})};search.oninput=render;
window.ORBIT_PREMIUM={games,school,bests,save,render,category};render();
})();