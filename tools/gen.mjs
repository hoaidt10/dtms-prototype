// Sinh code use_figma từ dữ liệu capture đã nén.
//   node gen.mjs <cap> setup                         → in code tạo page, section, component Topbar/Sidebar, cover
//   node gen.mjs <cap> screen <n> <topbarId> <sidebarId> → in code dựng màn thứ n (1-based theo manifest)
//   node gen.mjs <cap> links                          → in code nối prototype link + flow starting point
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [cap, cmd, a1, a2, a3] = process.argv.slice(2);
const M = JSON.parse(readFileSync(join(cap, 'manifest.json'), 'utf8'));
const load = (f) => JSON.parse(readFileSync(join(cap, f.replace('.json', '.c.json')), 'utf8'));

export const PAGES = { demo: '01 · Demo MS01.01 (9 cảnh)', khung: '02 · Khung & màn khác', nhanh: '03 · Nhánh phụ', comp: '99 · Components' };
const pageOf = (sec) => (sec.startsWith('Cảnh') ? PAGES.demo : sec === 'Nhánh phụ' ? PAGES.nhanh : PAGES.khung);
const GAP = 160, PAD = 120, HEAD = 120;

// Bố cục: mỗi section một hàng ngang; các section trên cùng page xếp dọc.
function layout() {
  const secs = [];
  for (const m of M) {
    let s = secs.find((x) => x.name === m.page);
    if (!s) { s = { name: m.page, page: pageOf(m.page), items: [] }; secs.push(s); }
    s.items.push(m);
  }
  const yByPage = {};
  for (const s of secs) {
    s.w = PAD * 2 + s.items.length * 1440 + (s.items.length - 1) * GAP;
    s.h = HEAD + Math.max(...s.items.map((m) => m.h)) + PAD;
    s.x = 0; s.y = yByPage[s.page] || 0; yByPage[s.page] = s.y + s.h + 240;
    s.items.forEach((m, i) => { m.fx = PAD + i * (1440 + GAP); m.fy = HEAD; });
  }
  return secs;
}

