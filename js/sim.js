// sim.js: pure simulation and level data (no DOM). Orbits are deterministic Keplerian rails.
const DT=[{n:'Interceptor',c:'#66ccff',rg:2.2,d:[12,3,0]},{n:'Sweeper',c:'#99ff88',rg:1.8,d:[1,14,0]},{n:'Shield array',c:'#ffcc66',rg:2.6,d:[0,0,14]}];
const OP=[['Low circular',1.5,0,1,'fast, close'],['High circular',4,0,1,'slow, wide'],['Elliptical',3.2,.6,1,'swoops in and out'],['Retrograde low',1.8,0,-1,'against the spin']];
const A=Math.PI/180,P1=[9*Math.cos(150*A),9*Math.sin(150*A)],PL=Math.hypot(...P1);
const LV=[
{n:'Rogue Asteroid',k:0,hp:200,rad:.25,hit:1.1,p:P1,v:[-P1[0]/PL*.2,-P1[1]/PL*.2],bear:'150°',types:[0],rec:[[1,60],[2,0],[2,330]],
cls:'My analysis: a rocky body of considerable mass. Area weapons will make little impression upon it.',
h:["Pardon the interruption, Commander. A rogue asteroid is approaching from bearing 150 degrees, with impact expected in about {E} seconds. If I may, interceptors are the appropriate instrument. I would suggest three or four, in high or elliptical orbits, positioned overhead on that side as it closes. The dry run will let you adjust their starting angles at your leisure.",
"Commander, an asteroid approaches from bearing 150 degrees, with impact in roughly {E} seconds. It is quite indifferent to sweeper fire, so interceptors are your best recourse. I calculate around seventeen seconds of combined coverage will be required, ideally toward the end of its approach.",
"Threat: asteroid. Integrity 200. Bearing 150 degrees. Impact in {E} seconds. Interceptor damage 12 per second, sweeper 1, shield nil. The rest, I trust, is in your capable hands."]},
{n:'Debris Swarm',k:1,hp:200,rad:.7,hit:1.8,p:[1,-10],v:[0,.25],bear:'276°',types:[0,1],rec:[[1,180],[2,90],[2,120]],
cls:'My analysis: a fragmented debris cloud. Powerful single shots would be rather wasted on it.',
h:["Forgive me, Commander, but a debris swarm is rising from the south, bearing 276 degrees, and shall pass Earth in about {E} seconds. Sweepers are the proper tool, as interceptors will barely trouble it. I would place sweepers in low orbits that cross its path during the final ten seconds.",
"Commander, a debris swarm approaches from bearing 276 degrees, with impact in about {E} seconds. It is wide and fragmented, so sweepers are most effective. I would aim for coverage between roughly twenty-four and thirty-four seconds.",
"Threat: debris swarm. Integrity 200. Bearing 276 degrees. Impact in {E} seconds. Sweeper damage 14 per second, interceptor 3, shield nil. I shall await your orders."]},
{n:'Solar Storm',k:2,hp:300,rad:.8,hit:1.1,p:[10,0],v:[-.28,0],bear:'0°',types:[0,1,2],rec:[[1,270],[1,300],[2,210]],
cls:'My analysis: a charged plasma front. Only shield arrays can absorb it, I am afraid.',
h:["Commander, I regret to report a solar storm front racing in from the Sun, bearing 0 degrees, arriving in about {E} seconds. Only shield arrays can absorb it. I would suggest placing three or more on orbits that keep them on the sunward side as it approaches.",
"Commander, a storm front approaches from the Sun, bearing 0 degrees, arriving in about {E} seconds. Shield arrays alone will serve. You will need around twenty seconds of combined coverage, so a single pass will not suffice, I am afraid.",
"Threat: solar storm. Integrity 300. Bearing 0 degrees. Impact in {E} seconds. Shield damage 14 per second, all other types nil. Do let me know if you require anything further."]}];
function posAt(it,t){const[,a,e,d]=OP[it.op],M=d*6.2832*t/(8*Math.pow(a,1.5));let E=M;for(let i=0;i<7;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));const px=a*(Math.cos(E)-e),py=a*Math.sqrt(1-e*e)*Math.sin(E),c=Math.cos(it.ang),s=Math.sin(it.ang);return[px*c-py*s,px*s+py*c]}
function orbitPts(it,n=90){const[,a,ec,d]=OP[it.op],c=Math.cos(it.ang),s=Math.sin(it.ang),o=[];for(let i=0;i<=n;i++){const e=i/n*6.2832,px=a*(Math.cos(e)-ec),py=a*Math.sqrt(1-ec*ec)*Math.sin(e)*d;o.push([px*c-py*s,px*s+py*c])}return o}
// ---------- multi-threat simulation ----------
// A level is either a single threat object {k,hp,rad,hit,p,v} or has threats:[...] (each may spawn later via t0).
const threatsOf=m=>m.threats||[m],hpTotal=m=>threatsOf(m).reduce((s,x)=>s+x.hp,0);
function mkT(k,bearDeg,sp,d0,hp,t0){const b=bearDeg*A,p=[10*Math.cos(b),10*Math.sin(b)],n=[-Math.sin(b),Math.cos(b)],T=[n[0]*d0,n[1]*d0],dl=Math.hypot(T[0]-p[0],T[1]-p[1]);
 return{k,hp,rad:[.25,.7,.8][k],hit:[1.1,1.8,1.1][k],p,v:[(T[0]-p[0])/dl*sp,(T[1]-p[1])/dl*sp],t0:t0||0,bear:Math.round(((bearDeg%360)+360)%360)}}
