"use strict";
const themes=[
 ["Neon Serpent","🐍","snake","Steuere deinen wachsenden Neon-Serpent, sammle Kerne und meide Minen."],
 ["Turbo Dodge","🏎️","dodge","Rase durch gefährlichen Verkehr, sammle Energie und aktiviere Schilde."],
 ["Star Catcher","🌠","catch","Fange Sternenstaub, weiche Splittern aus und halte deine Combo."],
 ["Brick Storm","🧱","brick","Sprenge Blockwellen mit präzisen Paddle-Schlägen und Power-ups."],
 ["Sky Hopper","🪽","hop","Springe immer höher über bewegliche Plattformen und schwebende Gefahren."],
 ["Target Rush","🎯","target","Triff bewegliche Ziele, baue Combos und meide explodierende Bomben."],
 ["Maze Escape","🌀","maze","Entkomme aus zufällig generierten Labyrinthen und fliehe vor Wächtern."],
 ["Asteroid Defender","🚀","shooter","Kämpfe gegen Asteroiden, feindliche Schiffe und mächtige Bosswellen."],
 ["Memory Galaxy","🧠","memory","Finde Sternenpaare und knacke immer anspruchsvollere Memory-Felder."],
 ["Orbit Runner","🏃","runner","Ren­ne durch chaotische Welten, springe doppelt und sammle Kristalle."]
];
const variants=[
 ["Neon", "#6939c6","#fa70d8",1],
 ["Inferno","#9b274c","#ffac54",1.18],
 ["Ocean","#0c6e93","#54ffe5",1.32],
 ["Cyber","#253db8","#53d9ff",1.48],
 ["Void","#221a54","#c58bff",1.68]
];
const predefined=[
 ["Lernlabor","📘","school","Schulplan und persönlicher Lernbereich","https://orbit-schulplan-test.kimi-gaertner.chatgpt.site"],
 ["Lernarena","🧠","school","Quiz, Training und Lernfortschritt","https://orbit-lernarena-test.kimi-gaertner.chatgpt.site"],
 ["Lerncoach Ultra","✨","school","Adaptive Lernfragen und Lernkarten","https://luke11w.github.io/project-orbit/website/coach.html"],
 ["ORBIT CUT","🎬","tools","Kostenloser Videoeditor","https://luke11w.github.io/website-1/orbit-cut/studio.html"],
 ["Flamingo Apocalypse","🦩","games","Sieben Stufen bis zum Weltuntergang","/website-1/flamingo-apocalypse/"]
];
const apps=predefined.map((p,i)=>({id:"link-"+i,name:p[0],icon:p[1],category:p[2],desc:p[3],url:p[4]}));
themes.forEach((t,i)=>variants.forEach((v,j)=>apps.push({id:t[2]+"-"+j,name:v[0]+" "+t[0],icon:t[1],category:"games",desc:t[3]+" • "+v[0]+"-Edition",type:t[2],variant:j})));
const $=s=>document.getElementById(s),grid=$("grid"),search=$("search"),canvas=$("canvas"),ctx=canvas.getContext("2d"),modal=$("gameModal"),status=$("status");
let filter="all",favorites={},bests={};
try{favorites=JSON.parse(localStorage.getItem("orbit-favorites-v2")||"{}");bests=JSON.parse(localStorage.getItem("orbit-store-bests-v1")||"{}")}catch{}
function persist(){try{localStorage.setItem("orbit-favorites-v2",JSON.stringify(favorites));localStorage.setItem("orbit-store-bests-v1",JSON.stringify(bests))}catch{}}
function render(){
 const q=search.value.trim().toLowerCase();
 const items=apps.filter(a=>(filter==="all"||filter==="favorite"&&favorites[a.id]||a.category===filter)&&[a.name,a.desc,a.category].join(" ").toLowerCase().includes(q));
 $("heading").textContent=({games:"Games",school:"Schule",tools:"Tools",favorite:"Favoriten"})[filter]||"Entdecken";$("count").textContent=items.length+" Apps";
 grid.replaceChildren();
 for(const a of items){
 const card=document.createElement("article");card.className="card";card.style.position="relative";
 const cover=document.createElement("div");cover.className="cover";const v=variants[a.variant===undefined?0:a.variant];
 cover.style.background="radial-gradient(ellipse at 50% 30%,"+v[2]+"90,transparent 70%),linear-gradient(135deg,"+v[1]+",#11152a)";
 const ico=document.createElement("span");ico.textContent=a.icon;ico.style.cssText="filter:drop-shadow(0 15px 22px #0009);transform:rotate(-8deg);display:block";cover.append(ico);
 const heart=document.createElement("button");heart.type="button";heart.setAttribute("aria-label",favorites[a.id]?"Favorit entfernen":"Als Favorit speichern");heart.textContent=favorites[a.id]?"★":"☆";heart.style.cssText="position:absolute;top:10px;right:10px;border-radius:50%;width:36px;height:36px;padding:0;z-index:1;background:#101322a8;color:#ffe695";
 heart.onclick=()=>{favorites[a.id]=!favorites[a.id];persist();render()};
 const body=document.createElement("div");body.className="body";
 const tag=document.createElement("div");tag.className="tag";tag.textContent=a.category==="school"?"📚 SCHULE":a.category==="tools"?"🛠 TOOLS":a.type?"🎮 GAME • LEVEL "+(a.variant+1):"🎮 GAME";
 const h=document.createElement("h3");h.textContent=a.name;
 const p=document.createElement("p");p.textContent=a.desc;
 const button=document.createElement("a");button.className="play";button.textContent=a.type?"▶ Spielen":"Öffnen ↗";
 button.href=a.url||"#";
 if(a.type)button.addEventListener("click",e=>{e.preventDefault();openGame(a)});
 else{button.target="_blank";button.rel="noopener noreferrer"}
 if(a.type){const best=document.createElement("small");best.style.cssText="display:block;color:#a5abd4;margin-bottom:10px";best.textContent="🏆 Best: "+(bests[a.id]||0);body.append(tag,h,p,best,button)}
 else body.append(tag,h,p,button);
 card.append(cover,heart,body);grid.append(card);
 }
 if(items.length===0){const msg=document.createElement("p");msg.textContent="Keine Treffer. Versuche einen anderen Suchbegriff.";grid.append(msg)}
}
document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(el=>el.classList.toggle("active",el===b));render()});
const tabs=document.querySelector(".tabs");const fav=document.createElement("button");fav.dataset.filter="favorite";fav.textContent="★ Favoriten";tabs.append(fav);fav.onclick=()=>{filter="favorite";document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===fav));render()};search.addEventListener("input",render);render();
const W=600,H=500,TAU=Math.PI*2,rnd=(a,b)=>Math.random()*(b-a)+a,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const input=new Set();let G=null,raf=0,last=0,muted=false,ac=null;
function sound(freq=480,duration=.07,kind="sine",volume=.035){if(muted)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),v=ac.createGain();o.type=kind;o.frequency.setValueAtTime(freq,ac.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(60,freq*.58),ac.currentTime+duration);v.gain.setValueAtTime(volume,ac.currentTime);v.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);o.connect(v).connect(ac.destination);o.start();o.stop(ac.currentTime+duration)}catch{}}
function sparks(x,y,color,n=12){if(!G)return;for(let i=0;i<n;i++)G.fx.push({x,y,vx:rnd(-4,4),vy:rnd(-5,3),life:rnd(13,36),size:rnd(2,6),color})}
function score(n,x=300,y=190){G.score+=n;if(n>0){G.combo++;if(x!==null)sparks(x,y,G.accent,7);sound(420+Math.min(G.combo,20)*28,.055)}if(G.score>=G.nextStage){G.level++;G.nextStage+=G.goal;G.banner=90;G.shake=13;sparks(300,240,"#ffe477",75);sound(800,.28,"sawtooth",.025);if(G.type==="brick")buildBricks();if(G.type==="maze")buildMaze();if(G.type==="memory")buildMemory()}}
function lose(x=G.p.x,y=G.p.y){if(G.shield>0){G.shield=0;sparks(x,y,"#63edff",22);return}G.lives--;G.combo=0;G.shake=18;G.invuln=75;sparks(x,y,"#ff526f",30);sound(110,.23,"sawtooth",.045);if(G.lives<=0)end(false)}
function end(win){if(!G||G.over)return;G.over=true;G.win=win;finishHighscore();sound(win?900:110,.3)}
function finishHighscore(){if(!G)return;const n=Math.floor(G.score);if(n>(bests[G.id]||0)){bests[G.id]=n;persist();render()}}
function openGame(a){
 cancelAnimationFrame(raf);input.clear();G={...a,accent:variants[a.variant][2],speed:variants[a.variant][3],score:0,combo:0,lives:3,level:1,nextStage:50,goal:50,over:false,ready:true,paused:false,fx:[],ents:[],bullets:[],t:0,spawn:30,banner:0,shake:0,invuln:0,shield:0,p:{x:300,y:410,vx:0,vy:0},pointerX:300,pointerY:250};init();$("modalName").textContent=a.icon+" "+a.name;modal.classList.add("show");last=0;raf=requestAnimationFrame(loop);
}
function init(){
 const s=G;if(!s)return;Object.assign(s,{score:0,combo:0,lives:3,level:1,nextStage:50,goal:50,over:false,ready:true,paused:false,fx:[],ents:[],bullets:[],t:0,spawn:30,banner:0,shake:0,invuln:0,shield:0,p:{x:300,y:410,vx:0,vy:0},pointerX:300,pointerY:250});
 if(s.type==="snake"){s.goal=50;s.nextStage=50;s.cell=20;s.snake=[[12,10],[11,10],[10,10]];s.dir=0;s.nextDir=0;s.stepClock=0;s.food=snakeFood();s.mines=[]}
 if(s.type==="brick"){s.p.x=300;s.ball={x:300,y:320,vx:3.8*s.speed,vy:-4.2*s.speed};s.goal=100;s.nextStage=100;buildBricks()}
 if(s.type==="hop"){s.p.y=385;s.p.vy=-8;s.maxHeight=0;s.ents=[{x:230,y:445,w:145,platform:true}];for(let i=0;i<8;i++)s.ents.push({x:rnd(60,480),y:445-(i+1)*65,w:rnd(80,135),platform:true,move:i>3&&i%2===0})}
 if(s.type==="target"){s.time=55*60;s.goal=150;s.nextStage=150;s.spawn=1}
 if(s.type==="maze"){s.goal=100;s.nextStage=100;buildMaze()}
 if(s.type==="memory"){s.goal=100;s.nextStage=100;buildMemory();s.time=180*60}
 if(s.type==="runner"){s.p.x=105;s.p.y=419;s.jumps=0;s.slide=0;s.spawn=50}
 if(s.type==="shooter"){s.spawn=30;s.fire=0;s.bossAt=150;s.boss=null}
}
function snakeFood(){const s=G;let p;do{p=[Math.floor(rnd(0,26)),Math.floor(rnd(0,19))]}while(s.snake&&s.snake.some(v=>v[0]===p[0]&&v[1]===p[1]));return p}
function buildBricks(){const s=G;s.bricks=[];const rows=Math.min(8,4+s.level),cols=9;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){if((x+y+s.variant)%7===0)continue;s.bricks.push({x:24+x*62,y:65+y*25,w:57,h:19,hp:1+((x*y+s.variant+s.level)%8===0?1:0)})}s.banner=70}
function buildMemory(){const s=G,n=s.variant>=3?20:16,syms=["🦩","🌙","🪐","⚡","🌟","🎮","💎","☄️","🌈","👾"];s.deck=Array.from({length:n},(_,i)=>({symbol:syms[i%(n/2)],open:false,matched:false}));for(let i=n-1;i>0;i--){const j=Math.floor(rnd(0,i+1));[s.deck[i],s.deck[j]]=[s.deck[j],s.deck[i]]}s.picks=[];s.lock=0;s.found=0;s.moves=0;s.preview=120-Math.min(60,s.level*10);s.goal=100;s.nextStage=s.level*100}
function buildMaze(){const s=G,cols=15,rows=11;s.maze=Array.from({length:rows},()=>Array(cols).fill(1));const dirs=[[0,2],[2,0],[-2,0],[0,-2]];function carve(x,y){s.maze[y][x]=0;const ds=dirs.slice().sort(()=>Math.random()-.5);for(const [dx,dy]of ds){const xx=x+dx,yy=y+dy;if(xx>0&&yy>0&&xx<cols-1&&yy<rows-1&&s.maze[yy][xx]){s.maze[y+dy/2][x+dx/2]=0;carve(xx,yy)}}}carve(1,1);s.p.x=1;s.p.y=1;s.maze[9][13]=0;s.gems=[];for(let n=0;n<5+s.variant;n++){let x,y;do{x=Math.floor(rnd(1,14));y=Math.floor(rnd(1,10))}while(s.maze[y][x]||x===1&&y===1);s.gems.push({x,y,got:false})}s.guard={x:13,y:9,cool:40};s.moveClock=0;s.goal=100;s.nextStage=s.level*100}
function rectangle(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()}
function text(str,x,y,size=19,color="#fff",align="center"){ctx.font="900 "+size+"px system-ui";ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(str,x,y)}
function line(x1,y1,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function hit(a,b,r){return Math.hypot(a.x-b.x,a.y-b.y)<r}
function moveX(){return (input.has("ArrowRight")||input.has("d")?1:0)-(input.has("ArrowLeft")||input.has("a")?1:0)}
function moveY(){return (input.has("ArrowDown")||input.has("s")?1:0)-(input.has("ArrowUp")||input.has("w")?1:0)}
function action(){return input.has(" ")||input.has("ArrowUp")||input.has("w")}
function damageCheck(e,r=24){if(G.invuln>0)return false;if(hit(G.p,e,r)){lose(e.x,e.y);return true}return false}
function advance(dt){
 const s=G;if(!s||s.ready||s.paused||s.over)return;
 s.t+=dt;s.invuln=Math.max(0,s.invuln-dt);s.banner=Math.max(0,s.banner-dt);s.shake*=.88;
 const x=moveX(),y=moveY(),speed=s.speed*(1+(s.level-1)*.12);
 if(s.type==="snake"){
   s.stepClock+=dt;const d=x?x>0?0:2:y?1:3;
   if((x||y)&&Math.abs(d-s.dir)!==2)s.nextDir=d;
   if(s.stepClock>=Math.max(4.7,9.2/speed-(s.level-1)*.4)){
     s.stepClock=0;s.dir=s.nextDir;
     const delta=[[1,0],[0,1],[-1,0],[0,-1]][s.dir],head=[s.snake[0][0]+delta[0],s.snake[0][1]+delta[1]],eat=head[0]===s.food[0]&&head[1]===s.food[1];
     if(head[0]<0||head[0]>25||head[1]<0||head[1]>18||s.snake.slice(0,eat?undefined:-1).some(p=>p[0]===head[0]&&p[1]===head[1])||s.mines.some(p=>p[0]===head[0]&&p[1]===head[1])){end(false);return}
     s.snake.unshift(head);if(eat){score(10,40+head[0]*20,62+head[1]*20);s.food=snakeFood();if(s.level>=2&&s.mines.length<Math.min(8,s.level+s.variant)){const mine=snakeFood();if(mine[0]!==s.food[0]||mine[1]!==s.food[1])s.mines.push(mine)}}else s.snake.pop();
   }
 }
 else if(s.type==="dodge"){
   s.p.x=clamp(s.p.x+x*6.8*dt,150,450);s.spawn-=dt;if(s.spawn<=0){s.spawn=Math.max(11,35/speed);s.ents.push({x:180+Math.floor(rnd(0,4))*80,y:-50,w:45,h:74,kind:Math.random()<.15?"shield":"car",vy:rnd(3.3,5.5)*speed})}
   s.ents.forEach(e=>{e.y+=e.vy*dt;if(e.y>530&&!e.gone){e.gone=true;if(e.kind==="car")score(3,null,null)}if(!e.gone&&Math.abs(e.x-s.p.x)<38&&Math.abs(e.y-s.p.y)<56){e.gone=true;if(e.kind==="shield"){s.shield=1;sparks(e.x,e.y,"#70e5ff",18);sound(650,.15)}else damageCheck(e,48)}});
   s.ents=s.ents.filter(e=>!e.gone&&e.y<530);s.score+=dt*.035*speed;
 }
 else if(s.type==="catch"){
   s.p.x=clamp(s.p.x+x*7.5*dt,25,575);s.spawn-=dt;
   if(s.spawn<=0){s.spawn=Math.max(9,25/speed);s.ents.push({x:rnd(25,575),y:-20,kind:Math.random()<(.22+s.variant*.05)?"bad":Math.random()<.08?"shield":"star",vy:rnd(3,5)*speed,r:16})}
   s.ents.forEach(e=>{e.y+=e.vy*dt;if(e.y>540)e.gone=true;if(!e.gone&&hit(e,s.p,29)){e.gone=true;if(e.kind==="bad")damageCheck(e,30);else if(e.kind==="shield"){s.shield=1;score(5,e.x,e.y)}else score(10+Math.min(20,Math.floor(s.combo/5)*5),e.x,e.y)}});
   s.ents=s.ents.filter(e=>!e.gone);
 }
 else if(s.type==="brick"){
   s.p.x=clamp(s.p.x+x*8*dt,55,545);const b=s.ball,oldY=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;
   if(b.x<12){b.x=12;b.vx=Math.abs(b.vx)}if(b.x>588){b.x=588;b.vx=-Math.abs(b.vx)}if(b.y<44){b.y=44;b.vy=Math.abs(b.vy)}
   if(b.vy>0&&oldY<=439&&b.y>=439&&Math.abs(b.x-s.p.x)<66){b.y=436;b.vy=-Math.abs(b.vy);b.vx=clamp(b.vx+(b.x-s.p.x)*.065,-9,9);sound(320,.06)}
   for(const br of s.bricks){if(br.hp>0&&b.x+9>br.x&&b.x-9<br.x+br.w&&b.y+9>br.y&&b.y-9<br.y+br.h){br.hp--;b.vy*=-1;score(10,br.x+br.w/2,br.y+10);break}}
   if(b.y>515){s.lives--;s.combo=0;s.ball={x:s.p.x,y:320,vx:rnd(-4,4)||3,vy:-4.4*speed};if(s.lives<=0)end(false)}
   if(!s.bricks.some(b=>b.hp>0)){s.level++;buildBricks();s.ball={x:s.p.x,y:330,vx:4*speed,vy:-5*speed};s.shake=12}
 }
 else if(s.type==="hop"){
   const p=s.p,oldY=p.y;p.vy+=.31*dt;p.x=clamp(p.x+x*5.7*dt,18,582);p.y+=p.vy*dt;
   for(const e of s.ents){if(e.move)e.x+=Math.sin(s.t*.03+e.y)*.7*dt;if(e.platform&&p.vy>0&&oldY+19<=e.y&&p.y+19>=e.y&&p.x+16>e.x&&p.x-16<e.x+e.w){p.y=e.y-19;p.vy=-10.5*speed;sparks(p.x,e.y,s.accent,6);sound(310,.07)}}
   if(p.y<180){const shift=180-p.y;p.y=180;s.maxHeight+=shift;for(const e of s.ents)e.y+=shift;score(shift*.11,null,null)}
   s.ents=s.ents.filter(e=>e.y<540);let top=s.ents.reduce((m,e)=>Math.min(m,e.y),500);while(top>20){top-=rnd(58,78);s.ents.push({x:rnd(15,475),y:top,w:rnd(75,130),platform:true,move:Math.random()<.25+.07*s.variant})}
   if(p.y>535)end(false);
 }
 else if(s.type==="target"){
   s.time-=dt;s.spawn-=dt;
   if(s.spawn<=0){s.spawn=Math.max(11,26/speed);s.ents.push({x:rnd(70,530),y:rnd(90,395),vx:rnd(-2,2)*speed,vy:rnd(-1.5,1.5)*speed,r:rnd(19,31),ttl:Math.max(38,115/speed),kind:Math.random()<(.15+s.variant*.02)?"bomb":"target"})}
   s.ents.forEach(e=>{e.x+=e.vx*dt;e.y+=e.vy*dt;e.ttl-=dt;if(e.x<40||e.x>560)e.vx*=-1;if(e.y<65||e.y>425)e.vy*=-1});s.ents=s.ents.filter(e=>e.ttl>0);if(s.time<=0)end(true);
 }
 else if(s.type==="maze"){
   s.moveClock-=dt;if(s.moveClock<=0&&(x||y)){s.moveClock=Math.max(3,7/speed);const dx=x||0,dy=x?0:y,nx=s.p.x+dx,ny=s.p.y+dy;if(nx>=0&&nx<15&&ny>=0&&ny<11&&s.maze[ny][nx]===0){s.p.x=nx;s.p.y=ny;s.gems.forEach(g=>{if(!g.got&&g.x===nx&&g.y===ny){g.got=true;score(10,75+nx*30,90+ny*30)}})}
   if(nx===13&&ny===9&&s.gems.every(g=>g.got)){score(50,null,null);s.level++;buildMaze();s.banner=90}
   }
   s.guard.cool-=dt;if(s.guard.cool<=0){s.guard.cool=Math.max(6,30/speed);let opts=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:s.guard.x+dx,y:s.guard.y+dy})).filter(p=>p.x>0&&p.y>0&&p.x<14&&p.y<10&&!s.maze[p.y][p.x]);opts.sort((a,b)=>(Math.abs(a.x-s.p.x)+Math.abs(a.y-s.p.y))-(Math.abs(b.x-s.p.x)+Math.abs(b.y-s.p.y)));if(opts.length){const step=Math.random()<.7?opts[0]:opts[Math.floor(rnd(0,opts.length))];s.guard.x=step.x;s.guard.y=step.y}if(s.guard.x===s.p.x&&s.guard.y===s.p.y){lose(75+s.p.x*30,90+s.p.y*30);s.p.x=1;s.p.y=1}}
 }
 else if(s.type==="shooter"){
   s.p.x=clamp(s.p.x+x*7.8*dt,20,580);s.fire=(s.fire||0)-dt;
   if((action()||s.variant===0)&&s.fire<=0){s.fire=Math.max(5,11/speed);s.bullets.push({x:s.p.x,y:405,vy:-11*speed});sound(360,.03,"square",.012)}
   s.spawn-=dt;if(s.spawn<=0){s.spawn=Math.max(8,29/speed);s.ents.push({x:rnd(32,568),y:-35,vx:rnd(-1.3,1.3)*speed,vy:rnd(2.4,4)*speed,hp:s.level>=3?2:1,kind:"enemy",r:22})}
   for(const b of s.bullets)b.y+=b.vy*dt;
   for(const e of s.ents){e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.x<20||e.x>580)e.vx*=-1;if(e.kind==="enemy"&&e.y>505){e.gone=true;lose(e.x,460)}for(const b of s.bullets){if(!b.gone&&!e.gone&&Math.hypot(b.x-e.x,b.y-e.y)<e.r+6){b.gone=true;e.hp--;if(e.hp<=0){e.gone=true;score(10,e.x,e.y)}else sparks(e.x,e.y,s.accent,5)}}}
   s.ents=s.ents.filter(e=>!e.gone);s.bullets=s.bullets.filter(b=>!b.gone&&b.y>-20);
   if(s.score>=s.bossAt&&!s.boss){s.boss={x:300,y:75,hp:15+s.level*5,t:0};s.bossAt+=250;s.banner=90}
   if(s.boss){let b=s.boss;b.t+=dt;b.x=300+Math.sin(b.t*.022)*210;for(const shot of s.bullets)if(!shot.gone&&Math.abs(shot.x-b.x)<52&&Math.abs(shot.y-b.y)<40){shot.gone=true;b.hp--;sparks(shot.x,shot.y,s.accent,5)}if(b.hp<=0){score(90,b.x,b.y);s.boss=null;s.shake=30}}
   if(s.invuln<=0&&s.ents.some(e=>Math.abs(e.x-s.p.x)<35&&Math.abs(e.y-420)<35))lose(s.p.x,420);
 }
 else if(s.type==="memory"){
   s.time-=dt;s.preview=Math.max(0,s.preview-dt);if(s.lock>0){s.lock-=dt;if(s.lock<=0){for(const i of s.picks)s.deck[i].open=false;s.picks=[]}}if(s.time<=0)end(false);
 }
 else if(s.type==="runner"){
   s.p.vy+=.49*dt;s.p.y+=s.p.vy*dt;if(s.p.y>419){s.p.y=419;s.p.vy=0;s.jumps=0}
   if((input.has("ArrowDown")||input.has("s"))&&s.p.y===419)s.slide=13;else s.slide=Math.max(0,(s.slide||0)-dt);
   s.spawn-=dt;if(s.spawn<=0){s.spawn=Math.max(23,68/speed);const kind=Math.random()<.28?"coin":Math.random()<.5?"tall":"block";s.ents.push({x:630,y:kind==="coin"?rnd(305,395):kind==="tall"?390:440,kind,r:kind==="coin"?13:22,w:kind==="tall"?20:30})}
   s.ents.forEach(e=>{e.x-=(5.5+speed*1.2)*dt;if(e.x<-40)e.gone=true;if(!e.gone&&Math.abs(e.x-105)<25){if(e.kind==="coin"&&Math.abs(e.y-s.p.y)<40){e.gone=true;score(15,e.x,e.y)}else if(e.kind!=="coin"&&Math.abs(e.y-s.p.y)<(s.slide&&e.kind==="tall"?15:38)){e.gone=true;lose(105,s.p.y)}}});
   s.ents=s.ents.filter(e=>!e.gone);s.score+=dt*.17*speed;
 }
 for(const e of s.fx){e.x+=e.vx*dt;e.y+=e.vy*dt;e.vy+=.12*dt;e.life-=dt}s.fx=s.fx.filter(e=>e.life>0).slice(-320);
}
function themeBackground(){
 const s=G,v=variants[s.variant],gr=ctx.createLinearGradient(0,0,W,H);gr.addColorStop(0,v[1]);gr.addColorStop(.7,"#0b1025");gr.addColorStop(1,"#060818");ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle="#ffffff0b";ctx.lineWidth=1;const scroll=s.t*.25;for(let i=0;i<18;i++){let x=i*44+scroll%44;line(x,0,x,H,"#ffffff0b",1)}for(let j=0;j<17;j++){let y=j*35+scroll%35;line(0,y,600,y,"#ffffff0b",1)}
 for(let i=0;i<26;i++){let x=(i*173+23)%600,y=(i*107+s.t*(.15+s.level*.08))%520;circle(x,y,1.5,i%3?"#ffffff66":v[2])}
}
function renderGame(){
 if(!G)return;const s=G;ctx.save();if(s.shake>.3)ctx.translate(rnd(-s.shake/2,s.shake/2),rnd(-s.shake/2,s.shake/2));themeBackground();const col=s.accent;
 if(s.type==="snake"){
  rectangle(38,60,524,384,"#00092488");for(let x=0;x<26;x++)for(let y=0;y<19;y++)if((x+y)%2===0)rectangle(40+x*20,62+y*20,19,19,"#ffffff06");
  s.mines.forEach(m=>{circle(50+m[0]*20,72+m[1]*20,8,"#ff506c");text("✕",50+m[0]*20,77+m[1]*20,12)});
  circle(50+s.food[0]*20,72+s.food[1]*20,9,"#ffe07c");s.snake.forEach((p,i)=>{rectangle(41+p[0]*20,63+p[1]*20,18,18,i?col:"#ffffff");if(i===0){circle(45+p[0]*20,69+p[1]*20,2,"#0b0c20");circle(54+p[0]*20,69+p[1]*20,2,"#0b0c20")}});
 }
 if(s.type==="dodge"){
  rectangle(115,0,370,500,"#111828");for(let i=1;i<4;i++)for(let y=-65+(s.t*7)%95;y<500;y+=95)rectangle(115+i*92,y,5,48,"#ffffcc44");
  for(const e of s.ents){const shield=e.kind==="shield";rectangle(e.x-22,e.y-35,44,70,shield?"#64efff":"#ff597b");rectangle(e.x-15,e.y-22,30,22,"#1c223e");rectangle(e.x-15,e.y+10,30,18,"#1c223e")}
  rectangle(s.p.x-23,375,46,78,s.invuln>0&&Math.floor(s.t/5)%2?"#ffffff88":col);rectangle(s.p.x-16,387,32,25,"#141d37");rectangle(s.p.x-16,429,32,11,"#10182d");
 }
 if(s.type==="catch"){rectangle(0,463,600,37,"#0b1232");for(const e of s.ents){text(e.kind==="star"?"⭐":e.kind==="shield"?"🛡️":"☄️",e.x,e.y,30)}text("🧺",s.p.x,452,59)}
 if(s.type==="brick"){
  s.bricks.forEach(b=>{if(b.hp>0){ctx.shadowBlur=11;ctx.shadowColor=col;rectangle(b.x,b.y,b.w,b.h,b.hp===2?"#fff1a5":col);ctx.shadowBlur=0}});
  rectangle(s.p.x-61,441,122,15,"#fff");rectangle(s.p.x-45,446,90,6,col);ctx.shadowBlur=15;ctx.shadowColor="#fff";circle(s.ball.x,s.ball.y,10,"#fff6b8");ctx.shadowBlur=0;
 }
 if(s.type==="hop"){for(const p of s.ents){rectangle(p.x,p.y,p.w,12,col);rectangle(p.x+4,p.y+12,p.w-8,5,"#ffffff43")};text("🪽",s.p.x,s.p.y+12,39)}
 if(s.type==="target"){for(const e of s.ents){circle(e.x,e.y,e.r+5,"#ffffff19");circle(e.x,e.y,e.r,e.kind==="bomb"?"#fd516b":col);circle(e.x,e.y,e.r*.6,"#fff");circle(e.x,e.y,e.r*.27,e.kind==="bomb"?"#ff3344":col);if(e.kind==="bomb")text("!",e.x,e.y+8,24,"#14121f")};line(s.pointerX-16,s.pointerY,s.pointerX+16,s.pointerY,"#ffffffb0");line(s.pointerX,s.pointerY-16,s.pointerX,s.pointerY+16,"#ffffffb0");text("ZEIT "+Math.max(0,Math.ceil(s.time/60))+"s",500,65,18)}
 if(s.type==="maze"){
  const cell=30,ox=75,oy=80;
  for(let yy=0;yy<11;yy++)for(let xx=0;xx<15;xx++){const x=ox+xx*cell,y=oy+yy*cell;rectangle(x,y,cell-1,cell-1,s.maze[yy][xx]?"#605092":"#151a35")}
  s.gems.filter(g=>!g.got).forEach(g=>circle(ox+g.x*cell+15,oy+g.y*cell+15,7,"#f8d66d"));circle(ox+13*cell+15,oy+9*cell+15,12,"#75ffb2");
  circle(ox+s.guard.x*cell+15,oy+s.guard.y*cell+15,10,"#ff5676");circle(ox+s.p.x*cell+15,oy+s.p.y*cell+15,12,col);
  text("💎 "+s.gems.filter(g=>g.got).length+"/"+s.gems.length,300,56,18);
 }
 if(s.type==="shooter"){
  s.ents.forEach(e=>{ctx.save();ctx.translate(e.x,e.y);ctx.rotate(s.t*.025);text("☄️",0,10,43);ctx.restore()});for(const b of s.bullets){rectangle(b.x-3,b.y-12,6,21,"#fff8a4")}
  if(s.boss){const b=s.boss;circle(b.x,b.y,50,"#902154");text("👾",b.x,b.y+25,69);rectangle(200,16,200,8,"#ffffff40");rectangle(200,16,200*b.hp/(15+s.level*5),8,"#ff5479")}
  ctx.save();ctx.translate(s.p.x,430);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,-31);ctx.lineTo(-25,27);ctx.lineTo(0,17);ctx.lineTo(25,27);ctx.closePath();ctx.fill();ctx.restore();
 }
 if(s.type==="memory"){
  const n=s.deck.length,cols=4,cw=97,ch=n===20?71:88,gapX=15,gapY=10,ox=74,oy=n===20?65:72;
  s.deck.forEach((a,i)=>{const xx=ox+(i%cols)*(cw+gapX),yy=oy+Math.floor(i/cols)*(ch+gapY),open=a.open||a.matched||s.preview>0;rectangle(xx,yy,cw,ch,a.matched?"#21715f":open?"#514074":col);text(open?a.symbol:"✦",xx+cw/2,yy+ch/2+16,39)});
  text("PAARE "+s.found+"/"+n/2,300,40,19);text("ZEIT "+Math.ceil(s.time/60)+"s",510,40,16);
 }
 if(s.type==="runner"){
  rectangle(0,460,600,40,"#222742");for(let x=-80+(s.t*7)%80;x<650;x+=80)rectangle(x,475,42,5,col);
  for(const e of s.ents){if(e.kind==="coin")text("💎",e.x,e.y+10,29);else if(e.kind==="tall"){rectangle(e.x-14,e.y-44,28,72,"#ff4e70");rectangle(e.x-16,e.y-50,32,10,"#ffbc6e")}else{text("🔥",e.x,e.y+15,41)}}
  if(s.slide)rectangle(82,430,47,22,col);else{circle(105,s.p.y-22,13,"#ffdbc9");rectangle(91,s.p.y-11,28,32,col);const kick=Math.sin(s.t*.45)*9;line(100,s.p.y+20,94+kick,s.p.y+38,"#ffdbc9",6);line(112,s.p.y+20,122-kick,s.p.y+38,"#ffdbc9",6)}
 }
 for(const f of s.fx){ctx.globalAlpha=clamp(f.life/30,0,1);circle(f.x,f.y,f.size,f.color)}ctx.globalAlpha=1;
 rectangle(0,0,600,42,"#05071cc9");text("✦ "+Math.floor(s.score),18,28,20,"#fff","left");text("STUFE "+s.level,300,28,16);text("♥ "+Math.max(0,s.lives),582,28,19,"#ff9eb6","right");
 if(s.shield)text("🛡️ SCHILD",493,63,13,"#93edff");if(s.banner&&!s.ready&&!s.over){rectangle(70,208,460,92,"#0b1026e8");text("⚡ STUFE "+s.level+" ⚡",300,262,34,col)}
 ctx.restore();
 const overlay=s.ready||s.paused||s.over;if(overlay){
  rectangle(0,0,600,500,"#070a1bdb");ctx.shadowColor=col;ctx.shadowBlur=20;
  text(s.over?(s.win?"🏆 CHALLENGE GESCHAFFT":"💀 GAME OVER"):s.paused?"⏸ PAUSE":s.icon+" "+s.name,300,173,s.ready?30:34);
  ctx.shadowBlur=0;text(s.over?"Punkte: "+Math.floor(s.score)+"   •   Best: "+Math.max(Math.floor(s.score),bests[s.id]||0):s.ready?helpFor(s.type):"Drücke P zum Fortsetzen",300,225,17);
  text(s.over?"TIPPE / ENTER / R FÜR NEUSTART":s.ready?"TIPPE / ENTER ZUM STARTEN":"P = WEITER   •   R = NEUSTART",300,304,20,col);
 }
 status.textContent=(s.ready?"Bereit • ":s.over?"Ende • ":"Läuft • ")+"Punkte "+Math.floor(s.score)+" • Highscore "+Math.max(bests[s.id]||0,Math.floor(s.score))+" • "+(s.type==="memory"?"Paare "+s.found+"/"+s.deck.length/2:s.type==="maze"?"Sammle alle Kristalle und erreiche das Portal":"Level "+s.level);
}
function helpFor(type){return({snake:"Pfeiltasten / WASD • Kerne fressen, Minen meiden",dodge:"Links / Rechts • Autos ausweichen",catch:"Links / Rechts • Sterne fangen, Splitter meiden",brick:"Links / Rechts • Den Ball zurückschlagen",hop:"Links / Rechts • Auf Plattformen landen",target:"Auf Ziele tippen • Bomben vermeiden",maze:"Pfeiltasten / WASD • Kristalle und Ausgang",shooter:"Links / Rechts und Leertaste zum Schiessen",memory:"Karten antippen • Gleiche Symbole aufdecken",runner:"Leertaste = Doppelsprung • Unten = Ducken"})[type]}
function loop(t){if(!G)return;const dt=Math.min(2,Math.max(0,(t-(last||t))/16.67));last=t;advance(dt);renderGame();raf=requestAnimationFrame(loop)}
function startGame(){if(!G)return;if(G.over){finishHighscore();init();G.ready=false}else if(G.ready)G.ready=false;else if(G.paused)G.paused=false;sound(560,.12)}
function close(){finishHighscore();modal.classList.remove("show");cancelAnimationFrame(raf);raf=0;G=null;input.clear();render()}
$("close").onclick=close;$("restart").onclick=()=>{if(G){finishHighscore();init();G.ready=false}};
modal.onclick=e=>{if(e.target===modal)close()};
function clickCanvas(e){
 if(!G)return;if(G.ready||G.over||G.paused){startGame();return}
 const r=canvas.getBoundingClientRect(),xx=(e.clientX-r.left)*600/r.width,yy=(e.clientY-r.top)*500/r.height,s=G;s.pointerX=xx;s.pointerY=yy;
 if(s.type==="target"){for(let i=s.ents.length-1;i>=0;i--){const a=s.ents[i];if(Math.hypot(xx-a.x,yy-a.y)<a.r+6){s.ents.splice(i,1);if(a.kind==="bomb")lose(xx,yy);else score(10+Math.min(30,s.combo*2),xx,yy);return}}s.combo=0;sound(170,.04)}
 else if(s.type==="memory"){if(s.lock>0||s.preview>0)return;const n=s.deck.length,cols=4,cw=97,ch=n===20?71:88,gapX=15,gapY=10,ox=74,oy=n===20?65:72;const col=Math.floor((xx-ox)/(cw+gapX)),row=Math.floor((yy-oy)/(ch+gapY)),i=row*cols+col;if(col<0||col>=4||row<0||i>=n)return;const left=ox+col*(cw+gapX),top=oy+row*(ch+gapY);if(xx>left+cw||yy>top+ch)return;const a=s.deck[i];if(a.open||a.matched)return;a.open=true;s.picks.push(i);s.moves++;sound(480,.05);if(s.picks.length===2){const [i1,i2]=s.picks;if(s.deck[i1].symbol===s.deck[i2].symbol){s.deck[i1].matched=true;s.deck[i2].matched=true;s.picks=[];s.found++;s.combo++;s.score+=10+Math.min(20,s.combo*2);sparks(xx,yy,s.accent,18);if(s.found===n/2){s.level++;s.score+=30;buildMemory();s.banner=90;if(s.level>4)end(true)}}else{s.combo=0;s.lock=42}}}
 else if(s.type==="hop"||s.type==="runner"){jump()}else if(s.type==="shooter"){input.add(" ");setTimeout(()=>input.delete(" "),125)}
}
function jump(){if(!G||G.over||G.ready)return;if(G.type==="runner"&&G.jumps<2){G.p.vy=G.jumps===0?-11.4:-10;G.jumps++;sparks(105,G.p.y,G.accent,10);sound(300,.08)}}
canvas.addEventListener("pointerdown",clickCanvas);
canvas.addEventListener("pointermove",e=>{if(!G)return;const r=canvas.getBoundingClientRect();G.pointerX=(e.clientX-r.left)*600/r.width;G.pointerY=(e.clientY-r.top)*500/r.height;if(G.type==="brick"&&e.buttons||G.type==="brick"&&e.pointerType==="touch")G.p.x=clamp(G.pointerX,61,539)});
document.addEventListener("keydown",e=>{if(!G)return;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();input.add(e.key);if(e.key==="Escape"){close();return}if(e.key.toLowerCase()==="r"){finishHighscore();init();G.ready=false;return}if(e.key==="Enter"&&(G.ready||G.over)){startGame();return}if(e.key.toLowerCase()==="p"&&!G.ready&&!G.over){G.paused=!G.paused;return}if(e.key===" "&&!e.repeat){if(G.ready||G.over){startGame();return}if(G.type==="runner")jump()}});
document.addEventListener("keyup",e=>input.delete(e.key));
for(const [id,key]of [["left","ArrowLeft"],["right","ArrowRight"],["up","ArrowUp"],["down","ArrowDown"]]){const el=$(id);el.addEventListener("pointerdown",e=>{e.preventDefault();if(G&&(G.ready||G.over))startGame();if(key==="ArrowUp"&&G?.type==="runner")jump();input.add(key);el.setPointerCapture(e.pointerId)});for(const event of ["pointerup","pointercancel","lostpointercapture"])el.addEventListener(event,()=>input.delete(key))}
const soundBtn=document.createElement("button");soundBtn.textContent="🔊 Ton";soundBtn.style.cssText="background:#3b3557";document.querySelector(".controls").append(soundBtn);soundBtn.onclick=()=>{muted=!muted;soundBtn.textContent=muted?"🔇 Stumm":"🔊 Ton"};
document.addEventListener("visibilitychange",()=>{if(document.hidden&&G&&!G.over&&!G.ready){G.paused=true;input.clear()}});
