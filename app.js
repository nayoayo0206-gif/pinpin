
/* ===== 一隅拼豆 1.3.1 persistence ===== */
const STORE_KEY='yigu-bead-data-v2';
const STORE_VERSION=2;
let saveTimer=null;

function appSnapshot(){
  return {
    version:STORE_VERSION,
    savedAt:new Date().toISOString(),
    current:window.current,
    db:window.db,
    history:[],
    future:[]
  };
}
function saveAll(reason='自動保存'){
  try{
    localStorage.setItem(STORE_KEY, JSON.stringify(appSnapshot()));
    const el=document.getElementById('saveStatus');
    if(el) el.textContent=`✓ 已保存 · ${new Date().toLocaleTimeString()} · ${reason}`;
  }catch(err){
    const el=document.getElementById('saveStatus');
    if(el) el.textContent='⚠️ 保存失敗：瀏覽器儲存空間可能不足';
    console.error(err);
  }
}
function scheduleSave(reason='自動保存'){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>saveAll(reason),180);
}
function loadAll(){
  try{
    const raw=localStorage.getItem(STORE_KEY);
    if(!raw)return false;
    const data=JSON.parse(raw);
    if(data?.db) window.db=data.db;
    if(data?.current) window.current=data.current;
    return true;
  }catch(err){console.warn('loadAll failed',err);return false}
}
function exportAppData(){
  saveAll('手動備份');
  const payload=localStorage.getItem(STORE_KEY)||JSON.stringify(appSnapshot());
  const blob=new Blob([payload],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`一隅拼豆_備份_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function importAppData(file){
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(!data || !data.db || !data.current) throw new Error('invalid backup');
      if(!confirm('匯入會覆蓋目前的一隅拼豆資料，確定嗎？'))return;
      localStorage.setItem(STORE_KEY,JSON.stringify(data));
      window.db=data.db; window.current=data.current;
      alert('資料已匯入。重新整理後即可使用。');
      location.reload();
    }catch(e){alert('這不是有效的一隅拼豆備份檔。')}
  };
  reader.readAsText(file);
}
function resetAppData(){
  if(!confirm('確定要刪除所有圖紙、庫存與作品資料嗎？此操作無法復原。'))return;
  localStorage.removeItem(STORE_KEY);
  alert('已清除資料，頁面即將重新載入。');
  location.reload();
}
window.addEventListener('beforeunload',()=>saveAll('離開前保存'));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveAll('切到背景')});

const KEY='beadStudioV3';
const mardHex={"A":["FAF4C8","FFFFD5","FEFF8B","FBED56","F4D738","FEAC4C","FE8B4C","FFDA45","FF995B","F77C31","FFDD99","FE9F72","FFC365","FD543D","FFF365","FFFF9F","FFE36E","FEBE7D","FD7C72","FFD568","FFE395","F4F57D","E6C9B7","F7F8A2","FFD67D","FFC830"],"B":["E6EE31","63F347","9EF780","5DE035","35E352","65E2A6","3DAF80","1C9C4F","27523A","95D3C2","5D722A","166F41","CAEB7B","ADE946","2E5132","C5ED9C","9BB13A","E6EE49","24B88C","C2F0CC","156A6B","0B3C43","303A21","EEFCA5","4E846D","8D7A35","CCE1AF","9EE5B9","C5E254","E2FCB1","B0E792","9CAB5A"],"C":["E8FFE7","A9F9FC","A0E2FB","41CCFF","01ACEB","50AAF0","3677D2","0F54C0","324BCA","3EBCE2","28DDDE","1C334D","CDE8FF","D5FDFF","22C4C6","1557A8","04D1F6","1D3344","1887A2","176DAF","BEDDFF","67B4BE","C8E2FF","7CC4FF","A9E5E5","3CAED8","D3DFFA","BBCFED","34488E"],"D":["AEB4F2","858EDD","2F54AF","182A84","B843C5","AC7BDE","8854B3","E2D3FF","D5B9F8","361851","B9BAE1","DE9AD4","B90095","8B279B","2F1F90","E3E1EE","C4D4F6","A45EC7","D8C3D7","9C32B2","9A009B","333A95","EBDAFC","7786E5","494FC7","DFC2F8"],"E":["FDD3CC","FEC0DF","FFB7E7","E8649E","F551A2","F13D74","C63478","FFDBE9","E970CC","D33793","FCDDD2","F78FC3","B5006D","FFD1BA","F8C7C9","FFF3EB","FFE2EA","FFC7DB","FEBAD5","D8C7D1","BD9DA1","B785A1","937A8D","E1BCE8"],"F":["FD957B","FC3D46","F74941","FC283C","E7002F","943630","971937","BC0028","E2677A","8A4526","5A2121","FD4E6A","F35744","FFA9AD","D30022","FEC2A6","E69C79","D37C46","C1444A","CD9391","F7B4C6","FDC0D0","F67E66","E698AA","E54B4F"],"G":["FFE2CE","FFC4AA","F4C3A5","E1B383","EDB045","E99C17","9D5B3E","753832","E6B483","D98C39","E0C593","FFC890","B7714A","8D614C","FCF9E0","F2D9BA","78524B","FFE4CC","E07935","A94023","B88558"],"H":["FDFBFF","FEFFFF","B6B1BA","89858C","48464E","2F2B2F","000000","E7D6DB","EDEDED","EEE9EA","CECDD5","FFF5ED","F5ECD2","CFD7D3","98A6A8","1D1414","F1EDED","FFFDF0","F6EFE2","949FA3","FFFBE1","CACAD4","9A9D94"],"M":["BCC6B8","8AA386","697D80","E3D2BC","D0CCAA","B0A782","B4A497","B38281","A58767","C5B2BC","9F7594","644749","D19066","C77362","757D78"]};
const mardColors=Object.entries(mardHex).flatMap(([series,vals])=>vals.map((hex,i)=>({id:`${series}${i+1}`,name:`${series}${i+1}`,hex:'#'+hex})));
const old=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('beadStudioV2')||localStorage.getItem('beadStudioV1')||'null');
const db=old?{colors:mardColors,inventory:mardColors.map(c=>({...c,stock:old.inventory?.find(x=>x.id===c.id)?.stock||0})),patterns:old.patterns||[],works:old.works||[]}:{colors:mardColors,inventory:mardColors.map(c=>({...c,stock:0})),patterns:[],works:[]};
let current={name:'我的新作品',size:32,cells:[],selected:mardColors[0].id};let history=[],future=[];let scan={src:null,image:null,cells:[],size:32};
const $=id=>document.getElementById(id);function persist(){localStorage.setItem(KEY,JSON.stringify(db))}function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function applyTheme(){const dark=localStorage.getItem('beadTheme')==='dark';document.documentElement.dataset.theme=dark?'dark':'light';$('themeBtn').textContent=dark?'☀️ 淺色':'☾ 深色'}function toggleTheme(){localStorage.setItem('beadTheme',localStorage.getItem('beadTheme')==='dark'?'light':'dark');applyTheme()}
function nav(id){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x.dataset.page===id));if(id==='home')renderHome();if(id==='editor'){renderPalette();buildGrid()}if(id==='inventory')renderInventory();if(id==='colors')renderColors();if(id==='works')renderWorks()}
function renderHome(){$('patternCount').textContent=db.patterns.length+' 張';$('patternList').innerHTML=db.patterns.length?db.patterns.map((p,i)=>`<div class="card" onclick="loadPattern(${i})"><div class="thumb">🧩</div><b>${esc(p.name)}</b><div class="muted">${p.size}×${p.size} · ${countCells(p.cells)} 顆</div></div>`).join(''):`<div class="card"><div class="thumb">🎨</div><b>還沒有圖紙</b><div class="muted">建立第一張拼豆圖紙吧</div></div>`}
function newPattern(){
  scheduleSave('圖紙更新');current={name:'我的新作品',size:32,cells:[],selected:mardColors[0].id};history=[];future=[];$('patternName').value=current.name;$('gridSize').value='32';nav('editor')}
function renderPalette(){const q=($('paletteSearch')?.value||'').toUpperCase();const list=db.colors.filter(c=>!q||c.id.includes(q));$('palette').innerHTML=list.map(c=>`<button class="swatch ${c.id===current.selected?'selected':''}" title="${c.id}" style="background:${c.hex}" onclick="selectColor('${c.id}')"></button>`).join('')||'<span class="muted">找不到色號</span>';const c=db.colors.find(x=>x.id===current.selected);$('selectedLabel').textContent=c?'目前：'+c.id:''}
function selectColor(id){current.selected=id;renderPalette()}
function buildGrid(){const g=$('grid');g.style.gridTemplateColumns=`repeat(${current.size},18px)`;g.innerHTML='';for(let i=0;i<current.size*current.size;i++){const b=document.createElement('button');b.className='cell';const id=current.cells[i];if(id){const c=db.colors.find(x=>x.id===id);if(c)b.style.background=c.hex}b.onclick=()=>paint(i);g.appendChild(b)}updateStats()}
function resizeGrid(){const n=+$('gridSize').value;history.push(JSON.stringify(current.cells));future=[];const a=new Array(n*n).fill(null);const min=Math.min(n,current.size);for(let r=0;r<min;r++)for(let c=0;c<min;c++)a[r*n+c]=current.cells[r*current.size+c]||null;current.size=n;current.cells=a;buildGrid()}
function paint(i){history.push(JSON.stringify(current.cells));future=[];current.cells[i]=eraser?null:(current.cells[i]===current.selected?null:current.selected);buildGrid()}
function undo(){if(!history.length)return;future.push(JSON.stringify(current.cells));current.cells=JSON.parse(history.pop());buildGrid()}function redo(){if(!future.length)return;history.push(JSON.stringify(current.cells));current.cells=JSON.parse(future.pop());buildGrid()}
function zoomGrid(delta){
  zoom=Math.max(.6,Math.min(2.4,zoom+delta*.2));
  const cells=document.querySelectorAll('.cell');
  cells.forEach(c=>{c.style.width=(18*zoom)+'px';c.style.height=(18*zoom)+'px'});
}
function setEraser(){eraser=!eraser;alert(eraser?'橡皮擦已開啟，再按一次可關閉。':'橡皮擦已關閉。');}
function clearGrid(){
  scheduleSave('圖紙更新');
  if(!confirm('確定要清除整張圖紙嗎？'))return;
  history.push(JSON.stringify(current.cells));future=[];current.cells=Array(current.size*current.size).fill(null);buildGrid();
}
function updateStats(){const counts={};current.cells.forEach(id=>{if(id)counts[id]=(counts[id]||0)+1});$('totalBeads').textContent=Object.values(counts).reduce((a,b)=>a+b,0);$('colorKinds').textContent=Object.keys(counts).length;$('usage').innerHTML=Object.entries(counts).map(([id,n])=>{const c=db.colors.find(x=>x.id===id),s=db.inventory.find(x=>x.id===id)?.stock||0;return `<div class="usageRow"><span class="dot" style="background:${c.hex}"></span><div class="grow"><b>${id}</b><div class="muted">需要 ${n} · 庫存 ${s}</div></div><b class="${s>=n?'ok':'danger'}">${s>=n?'✓ 足夠':'缺 '+(n-s)}</b></div>`}).join('')||'<div class="muted">開始上色後會顯示用量。</div>'}
function savePattern(){
  scheduleSave('圖紙保存');current.name=$('patternName').value||'未命名圖紙';db.patterns.unshift({name:current.name,size:current.size,cells:[...current.cells],updated:new Date().toISOString()});persist();nav('home')}
function loadPattern(i){const p=db.patterns[i];current={...p,selected:mardColors[0].id};history=[];future=[];$('patternName').value=p.name;$('gridSize').value=p.size;nav('editor')}
function renderInventory(){const q=($('invSearch')?.value||'').toUpperCase();$('inventoryList').innerHTML=db.inventory.filter(x=>!q||x.id.includes(q)).map((x,i)=>`<div class="invRow"><span class="dot" style="background:${x.hex}"></span><div class="grow"><b>${x.id}</b></div><button class="ghost" onclick="changeStock(${i},-10)">−10</button><b class="stock">${x.stock}</b><button class="ghost" onclick="changeStock(${i},10)">＋10</button></div>`).join('')}
function changeStock(i,n){db.inventory[i].stock=Math.max(0,db.inventory[i].stock+n);persist();renderInventory()}
function addInventory(){const id=prompt('MARD 色號，例如 A1');if(!id)return;const c=db.colors.find(x=>x.id.toUpperCase()===id.toUpperCase());if(!c){alert('這不是內建的 MARD 221 色號。');return}const stock=+(prompt('目前庫存顆數','0')||0);const x=db.inventory.find(v=>v.id===c.id);x.stock=Math.max(0,stock);persist();renderInventory()}
function renderColors(){const q=($('colorSearch')?.value||'').toUpperCase();const list=db.colors.filter(c=>!q||c.id.includes(q));$('colorCount').textContent=db.colors.length+' 色';$('colorList').innerHTML=list.map(c=>`<div class="colorRow"><span class="dot" style="background:${c.hex}"></span><div class="grow"><b>${c.id}</b><div class="muted">HEX ${c.hex}</div></div></div>`).join('')}
function addWork(){const input=document.createElement('input');input.type='file';input.accept='image/*';input.capture='environment';input.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{db.works.unshift({name:f.name,src:r.result,date:new Date().toISOString()});persist();renderWorks()};r.readAsDataURL(f)};input.click()}
function renderWorks(){$('workList').innerHTML=db.works.length?db.works.map(w=>`<div class="card"><img src="${w.src}" style="width:100%;height:160px;object-fit:cover;border-radius:12px"><b>${esc(w.name)}</b><div class="muted">${new Date(w.date).toLocaleDateString()}</div></div>`).join(''):`<div class="card"><div class="thumb">📷</div><b>還沒有作品</b><div class="muted">上傳完成品照片即可保存。</div></div>`}
function openScanner(){$('scanInput').value='';$('scanControls').classList.add('hidden');$('scanResult').classList.add('hidden');$('scanPreview').innerHTML='尚未選擇圖片';nav('scanner')}
function loadScan(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{scan.src=r.result;const img=new Image();img.onload=()=>{scan.image=img;$('scanPreview').innerHTML='';const el=document.createElement('img');el.src=r.result;$('scanPreview').appendChild(el);$('scanControls').classList.remove('hidden');suggestGrid()};img.src=r.result};r.readAsDataURL(f)}
function edgeScore(imgData,w,h,n,axis){let sum=0,count=0;const d=imgData.data;if(axis==='x'){for(let k=1;k<n;k++){const x=Math.round(k*w/n);for(let y=0;y<h;y+=Math.max(1,Math.floor(h/80))){const i=(y*w+x)*4, j=(y*w+Math.max(0,x-1))*4;sum+=Math.abs(d[i]-d[j])+Math.abs(d[i+1]-d[j+1])+Math.abs(d[i+2]-d[j+2]);count++}}}else{for(let k=1;k<n;k++){const y=Math.round(k*h/n);for(let x=0;x<w;x+=Math.max(1,Math.floor(w/80))){const i=(y*w+x)*4,j=(Math.max(0,y-1)*w+x)*4;sum+=Math.abs(d[i]-d[j])+Math.abs(d[i+1]-d[j+1])+Math.abs(d[i+2]-d[j+2]);count++}}}return sum/Math.max(1,count)}
function suggestGrid(){if(!scan.image)return;const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');const s=Math.min(scan.image.width,scan.image.height);canvas.width=180;canvas.height=180;ctx.drawImage(scan.image,(scan.image.width-s)/2,(scan.image.height-s)/2,s,s,0,0,180,180);const data=ctx.getImageData(0,0,180,180);const candidates=[16,24,32,48,64];let best=candidates[0],bestScore=-1;for(const n of candidates){const score=edgeScore(data,180,180,n,'x')+edgeScore(data,180,180,n,'y');if(score>bestScore){bestScore=score;best=n}}$('scanSize').value=best;$('scanStatus').textContent=`已自動建議 ${best}×${best}；如果圖紙格數已知，可以手動改。`}
function rgbNearest(r,g,b){let best=null,bd=1e20;for(const c of db.colors){const q=parseInt(c.hex.slice(1),16),cr=q>>16,cg=(q>>8)&255,cb=q&255;const d=.30*(r-cr)**2+.59*(g-cg)**2+.11*(b-cb)**2;if(d<bd){bd=d;best=c}}return best}
function runScan(){if(!scan.image)return;const n=+$('scanSize').value,canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');const s=Math.min(scan.image.width,scan.image.height);canvas.width=n;canvas.height=n;ctx.drawImage(scan.image,(scan.image.width-s)/2,(scan.image.height-s)/2,s,s,0,0,n,n);const d=ctx.getImageData(0,0,n,n).data;scan.size=n;scan.cells=[];let sum=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const i=(y*n+x)*4,c=rgbNearest(d[i],d[i+1],d[i+2]);scan.cells.push(c.id);const q=parseInt(c.hex.slice(1),16);sum+=Math.sqrt((d[i]-(q>>16))**2+(d[i+1]-((q>>8)&255))**2+(d[i+2]-(q&255))**2)}const avg=sum/(n*n);const conf=Math.max(0,Math.min(100,Math.round(100-avg/2.2)));$('scanStatus').textContent='辨識完成。';$('scanConfidence').textContent=`色彩匹配約 ${conf}%`;$('scanResult').classList.remove('hidden');renderScanGrid()}
function renderScanGrid(){const g=$('scanGrid');const n=scan.size;const wrap=document.createElement('div');wrap.className='grid';wrap.style.gridTemplateColumns=`repeat(${n},18px)`;wrap.style.margin='auto';for(let i=0;i<scan.cells.length;i++){const b=document.createElement('button');b.className='cell';const c=db.colors.find(x=>x.id===scan.cells[i]);b.style.background=c.hex;b.title=c.id;b.onclick=()=>{const next=prompt(`目前 ${c.id}
輸入新的 MARD 色號，例如 A12`,c.id);if(next){const id=next.toUpperCase();if(db.colors.some(x=>x.id===id)){scan.cells[i]=id;renderScanGrid()}else alert('找不到這個 MARD 色號。')}};wrap.appendChild(b)}g.innerHTML='';g.appendChild(wrap)}
function useScanResult(){current={name:$('scanName').value||'AI 辨識圖紙',size:scan.size,cells:[...scan.cells],selected:scan.cells.find(Boolean)||mardColors[0].id};history=[];future=[];$('patternName').value=current.name;$('gridSize').value=scan.size;nav('editor')}
applyTheme();persist();renderHome();
let aiResult=null, aiImageData=null;

function showAIPanel(dataUrl){
  const panel=document.getElementById('aiPanel');
  const img=document.getElementById('aiPreview');
  if(!panel||!img)return;
  img.src=dataUrl; panel.classList.remove('hidden');
  document.getElementById('aiStatus').textContent='圖片已載入。可直接開始辨識，或指定格數。';
  document.getElementById('aiResult').innerHTML='';
  document.getElementById('applyAI').classList.add('hidden');
}
function closeAIPanel(){document.getElementById('aiPanel')?.classList.add('hidden')}
function rgb(hex){return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)]}
function colorDistance(a,b){
  // perceptual-ish weighted RGB distance
  const rmean=(a[0]+b[0])/2, dr=a[0]-b[0], dg=a[1]-b[1], db=a[2]-b[2];
  return Math.sqrt((2+rmean/256)*dr*dr+4*dg*dg+(2+(255-rmean)/256)*db*db);
}
function nearestMARD(rgbv){
  let best=null, bd=Infinity;
  for(const c of db.colors){
    const d=colorDistance(rgbv,rgb(c.hex));
    if(d<bd){bd=d;best=c}
  }
  return {color:best,distance:bd}
}
function loadImage(url){
  return new Promise((resolve,reject)=>{
    const im=new Image(); im.onload=()=>resolve(im); im.onerror=reject; im.src=url;
  });
}
function estimateGrid(img){
  const ratio=img.naturalWidth/img.naturalHeight;
  // Common bead-chart sizes; choose the closest practical grid based on image aspect.
  const preset=document.getElementById('aiGridPreset').value;
  if(preset!=='auto')return +preset;
  const candidates=[16,24,32,48,64];
  // Start from visual resolution; default to 32 for square charts.
  return ratio>1.7?48:ratio<.58?48:32;
}
async function analyzePatternImage(){
  const img=document.getElementById('aiPreview');
  const status=document.getElementById('aiStatus');
  if(!img.src){status.textContent='請先選擇圖紙。';return}
  status.textContent='正在分析圖片、切格與匹配 MARD 221 色…';
  const im=await loadImage(img.src);
  const n=estimateGrid(im);
  const rot=+document.getElementById('aiRotation').value;
  const c=document.createElement('canvas');
  const ctx=c.getContext('2d',{willReadFrequently:true});
  const w=im.naturalWidth,h=im.naturalHeight;
  if(rot===90||rot===270){c.width=h;c.height=w}else{c.width=w;c.height=h}
  ctx.save();
  if(rot===90){ctx.translate(h,0);ctx.rotate(Math.PI/2)}
  else if(rot===180){ctx.translate(w,h);ctx.rotate(Math.PI)}
  else if(rot===270){ctx.translate(0,w);ctx.rotate(-Math.PI/2)}
  ctx.drawImage(im,0,0);ctx.restore();
  const W=c.width,H=c.height;
  // Detect the central chart region by scanning for the strongest non-background area.
  const data=ctx.getImageData(0,0,W,H);
  // Robust bounding box: ignore near-white page margins.
  let minX=W,minY=H,maxX=0,maxY=0;
  for(let y=0;y<H;y+=Math.max(1,Math.floor(H/300))){
    for(let x=0;x<W;x+=Math.max(1,Math.floor(W/300))){
      const i=(y*W+x)*4,r=data.data[i],g=data.data[i+1],b=data.data[i+2];
      if(Math.min(r,g,b)<238 || Math.max(r,g,b)-Math.min(r,g,b)>18){
        minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
      }
    }
  }
  if(maxX<=minX||maxY<=minY){minX=0;minY=0;maxX=W;maxY=H}
  const pad=0.01*Math.min(W,H);
  minX=Math.max(0,Math.floor(minX-pad));minY=Math.max(0,Math.floor(minY-pad));
  maxX=Math.min(W,Math.ceil(maxX+pad));maxY=Math.min(H,Math.ceil(maxY+pad));
  const cw=(maxX-minX)/n,ch=(maxY-minY)/n;
  const cells=[];
  const counts={};
  for(let gy=0;gy<n;gy++){
    for(let gx=0;gx<n;gx++){
      const x=Math.floor(minX+gx*cw+cw*.2),y=Math.floor(minY+gy*ch+ch*.2);
      const ww=Math.max(1,Math.floor(cw*.6)),hh=Math.max(1,Math.floor(ch*.6));
      const pix=ctx.getImageData(x,y,Math.min(ww,W-x),Math.min(hh,H-y)).data;
      let sr=0,sg=0,sb=0,count=0;
      for(let i=0;i<pix.length;i+=4){sr+=pix[i];sg+=pix[i+1];sb+=pix[i+2];count++}
      const avg=[Math.round(sr/count),Math.round(sg/count),Math.round(sb/count)];
      const m=nearestMARD(avg);
      cells.push(m.color?.id||null);
      if(m.color)counts[m.color.id]=(counts[m.color.id]||0)+1;
    }
  }
  aiResult={size:n,cells,counts};
  status.textContent=`完成：${n} × ${n}，共 ${n*n} 格。點擊色號或直接套用後可逐格修正。`;
  document.getElementById('aiResult').innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([id,num])=>{
    const c=db.colors.find(x=>x.id===id),stock=db.inventory.find(x=>x.id===id)?.stock||0;
    return `<div class="usageRow"><span class="dot" style="background:${c?.hex}"></span><div class="grow"><b>${id}</b> ${c?.name||''}<div class="muted">辨識 ${num} · 庫存 ${stock}</div></div><b class="${stock>=num?'ok':'danger'}">${stock>=num?'足夠':'缺 '+(num-stock)}</b></div>`;
  }).join('');
  document.getElementById('applyAI').classList.remove('hidden');
}
function applyAIResult(){
  scheduleSave('圖紙更新');
  if(!aiResult)return;
  current={name:'AI 辨識圖紙',size:aiResult.size,cells:[...aiResult.cells],selected:db.colors[0]?.id};
  history=[];future=[];
  document.getElementById('patternName').value=current.name;
  document.getElementById('gridSize').value=current.size;
  nav('editor');
}

function choosePatternImage(){
  const useAlbum = confirm('按「確定」從相簿選圖；按「取消」使用相機拍攝。');
  document.getElementById(useAlbum ? 'imageInput' : 'cameraInput').click();
}
function handlePatternImage(file){
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{sessionStorage.setItem('patternImagePreview',reader.result);showAIPanel(reader.result)};
  reader.readAsDataURL(file);
}
document.getElementById('imageInput').addEventListener('change',e=>handlePatternImage(e.target.files[0]));
document.getElementById('cameraInput').addEventListener('change',e=>handlePatternImage(e.target.files[0]));



document.addEventListener('DOMContentLoaded',()=>{
  const loaded=loadAll();
  if(loaded){
    try{
      if(typeof renderInventory==='function') renderInventory();
      if(typeof renderPatterns==='function') renderPatterns();
      if(typeof buildGrid==='function') buildGrid();
      if(typeof updateStats==='function') updateStats();
    }catch(e){console.warn('UI restore',e)}
  }
});

window.addEventListener('click',e=>{if(e.target.closest('button')) scheduleSave('操作後保存')});
