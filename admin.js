(()=>{
const REPO='ecomaura/tajepoxy',BRANCH='main',API='https://api.github.com',$=s=>document.querySelector(s);
const F=['title','tagline','badge','dates','location','fee','booking','phone','description','styles','perks','payNote'];
let token=localStorage.getItem('gh_tok')||sessionStorage.getItem('gh_tok')||'',data=Object.assign({},WS.DEFAULT),newImg=null,pvImg=null;
const say=(t,c)=>{$('#status').innerHTML=t?`<div class="msg ${c||'info'}">${t}</div>`:''};
const b64=s=>btoa(unescape(encodeURIComponent(s))),unb64=s=>decodeURIComponent(escape(atob(s.replace(/\n/g,''))));
async function gh(p,o){o=o||{};const r=await fetch(API+p,Object.assign({},o,{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}}));
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(r.status===401?'Invalid or expired token':(j.message||r.status));return j}
const put=(path,content,msg,sha)=>gh(`/repos/${REPO}/contents/${path}`,{method:'PUT',body:JSON.stringify(Object.assign({message:msg,content,branch:BRANCH},sha?{sha}:{}))});
function fill(d){F.forEach(k=>{const v=d[k];$('#f_'+k).value=Array.isArray(v)?v.join('\n'):(v==null?'':v)});$('#f_showOnHome').checked=d.showOnHome!==false;$('#thumb').src=d.image;preview()}
function read(){const d=Object.assign({},data);F.forEach(k=>{let v=$('#f_'+k).value.trim();if(k==='styles'||k==='perks')v=WS.list(v);d[k]=v});d.showOnHome=$('#f_showOnHome').checked;return d}
function preview(){const d=read();if(pvImg)d.image=pvImg;WS.renderHome(d,$('#pv'));$('#pv').style.display=''}
async function connect(){say('Connecting to GitHub…');
  try{const r=await gh(`/repos/${REPO}`);if(r.permissions&&!r.permissions.push)throw new Error('This token cannot write to '+REPO+'. Give it "Contents: Read and write".');
    try{const c=await gh(`/repos/${REPO}/contents/data/workshop.json?ref=${BRANCH}`);data=Object.assign({},WS.DEFAULT,JSON.parse(unb64(c.content)))}catch(e){data=Object.assign({},WS.DEFAULT)}
    $('#login').classList.add('hide');$('#editor').classList.remove('hide');fill(data);say('')}
  catch(e){token='';say('Could not connect: '+e.message,'err')}}
const compress=f=>new Promise((ok,no)=>{const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{const s=Math.min(1,1400/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*s);c.height=Math.round(i.height*s);
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.85))};i.onerror=()=>no(new Error('Could not read this image'));i.src=u});
async function save(){const d=read(),miss=['title','dates','location','fee','booking','phone'].filter(k=>!d[k]);
  if(miss.length)return say('Please fill: '+miss.join(', '),'err');
  $('#save').disabled=true;
  try{
    if(newImg){say('Uploading image…');const p=`assets/workshop/workshop-${Date.now()}.jpg`;await put(p,newImg.split(',')[1],'Update workshop image');d.image=p}
    say('Saving details…');let sha;try{sha=(await gh(`/repos/${REPO}/contents/data/workshop.json?ref=${BRANCH}`)).sha}catch(e){}
    await put('data/workshop.json',b64(JSON.stringify(d,null,2)+'\n'),'Update workshop details',sha);
    data=d;newImg=null;pvImg=null;$('#f_image').value='';
    say('✅ Saved to GitHub. The live site updates in about 1–2 minutes. <a href="workshop.html" target="_blank">View workshop page</a> · <a href="index.html" target="_blank">View home page</a>','ok')}
  catch(e){say('Save failed: '+e.message,'err')}
  $('#save').disabled=false}
$('#connect').onclick=()=>{token=$('#tok').value.trim();if(!token)return say('Paste your GitHub token first.','err');
  (localStorage.removeItem('gh_tok'),sessionStorage.removeItem('gh_tok'));($('#rem').checked?localStorage:sessionStorage).setItem('gh_tok',token);connect()};
$('#logout').onclick=()=>{localStorage.removeItem('gh_tok');sessionStorage.removeItem('gh_tok');token='';$('#tok').value='';$('#editor').classList.add('hide');$('#login').classList.remove('hide');say('Disconnected. Token removed from this browser.')};
$('#reset').onclick=()=>{if(confirm('Reset the form to the original default details? (Nothing is saved until you click Save.)')){newImg=pvImg=null;fill(Object.assign({},WS.DEFAULT))}};
$('#f_image').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(!/^image\//.test(f.type))return say('Please choose an image file.','err');
  try{newImg=pvImg=await compress(f);$('#thumb').src=newImg;preview();say('')}catch(x){say(x.message,'err')}};
$('#form').addEventListener('input',preview);$('#save').onclick=save;
if(token){$('#tok').value=token;connect()}
})();
