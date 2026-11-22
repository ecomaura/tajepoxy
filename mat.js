/* Material calculator – data from "Epoxy Flooring Material Calculation Sheet". per = grams per sq ft, p = parts [name, share] */
const COATS={
primer:{name:'1. Primer Coat (Base Prep)',per:5,v:[{l:'2 : 1',p:[['Resin',2],['Hardener',1]]}]},
screed:{name:'2. Screed Layer (Leveling / Body Coat)',per:150,v:[
 {l:'2 : 2 : 1 (5 Parts)',p:[['Resin',2],['Sand',2],['Hardener',1]]},
 {l:'2 : 4 : 1 (7 Parts)',p:[['Resin',2],['Sand',4],['Hardener',1]]},
 {l:'2 : 6 : 1 (9 Parts)',p:[['Resin',2],['Sand',6],['Hardener',1]]}]},
top:{name:'3. Top Coat (Finish Styles)',per:150,v:[
 {l:'Marble',r:'2 : 2 : 1',p:[['Resin',2],['Colour / Pigment',2],['Hardener',1]]},
 {l:'Metallic',r:'2 : 1',p:[['Resin',2],['Hardener',1]],n:'Resin quantity includes metallic powder (as per shade).'},
 {l:'3D Epoxy',r:'3 : 1',p:[['Resin',3],['Hardener',1]],n:'Add colour only in the 1 pint portion.'}]}};
const g=(n,d=1)=>n.toLocaleString('en-IN',{maximumFractionDigits:d}),$=s=>document.querySelector(s);
const comp=(c,v,A)=>{const t=c.per*A,s=v.p.reduce((a,x)=>a+x[1],0);return{t,s,rows:v.p.map(x=>[x[0],x[1],t*x[1]/s])}};
const bd=(c,v,A)=>comp(c,v,A).rows.map(r=>`${r[0].split(' ')[0]}: ${g(r[2])} gm`).join(' | ');
let A=1000;
$('#msc').innerHTML=COATS.screed.v.map((v,i)=>`<option value="${i}">${v.l}</option>`).join('');
$('#mtc').innerHTML=COATS.top.v.map((v,i)=>`<option value="${i}">${v.l} (${v.r})</option>`).join('');
function mrender(){
 const sel=[[COATS.primer,COATS.primer.v[0]],[COATS.screed,COATS.screed.v[+$('#msc').value]],[COATS.top,COATS.top.v[+$('#mtc').value]]];
 const tot={};let h='';
 sel.forEach(([c,v])=>{const r=comp(c,v,A);
  r.rows.forEach(x=>tot[x[0]]=(tot[x[0]]||0)+x[2]);
  h+=`<div class="mc"><h3>${c.name} <span>— ${g(c.per)} gm / sq ft · Ratio ${v.r||v.l}</span></h3><div class="tw2"><table><thead><tr><th>Component</th><th>Parts</th><th>Weight (gm)</th><th>Weight (kg)</th></tr></thead><tbody>${r.rows.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${g(x[2])}</td><td>${g(x[2]/1000,3)}</td></tr>`).join('')}</tbody><tfoot><tr><td>Total</td><td>${r.s}</td><td>${g(r.t)}</td><td>${g(r.t/1000,3)}</td></tr></tfoot></table></div>${v.n?`<p class="mn">${v.n}</p>`:''}</div>`});
 const gt=Object.entries(tot),all=gt.reduce((a,x)=>a+x[1],0);
 h+=`<div class="mc gt"><h3>Total Material Required — ${g(A)} sq ft (All Coats)</h3><div class="tw2"><table><thead><tr><th>Material</th><th>Weight (gm)</th><th>Weight (kg)</th></tr></thead><tbody>${gt.map(x=>`<tr><td>${x[0]}</td><td>${g(x[1])}</td><td>${g(x[1]/1000,2)}</td></tr>`).join('')}</tbody><tfoot><tr><td>Grand Total</td><td>${g(all)}</td><td>${g(all/1000,2)}</td></tr></tfoot></table></div></div>`;
 $('#mout').innerHTML=h;
 const m=`Hi Taj Epoxy, I need material & quote for epoxy flooring.\nArea: ${g(A)} sq ft\nScreed ratio: ${sel[1][1].l}\nTop coat: ${sel[2][1].l}\nTotal material: ${g(all/1000,2)} kg`;
 $('#mquote').href=`https://wa.me/${WA_NUMBER}?text=`+encodeURIComponent(m);
 document.querySelectorAll('.mpre').forEach(b=>b.classList.toggle('on',+b.dataset.v==A));
}
$('#marea').oninput=e=>{A=Math.max(1,+e.target.value||1);mrender()};
$('#msc').onchange=$('#mtc').onchange=mrender;
$('#mpres').innerHTML=[100,250,500,1000,2500,5000].map(v=>`<button class="pre mpre" data-v="${v}">${g(v)}</button>`).join('');
$('#mpres').onclick=e=>{const b=e.target.closest('.mpre');if(b){A=+b.dataset.v;$('#marea').value=A;mrender()}};
/* reference sheet */
const P=COATS.primer,S=COATS.screed,T=COATS.top;
$('#mref').innerHTML=`<div class="mc"><h3>1. Primer Coat (Base Prep)</h3><div class="tw2"><table><thead><tr><th>Area</th><th>Total Weight</th><th>Ratio (R : H)</th><th>Component Breakdown</th></tr></thead><tbody>${[1,4].map(a=>`<tr><td>${a} sq ft</td><td><b>${P.per*a} gm</b></td><td>2 : 1</td><td>${bd(P,P.v[0],a)}</td></tr>`).join('')}</tbody></table></div></div>
<div class="mc"><h3>2. Screed Layer (Leveling / Body Coat)</h3><div class="tw2"><table><thead><tr><th>Ratio (R : S : H)</th><th>1 sq ft Total</th><th>4 sq ft Total</th><th>4 sq ft Breakdown</th></tr></thead><tbody>${S.v.map(v=>`<tr><td>${v.l}</td><td>150 gm</td><td><b>600 gm</b></td><td>${bd(S,v,4)}</td></tr>`).join('')}</tbody></table></div></div>
<div class="mc"><h3>3. Top Coat (Finish Styles)</h3><div class="tw2"><table><thead><tr><th>Finish Type</th><th>1 sq ft Total</th><th>4 sq ft Total</th><th>Ratio</th><th>4 sq ft Components</th></tr></thead><tbody>${T.v.map(v=>`<tr><td><b>${v.l}</b></td><td>150 gm</td><td><b>600 gm</b></td><td>${v.r}</td><td>${bd(T,v,4)}${v.n?`<br><small>${v.n}</small>`:''}</td></tr>`).join('')}</tbody></table></div></div>`;
document.querySelectorAll('.seg .tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.seg .tab').forEach(x=>x.classList.toggle('on',x==b));$('#matview').classList.toggle('hide',b.dataset.v!='mat');$('#costview').classList.toggle('hide',b.dataset.v!='cost')});
mrender();