// Every defender fires at the nearest living threat inside its range. Any threat reaching Earth ends the run; killing all of them wins.
function sim(m,pl,h=.1){const T=threatsOf(m),hp=T.map(x=>x.hp),al=T.map(()=>true),o={st:[],win:false,hit:null,hitIdx:-1};let t=0;
for(;t<=100;t+=h){
 const TP=T.map(x=>{const u=t-(x.t0||0);return u<0?null:[x.p[0]+x.v[0]*u,x.p[1]+x.v[1]*u]}),sh=pl.map(it=>posAt(it,t)),
 tg=sh.map((p,i)=>{let b=-1,bd=1e9;for(let j=0;j<T.length;j++){const q=TP[j];if(!al[j]||!q)continue;const d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(d<DT[pl[i].ty].rg+T[j].rad&&d<bd){bd=d;b=j}}return b});
 if(t>0)tg.forEach((j,i)=>{if(j>=0)hp[j]-=DT[pl[i].ty].d[T[j].k]*h});
 for(let j=0;j<T.length;j++)if(al[j]&&hp[j]<=0){hp[j]=0;al[j]=false}
 o.st.push({t,TP,AL:al.slice(),HP:hp.slice(),hpt:hp.reduce((a,b)=>a+b,0),sh,tg,inr:tg.map(j=>j>=0),tp:TP[0]||T[0].p,hp:hp[0]});
 if(!al.some(a=>a)){o.win=true;break}
 let hi=-1;for(let j=0;j<T.length;j++)if(al[j]&&TP[j]&&Math.hypot(TP[j][0],TP[j][1])<=T[j].hit){hi=j;break}
 if(hi>=0){o.hit=t;o.hitIdx=hi;break}}
o.end=t;return o}
// Level 4: the first mixed wave, with no recommended layout
{const T=[mkT(0,40,.2,0,200,0),mkT(1,250,.25,1,200,6)];
LV.push({n:'Twin Strike',threats:T,types:[0,1],lim:5,par:4,bear:'40° and 250°',k:0,hp:400,
cls:'My analysis: two contacts of differing nature, a rocky body and a debris cloud, arriving at different times.',
h:["Commander, two contacts are inbound: an asteroid from bearing 40 degrees and a debris swarm from bearing 250 degrees, the first impact in about {E} seconds. Interceptors will serve against the asteroid and sweepers against the swarm. You have five launches, so each defender must earn its place. I am afraid I cannot mark a layout this time.",
"Two contacts: an asteroid from bearing 40 degrees and a debris swarm from bearing 250 degrees. First impact in about {E} seconds. Interceptors for the asteroid, sweepers for the swarm. Defenders engage the nearest contact in range, so mind your overlaps.",
"Threats: asteroid, integrity 200, bearing 40 degrees; debris swarm, integrity 200, bearing 250 degrees. First impact in {E} seconds. Interceptor 12 and 3, sweeper 1 and 14, against asteroid and swarm respectively. Defenders target the nearest contact in range."]})}
LV.forEach(m=>{m.hpT=hpTotal(m);m.eta=Math.round(sim(m,[]).end)});
// ---------- Daily Challenge generator (seeded by UTC date; same puzzle for everyone) ----------
function rng32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const dayKey=(d=new Date())=>d.getUTCFullYear()*10000+(d.getUTCMonth()+1)*100+d.getUTCDate();
const dayLabel=k=>Math.floor(k/10000)+'-'+String(Math.floor(k/100)%100).padStart(2,'0')+'-'+String(k%100).padStart(2,'0');
const prevDay=k=>dayKey(new Date(Date.UTC(Math.floor(k/10000),Math.floor(k/100)%100-1,k%100-1)));
const MODS=[['none',null],['no low orbits',[1,2]],['low orbits only',[0,3]],['no retrograde',[0,1,2]],['high or elliptical only',[1,2]]];
function greedyPlan(m,cands,max){const S=[];for(let c=0;c<max;c++){let bh=1e9,bc=null;for(const cd of cands){const r=sim(m,S.concat(cd),.2),h=r.st[r.st.length-1].hpt;if(h<bh){bh=h;bc=cd}}if(!bc)return null;S.push(bc);if(bh<=0&&sim(m,S).win)return S}return null}
const KN=['Asteroid','Debris Swarm','Solar Storm'];
function makeDaily(key){
 const wd=(new Date(Date.UTC(Math.floor(key/10000),Math.floor(key/100)%100-1,key%100)).getUTCDay()+6)%7,diff=[.1,.25,.4,.55,.7,.9,1][wd];
 let best=null;
 for(let att=0;att<40&&!best;att++){
  const R=rng32(key*7919+att*104729),k=Math.floor(R()*3),b=R()*360,sp=[.17+R()*.09,.2+R()*.1,.24+R()*.08][k],d0=k==1?.2+R()*1.2:(R()-.5)*.5,mult=diff>=.55&&R()<.6;
  const hpf=1.15+1.1*diff+R()*.3,T=[mkT(k,b,sp,d0,Math.round([200,200,300][k]*hpf*(mult?.7:1)/10)*10,0)];
  if(mult){const k2=R()<.7?(k+1+Math.floor(R()*2))%3:k,b2=b+90+R()*180,sp2=[.17+R()*.09,.2+R()*.1,.24+R()*.08][k2],d2=k2==1?.2+R()*1.2:(R()-.5)*.5;T.push(mkT(k2,b2,sp2,d2,Math.round([200,200,300][k2]*hpf*.7/10)*10,4+Math.round(R()*10)))}
  const mod=R()<.35+.5*diff?MODS[1+Math.floor(R()*4)]:MODS[0],ops=mod[1]||[0,1,2,3],need=[...new Set(T.map(x=>x.k))].sort(),types=need.slice();[0,1,2].forEach(t=>{if(!need.includes(t)&&R()<.5)types.push(t)});types.sort();
  const m={threats:T,k:T[0].k,hp:T[0].hp,rad:T[0].rad,hit:T[0].hit,p:T[0].p,v:T[0].v},cands=[];ops.forEach(op=>need.forEach(ty=>{for(let g=0;g<24;g++)cands.push({ty,op,ang:g*15*A})}));
  const sol=greedyPlan(m,cands,mult?5:4),par=sol?sol.length:0;
  if(!par||par<(mult?3:diff<.3?2:3))continue;
  const code=String.fromCharCode(65+Math.floor(R()*26))+String.fromCharCode(65+Math.floor(R()*26)),
  name=mult?'Twin Threat '+code:[ 'Asteroid '+(key%100+2000)+' '+code,'Debris Swarm '+code,'Solar Storm '+code][k],
  bears=T.map(x=>x.bear),dm=DT.map(d=>d.n+' '+d.d.join('/')+' vs asteroid/debris/storm').join('; '),mods=mod[0]=='none'?'no orbit restrictions':mod[0],lim=Math.min(6,par+1);
  best={n:name,k:T[0].k,hp:T[0].hp,rad:T[0].rad,hit:T[0].hit,p:T[0].p,v:T[0].v,threats:T,bear:bears.join('° and ')+'°',types,ops,lim,par,sol,mods,diff,daily:true,key,
   cls:'Constraints: '+mods+'. Launch budget '+lim+'.',
   h:Array(3).fill('Threats: '+T.map(x=>KN[x.k].toLowerCase()+', integrity '+x.hp+', bearing '+x.bear+' degrees').join('; ')+'. First impact in {E} seconds. Damage per second: '+DT.map(d=>d.n.toLowerCase()+' '+d.d.join('/')).join(', ')+' (asteroid, debris, storm). Constraints: '+mods+'. Launch budget '+lim+'. The rest is in your hands, Commander.')};
  best.hpT=hpTotal(best);best.eta=Math.round(sim(best,[]).end)}
 return best}