(function buildEngine(){
"use strict";
const W=960,H=600,TAU=Math.PI*2,$=id=>document.getElementById(id),canvas=$("canvas"),g=canvas.getContext("2d"),lib=window.ORBIT_PREMIUM;
let G=null,raf=0,last=0,keys=new Set(),soundEnabled=true,audio=null;
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),hit=(a,b,r)=>Math.hypot(a.x-b.x,a.y-b.y)<r;
function audioFx(f=420,d=.08,type="sine",vol=.03){if(!soundEnabled)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),v=audio.createGain();o.type=type;o.frequency.setValueAtTime(f,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(65,f*.55),audio.currentTime+d);v.gain.setValueAtTime(vol,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(v);v.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}}
function circle(x,y,r,color){g.fillStyle=color;g.beginPath();g.arc(x,y,Math.max(.1,r),0,TAU);g.fill()}
function rect(x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h)}
function line(x,y,xx,yy,color,w=2){g.strokeStyle=color;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(xx,yy);g.stroke()}
function poly(points,fill){g.fillStyle=fill;g.beginPath();g.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)g.lineTo(points[i][0],points[i][1]);g.closePath();g.fill()}
function text(t,x,y,size=20,color="#fff",align="center"){g.font=`900 ${size}px system-ui`;g.fillStyle=color;g.textAlign=align;g.fillText(t,x,y)}
function grad(a,b){const t=g.createLinearGradient(0,0,0,H);t.addColorStop(0,a);t.addColorStop(1,b);rect(0,0,W,H,t)}
function glow(x,y,r,color){g.save();const a=g.createRadialGradient(x,y,0,x,y,r);a.addColorStop(0,color);a.addColorStop(1,"#00000000");circle(x,y,r,a);g.restore()}
function particle(x,y,c,n=12,power=1){if(!G)return;for(let i=0;i<n;i++)G.fx.push({x,y,vx:rnd(-5,5)*power,vy:rnd(-6,4)*power,ttl:rnd(15,48),max:48,r:rnd(1,5),color:c})}
function points(n,x,y){G.score+=n;if(n>0){particle(x,y,G.accent,Math.min(24,4+Math.ceil(n/3)));audioFx(470+Math.min(500,G.combo*20),.06);G.combo++}G.banner=G.banner||0}
function damage(x,y){const s=G;if(s.invuln>0||s.dead)return;if(s.shield>0){s.shield=0;particle(x,y,"#81edff",36);audioFx(600,.12);return}s.hp--;s.invuln=70;s.combo=0;s.shake=23;s.flash=17;particle(x,y,"#ff647e",45);audioFx(140,.25,"sawtooth",.05);if(s.hp<=0)finish()}
function finish(win=false){if(!G||G.dead)return;G.dead=true;G.won=win;updateBest();audioFx(win?880:140,.35,"triangle",.06)}
function updateBest(){if(!G)return;const n=Math.floor(G.score);if(n>(lib.bests[G.id]||0)){lib.bests[G.id]=n;lib.save();lib.render()}}
function newLevel(){G.level++;G.banner=120;G.shake=15;G.flash=10;particle(W/2,H/2,G.accent,65,2);audioFx(820,.22,"sawtooth",.025)}
function open(id){const item=lib.games.find(x=>x.id===id);if(!item||item.url)return;G={id,mode:id,title:item.name,accent:item.color[1],hp:3,score:0,combo:0,level:1,fx:[],obj:[],shoot:[],t:0,scroll:0,invuln:0,shield:0,shake:0,flash:0,banner:0,dead:false,won:false,paused:false,ready:true,spawn:0,cool:0,player:{x:470,y:460,vx:0,vy:0},pointer:{x:480,y:300}};initialize();$("gameTitle").textContent=item.icon+" "+item.name;$("gameSubtitle").textContent=item.tag+" • ORBIT STORE 3.0";$("player").classList.add("open");keys.clear();last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function initialize(){const s=G;if(!s)return;Object.assign(s,{hp:3,score:0,combo:0,level:1,fx:[],obj:[],shoot:[],t:0,scroll:0,invuln:0,shield:0,shake:0,flash:0,banner:0,dead:false,won:false,paused:false,ready:true,spawn:16,cool:0,player:{x:470,y:460,vx:0,vy:0}});
if(s.mode==="drift"){s.player.x=480;s.road=0;s.nitro=50;s.boost=0;s.distance=0}
if(s.mode==="runner"){s.player.x=204;s.player.y=482;s.jumps=0;s.slide=0;s.speed=9;s.spawn=75}
if(s.mode==="inferno"){s.player.x=480;s.ball=[{x:470,y:430,vx:5.5,vy:-6.4}];s.bricks=[];s.coreBoss=null;buildBricks()}
if(s.mode==="astro"){s.player.x=480;s.player.y=500;s.spawn=28;s.boss=null;s.bossNext=220;s.hp=4}
if(s.mode==="maze"){s.hp=3;buildMaze()}
if(s.mode==="target"){s.hp=3;s.clock=65*60;s.spawn=10}
if(s.mode==="sky"){s.player.x=470;s.player.y=420;s.player.vy=-12;s.camera=0;s.height=0;s.obj=[];s.hp=1;for(let i=0;i<9;i++)s.obj.push({x:120+(i*191)%650,y:540-i*83,w:105,kind:"platform",moving:i%4===0})}
}
function buildBricks(){const s=G;s.bricks=[];for(let row=0;row<5+s.level%4;row++)for(let col=0;col<12;col++){if((row*7+col+s.level)%11===0)continue;s.bricks.push({x:80+col*67,y:88+row*36,hp:1+((row+col+s.level)%7===0?1:0),phase:rnd(0,TAU)})}s.coreBoss=s.level%3===0?{x:480,y:90,hp:22+s.level*6,max:22+s.level*6,t:0,fire:95}:null;s.banner=90}
function buildMaze(){const s=G;s.maze=Array.from({length:15},()=>Array(25).fill(1));function dig(x,y){s.maze[y][x]=0;const ds=[[0,2],[2,0],[-2,0],[0,-2]].sort(()=>Math.random()-.5);for(const [dx,dy]of ds){const xx=x+dx,yy=y+dy;if(xx>0&&yy>0&&xx<24&&yy<14&&s.maze[yy][xx]){s.maze[y+dy/2][x+dx/2]=0;dig(xx,yy)}}}dig(1,1);s.player.x=1;s.player.y=1;s.maze[13][23]=0;s.gems=[];for(let i=0;i<7+s.level;i++){let x,y;do{x=1+Math.floor(rnd(0,12))*2;y=1+Math.floor(rnd(0,7))*2}while(s.gems.some(p=>p.x===x&&p.y===y)||x===1&&y===1);s.gems.push({x,y,taken:false})}s.guard={x:23,y:13,timer:45};s.moveTimer=0}
const pressed=(k,k2)=>keys.has(k)||!!k2&&keys.has(k2),axisX=()=>Number(pressed("ArrowRight","KeyD"))-Number(pressed("ArrowLeft","KeyA")),axisY=()=>Number(pressed("ArrowDown","KeyS"))-Number(pressed("ArrowUp","KeyW"));
function action(){const s=G;if(!s||s.dead||s.ready)return;if(s.mode==="runner"&&s.jumps<2){s.player.vy=s.jumps===0?-14:-12;s.jumps++;particle(s.player.x,s.player.y,s.accent,10);audioFx(370,.06)}if(s.mode==="drift"&&s.nitro>1){s.boost=42;s.nitro=Math.max(0,s.nitro-28);audioFx(700,.17,"sawtooth")}}
function step(dt){
const s=G;if(!s||s.ready||s.dead||s.paused)return;s.t+=dt;s.scroll+=dt;s.invuln=Math.max(0,s.invuln-dt);s.shake*=.9;s.flash=Math.max(0,s.flash-dt);s.banner=Math.max(0,s.banner-dt);s.cool-=dt;const mx=axisX(),my=axisY();
if(s.mode==="drift"){
 const v=5.8+s.level*.55+(s.boost>0?5:0);s.boost=Math.max(0,s.boost-dt);s.road+=v*dt;s.distance+=v*dt;s.score+=v*.025*dt;
 s.player.x=clamp(s.player.x+mx*9.6*dt,272,688);if(s.boost>0)particle(s.player.x,535,"#63fcff",2);
 s.spawn-=dt;if(s.spawn<=0){s.spawn=Math.max(11,42-s.level*3);const lane=[338,438,538,638][Math.floor(rnd(0,4))],pickup=Math.random()<.17;s.obj.push({x:lane,y:-110,kind:pickup?"nitro":"car",speed:rnd(3,5)+v*.78,seed:rnd(0,100),gone:false})}
 for(const e of s.obj){e.y+=e.speed*dt;if(e.y>660&&!e.gone){e.gone=true;if(e.kind==="car")points(3,e.x,550)}
 if(!e.gone&&Math.abs(e.y-477)<75&&Math.abs(e.x-s.player.x)<53){e.gone=true;if(e.kind==="nitro"){s.nitro=clamp(s.nitro+26,0,100);points(20,e.x,e.y)}else if(s.boost<=0)damage(e.x,e.y);else points(10,e.x,e.y)}}
 s.obj=s.obj.filter(e=>!e.gone);if(s.distance>3000*s.level)newLevel();
}
if(s.mode==="runner"){
 const p=s.player,speed=8+s.level*.8;p.vy+=.64*dt;p.y+=p.vy*dt;if(p.y>=482){p.y=482;p.vy=0;s.jumps=0}if(pressed("ArrowDown","KeyS")&&p.y===482)s.slide=14;else s.slide=Math.max(0,(s.slide||0)-dt);s.score+=speed*.04*dt;
 s.spawn-=dt;if(s.spawn<=0){s.spawn=Math.max(27,78-s.level*5);const r=Math.random(),kind=r<.19?"crystal":r<.46?"drone":r<.75?"wall":"spikes";s.obj.push({x:1030,y:kind==="drone"?445:kind==="crystal"?rnd(330,420):485,kind,alive:true})}
 for(const e of s.obj){e.x-=speed*dt;if(!e.alive)continue;if(Math.abs(e.x-p.x)<34){if(e.kind==="crystal"&&Math.abs(e.y-p.y)<60){e.alive=false;points(25,e.x,e.y)}if(e.kind==="wall"&&p.y>430){e.alive=false;damage(e.x,e.y)}if(e.kind==="spikes"&&p.y>453){e.alive=false;damage(e.x,e.y)}if(e.kind==="drone"&&p.y>385&&(!s.slide||p.y<475)){e.alive=false;damage(e.x,e.y)}}}s.obj=s.obj.filter(e=>e.x>-80&&e.alive);if(s.score>170*s.level)newLevel();
}
if(s.mode==="inferno"){
 s.player.x=clamp(s.player.x+mx*12*dt,94,866);
 if(pressed("Space")&&s.cool<=0){s.cool=65;for(const dx of [-40,40])s.shoot.push({x:s.player.x+dx,y:514,vy:-14});audioFx(850,.06,"square")}
 for(const sh of s.shoot)sh.y+=sh.vy*dt;s.shoot=s.shoot.filter(sh=>sh.y>-30);
 for(const b of s.ball){const old=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<14){b.x=14;b.vx=Math.abs(b.vx)}if(b.x>946){b.x=946;b.vx=-Math.abs(b.vx)}if(b.y<48){b.y=48;b.vy=Math.abs(b.vy)}
 if(b.vy>0&&old<521&&b.y>=521&&Math.abs(b.x-s.player.x)<91){b.y=516;b.vy=-Math.abs(b.vy);b.vx=clamp(b.vx+(b.x-s.player.x)*.05,-11,11);audioFx(230,.075)}
 if(b.y>650){b.dead=true;s.hp--;s.shake=10;if(s.hp<=0)finish()}
 }
 s.ball=s.ball.filter(b=>!b.dead);if(!s.ball.length&&s.hp>0)s.ball=[{x:s.player.x,y:440,vx:rnd(-5,5)||5,vy:-7}];
 for(const brick of s.bricks)if(brick.hp>0){const centre={x:brick.x+28,y:brick.y+13};let impact=false;for(const b of s.ball)if(b.x>brick.x-13&&b.x<brick.x+69&&b.y>brick.y-13&&b.y<brick.y+36){b.vy*=-1;impact=true;break}for(const sh of s.shoot)if(sh.y>brick.y&&sh.y<brick.y+32&&sh.x>brick.x&&sh.x<brick.x+56){sh.y=-100;impact=true;break}if(impact){brick.hp--;if(brick.hp===0){points(10,centre.x,centre.y);if(Math.random()<.035&&s.ball.length<3)s.ball.push({x:centre.x,y:centre.y,vx:rnd(-6,6)||4,vy:5})}}}
 if(s.coreBoss){const boss=s.coreBoss;boss.t+=dt;boss.x=480+Math.sin(boss.t*.019)*215;boss.fire-=dt;if(boss.fire<=0){boss.fire=Math.max(30,95-s.level*4);s.obj.push({x:boss.x,y:160,vy:3+s.level*.5,kind:"fire"})}
for(const b of s.ball)if(b.vy<0&&Math.abs(b.x-boss.x)<82&&Math.abs(b.y-boss.y)<69){b.vy=Math.abs(b.vy);boss.hp--;particle(b.x,b.y,"#ffdc6a",10)}
for(const sh of s.shoot)if(sh.y>boss.y-55&&sh.y<boss.y+55&&Math.abs(sh.x-boss.x)<85){sh.y=-100;boss.hp--;particle(sh.x,sh.y,"#ffc66d",6)}
if(boss.hp<=0){points(180,boss.x,boss.y);particle(boss.x,boss.y,"#ff822f",85,2);s.coreBoss=null;s.shake=27}}
for(const e of s.obj){e.y+=e.vy*dt;if(e.y>650)e.gone=true;if(!e.gone&&Math.abs(e.y-535)<28&&Math.abs(e.x-s.player.x)<85){e.gone=true;damage(e.x,e.y)}}s.obj=s.obj.filter(e=>!e.gone);
if(!s.bricks.some(b=>b.hp>0)&&!s.coreBoss){newLevel();buildBricks();s.obj=[];s.ball=[{x:s.player.x,y:415,vx:5+s.level*.5,vy:-6-s.level*.4}]}
}
if(s.mode==="astro"){
 const p=s.player;p.x=clamp(p.x+mx*8*dt,40,920);p.y=clamp(p.y+my*7*dt,290,555);
 if((pressed("Space")||s.t%8<dt)&&s.cool<=0){s.cool=9;s.shoot.push({x:p.x-13,y:p.y-25,vy:-16},{x:p.x+13,y:p.y-25,vy:-16});audioFx(430,.035,"square",.008)}
 s.spawn-=dt;if(s.spawn<=0){s.spawn=Math.max(10,35-s.level*3);s.obj.push({x:rnd(60,900),y:-55,kind:"enemy",vx:rnd(-2,2),vy:rnd(2.5,4)+s.level*.35,hp:s.level>3?2:1,alive:true})}
 for(const sh of s.shoot)sh.y+=sh.vy*dt;
 for(const e of s.obj){e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.x<35||e.x>925)e.vx*=-1;if(e.y>630&&e.alive){e.alive=false;damage(p.x,p.y)}
 if(e.alive&&hit(e,p,43)){e.alive=false;damage(e.x,e.y)}
 for(const sh of s.shoot)if(!sh.dead&&e.alive&&hit(sh,e,27)){sh.dead=true;e.hp--;if(e.hp<=0){e.alive=false;points(20,e.x,e.y)}else particle(e.x,e.y,s.accent,4)}}
 s.shoot=s.shoot.filter(e=>!e.dead&&e.y>-30);s.obj=s.obj.filter(e=>e.alive);
 if(s.score>s.bossNext&&!s.boss){s.boss={x:480,y:100,hp:25+s.level*8,max:25+s.level*8,t:0,fire:70};s.bossNext+=300;s.banner=100}
 if(s.boss){const b=s.boss;b.t+=dt;b.x=480+Math.sin(b.t*.013)*260;b.fire-=dt;if(b.fire<=0){b.fire=75;s.obj.push({x:b.x,y:b.y+70,kind:"enemy",vx:(p.x-b.x)/120,vy:4,hp:1,alive:true})}
 for(const sh of s.shoot)if(!sh.dead&&Math.abs(sh.x-b.x)<100&&Math.abs(sh.y-b.y)<68){sh.dead=true;b.hp--;particle(sh.x,sh.y,s.accent,4)}if(b.hp<=0){points(120,b.x,b.y);s.boss=null;newLevel()}}
}
if(s.mode==="maze"){
 s.moveTimer-=dt;if(s.moveTimer<=0&&(mx||my)){s.moveTimer=7;const x=s.player.x+(mx||0),y=s.player.y+(mx?0:my);if(x>0&&x<24&&y>0&&y<14&&!s.maze[y][x]){s.player.x=x;s.player.y=y;for(const gem of s.gems)if(!gem.taken&&gem.x===x&&gem.y===y){gem.taken=true;points(20,95+x*31,80+y*31)}}
 if(s.player.x===23&&s.player.y===13&&s.gems.every(z=>z.taken)){points(100,840,495);newLevel();buildMaze()}}
 s.guard.timer-=dt;if(s.guard.timer<=0){s.guard.timer=Math.max(8,28-s.level);const opts=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:s.guard.x+dx,y:s.guard.y+dy})).filter(v=>v.x>0&&v.x<24&&v.y>0&&v.y<14&&!s.maze[v.y][v.x]);opts.sort((a,b)=>(Math.abs(a.x-s.player.x)+Math.abs(a.y-s.player.y))-(Math.abs(b.x-s.player.x)+Math.abs(b.y-s.player.y)));if(opts.length){const chosen=Math.random()<.8?opts[0]:opts[Math.floor(rnd(0,opts.length))];s.guard.x=chosen.x;s.guard.y=chosen.y}if(s.guard.x===s.player.x&&s.guard.y===s.player.y){damage(95+s.player.x*31,80+s.player.y*31);s.player.x=1;s.player.y=1}}
}
if(s.mode==="target"){
 s.clock-=dt;s.spawn-=dt;if(s.spawn<=0){s.spawn=Math.max(8,29-s.level*3);s.obj.push({x:rnd(90,870),y:rnd(110,470),vx:rnd(-3,3)*(.9+s.level*.2),vy:rnd(-2,2),r:rnd(24,43),kind:Math.random()<.2?"bomb":"target",ttl:105-s.level*4})}
 for(const e of s.obj){e.x+=e.vx*dt;e.y+=e.vy*dt;e.ttl-=dt;if(e.x<60||e.x>900)e.vx*=-1;if(e.y<70||e.y>540)e.vy*=-1}const lost=s.obj.filter(e=>e.ttl<=0&&e.kind==="target").length;s.combo=lost?0:s.combo;s.obj=s.obj.filter(e=>e.ttl>0);if(s.clock<=0)finish(true);if(s.score>=s.level*350)newLevel();
}
if(s.mode==="sky"){
 const p=s.player,old=p.y;p.vy+=.38*dt;p.x=clamp(p.x+mx*7.6*dt,35,925);p.y+=p.vy*dt;
 for(const e of s.obj)if(e.kind==="platform"&&p.vy>0&&old+22<=e.y&&p.y+22>=e.y&&p.x+22>e.x&&p.x-22<e.x+e.w){p.y=e.y-22;p.vy=-13.6;particle(p.x,e.y,s.accent,7);audioFx(400,.05)}
 if(p.y<240){const d=240-p.y;p.y=240;s.height+=d;s.score+=d*.15;for(const e of s.obj)e.y+=d}
 for(const e of s.obj)if(e.moving)e.x=clamp(e.x+Math.sin(s.t*.032+e.y)*.9*dt,15,850);
 for(const e of s.obj)if(e.kind==="gem"&&Math.hypot(e.x-p.x,e.y-p.y)<33){e.y=999;points(30,p.x,p.y)}
s.obj=s.obj.filter(e=>e.y<670);let top=s.obj.filter(e=>e.kind==="platform").reduce((m,e)=>Math.min(m,e.y),600);while(top>-70){top-=rnd(63,105);{const platform={x:rnd(40,815),y:top,w:rnd(84,170),kind:"platform",moving:Math.random()<.25+s.level*.04};s.obj.push(platform);if(Math.random()<.35)s.obj.push({x:platform.x+platform.w/2,y:top-35,kind:"gem"})}}
 if(p.y>650)finish();if(s.score>s.level*260)newLevel();
}
for(const f of s.fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=.15*dt;f.ttl-=dt}s.fx=s.fx.filter(f=>f.ttl>0).slice(-320);
}
function background(){
const s=G;const theme={drift:["#130d37","#151b3c"],runner:["#130d29","#38163d"],inferno:["#270918","#7d2219"],astro:["#070e37","#251647"],maze:["#081e2f","#153543"],target:["#230c4e","#3f1d67"],sky:["#265aa3","#edb97e"]}[s.mode];grad(theme[0],theme[1]);const speed=s.mode==="sky"?.3:1;
for(let i=0;i<75;i++){const x=(i*217.7)%970,y=((i*97.3+s.t*(.2+i%5*.18)*speed)%640);circle(x,y,(i%3)+.7,"#ffffff67")}
if(s.mode==="drift"){for(let i=0;i<38;i++){const x=i*29;rect(x,160+(i*17%110),22,200,"#090f2e");rect(x+5,180+(i*17%110),4,38,i%2?"#f954a899":"#6addff99")}glow(480,180,300,"#9c43a622")}
if(s.mode==="runner"){for(let i=0;i<27;i++){const x=i*48-(s.scroll*1.8%48),top=120+(i*91%170);rect(x,top,44,520-top,"#100c25");for(let y=top+22;y<490;y+=29)rect(x+11,y,6,12,i%3?"#a84dac66":"#72e6fe78")}for(let i=0;i<60;i++)line((i*97+s.t*7)%1050-50,(i*33+s.t*11)%660-40,(i*97+s.t*7)%1050-58,(i*33+s.t*11)%660-21,"#9b86ff54",1)}
if(s.mode==="inferno"){for(let i=0;i<14;i++){const x=i*75;poly([[x,580],[x+40,360-(i*89%120)],[x+85,580]],"#3f1423")}glow(480,550,400,"#e94b243e");for(let i=0;i<24;i++){const x=(i*109+s.t*1.7)%980,y=600-(i*43+s.t*3)%550;circle(x,y,i%4+1,"#ff8d3e8a")}}
if(s.mode==="astro"){glow(650,170,250,"#4b67fb36");circle(740,155,96,"#393aa8");circle(757,143,72,"#6557bc");circle(792,115,20,"#8d77df");for(let i=0;i<16;i++)line((i*109)%980,(i*83+s.t*3)%620,(i*109)%980,(i*83+s.t*3)%620+20,"#a0f0ff9a",2)}
if(s.mode==="maze"){for(let i=0;i<20;i++){const x=i*52;poly([[x,0],[x+30,70+i%4*30],[x+45,0]],"#113b46");poly([[x,600],[x+20,530-i%5*32],[x+54,600]],"#125061")}}
if(s.mode==="target"){for(let i=0;i<10;i++){g.save();g.translate(480,320);g.rotate(s.t*.001+i*.31);g.strokeStyle="#bd8fff1f";g.lineWidth=2;g.strokeRect(-210-i*33,-135-i*22,420+i*66,270+i*44);g.restore()}glow(480,280,270,"#e857d22a")}
if(s.mode==="sky"){glow(700,130,400,"#fff1bf61");circle(765,95,84,"#fff0c3");for(let i=0;i<14;i++){const x=(i*167+s.t*.14)%1100-80,y=40+(i*97%520);g.fillStyle="#ffffff77";g.beginPath();g.ellipse(x,y,80+(i%4)*20,24,0,0,TAU);g.fill()}}
}
function car(x,y,player=false){g.save();g.translate(x,y);if(player){glow(0,45,105,"#35c9ff5a");rect(-30,-56,60,112,"#06071a");poly([[-32,-38],[-20,-62],[20,-62],[32,-38],[37,39],[25,62],[-25,62],[-37,39]],"#50ccf2");rect(-24,-25,48,36,"#18234b");rect(-23,29,46,18,"#12344f");rect(-31,48,20,11,"#ff94d5");rect(11,48,20,11,"#ff94d5")}else{rect(-36,-45,72,96,"#101324");rect(-31,-43,62,91,"#ff4f86");rect(-22,-28,44,30,"#1b2945");rect(-28,31,18,12,"#f6e2b3");rect(10,31,18,12,"#f6e2b3")}g.restore()}
function drawMode(){
const s=G;const p=s.player, col=s.accent;
if(s.mode==="drift"){
poly([[340,170],[620,170],[875,600],[85,600]],"#101426");line(339,170,85,600,"#56e9ff",7);line(620,170,875,600,"#56e9ff",7);
for(let i=0;i<15;i++){const z=((i*58+s.road*1.8)%520)/520,y=170+z*z*440,w=3+z*14;rect(479-w/2,y,w,5+z*30,"#ffffffa6");rect(339-z*145,y,w,4+z*20,"#ba6dff");rect(620+z*145,y,w,4+z*20,"#ba6dff")}
for(const e of s.obj){if(e.kind==="nitro"){glow(e.x,e.y,43,"#2ff6ff6d");circle(e.x,e.y,18,"#4dfcff");text("⚡",e.x,e.y+8,23)}else car(e.x,e.y)}if(!(s.invuln>0&&Math.floor(s.t/5)%2))car(p.x,470,true);
rect(22,540,220,13,"#ffffff28");rect(22,540,220*s.nitro/100,13,"#67f6fe");text("NITRO SPACE",30,530,16,"#9ef7ff","left");
}
if(s.mode==="runner"){
rect(0,525,960,75,"#161629");for(let i=0;i<15;i++)rect(i*80-(s.scroll*9)%80,550,38,5,"#5b4974");
for(const e of s.obj){if(e.kind==="crystal"){glow(e.x,e.y,48,"#69e7ff69");text("💎",e.x,e.y+12,33)}else if(e.kind==="drone"){glow(e.x,e.y,40,"#f761cb78");text("🚨",e.x,e.y+14,40)}else if(e.kind==="wall"){rect(e.x-17,426,34,100,"#e350b0");rect(e.x-12,432,24,84,"#471b4c")}else{text("⚡",e.x,520,42)}}
if(!(s.invuln>0&&Math.floor(s.t/4)%2)){g.save();g.translate(p.x,p.y);if(s.slide){rect(-29,-13,58,22,col);circle(29,-17,13,"#ffced5")}else{circle(0,-52,17,"#ffe5df");rect(-14,-38,28,43,col);const k=Math.sin(s.t*.5)*18;line(-5,5,-13+k,34,"#ffc3d2",9);line(8,4,16-k,35,"#ffc3d2",9);line(-13,-22,-34+k/2,-5,"#ffaad4",8)}g.restore()}
text("DOPPELSPRUNG  ↑ / SPACE     SLIDE  ↓",480,575,13,"#cca8ef");
}
if(s.mode==="inferno"){
for(const b of s.bricks)if(b.hp>0){const pul=Math.sin(s.t*.045+b.phase)*.2+.8;glow(b.x+28,b.y+15,42,b.hp>1?"#ff9b3a55":"#e9403850");rect(b.x,b.y,56,28,b.hp>1?"#f6aa52":"#e5504b");rect(b.x+4,b.y+5,47,5,`rgba(255,246,206,${pul})`)}
glow(p.x,535,130,"#ff9c4063");rect(p.x-86,530,172,17,"#fff5dc");rect(p.x-69,535,138,9,"#ff9d46");
for(const b of s.ball){glow(b.x,b.y,37,"#ffe7a879");circle(b.x,b.y,12,"#fff6c4");circle(b.x-3,b.y-4,4,"#fff")}
for(const sh of s.shoot){glow(sh.x,sh.y,20,"#ffad5080");rect(sh.x-4,sh.y-18,8,32,"#fff1af")}
for(const e of s.obj){glow(e.x,e.y,45,"#ff803d79");circle(e.x,e.y,14,"#ffb14e")}
if(s.coreBoss){const b=s.coreBoss;glow(b.x,b.y,130,"#ff592f9f");circle(b.x,b.y,62,"#67212e");circle(b.x,b.y,50,"#ff8c36");circle(b.x-19,b.y-8,11,"#421323");circle(b.x+19,b.y-8,11,"#421323");poly([[b.x-23,b.y+19],[b.x+23,b.y+19],[b.x,b.y+35]],"#421323");rect(340,38,280,12,"#ffffff3d");rect(340,38,280*b.hp/b.max,12,"#ffc061")}
rect(18,554,210,8,"#ffffff32");rect(18,554,210*clamp(1-s.cool/65,0,1),8,"#ffbd65");
}
if(s.mode==="astro"){
for(const e of s.obj){glow(e.x,e.y,55,"#ff71934d");g.save();g.translate(e.x,e.y);g.rotate(s.t*.02);poly([[0,-28],[26,0],[0,28],[-26,0]],"#ff7b9c");circle(0,0,10,"#491044");g.restore()}
if(s.boss){const b=s.boss;glow(b.x,b.y,150,"#e873ff40");poly([[b.x-95,b.y-20],[b.x-44,b.y-69],[b.x+48,b.y-69],[b.x+104,b.y-20],[b.x+48,b.y+54],[b.x-52,b.y+54]],"#a351a9");rect(b.x-28,b.y-30,58,30,"#331b57");circle(b.x,b.y+12,24,"#ffbc71");rect(350,28,260,12,"#ffffff33");rect(350,28,260*b.hp/b.max,12,"#f47dbe")}
for(const sh of s.shoot){glow(sh.x,sh.y,18,"#7af7ff5b");rect(sh.x-4,sh.y-19,8,31,"#83f4ff")}
if(!(s.invuln>0&&Math.floor(s.t/5)%2)){g.save();g.translate(p.x,p.y);glow(0,32,75,"#77f5ff62");poly([[0,-42],[-34,39],[-5,17],[0,30],[5,17],[34,39]],"#d9eafc");poly([[0,-29],[-14,15],[14,15]],"#4a67d3");poly([[-9,36],[0,71],[9,36]],"#ffb15d");g.restore()}
}
if(s.mode==="maze"){
const ox=84,oy=70,sz=31;for(let y=0;y<15;y++)for(let x=0;x<25;x++){const xx=ox+x*sz,yy=oy+y*sz,wall=s.maze[y][x];rect(xx,yy,sz-1,sz-1,wall?"#1c3543":"#0d1c2c");if(wall&&((x*y)%7===0))poly([[xx+6,yy+3],[xx+23,yy+5],[xx+16,yy+24]],"#357b87")}
for(const gem of s.gems)if(!gem.taken){const xx=ox+gem.x*sz+15,yy=oy+gem.y*sz+15;glow(xx,yy,35,"#86fded91");poly([[xx,yy-11],[xx+9,yy],[xx,yy+11],[xx-9,yy]],"#a1fff0")}
const exitX=ox+23*sz+15,exitY=oy+13*sz+15;glow(exitX,exitY,43,"#ffdf778c");circle(exitX,exitY,11,"#fff3b0");
const gx=ox+s.guard.x*sz+15,gy=oy+s.guard.y*sz+15;glow(gx,gy,32,"#ff518d8a");circle(gx,gy,12,"#ef5d83");
const px=ox+p.x*sz+15,py=oy+p.y*sz+15;glow(px,py,80,"#b3fff756");circle(px,py,12,"#f5eac4");
const dark=g.createRadialGradient(px,py,38,px,py,250);dark.addColorStop(0,"#00000000");dark.addColorStop(1,"#000b16d8");rect(ox,oy,25*sz,15*sz,dark);
text("💎 "+s.gems.filter(z=>z.taken).length+"/"+s.gems.length,480,38,20,"#8cfde5");
}
if(s.mode==="target"){
for(let i=0;i<13;i++){g.save();g.translate(480,300);g.rotate(s.t*.003+i*.07);g.strokeStyle="#dc9bff2c";g.lineWidth=2;g.strokeRect(-180-i*39,-105-i*24,360+i*78,210+i*48);g.restore()}
for(const e of s.obj){glow(e.x,e.y,e.r*2.5,e.kind==="bomb"?"#fe426c6e":"#f7a6ff72");circle(e.x,e.y,e.r+8,"#ffffff22");circle(e.x,e.y,e.r,e.kind==="bomb"?"#ff4c79":"#bd70f5");circle(e.x,e.y,e.r*.68,"#f9d8ff");circle(e.x,e.y,e.r*.36,e.kind==="bomb"?"#ed1a44":"#7e39b7");if(e.kind==="bomb")text("!",e.x,e.y+10,31,"#fff")}
const x=s.pointer.x,y=s.pointer.y;line(x-22,y,x-6,y,"#bfffff",2);line(x+6,y,x+22,y,"#bfffff",2);line(x,y-22,x,y-6,"#bfffff",2);line(x,y+6,x,y+22,"#bfffff",2);
text("ZEIT "+Math.ceil(s.clock/60)+"s",870,87,23,"#fff3ab");text("COMBO ×"+Math.max(1,s.combo),90,87,20,"#ffb3ea");
}
if(s.mode==="sky"){
for(const e of s.obj){if(e.kind==="gem"){glow(e.x,e.y,50,"#fff3b189");text("💎",e.x,e.y+12,27);continue}glow(e.x+e.w/2,e.y,65,"#fff1b35e");poly([[e.x,e.y],[e.x+e.w,e.y],[e.x+e.w-13,e.y+18],[e.x+10,e.y+18]],"#ead2ad");rect(e.x+10,e.y+18,e.w-20,6,"#a9dff0");if(e.moving)circle(e.x+e.w/2,e.y-11,6,"#fff5ac")}
g.save();g.translate(p.x,p.y);glow(0,0,80,"#ffeaa876");g.rotate(Math.sin(s.t*.09)*.08);circle(0,0,21,"#fff5de");poly([[-5,12],[-35,27],[-9,-13]],"#fff0c4");poly([[8,14],[38,24],[10,-13]],"#fff0c4");circle(7,-5,3,"#534871");g.restore();
text("HÖHE "+Math.floor(s.height)+"m",790,78,21,"#fff4ce");
}
}
function draw(){
const s=G;if(!s)return;g.save();if(s.shake>.3)g.translate(rnd(-s.shake,s.shake),rnd(-s.shake,s.shake));background();drawMode();
for(const f of s.fx){g.globalAlpha=clamp(f.ttl/f.max,0,1);circle(f.x,f.y,f.r,f.color)}g.globalAlpha=1;if(s.flash>0)rect(0,0,W,H,`rgba(255,255,255,${clamp(s.flash/55,0,.26)})`);
rect(0,0,W,51,"#030918ba");text("✦ "+Math.floor(s.score),25,34,24,"#ffffff","left");text("STUFE "+s.level,480,32,17,"#c7e8ff");text("♥ "+Math.max(0,s.hp),934,34,23,"#ffb8d0","right");
if(s.banner>0&&!s.ready&&!s.dead){rect(255,242,450,110,"#090d24c7");text("⚡ LEVEL "+s.level+" ⚡",480,313,43,"#fff4ce")}
if(s.ready||s.dead||s.paused){rect(0,0,W,H,"#040917df");glow(480,270,250,"#8065ca51");text(s.ready?s.title:s.paused?"PAUSE":s.won?"CHALLENGE GESCHAFFT":"GAME OVER",480,245,s.ready?51:43,"#fff");text(s.ready?"Eigene Welt. Eigene Regeln. Höchste Intensität.":s.dead?"Punkte "+Math.floor(s.score)+"   •   Best "+Math.max(lib.bests[s.id]||0,Math.floor(s.score)):"P zum Weiterspielen",480,300,22,"#c7d3ed");text(s.ready?"ENTER / TIPPE ZUM STARTEN":s.dead?"ENTER / TIPPE FÜR NEUSTART":"P = WEITER",480,380,23,"#82f4e0")}
g.restore();$("hudLeft").textContent="✦ "+Math.floor(s.score)+" Punkte";$("hudCenter").textContent="LEVEL "+s.level+" • "+s.title;$("hudRight").textContent="BEST "+Math.max(lib.bests[s.id]||0,Math.floor(s.score))
}
function loop(now){if(!G)return;const dt=Math.min(2,Math.max(0,(now-(last||now))/16.667));last=now;step(dt);draw();raf=requestAnimationFrame(loop)}
function start(){if(!G)return;if(G.dead){updateBest();initialize();G.ready=false}else if(G.ready)G.ready=false;else if(G.paused)G.paused=false;audioFx(670,.1)}
function close(){if(G)updateBest();G=null;cancelAnimationFrame(raf);keys.clear();$("player").classList.remove("open");lib.render()}
$("closeBtn").onclick=close;$("pauseBtn").onclick=()=>{if(G&&!G.dead&&!G.ready)G.paused=!G.paused};
$("restartBtn").onclick=()=>{if(G){updateBest();initialize();G.ready=false}};
$("soundBtn").onclick=()=>{soundEnabled=!soundEnabled;$("soundBtn").textContent=soundEnabled?"🔊":"🔇"};
document.addEventListener("keydown",e=>{if(!G)return;if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space"].includes(e.code))e.preventDefault();keys.add(e.code);if(e.code==="Escape"){close();return}if(e.code==="KeyP"){if(!G.ready&&!G.dead)G.paused=!G.paused;return}if(e.code==="KeyR"){updateBest();initialize();G.ready=false;return}if(e.code==="Enter"&&(G.ready||G.dead)){start();return}if(e.code==="Space"&&!e.repeat){if(G.ready||G.dead)start();else action()}});
document.addEventListener("keyup",e=>keys.delete(e.code));
document.querySelectorAll("[data-key]").forEach(b=>{const code=b.dataset.key;b.addEventListener("pointerdown",e=>{e.preventDefault();if(G?.ready||G?.dead)start();keys.add(code);if(code==="Space")action();b.setPointerCapture(e.pointerId)});for(const type of ["pointerup","pointercancel","lostpointercapture"])b.addEventListener(type,()=>keys.delete(code))});
canvas.addEventListener("pointerdown",e=>{if(!G)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;G.pointer={x,y};if(G.ready||G.dead||G.paused){start();return}
if(G.mode==="target"){for(let i=G.obj.length-1;i>=0;i--){const obj=G.obj[i];if(Math.hypot(x-obj.x,y-obj.y)<obj.r+10){G.obj.splice(i,1);if(obj.kind==="bomb")damage(x,y);else points(20+Math.min(30,G.combo*3),x,y);return}}G.combo=0;audioFx(160,.05)}
else if(G.mode==="runner"||G.mode==="drift")action();
else if(G.mode==="astro"){keys.add("Space");setTimeout(()=>keys.delete("Space"),120)}
else if(G.mode==="inferno"){G.player.x=clamp(x,90,870);keys.add("Space");setTimeout(()=>keys.delete("Space"),180)}
else if(G.mode==="sky")G.player.x=clamp(x,30,930)
});
canvas.addEventListener("pointermove",e=>{if(!G)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;G.pointer={x,y};if(G.mode==="inferno"&&(e.buttons||e.pointerType==="touch"))G.player.x=clamp(x,90,870)});
$("player").addEventListener("pointerdown",e=>{if(e.target===$("player"))close()});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&G&&!G.dead&&!G.ready)G.paused=true});
window.ORBIT_ARCADE={open,close,start};
})();