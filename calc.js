/* ===== EDIT PRICING HERE =====
   cons = grams per sq ft, price = ₹ per kg (material) | svc rows: price = ₹ per sq ft
   NOTE: "industrial" matches the original costing chart. The other 3 systems use PLACEHOLDER figures – replace with real rates. */
const SYSTEMS=[
{id:'industrial',name:'Industrial Epoxy Flooring',thick:'5mm',cond:'Floor Condition — Tiles - Stone',steps:[
 {p:'Primer',i:'R+H',r:[['R+H',5,380]]},
 {p:'Screed For 2mm',i:'R+H+F+P',r:[['R+H',100,380],['610 Filler',200,25],['Pigment',3,700]]},
 {p:'Topcoat With Filler For 1mm',i:'R+H+F+P',r:[['R+H',75,650],['710 Filler',50,25],['Pigment',3,700]]},
 {p:'Professional Charges',i:'—',r:[['Professional Charges',0,130,1]]}]},
{id:'italian',name:'Italian Epoxy Flooring',thick:'4mm',cond:'Floor Condition — Tiles - Stone',steps:[ /* PLACEHOLDER */
 {p:'Primer',i:'R+H',r:[['R+H',5,380]]},
 {p:'Screed For 2mm',i:'R+H+F+P',r:[['R+H',90,380],['610 Filler',180,25],['Pigment',3,700]]},
 {p:'Italian Topcoat For 1mm',i:'R+H+P',r:[['R+H',80,750],['Pigment',4,700]]},
 {p:'Professional Charges',i:'—',r:[['Professional Charges',0,140,1]]}]},
{id:'metallic',name:'Metallic Epoxy Flooring',thick:'4.5mm',cond:'Floor Condition — Tiles - Stone',steps:[ /* PLACEHOLDER */
 {p:'Primer',i:'R+H',r:[['R+H',5,380]]},
 {p:'Screed For 2mm',i:'R+H+F+P',r:[['R+H',100,380],['610 Filler',200,25],['Pigment',3,700]]},
 {p:'Metallic Coat For 1.5mm',i:'R+H+MP',r:[['R+H',110,650],['Metallic Pigment',10,2500]]},
 {p:'Professional Charges',i:'—',r:[['Professional Charges',0,160,1]]}]},
{id:'flakes',name:'3D / Flakes / Granules / Digital Paper Epoxy',thick:'5.5mm',cond:'Floor Condition — Tiles - Stone',steps:[ /* PLACEHOLDER */
 {p:'Primer',i:'R+H',r:[['R+H',5,380]]},
 {p:'Screed For 2mm',i:'R+H+F+P',r:[['R+H',100,380],['610 Filler',200,25],['Pigment',3,700]]},
 {p:'Flakes / 3D Layer',i:'R+H+Flakes',r:[['R+H',120,650],['Flakes / Digital Paper',40,400]]},
 {p:'Professional Charges',i:'—',r:[['Professional Charges',0,180,1]]}]}];
const $=s=>document.querySelector(s),f=(n,d=2)=>n.toLocaleString('en-IN',{maximumFractionDigits:d});
let cur=0,area=1000;
function render(){
 const S=SYSTEMS[cur];let total=0,h='';
 S.steps.forEach((st,n)=>st.r.forEach((r,k)=>{
  const svc=r[3],use=svc?area:r[1]*area/1000,t=use*r[2];total+=t;
  h+=`<tr>${k?'':`<td rowspan="${st.r.length}">${n+1}</td><td rowspan="${st.r.length}">${st.p}</td><td rowspan="${st.r.length}">${st.i}</td>`}<td>${r[0]}</td><td>${f(area)}</td><td>${svc?'—':f(r[1])}</td><td>${f(use)}</td><td>${f(r[2])}</td><td><b>${f(t)}</b></td></tr>`}));
 $('#title').textContent=`${S.name} (${S.thick})`;$('#cond').textContent=S.cond;$('#rows').innerHTML=h;
 const per=total/area;$('#tp').textContent=f(total);$('#sq').textContent=f(area);$('#ps').textContent=f(per,1);
 $('#tabs').innerHTML=SYSTEMS.map((s,i)=>`<button class="tab${i==cur?' on':''}" data-i="${i}">${s.name} (${s.thick})</button>`).join('');
 document.querySelectorAll('.pre').forEach(b=>b.classList.toggle('on',+b.dataset.v==area));
 const q=$('#quote');q.href=`https://wa.me/${WA_NUMBER}?text=`+encodeURIComponent(`Hi Taj Epoxy, I need a detailed quote.\nSystem: ${S.name} (${S.thick})\nArea: ${f(area)} sq ft\nEstimated cost: ₹${f(total)} (₹${f(per,1)}/sq ft)`);
}
$('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(b){cur=+b.dataset.i;render()}};
$('#area').oninput=e=>{area=Math.max(1,+e.target.value||0)||1;render()};
$('#pres').innerHTML=[250,500,1000,2500,5000].map(v=>`<button class="pre" data-v="${v}">${f(v)}</button>`).join('');
$('#pres').onclick=e=>{const b=e.target.closest('.pre');if(b){area=+b.dataset.v;$('#area').value=area;render()}};
render();