const RUNTIME = `
const hex=(h)=>{const n=parseInt(h.slice(1,7),16);return{c:{r:(n>>16&255)/255,g:(n>>8&255)/255,b:(n&255)/255},a:h.length>7?parseInt(h.slice(7,9),16)/255:1}};
const paint=(h)=>{const x=hex(h);return{type:'SOLID',color:x.c,opacity:x.a}};
await Promise.all([['Roboto','Regular'],['Roboto','Medium'],['Roboto','Bold'],['Roboto','Italic'],['Tinos','Regular'],['Tinos','Bold'],['Tinos','Italic'],['Noto Color Emoji','Regular'],['Noto Sans Symbols2','Regular']].map(([family,style])=>figma.loadFontAsync({family,style})));
function build(C,n,parent,ox,oy){
 const k=n[0],x=n[1]+(ox||0),y=n[2]+(oy||0),w=Math.max(n[3],1),h=Math.max(n[4],1);
 if(k===0){const st=C.s[n[5]];const f=figma.createFrame();f.name=C.m[n[6]]||'box';parent.appendChild(f);f.x=x;f.y=y;f.resize(w,h);
  f.fills=st.bg?[paint(st.bg)]:[];
  if(st.bo){f.strokes=[paint(st.bo)];f.strokeAlign='INSIDE';if(Array.isArray(st.bw)){f.strokeTopWeight=st.bw[0];f.strokeRightWeight=st.bw[1];f.strokeBottomWeight=st.bw[2];f.strokeLeftWeight=st.bw[3];}else f.strokeWeight=st.bw;if(st.dash)f.dashPattern=[4,3];}
  if(st.r!=null){if(Array.isArray(st.r)){f.topLeftRadius=st.r[0];f.topRightRadius=st.r[1];f.bottomRightRadius=st.r[2];f.bottomLeftRadius=st.r[3];}else f.cornerRadius=Math.min(st.r,Math.min(w,h)/2);}
  if(st.sh){const s=hex(st.sh[0]);f.effects=[{type:'DROP_SHADOW',color:{r:s.c.r,g:s.c.g,b:s.c.b,a:s.a},offset:{x:st.sh[1],y:st.sh[2]},radius:st.sh[3],spread:st.sh[4],visible:true,blendMode:'NORMAL'}];}
  f.clipsContent=!!st.clip;if(st.op)f.opacity=st.op;
  for(const c of n[7])build(C,c,f);return f;}
 if(k===1){const st=C.s[n[5]];const t=figma.createText();const fam=st.ff==='serif'?'Tinos':'Roboto';
  let style=st.w>=600?'Bold':(st.w>=500&&fam==='Roboto')?'Medium':'Regular';if(st.it)style=style==='Regular'?'Italic':(fam==='Tinos'&&style==='Bold'?'Bold Italic':style);if(fam==='Tinos'&&style==='Bold Italic')style='Bold';
  t.fontName={family:fam,style};t.fontSize=st.s;t.characters=st.up?n[6].toUpperCase():n[6];t.fills=[paint(st.c)];
  {const EM=/[\\u2016\\u2600-\\u27BF]\\uFE0F?|[\\u{1F300}-\\u{1FAFF}]\\uFE0F?/gu;let m;while((m=EM.exec(t.characters))){t.setRangeFontName(m.index,m.index+m[0].length,{family:/[\\u2713\\u2016]/.test(m[0])?'Noto Sans Symbols2':'Noto Color Emoji',style:'Regular'});}}
  if(st.st)t.textDecoration='STRIKETHROUGH';if(st.ul)t.textDecoration='UNDERLINE';
  parent.appendChild(t);
  if(st.wrap){if(st.lh)t.lineHeight={unit:'PIXELS',value:st.lh};t.textAutoResize='HEIGHT';t.resize(Math.max(w,4),t.height);t.x=x;t.y=y-(st.lh?(st.lh-st.s*1.17)/2:0);}
  else{t.textAutoResize='WIDTH_AND_HEIGHT';t.x=x;t.y=y+(h-t.height)/2;}
  t.name=n[6].slice(0,40);return t;}
 if(k===2){const s=figma.createNodeFromSvg(C.v[n[5]]);s.name='icon';parent.appendChild(s);s.x=x;s.y=y;if(Math.abs(s.width-w)>0.5||Math.abs(s.height-h)>0.5)s.resize(w,h);return s;}
 const e=n[6]?figma.createEllipse():figma.createRectangle();parent.appendChild(e);e.resize(w,h);e.x=x;e.y=y;if(!n[6])e.cornerRadius=3;
 e.fills=[paint(n[5]?'#ee0033':'#ffffff')];e.strokes=[paint(n[5]?'#ee0033':'#b0b3b8')];e.strokeWeight=1;e.name=n[5]?'checked':'unchecked';return e;
}
function raiseIcons(root){let k=0;for(const i of root.findAll(n=>n.name==='icon'&&n.parent&&n.parent.type==='FRAME')){i.parent.appendChild(i);k++;}return k;}
function recolor(node,h){const p=[paint(h)];for(const v of node.findAll(x=>x.type==='VECTOR'||x.type==='TEXT'||x.type==='ELLIPSE'||x.type==='RECTANGLE')){if(v.type==='TEXT'){v.fills=p;continue;}if(v.strokes&&v.strokes.length)v.strokes=p;if(v.fills&&v.fills.length&&v.type==='VECTOR')v.fills=p;}}
`;

