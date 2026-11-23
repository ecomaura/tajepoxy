const WA_NUMBER='919920899998';
const waLink=m=>`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m)}`;
document.querySelector('.burger').onclick=()=>document.querySelector('.nav ul').classList.toggle('open');
// Any <a data-wa="message"> becomes a prefilled WhatsApp link
document.querySelectorAll('[data-wa]').forEach(a=>{
  const m=a.dataset.wa||`Hi Taj Epoxy, I'm browsing your "${document.title.split('|')[0].trim()}" page and would like more information.`;
  a.href=waLink(m);a.target='_blank';a.rel='noopener';
});
// Any <form data-wa-form> sends its fields to WhatsApp
document.querySelectorAll('form[data-wa-form]').forEach(f=>f.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(f);let t=f.dataset.waForm+'\n';
  d.forEach((v,k)=>{if(v)t+=`${f.querySelector(`[name="${k}"]`).dataset.label||k}: ${v}\n`});
  window.open(waLink(t.trim()),'_blank');
}));

// Lightbox for gallery images
(()=>{const g=document.querySelectorAll('.gal img');if(!g.length)return;const l=document.createElement('div');l.className='lb';l.innerHTML='<img alt="">';document.body.appendChild(l);
g.forEach(i=>i.onclick=()=>{l.querySelector('img').src=i.src;l.querySelector('img').alt=i.alt;l.classList.add('on')});l.onclick=()=>l.classList.remove('on');document.addEventListener('keydown',e=>e.key==='Escape'&&l.classList.remove('on'))})();
