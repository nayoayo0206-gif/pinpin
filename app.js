const KEY='beadStudioV1';
const demoColors=[
 {id:'MARD-001',name:'黑',hex:'#222222'},{id:'MARD-002',name:'白',hex:'#f7f7f2'},
 {id:'MARD-003',name:'灰',hex:'#8a8a8a'},{id:'MARD-004',name:'淺灰',hex:'#c9c9c9'},
 {id:'MARD-005',name:'紅',hex:'#d83a3a'},{id:'MARD-006',name:'橘',hex:'#f07832'},
 {id:'MARD-007',name:'黃',hex:'#f2c94c'},{id:'MARD-008',name:'綠',hex:'#4aa564'},
 {id:'MARD-009',name:'藍',hex:'#3d78d8'},{id:'MARD-010',name:'深藍',hex:'#274b9f'},
 {id:'MARD-011',name:'紫',hex:'#8756c7'},{id:'MARD-012',name:'粉',hex:'#e58bb1'}
];
let db=JSON.parse(localStorage.getItem(KEY)||'null')||{colors:demoColors,inventory:demoColors.map((c,i)=>({...c,stock:i%4===0?50:120})),patterns:[],works:[]};
let current={name:'我的新作品',size:32,cells:[],selected:demoColors[0].id}; let history=[],future=[];
function persist(){localStorage.setItem(KEY,JSON.stringify(db))}
function nav(id){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x.dataset.page===id));if(id==='home')renderHome();if(id==='inventory')renderInventory();if(id==='works')renderWorks();if(id==='colors')renderColors();if(id==='editor'){renderPalette();buildGrid();}}
function renderHome(){document.getElementById('patternCount').textContent=db.patterns.length+' 張';document.getElementById('patternList').innerHTML=db.patterns.length?db.patterns.map((p,i)=>`<div class="card" onclick="loadPattern(${i})"><div class="thumb">🧩</div><b>${esc(p.name)}</b><div class="muted">${p.size}×${p.size} · ${countCells(p.cells)} 顆</div></div>`).join(''):`<div class="card"><div class="thumb">🎨</div><b>還沒有圖紙</b><div class="muted">建立第一張拼豆圖紙吧</div></div>`}
function newPattern(){current={name:'我的新作品',size:32,cells:[],selected:db.colors[0]?.id};history=[];future=[];document.getElementById('patternName').value=current.name;document.getElementById('gridSize').value=32;nav('editor')}
function renderPalette(){document.getElementById('palette').innerHTML=db.colors.slice(0,30).map(c=>`<button class="swatch ${c.id===current.selected?'selected':''}" title="${c.id} ${c.name}" style="background:${c.hex}" onclick="selectColor('${c.id}')"></button>`).join('')}
function selectColor(id){current.selected=id;renderPalette()}
function buildGrid(){current.size=+document.getElementById('gridSize').value;const g=document.getElementById('grid');g.style.gridTemplateColumns=`repeat(${current.size},18px)`;g.innerHTML='';for(let i=0;i<current.size*current.size;i++){const b=document.createElement('button');b.className='cell';b.dataset.i=i;const c=current.cells[i];if(c){const col=db.colors.find(x=>x.id===c);if(col)b.style.background=col.hex}b.onclick=()=>paint(i);g.appendChild(b)}updateStats()}
function paint(i){history.push(JSON.stringify(current.cells));future=[];current.cells[i]=current.cells[i]===current.selected?null:current.selected;buildGrid()}
function undo(){if(!history.length)return;future.push(JSON.stringify(current.cells));current.cells=JSON.parse(history.pop());buildGrid()}
function redo(){if(!future.length)return;history.push(JSON.stringify(current.cells));current.cells=JSON.parse(future.pop());buildGrid()}
function updateStats(){const counts={};current.cells.forEach(id=>{if(id)counts[id]=(counts[id]||0)+1});document.getElementById('totalBeads').textContent=Object.values(counts).reduce((a,b)=>a+b,0);document.getElementById('colorKinds').textContent=Object.keys(counts).length;document.getElementById('usage').innerHTML=Object.entries(counts).map(([id,n])=>{const c=db.colors.find(x=>x.id===id),s=db.inventory.find(x=>x.id===id)?.stock||0;return `<div class="usageRow"><span class="dot" style="background:${c?.hex||'#ddd'}"></span><div class="grow"><b>${id}</b> ${c?.name||''}<div class="muted">需要 ${n} · 庫存 ${s}</div></div><b class="${s>=n?'ok':'danger'}">${s>=n?'✓ 足夠':'缺 '+(n-s)}</b></div>`}).join('')||'<div class="muted">開始上色後會顯示用量。</div>'}
function savePattern(){current.name=document.getElementById('patternName').value||'未命名圖紙';const p={name:current.name,size:current.size,cells:[...current.cells],updated:new Date().toISOString()};db.patterns.unshift(p);persist();nav('home')}
function loadPattern(i){const p=db.patterns[i];current={...p,selected:db.colors[0]?.id};history=[];future=[];document.getElementById('patternName').value=p.name;document.getElementById('gridSize').value=p.size;nav('editor')}
function renderInventory(){const q=(document.getElementById('invSearch')?.value||'').toLowerCase();document.getElementById('inventoryList').innerHTML=db.inventory.filter(x=>(x.id+x.name).toLowerCase().includes(q)).map((x,i)=>`<div class="invRow"><span class="dot" style="background:${x.hex}"></span><div class="grow"><b>${x.id}</b> ${x.name}</div><button class="ghost" onclick="changeStock(${i},-10)">−10</button><b class="stock">${x.stock}</b><button class="ghost" onclick="changeStock(${i},10)">＋10</button></div>`).join('')}
function changeStock(i,n){db.inventory[i].stock=Math.max(0,db.inventory[i].stock+n);persist();renderInventory()}
function addInventory(){const id=prompt('MARD 色號');if(!id)return;const name=prompt('顏色名稱')||'';const hex=prompt('HEX 顏色，例如 #ff0000','#999999')||'#999999';const stock=+(prompt('目前庫存顆數','0')||0);db.inventory.push({id,name,hex,stock});if(!db.colors.some(c=>c.id===id))db.colors.push({id,name,hex});persist();renderInventory();renderColors()}
function renderColors(){document.getElementById('colorList').innerHTML=db.colors.map((c,i)=>`<div class="colorRow"><span class="dot" style="background:${c.hex}"></span><div class="grow"><b>${c.id}</b><div class="muted">${c.name} · ${c.hex}</div></div><button class="ghost" onclick="editColor(${i})">編輯</button></div>`).join('')}
function addColor(){const id=prompt('MARD 色號');if(!id)return;const name=prompt('顏色名稱')||'';const hex=prompt('HEX 顏色','#999999')||'#999999';db.colors.push({id,name,hex});db.inventory.push({id,name,hex,stock:0});persist();renderColors()}
function editColor(i){const c=db.colors[i];c.name=prompt('顏色名稱',c.name)||c.name;c.hex=prompt('HEX 顏色',c.hex)||c.hex;const inv=db.inventory.find(x=>x.id===c.id);if(inv){inv.name=c.name;inv.hex=c.hex}persist();renderColors()}
function addWork(){const input=document.createElement('input');input.type='file';input.accept='image/*';input.capture='environment';input.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{db.works.unshift({name:f.name,src:r.result,date:new Date().toISOString()});persist();renderWorks()};r.readAsDataURL(f)};input.click()}
function renderWorks(){document.getElementById('workList').innerHTML=db.works.length?db.works.map(w=>`<div class="card"><img src="${w.src}" style="width:100%;height:160px;object-fit:cover;border-radius:12px"><b>${esc(w.name)}</b><div class="muted">${new Date(w.date).toLocaleDateString()}</div></div>`).join(''):`<div class="card"><div class="thumb">📷</div><b>還沒有作品</b><div class="muted">上傳完成品照片即可保存。</div></div>`}
document.getElementById('imageInput').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;alert('已收到圖紙。正式版 AI 模組會在這一步進行格線偵測、顏色辨識與 MARD 色號匹配；目前先進入編輯器讓你手動修正。');newPattern()});
function countCells(c){return c.filter(Boolean).length}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
renderHome();