function setup() {
  const secs = layout();
  const shell = load('shell-' + (() => { for (let i = 0; i < 9; i++) { try { const d = JSON.parse(readFileSync(join(cap, `shell-${i}.json`), 'utf8')); if (d.skey.startsWith('Việc của tôi')) return i; } catch { break; } } return 0; })() + '.json');
  return `${RUNTIME}
const D=${JSON.stringify(shell)};
const P=${JSON.stringify(PAGES)};
const want=[P.demo,P.khung,P.nhanh,P.comp];
const first=figma.root.children[0];
if(first.name==='Page 1'&&first.children.length===0)first.name='00 · Cover';
const pages={};
for(const name of want){pages[name]=figma.root.children.find(p=>p.name===name)||(()=>{const p=figma.createPage();p.name=name;return p;})();}
// Component Topbar + Sidebar trên page Components (page hiện tại = trang đầu, nên dựng ở đây rồi chuyển sang)
for(const old of first.findAll(n=>n.type==='COMPONENT'&&(n.name==='Shell/Topbar'||n.name==='Shell/Sidebar')))old.remove();
const top=figma.createComponent();top.name='Shell/Topbar';first.appendChild(top);top.resize(1440,60);top.fills=[];
build(D.topbar,D.topbar.t,top);
const side=figma.createComponent();side.name='Shell/Sidebar';first.appendChild(side);side.resize(256,D.sidebar.t[4]);side.fills=[];
build(D.sidebar,D.sidebar.t,side);
for(const t of side.findAll(n=>n.type==='TEXT'&&n.characters.startsWith('Prototype')))t.constraints={horizontal:'CENTER',vertical:'MAX'};
const inner=side.children[0];if(inner){inner.constraints={horizontal:'MIN',vertical:'STRETCH'};}
top.description='Topbar VHT (vht-topbar, fe/repo-khcn-core-fe). Override tên, vai trò, chữ tắt avatar và số thông báo theo persona.';
side.description='Sidebar ĐTMS 13 phân hệ (management-sidebar). Mục đang chọn: khung nav:<nhãn> nền #EE0033.';
pages[P.comp].appendChild(top);pages[P.comp].appendChild(side);top.x=0;top.y=0;side.x=0;side.y=120;
return {topbar:top.id,sidebar:side.id,pages:Object.fromEntries(Object.entries(pages).map(([k,v])=>[k,v.id])),sections:${JSON.stringify(secs.map((s) => ({ name: s.name, page: s.page, x: s.x, y: s.y, w: s.w, h: s.h, n: s.items.length })))}};`;
}

function sectionsCode(pageName) {
  const secs = layout().filter((s) => s.page === pageName);
  return `
const page=figma.root.children.find(p=>p.name===${JSON.stringify(pageName)});await figma.setCurrentPageAsync(page);
const S=${JSON.stringify(secs.map((s) => ({ name: s.name, x: s.x, y: s.y, w: s.w, h: s.h })))};
await figma.loadFontAsync({family:'Roboto',style:'Bold'});await figma.loadFontAsync({family:'Roboto',style:'Regular'});
const ids=[];
for(const s of S){let sec=page.children.find(n=>n.type==='SECTION'&&n.name===s.name);if(!sec){sec=figma.createSection();sec.name=s.name;page.appendChild(sec);}
 sec.x=s.x;sec.y=s.y;sec.resizeWithoutConstraints(s.w,s.h);ids.push(sec.id);
 let t=sec.children.find(n=>n.type==='TEXT'&&n.name==='Tiêu đề section');if(!t){t=figma.createText();t.name='Tiêu đề section';sec.appendChild(t);}
 t.fontName={family:'Roboto',style:'Bold'};t.fontSize=40;t.characters=s.name;t.x=120;t.y=40;}
return {sections:ids};`;
}

