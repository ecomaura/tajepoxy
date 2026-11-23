/* Renders the workshop section (home) and workshop page from data/workshop.json.
   Edit it from /admin.html. DEFAULT is the fallback if the file can't be loaded. */
(function(){
const DEFAULT={title:'Resin Table / Epoxy Flooring Workshop',tagline:'Learn Professional Techniques & Start Your High Profit Business',badge:'Seats Limited',dates:'3, 4, 5 December',location:'Delhi',fee:'14,999',booking:'2,000',description:'Hands-on training covering 3D, marble, metallic, industrial, flake and parking flooring, plus resin tables.',styles:['3D Flooring','Marble Finish','Metallic Finish','Industrial Flooring','Flakes & Granular Finish','Parking Flooring'],perks:['Practical Training','Expert Guidance','Business Support','Certificate Provided'],payNote:'Pay via G Pay / UPI',phone:'9920899998',image:'assets/workshop-flyer.jpg',showOnHome:true};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=a=>Array.isArray(a)?a:String(a||'').split('\n').map(x=>x.trim()).filter(Boolean);
const digits=p=>{p=String(p||'').replace(/\D/g,'');return p.length===10?'91'+p:p};
const wa=(d,m)=>`https://wa.me/${digits(d.phone)}?text=${encodeURIComponent(m)}`;
const ICONS=['tool','cap','trend','award','check'];
const bookMsg=d=>`Hi Taj Epoxy, I want to book my seat for the ${d.title} (${d.dates}, ${d.location}). Please share payment details for the ₹${d.booking} booking amount.`;
const chips=(a,icons)=>list(a).map((x,i)=>`<span>${icons?`<i class="i i-${ICONS[i%ICONS.length]}"></i>`:''}${esc(x)}</span>`).join('');
const price=d=>`<div class="price"><div><b>₹${esc(d.fee)}/-</b>Workshop Fee</div><div><b>₹${esc(d.booking)}/-</b>Booking Amount</div></div>`;
function renderHome(d,el){
  if(!el)return;el.style.display=d.showOnHome===false?'none':'';
  el.innerHTML=`<div class="w grid g2"><div>${d.badge?`<span class="badge"><i class="i i-flame"></i>${esc(d.badge)}</span>`:''}<h2>${esc(d.title)}</h2><p class="sub">${esc(d.tagline)}</p>
<p style="font-size:22px;font-weight:600;margin-bottom:6px"><i class="i i-cal"></i>${esc(d.dates)} &nbsp;·&nbsp; <i class="i i-pin"></i>${esc(d.location)}</p>
<div class="chips" style="margin-bottom:6px">${chips(d.styles)}</div>${price(d)}<div class="chips">${chips(d.perks,1)}</div><br>
<a class="btn wa-btn" target="_blank" rel="noopener" href="${wa(d,bookMsg(d))}"><i class="wai"></i>Book Your Seat</a> <a class="btn o" href="workshop.html">Full Details</a>
<p style="margin-top:14px;font-size:14px"><i class="i i-phone"></i>${esc(d.phone)}${d.payNote?' · '+esc(d.payNote):''}</p></div><img src="${esc(d.image)}" alt="${esc(d.title)}"></div>`;
}
function renderPage(d){
  const h=document.getElementById('ws-hero'),m=document.getElementById('ws-main');
  if(h)h.innerHTML=`<div class="ph-hero"><h1>${esc(d.title)}</h1><p>${esc(d.tagline)}</p></div>`;
  if(m)m.innerHTML=`<div class="w grid g2"><div><h2>${esc(d.dates)} · ${esc(d.location)}</h2><p class="sub">${esc(d.description)}</p>
<h3 style="color:var(--pd);margin-bottom:8px">What you'll learn</h3><div class="chips" style="margin-bottom:6px">${chips(d.styles)}</div>${price(d)}<div class="chips">${chips(d.perks,1)}</div><br>
<a class="btn wa-btn" target="_blank" rel="noopener" href="${wa(d,bookMsg(d))}"><i class="wai"></i>Book on WhatsApp</a> <a class="btn g" href="tel:+${digits(d.phone)}">${esc(d.phone)}</a>
${d.payNote?`<p style="margin-top:14px;color:var(--m)">${esc(d.payNote)}</p>`:''}</div>
<img src="${esc(d.image)}" alt="${esc(d.title)}" style="border-radius:18px;box-shadow:0 10px 40px #5b2a9133;max-width:420px;margin:auto;width:100%"></div>`;
  const f=document.querySelector('form[data-wa-form]');
  if(f){f.dataset.waForm=`Workshop Registration – ${d.dates}, ${d.location}`;f.dataset.waNumber=digits(d.phone)}
}
const load=()=>fetch('data/workshop.json?v='+Date.now()).then(r=>r.ok?r.json():{}).catch(()=>({})).then(j=>Object.assign({},DEFAULT,j));
window.WS={DEFAULT,renderHome,renderPage,load,list};
const home=document.getElementById('ws-home');
if(home||document.getElementById('ws-main')){
  const go=d=>{renderHome(d,home);renderPage(d)};
  go(DEFAULT);load().then(go);
}
})();
