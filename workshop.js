/* Renders workshops on Home (section) and Workshop page from data/workshops.json.
   Manage them from /admin.html. DEFAULT is the fallback if the file can't be loaded. */
(function(){
const DEFAULT={id:'w1',title:'Resin Table / Epoxy Flooring Workshop',tagline:'Learn Professional Techniques & Start Your High Profit Business',badge:'Seats Limited',dates:'3, 4, 5 December',location:'Delhi',fee:'14,999',booking:'2,000',description:'Hands-on training covering 3D, marble, metallic, industrial, flake and parking flooring, plus resin tables.',styles:['3D Flooring','Marble Finish','Metallic Finish','Industrial Flooring','Flakes & Granular Finish','Parking Flooring'],perks:['Practical Training','Expert Guidance','Business Support','Certificate Provided'],payNote:'Pay via G Pay / UPI',phone:'9920899998',image:'assets/workshop-flyer.jpg',visible:true,showOnHome:true};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=a=>Array.isArray(a)?a:String(a||'').split('\n').map(x=>x.trim()).filter(Boolean);
const digits=p=>{p=String(p||'').replace(/\D/g,'');return p.length===10?'91'+p:p};
const wa=(d,m)=>`https://wa.me/${digits(d.phone)}?text=${encodeURIComponent(m)}`;
const ICONS=['tool','cap','trend','award','check'];
const sid=d=>String(d.id||'').replace(/[^\w-]/g,'');
const bookMsg=d=>`Hi Taj Epoxy, I want to book my seat for the ${d.title} (${d.dates}, ${d.location}). Please share payment details for the ₹${d.booking} booking amount.`;
const chips=(a,icons)=>list(a).map((x,i)=>`<span>${icons?`<i class="i i-${ICONS[i%ICONS.length]}"></i>`:''}${esc(x)}</span>`).join('');
const price=d=>`<div class="price"><div><b>₹${esc(d.fee)}/-</b>Workshop Fee</div><div><b>₹${esc(d.booking)}/-</b>Booking Amount</div></div>`;
const meta=d=>`<i class="i i-cal"></i>${esc(d.dates)} &nbsp;·&nbsp; <i class="i i-pin"></i>${esc(d.location)}`;
const bookBtn=(d,t)=>`<a class="btn wa-btn" target="_blank" rel="noopener" href="${wa(d,bookMsg(d))}"><i class="wai"></i>${t}</a>`;
const vis=l=>l.filter(w=>w.visible!==false);
function single(d){return `<div class="w grid g2"><div>${d.badge?`<span class="badge"><i class="i i-flame"></i>${esc(d.badge)}</span>`:''}<h2>${esc(d.title)}</h2><p class="sub">${esc(d.tagline)}</p>
<p style="font-size:22px;font-weight:600;margin-bottom:6px">${meta(d)}</p><div class="chips" style="margin-bottom:6px">${chips(d.styles)}</div>${price(d)}<div class="chips">${chips(d.perks,1)}</div><br>
${bookBtn(d,'Book Your Seat')} <a class="btn o" href="workshop.html#${sid(d)}">Full Details</a>
<p style="margin-top:14px;font-size:14px"><i class="i i-phone"></i>${esc(d.phone)}${d.payNote?' · '+esc(d.payNote):''}</p></div><img src="${esc(d.image)}" alt="${esc(d.title)}"></div>`}
function card(d){return `<div class="card"><a href="workshop.html#${sid(d)}"><img class="cimg" style="height:230px" src="${esc(d.image)}" alt="${esc(d.title)}" loading="lazy"></a><div class="b">${d.badge?`<span class="badge"><i class="i i-flame"></i>${esc(d.badge)}</span>`:''}
<h3><a href="workshop.html#${sid(d)}">${esc(d.title)}</a></h3><p style="font-weight:600;color:var(--t);margin:6px 0">${meta(d)}</p><p><b style="color:var(--p)">₹${esc(d.fee)}/-</b> fee · ₹${esc(d.booking)}/- booking</p>
<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">${bookBtn(d,'Book Seat')}<a class="btn o" href="workshop.html#${sid(d)}">Details</a></div></div></div>`}
function renderHome(l,el){
  if(!el)return;const v=vis(l).filter(w=>w.showOnHome!==false);
  el.style.display=v.length?'':'none';
  el.innerHTML=v.length===1?single(v[0]):`<div class="w c"><h2>Upcoming Workshops</h2><p class="sub">Learn professional techniques &amp; start your high-profit business.</p><div class="grid g3" style="text-align:left">${v.map(card).join('')}</div><br><a class="btn" href="workshop.html">View All Workshops</a></div>`;
}
function block(d,multi,i){return `<div class="wsb" id="${sid(d)}"><div class="w grid g2${i%2?' rev':''}"><div>${d.badge?`<span class="badge"><i class="i i-flame"></i>${esc(d.badge)}</span>`:''}
${multi?`<h2>${esc(d.title)}</h2><p class="sub" style="margin-bottom:10px">${esc(d.tagline)}</p><p style="font-weight:600;font-size:18px;margin-bottom:10px">${meta(d)}</p>`:`<h2>${esc(d.dates)} · ${esc(d.location)}</h2>`}
<p class="sub">${esc(d.description)}</p><h3 style="color:var(--pd);margin-bottom:8px">What you'll learn</h3><div class="chips" style="margin-bottom:6px">${chips(d.styles)}</div>${price(d)}<div class="chips">${chips(d.perks,1)}</div><br>
${bookBtn(d,'Book on WhatsApp')} <a class="btn g" href="tel:+${digits(d.phone)}">${esc(d.phone)}</a>${d.payNote?`<p style="margin-top:14px;color:var(--m)">${esc(d.payNote)}</p>`:''}</div>
<img src="${esc(d.image)}" alt="${esc(d.title)}" style="border-radius:18px;box-shadow:0 10px 40px #5b2a9133;max-width:420px;margin:auto;width:100%"></div></div>`}
function renderPage(l){
  const h=document.getElementById('ws-hero'),m=document.getElementById('ws-main'),v=vis(l),n=v.length;
  if(h)h.innerHTML=`<div class="ph-hero"><h1>${n===1?esc(v[0].title):'Our Workshops'}</h1><p>${n===1?esc(v[0].tagline):'Hands-on training to learn professional techniques &amp; start your high-profit business'}</p></div>`;
  if(m)m.innerHTML=n?v.map((d,i)=>block(d,n>1,i)).join(''):`<div class="w c" style="padding:30px 0"><h2>No workshops scheduled right now</h2><p class="sub">Message us on WhatsApp to hear about the next batch.</p><a class="btn wa-btn" target="_blank" rel="noopener" href="https://wa.me/${digits(DEFAULT.phone)}?text=${encodeURIComponent('Hi Taj Epoxy, please share details of the upcoming workshop.')}"><i class="wai"></i>Ask on WhatsApp</a></div>`;
  const f=document.querySelector('form[data-wa-form]'),p=document.getElementById('ws-pick');
  if(f&&p){
    p.innerHTML=v.map((d,i)=>`<option value="${i}">${esc(d.title)} (${esc(d.dates)}, ${esc(d.location)})</option>`).join('')||'<option>General enquiry</option>';
    const sync=()=>{const d=v[+p.value];f.dataset.waNumber=digits((d||DEFAULT).phone)};
    p.onchange=sync;sync();p.hidden=!n;
    p.querySelectorAll&&[...p.options].forEach((o,i)=>{o.value=v[i]?`${v[i].title} (${v[i].dates}, ${v[i].location})`:o.value});
    p.onchange=()=>{const i=p.selectedIndex,d=v[i];f.dataset.waNumber=digits((d||DEFAULT).phone)};p.onchange();
  }
}
const load=()=>fetch('data/workshops.json?v='+Date.now()).then(r=>r.ok?r.json():{}).catch(()=>({})).then(j=>Array.isArray(j.workshops)?j.workshops.map((w,i)=>Object.assign({},DEFAULT,{id:'w'+(i+1)},w)):[DEFAULT]);
window.WS={DEFAULT,renderHome,renderPage,load,list,esc};
const home=document.getElementById('ws-home');
if(home||document.getElementById('ws-main')){const go=l=>{renderHome(l,home);renderPage(l)};go([DEFAULT]);load().then(go)}
})();