function screen(i, topId, sideId) {
  const secs = layout();
  const m = M[i - 1];
  const sec = secs.find((s) => s.items.includes(m));
  const d = load(m.file);
  const p = JSON.parse(readFileSync(join(cap, m.file), 'utf8')).meta;
  const init = p.p.short.replace('TGĐ ', '').slice(0, 2).toUpperCase();
  const active = p.active.replace(/\s+\d+$/, '').trim();
  return `${RUNTIME}
const D=${JSON.stringify(d)};
const page=figma.root.children.find(p=>p.name===${JSON.stringify(sec.page)});await figma.setCurrentPageAsync(page);
const sec=page.children.find(n=>n.type==='SECTION'&&n.name===${JSON.stringify(sec.name)});
const NAME=${JSON.stringify(m.id + ' · ' + m.title)};
for(const old of sec.children.filter(n=>n.name===NAME))old.remove();
const fr=figma.createFrame();fr.name=NAME;sec.appendChild(fr);fr.x=${m.fx};fr.y=${m.fy};fr.resize(1440,${m.h});fr.fills=[paint('#f5f5f5')];fr.clipsContent=true;
const top=(await figma.getNodeByIdAsync('${topId}')).createInstance();fr.appendChild(top);top.x=0;top.y=0;
const side=(await figma.getNodeByIdAsync('${sideId}')).createInstance();fr.appendChild(side);side.x=0;side.y=60;side.resize(256,${m.h - 60});
// Override persona trên topbar (bản gốc: Minh)
const TX={'Nguyễn Văn Minh':${JSON.stringify(p.p.name)},'Chuyên quản ĐVĐX':${JSON.stringify(p.p.role)},'MI':${JSON.stringify(init)}};
for(const t of top.findAll(n=>n.type==='TEXT'))if(TX[t.characters]!=null&&TX[t.characters]!==t.characters)t.characters=TX[t.characters];
const cnt=top.findOne(n=>n.name==='span.count');if(cnt){if(${p.bell}>0){const t=cnt.findOne(n=>n.type==='TEXT');t.characters='${p.bell}';}else cnt.visible=false;}
// Sidebar: mục đang chọn + số việc
const ACTIVE=${JSON.stringify(active)};
if(ACTIVE!=='Việc của tôi'){
 const v=side.findOne(n=>n.name==='nav:Việc của tôi');if(v){v.fills=[];recolor(v,'#0a0c11');const b=v.findOne(n=>n.name==='span.badge-n');if(b){b.fills=[paint('#ee0033')];recolor(b,'#ffffff');}}
 const a=side.findOne(n=>n.name==='nav:'+ACTIVE);if(a){a.fills=[paint('#ee0033')];recolor(a,'#ffffff');const g=side.findOne(n=>n.name==='nav:Đề xuất mua sắm');if(g&&['Danh sách ĐXMS','Yêu cầu báo giá','Cơ sở giá','Điều chỉnh ĐXMS'].includes(ACTIVE))recolor(g,'#ee0033');}
}
{const v=side.findOne(n=>n.name==='nav:Việc của tôi');const b=v&&v.findOne(n=>n.name==='span.badge-n');if(b){if(${p.bell}>0){b.findOne(n=>n.type==='TEXT').characters='${p.bell}';}else b.visible=false;}}
const main=build(D.main,D.main.t,fr,256,60);main.name='Nội dung';
${d.overlay ? "const ov=build(D.overlay,D.overlay.t,fr,0,0);ov.name='Hộp thoại';" : ''}
const links=fr.findAll(n=>n.name.startsWith('link→')).map(n=>({id:n.id,to:n.name.slice(5)}));
return {frame:fr.id,name:NAME,nodes:fr.findAll(()=>true).length,links};`;
}

/* Runtime dựng màn lưu trong file Figma (text node "__runtime" trên page Components), gọi bằng AsyncFunction.
   Tham số: figma, D (dữ liệu màn đã nén), CFG (page, section, tên, vị trí, persona, số việc, mục menu). */
