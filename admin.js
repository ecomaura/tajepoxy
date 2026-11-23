(()=>{
const REPO='ecomaura/tajepoxy',BRANCH='main',API='https://api.github.com',$=s=>document.querySelector(s),esc=WS.esc;
const F=['title','tagline','badge','dates','location','fee','booking','phone','description','styles','perks','payNote'];
let token=localStorage.getItem('gh_tok')||sessionStorage.getItem('gh_tok')||'',items=[],idx=0,pend={};
const uid=()=>'w'+Date.now().toString(36)+Math.floor(Math.random()*99);
const blank=()=>Object.assign({},WS.DEFAULT,{id:uid(),title:'New Workshop',tagline:'',badge:'',dates:'',location:'',fee:'',booking:'',description:'',styles:[],perks:['Practical Training','Expert Guidance','Business Support','Certificate Provided'],phone:(items[0]&&items[0].phone)||WS.DEFAULT.phone});
const clone=o=>JSON.parse(JSON.stringify(o));
const say=(t,c)=>{$('#status').innerHTML=t?`<div class="msg ${c||'info'}">${t}</div>`:''};
const b64=s=>btoa(unescape(encodeURIComponent(s))),unb64=s=>decodeURIComponent(escape(atob(s.replace(/\n/g,''))));
async function gh(p,o){o=o||{};const r=await fetch(API+p,Object.assign({},o,{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}}));
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(r.status===401?'Invalid or expired token':(j.message||r.status));return j}
const put=(path,content,msg,sha)=>gh(`/repos/${REPO}/contents/${path}`,{method:'PUT',body:JSON.stringify(Object.assign({message:msg,content,branch:BRANCH},sha?{sha}:{}))});
function read(){const d=Object.assign({},items[idx]);F.forEach(k=>{let v=$('#f_'+k).value.trim();if(k==='styles'||k==='perks')v=WS.list(v);d[k]=v});d.visible=$('#f_visible').checked;d.showOnHome=$('#f_showOnHome').checked;return d}
const sync=()=>{if(items[idx])items[idx]=read()};
function list(){$('#wl').innerHTML=items.map((w,i)=>`<button type="button" class="${i===idx?'on':''}" data-i="${i}"><b>${esc(w.title||'Untitled')}</b><small>${esc(w.dates||'no dates yet')}${w.visible===false?' · Hidden':''}</small></button>`).join('')||'<p style="color:var(--m);font-size:14px">No workshops yet — click “Add workshop”.</p>'}
function fill(){const has=items.length>0;$('#form').classList.toggle('hide',!has);$('#pvwrap').classList.toggle('hide',!has);list();if(!has)return;
  const d=items[idx];F.forEach(k=>{const v=d[k];$('#f_'+k).value=Array.isArray(v)?v.join('\n'):(v==null?'':v)});
  $('#f_visible').checked=d.visible!==false;$('#f_showOnHome').checked=d.showOnHome!==false;$('#f_image').value='';$('#thumb').src=pend[d.id]||d.image;preview()}
function preview(){const d=read();if(pend[d.id])d.image=pend[d.id];d.visible=d.showOnHome=true;WS.renderHome([d],$('#pv'));$('#pv').style.display=''}
const pick=i=>{sync();idx=i;fill()};
async function connect(){say('Connecting to GitHub…');
  try{const r=await gh(`/repos/${REPO}`);if(r.permissions&&!r.permissions.push)throw new Error('This token cannot write to '+REPO+'. Give it "Contents: Read and write".');
    try{const c=await gh(`/repos/${REPO}/contents/data/workshops.json?ref=${BRANCH}`);items=JSON.parse(unb64(c.content)).workshops.map((w,i)=>Object.assign({},WS.DEFAULT,{id:'w'+(i+1)},w))}catch(e){items=[clone(WS.DEFAULT)]}
    idx=0;pend={};$('#login').classList.add('hide');$('#editor').classList.remove('hide');fill();say('')}
  catch(e){token='';say('Could not connect: '+e.message,'err')}}
const compress=f=>new Promise((ok,no)=>{const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{const s=Math.min(1,1400/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*s);c.height=Math.round(i.height*s);
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.85))};i.onerror=()=>no(new Error('Could not read this image'));i.src=u});
async function save(){sync();
  for(let i=0;i<items.length;i++){const d=items[i];if(d.visible===false)continue;const miss=['title','dates','location','fee','booking','phone'].filter(k=>!d[k]);
    if(miss.length){idx=i;fill();return say(`“${esc(d.title||'Untitled')}”: please fill ${miss.join(', ')} (or untick “Visible on website”).`,'err')}}
  $('#save').disabled=true;
  try{
    for(const d of items){if(pend[d.id]){say('Uploading image for “'+esc(d.title)+'”…');const p=`assets/workshop/${d.id}-${Date.now()}.jpg`;await put(p,pend[d.id].split(',')[1],'Update workshop image');d.image=p}}
    say('Saving workshops…');let sha;try{sha=(await gh(`/repos/${REPO}/contents/data/workshops.json?ref=${BRANCH}`)).sha}catch(e){}
    await put('data/workshops.json',b64(JSON.stringify({workshops:items},null,2)+'\n'),'Update workshops',sha);
    pend={};fill();say('✅ Saved to GitHub. The live site updates in about 1–2 minutes. <a href="workshop.html" target="_blank">View workshop page</a> · <a href="index.html" target="_blank">View home page</a>','ok')}
  catch(e){say('Save failed: '+e.message,'err')}
  $('#save').disabled=false}
$('#connect').onclick=()=>{token=$('#tok').value.trim();if(!token)return say('Paste your GitHub token first.','err');
  localStorage.removeItem('gh_tok');sessionStorage.removeItem('gh_tok');($('#rem').checked?localStorage:sessionStorage).setItem('gh_tok',token);connect()};
$('#logout').onclick=()=>{localStorage.removeItem('gh_tok');sessionStorage.removeItem('gh_tok');token='';$('#tok').value='';$('#editor').classList.add('hide');$('#login').classList.remove('hide');say('Disconnected. Token removed from this browser.')};
$('#wl').onclick=e=>{const b=e.target.closest('button');if(b)pick(+b.dataset.i)};
$('#addw').onclick=()=>{sync();items.push(blank());idx=items.length-1;fill();$('#f_title').focus();$('#f_title').select()};
$('#dupw').onclick=()=>{sync();const o=items[idx],c=clone(o);c.id=uid();c.title+=' (copy)';if(pend[o.id])pend[c.id]=pend[o.id];items.splice(idx+1,0,c);idx++;fill()};
$('#delw').onclick=()=>{if(!items.length||!confirm('Delete “'+(items[idx].title||'this workshop')+'”? (Nothing is removed from the site until you click Save.)'))return;delete pend[items[idx].id];items.splice(idx,1);idx=Math.max(0,Math.min(idx,items.length-1));fill()};
const mv=n=>{sync();const j=idx+n;if(j<0||j>=items.length)return;[items[idx],items[j]]=[items[j],items[idx]];idx=j;fill()};
$('#upw').onclick=()=>mv(-1);$('#downw').onclick=()=>mv(1);
$('#f_image').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(!/^image\//.test(f.type))return say('Please choose an image file.','err');
  try{const u=await compress(f);pend[items[idx].id]=u;$('#thumb').src=u;preview();say('')}catch(x){say(x.message,'err')}};
$('#form').addEventListener('input',()=>{sync();list();preview()});$('#save').onclick=save;
if(token){$('#tok').value=token;connect()}
})();
