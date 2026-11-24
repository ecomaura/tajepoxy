// Replace with the real WhatsApp number (country code + number, digits only)
const WA_NUMBER="919999999999";
const wa=t=>`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;
document.querySelectorAll('[data-wa]').forEach(a=>{a.href=wa(a.dataset.wa);a.target='_blank';a.rel='noopener'});
const b=document.querySelector('.burger'),u=document.querySelector('nav ul');
b&&b.addEventListener('click',()=>{const o=u.classList.toggle('open');b.setAttribute('aria-expanded',o)});
const f=document.getElementById('enquiry');
f&&f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f);
window.open(wa(`Hello ShashiNanda Creations,\nName: ${d.get('name')}\nInterested in: ${d.get('product')}\nQuantity: ${d.get('qty')||'-'}\nMessage: ${d.get('msg')||'-'}`),'_blank')});