const SCREEN_BODY = `${RUNTIME}
const page=figma.root.children.find(p=>p.name===CFG.page);await figma.setCurrentPageAsync(page);
const sec=page.children.find(n=>n.type==='SECTION'&&n.name===CFG.sec);
for(const old of sec.children.filter(n=>n.name===CFG.name))old.remove();
const fr=figma.createFrame();fr.name=CFG.name;sec.appendChild(fr);fr.x=CFG.x;fr.y=CFG.y;fr.resize(1440,CFG.h);fr.fills=[paint('#f5f5f5')];fr.clipsContent=true;
const top=(await figma.getNodeByIdAsync(CFG.top)).createInstance();fr.appendChild(top);top.x=0;top.y=0;
const side=(await figma.getNodeByIdAsync(CFG.side)).createInstance();fr.appendChild(side);side.x=0;side.y=60;side.resize(256,CFG.h-60);
const TX={'Nguyễn Văn Minh':CFG.pn,'Chuyên quản ĐVĐX':CFG.pr,'MI':CFG.pi};
for(const t of top.findAll(n=>n.type==='TEXT'))if(TX[t.characters]!=null&&TX[t.characters]!==t.characters)t.characters=TX[t.characters];
const cnt=top.findOne(n=>n.name==='span.count');if(cnt){if(CFG.bell>0){cnt.findOne(n=>n.type==='TEXT').characters=String(CFG.bell);}else cnt.visible=false;}
if(CFG.active!=='Việc của tôi'){
 const v=side.findOne(n=>n.name==='nav:Việc của tôi');if(v){v.fills=[];recolor(v,'#0a0c11');const b=v.findOne(n=>n.name==='span.badge-n');if(b){b.fills=[paint('#ee0033')];recolor(b,'#ffffff');}}
 const a=side.findOne(n=>n.name==='nav:'+CFG.active);if(a){a.fills=[paint('#ee0033')];recolor(a,'#ffffff');const g=side.findOne(n=>n.name==='nav:Đề xuất mua sắm');if(g&&['Danh sách ĐXMS','Yêu cầu báo giá','Cơ sở giá','Điều chỉnh ĐXMS'].includes(CFG.active))recolor(g,'#ee0033');}
}
{const v=side.findOne(n=>n.name==='nav:Việc của tôi');const b=v&&v.findOne(n=>n.name==='span.badge-n');if(b){if(CFG.bell>0)b.findOne(n=>n.type==='TEXT').characters=String(CFG.bell);else b.visible=false;}}
const main=build(D.main,D.main.t,fr,256,60);main.name='Nội dung';
if(D.overlay){const ov=build(D.overlay,D.overlay.t,fr,0,0);ov.name='Hộp thoại';}
raiseIcons(main);if(D.overlay)raiseIcons(fr.children[fr.children.length-1]);
const links=fr.findAll(n=>n.name.startsWith('link→')).map(n=>n.name.slice(5));
return {frame:fr.id,name:CFG.name,nodes:fr.findAll(()=>true).length,links};`;

function storeRuntime() {
  return `const pc=figma.root.children.find(p=>p.name===${JSON.stringify(PAGES.comp)});await figma.setCurrentPageAsync(pc);
await figma.loadFontAsync({family:'Roboto',style:'Regular'});
let t=pc.children.find(n=>n.type==='TEXT'&&n.name==='__runtime');if(!t){t=figma.createText();t.name='__runtime';pc.appendChild(t);}
t.fontName={family:'Roboto',style:'Regular'};t.fontSize=8;t.characters=${JSON.stringify(SCREEN_BODY)};t.x=0;t.y=1300;t.visible=false;t.locked=true;
return {runtime:t.id,len:t.characters.length};`;
}

function screenCall(i, topId, sideId, rtId) {
  const secs = layout();
  const m = M[i - 1];
  const sec = secs.find((s) => s.items.includes(m));
  const d = load(m.file);
  const p = JSON.parse(readFileSync(join(cap, m.file), 'utf8')).meta;
  const CFG = { page: sec.page, sec: sec.name, name: m.id + ' · ' + m.title, x: m.fx, y: m.fy, h: m.h, top: topId, side: sideId,
    pn: p.p.name, pr: p.p.role, pi: p.p.short.replace('TGĐ ', '').slice(0, 2).toUpperCase(), bell: p.bell, active: p.active.replace(/\s+\d+$/, '').trim() };
  return `const D=${JSON.stringify(d)};
const CFG=${JSON.stringify(CFG)};
const AF=Object.getPrototypeOf(async function(){}).constructor;
return await (new AF('figma','D','CFG',(await figma.getNodeByIdAsync('${rtId}')).characters))(figma,D,CFG);`;
}

