/* ===== EDIT PRICING HERE =====
   Consumption follows the Taj Epoxy "Material Calculation Sheet":
   BASE = 3mm: Primer 5 gm/sqft (R:H 2:1, fixed) · Screed 150 gm/sqft (R:S:H) · Top coat 150 gm/sqft (finish ratio).
   Screed & top coat are scaled by selected thickness ÷ 3mm.
   Prices: ₹ per kg for materials, ₹ per sq ft for professional charges.
   NOTE: Industrial prof. charge (130) is from the original chart; the other 3 systems' charges are PLACEHOLDERS. */
const PER={primer:5,screed:150,top:150};
const PRICE={rhBase:380,sand:25,pigment:700,rhTop:650};
const SCREED=[['2 : 2 : 1 (5 Parts)',[2,2,1]],['2 : 4 : 1 (7 Parts)',[2,4,1]],['2 : 6 : 1 (9 Parts)',[2,6,1]]]; // [Resin, Sand, Hardener]
const TOP=[{l:'Marble',x:'Pigment',r:[2,2,1]},{l:'Metallic',x:'',r:[2,0,1],n:'incl. metallic powder (as per shade)'},{l:'3D Epoxy',x:'',r:[3,0,1],n:'colour only in 1 pint'}]; // [Resin, Colour, Hardener]
const SYSTEMS=[
{name:'Industrial Epoxy Flooring',thick:'5mm',top:0,pc:130},
{name:'Italian Epoxy Flooring',thick:'4mm',top:0,pc:140},
{name:'Metallic Epoxy Flooring',thick:'4.5mm',top:1,pc:160},
{name:'3D / Flakes / Granules / Digital Paper Epoxy',thick:'5.5mm',top:2,pc:180}];
const $=s=>document.querySelector(s),f=(n,d=2)=>n.toLocaleString('en-IN',{maximumFractionDigits:d});
let cur=0,area=1000;const mm=()=>Math.max(1,+$('#mm').value||3);
$('#sc').innerHTML=SCREED.map((s,i)=>`<option value="${i}">${s[0]}</option>`).join('');
$('#tc').innerHTML=TOP.map((t,i)=>`<option value="${i}">${t.l} (${t.r.filter(x=>x).join(' : ')})</option>`).join('');
function steps(){
 const sc=SCREED[+$('#sc').value],tp=TOP[+$('#tc').value],k=mm()/3;
 const split=(per,[r,m,h])=>{const s=r+m+h;return{rh:per*(r+h)/s,res:per*r/s,har:per*h/s,mid:per*m/s}};
 const sp=split(PER.screed*k,sc[1]),tt=split(PER.top*k,tp.r);
 const rh=(o,n)=>['R+H',o.rh,0,`Resin ${f(o.res,1)} · Hardener ${f(o.har,1)} gm`];
 return[
 {p:'Primer',i:'R+H (2 : 1)',r:[['R+H',PER.primer,PRICE.rhBase,0,`Resin ${f(PER.primer*2/3,1)} · Hardener ${f(PER.primer/3,1)} gm`]]},
 {p:'Screed Layer',i:'R+S+H ('+sc[0].split(' (')[0]+')',r:[['R+H',sp.rh,PRICE.rhBase,0,`Resin ${f(sp.res,1)} · Hardener ${f(sp.har,1)} gm`],['Sand',sp.mid,PRICE.sand]]},
 {p:'Top Coat – '+tp.l,i:(tp.x?'R+P+H':'R+H')+' ('+tp.r.filter(x=>x).join(' : ')+')',r:[['R+H',tt.rh,PRICE.rhTop,0,`Resin ${f(tt.res,1)} · Hardener ${f(tt.har,1)} gm`+(tp.n?` · ${tp.n}`:'')]].concat(tp.x?[[tp.x,tt.mid,PRICE.pigment]]:[])},
 {p:'Professional Charges',i:'—',r:[['Professional Charges',0,SYSTEMS[cur].pc,1]]}]}
function render(){
 const S=SYSTEMS[cur];let total=0,h='';
 steps().forEach((st,n)=>st.r.forEach((r,k)=>{
  const svc=r[3]===1,use=svc?area:r[1]*area/1000,t=use*r[2];total+=t;
  h+=`<tr>${k?'':`<td rowspan="${st.r.length}">${n+1}</td><td rowspan="${st.r.length}">${st.p}</td><td rowspan="${st.r.length}">${st.i}</td>`}<td>${r[0]}${r[4]?`<br><small>${r[4]}</small>`:''}</td><td>${f(area)}</td><td>${svc?'—':f(r[1],1)}</td><td>${f(use)}</td><td>${f(r[2])}</td><td><b>${f(t)}</b></td></tr>`}));
 $('#title').textContent=`${S.name} (${f(mm(),1)}mm)`;$('#cond').textContent='Floor Condition — Tiles - Stone';$('#rows').innerHTML=h;
 const per=total/area;$('#tp').textContent=f(total);$('#sq').textContent=f(area);$('#ps').textContent=f(per,1);
 $('#tabs').innerHTML=SYSTEMS.map((s,i)=>`<button class="tab${i==cur?' on':''}" data-i="${i}">${s.name} (${s.thick})</button>`).join('');
 document.querySelectorAll('.pre').forEach(b=>b.classList.toggle('on',+b.dataset.v==area));
 const q=$('#quote');q.href=`https://wa.me/${WA_NUMBER}?text=`+encodeURIComponent(`Hi Taj Epoxy, I need a detailed quote.\nSystem: ${S.name}\nThickness: ${f(mm(),1)}mm\nScreed: ${SCREED[+$('#sc').value][0]}\nTop coat: ${TOP[+$('#tc').value].l}\nArea: ${f(area)} sq ft\nEstimated cost: ₹${f(total)} (₹${f(per,1)}/sq ft)`);
}
$('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(b){cur=+b.dataset.i;$('#tc').value=SYSTEMS[cur].top;$('#mm').value=parseFloat(SYSTEMS[cur].thick);render()}};
$('#mm').oninput=render;
$('#sc').onchange=$('#tc').onchange=render;
$('#area').oninput=e=>{area=Math.max(1,+e.target.value||0)||1;render()};
$('#pres').innerHTML=[250,500,1000,2500,5000].map(v=>`<button class="pre" data-v="${v}">${f(v)}</button>`).join('');
$('#pres').onclick=e=>{const b=e.target.closest('.pre');if(b){area=+b.dataset.v;$('#area').value=area;render()}};
$('#tc').value=SYSTEMS[0].top;$('#mm').value=parseFloat(SYSTEMS[0].thick);render();
