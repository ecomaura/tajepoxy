document.querySelector('.burger').onclick=()=>document.querySelector('.nav ul').classList.toggle('open');
function sendWA(e){e.preventDefault();const f=e.target,t=`Hi Taj Epoxy, I'm ${f.n.value} (${f.p.value}). Interested in: ${f.s.value}. ${f.m.value}`;
window.open('https://wa.me/919920899998?text='+encodeURIComponent(t),'_blank')}