function links() {
  const pages = [PAGES.demo, PAGES.khung, PAGES.nhanh];
  return pages.map((pg) => `
const page=figma.root.children.find(p=>p.name===${JSON.stringify(pg)});await figma.setCurrentPageAsync(page);
const frames=page.findAll(n=>n.type==='FRAME'&&n.parent&&n.parent.type==='SECTION');
const byId=(id)=>frames.find(f=>f.name.startsWith(id+' · '));
let ok=0;const miss=[];
for(const f of frames){for(const l of f.findAll(n=>n.name.startsWith('link→'))){const dst=byId(l.name.slice(5));if(!dst){miss.push(l.name);continue;}
 await l.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dst.id,navigation:'NAVIGATE',transition:{type:'DISSOLVE',easing:{type:'EASE_OUT'},duration:0.2},preserveScrollPosition:false,resetVideoPosition:false}]}]);ok++;}}
${pg === PAGES.demo ? "const start=byId('SCR-01-minh');if(start)page.flowStartingPoints=[{nodeId:start.id,name:'Demo MS01.01'}];" : ''}
${pg === PAGES.nhanh ? "const st2=byId('B-14-a');if(st2)page.flowStartingPoints=[{nodeId:st2.id,name:'Nhánh giải trình > 2 vòng'}];" : ''}
return {page:page.name,linked:ok,miss};`).join('\n/*----*/\n');
}

// Nhiều màn (cùng page) trong một lần gọi: node gen.mjs <cap> batch <từ> <đến> <topId> <sideId> <rtId>
function batch(from, to, topId, sideId, rtId) {
  const parts = [];
  for (let i = from; i <= to; i++) parts.push('{' + screenCall(i, topId, sideId, rtId).replace('return await', 'R.push(await').replace(/;\s*$/, ');') + '}');
  return 'const R=[];\n' + parts.join('\n') + '\nreturn R;';
}
// Đưa icon lên trên anh em cùng cha cho các màn đã dựng trên một page
function fixIcons(pageName) {
  return `const page=figma.root.children.find(p=>p.name===${JSON.stringify(pageName)});await figma.setCurrentPageAsync(page);
let k=0;for(const i of page.findAll(n=>n.name==='icon'&&n.parent&&n.parent.type==='FRAME'&&!n.parent.type.startsWith('COMP'))){try{i.parent.appendChild(i);k++;}catch(e){}}
return {page:page.name,raised:k};`;
}

// Xoá toàn bộ section (và frame bên trong) trên các page màn hình, để dựng lại từ đầu khi danh sách màn đổi.
function reset() {
  return `let n=0;for(const name of ${JSON.stringify([PAGES.demo, PAGES.khung, PAGES.nhanh])}){const page=figma.root.children.find(p=>p.name===name);if(!page)continue;await figma.setCurrentPageAsync(page);for(const s of page.children.filter(c=>c.type==='SECTION')){s.remove();n++;}}
return {removedSections:n};`;
}

if (cmd === 'reset') process.stdout.write(reset());
else if (cmd === 'batch') process.stdout.write(batch(Number(a1), Number(a2), a3, process.argv[7], process.argv[8]));
else if (cmd === 'fixicons') process.stdout.write(fixIcons(a1));
else if (cmd === 'setup') process.stdout.write(setup());
else if (cmd === 'sections') process.stdout.write(sectionsCode(a1));
else if (cmd === 'screen') process.stdout.write(screen(Number(a1), a2, a3));
else if (cmd === 'links') process.stdout.write(links());
else if (cmd === 'runtime') process.stdout.write(storeRuntime());
else if (cmd === 'call') process.stdout.write(screenCall(Number(a1), a2, a3, process.argv[7]));
else if (cmd === 'list') console.log(M.map((m, i) => `${i + 1}\t${m.id}\t${m.page}\t${m.h}`).join('\n'));
