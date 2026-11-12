/* Kho comment chung cho prototype ĐTMS (js/review.js) — Google Apps Script gắn với một Google Sheet.
   Cài: xem tools/review-sheet/README.md. Không cần đăng nhập phía người review (Deploy: Execute as Me, Who has access: Anyone).

   API (mọi phản hồi là JSON {ok, ...} hoặc {ok:false, error}):
     GET  ?op=list               → {comments, at}          tất cả comment (không kèm ảnh chụp dữ liệu)
     GET  ?op=snap&key=<k>       → {data}                  một ảnh chụp dữ liệu prototype
     GET  ?op=export             → tệp dtms-prototype-review đầy đủ (comments + snapshots) — như nút Xuất JSON
     POST body = JSON (Content-Type text/plain để trình duyệt không gửi preflight):
       {op:'add', comment, snapshot:{key, data}, base}   máy chủ cấp số ghim (no) để không trùng giữa nhiều người
       {op:'reply', id, reply:{author, at, text}}
       {op:'status', id, status, at}
       {op:'delete', id, author}                         chỉ người tạo xoá được
       {op:'import', comments, snapshots, base}          gộp theo id, cùng luật nút Nhập JSON
   Sheet "comments": các cột đọc được (để xem / lọc ngay trên Sheet) + cột json (bản đầy đủ — nguồn sự thật).
   Sheet "snapshots": key | n | phần 1 | phần 2 … (cắt 40.000 ký tự một ô, giới hạn ô của Sheet là 50.000). */

var COLS = ['id', 'no', 'status', 'type', 'author', 'createdAt', 'updatedAt', 'screen', 'title', 'label', 'text', 'replies', 'link', 'json'];
var CHUNK = 40000;

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.op === 'snap') return out({ ok: true, data: readSnap(p.key) });
    if (p.op === 'export') return out(exportAll());
    return out({ ok: true, comments: readAll().map(function (r) { return r.c; }), at: new Date().toISOString() });
  } catch (err) { return out({ ok: false, error: String(err && err.message || err) }); }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return out(handle(b));
  } catch (err) {
    return out({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) { /* bỏ qua */ }
  }
}

function handle(b) {
  var rows = readAll(), byId = {};
  rows.forEach(function (r) { byId[r.c.id] = r; });
  var maxNo = rows.reduce(function (m, r) { return Math.max(m, r.c.no || 0); }, 0);
  if (b.op === 'add') {
    var c = b.comment;
    if (!c || !c.id || !c.text) throw new Error('Thiếu comment.');
    if (b.snapshot && b.snapshot.key) writeSnap(b.snapshot.key, b.snapshot.data);
    if (byId[c.id]) return { ok: true, comment: byId[c.id].c, dup: true };
    c.no = maxNo + 1;
    if (b.base) c.link = b.base + '?rv=' + encodeURIComponent(c.id);
    append(c);
    return { ok: true, comment: c };
  }
  if (b.op === 'import') {
    Object.keys(b.snapshots || {}).forEach(function (k) { writeSnap(k, b.snapshots[k]); });
    var add = 0, upd = 0;
    (b.comments || []).forEach(function (c) {
      var old = byId[c.id];
      if (!old) {
        c = JSON.parse(JSON.stringify(c)); delete c._lost;
        c.no = ++maxNo;
        if (b.base) c.link = b.base + '?rv=' + encodeURIComponent(c.id);
        append(c); byId[c.id] = { c: c }; add++;
        return;
      }
      var o = old.c, seen = {};
      o.replies = o.replies || [];
      o.replies.forEach(function (r) { seen[r.at + '|' + r.text] = 1; });
      (c.replies || []).forEach(function (r) { if (!seen[r.at + '|' + r.text]) { o.replies.push(r); upd++; } });
      o.replies.sort(function (x, y) { return x.at < y.at ? -1 : 1; });
      if ((c.updatedAt || '') > (o.updatedAt || '')) { o.status = c.status; o.text = c.text; o.updatedAt = c.updatedAt; }
      if (old.row) write(old.row, o);
    });
    return { ok: true, add: add, upd: upd };
  }
  var r = byId[b.id];
  if (!r) return { ok: true, missing: true };   // comment đã bị xoá ở máy khác — coi như xong
  var cm = r.c;
  if (b.op === 'reply') {
    var x = b.reply || {};
    cm.replies = cm.replies || [];
    if (!cm.replies.some(function (y) { return y.at === x.at && y.text === x.text; })) cm.replies.push(x);
    cm.updatedAt = x.at || new Date().toISOString();
  } else if (b.op === 'status') {
    cm.status = b.status === 'resolved' ? 'resolved' : 'open';
    cm.updatedAt = b.at || new Date().toISOString();
  } else if (b.op === 'delete') {
    if (b.author !== cm.author) throw new Error('Chỉ người tạo comment mới xoá được.');
    sheet('comments').deleteRow(r.row);
    return { ok: true };
  } else {
    throw new Error('op không hợp lệ: ' + b.op);
  }
  write(r.row, cm);
  return { ok: true, comment: cm };
}

/* ---------- Sheet ---------- */
function sheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (name === 'comments') { sh.appendRow(COLS); sh.setFrozenRows(1); sh.getRange(1, 1, 1, COLS.length).setFontWeight('bold'); }
    else { sh.appendRow(['key', 'n', 'data']); sh.setFrozenRows(1); }
  }
  return sh;
}
function readAll() {
  var sh = sheet('comments'), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  var col = COLS.indexOf('json');
  return sh.getRange(2, 1, n, COLS.length).getValues().map(function (v, i) {
    try { return { row: i + 2, c: JSON.parse(v[col]) }; } catch (e) { return null; }
  }).filter(function (r) { return r && r.c && r.c.id; });
}
function rowOf(c) {
  var w = c.where || {}, t = c.target || {}, s = w.screen || {};
  var rep = (c.replies || []).map(function (r) { return r.author + ': ' + r.text; }).join('\n');
  var v = { id: c.id, no: c.no, status: c.status === 'resolved' ? 'Đã xử lý' : 'Chưa xử lý', type: c.type, author: c.author,
    createdAt: c.createdAt, updatedAt: c.updatedAt, screen: [s.scr, s.name].filter(String).join(' · '), title: w.title || '',
    label: t.label || '', text: c.text, replies: rep, link: c.link || '', json: JSON.stringify(c) };
  return COLS.map(function (k) { return v[k] == null ? '' : v[k]; });
}
function append(c) { sheet('comments').appendRow(rowOf(c)); }
function write(row, c) { sheet('comments').getRange(row, 1, 1, COLS.length).setValues([rowOf(c)]); }

function snapRow(key) {
  var sh = sheet('snapshots'), n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  var keys = sh.getRange(2, 1, n, 1).getValues();
  for (var i = 0; i < keys.length; i++) if (keys[i][0] === key) return i + 2;
  return 0;
}
function writeSnap(key, data) {
  if (!key || data == null || snapRow(key)) return;   // khoá là hash nội dung — đã có thì giống hệt
  var s = JSON.stringify(data), parts = [];
  for (var i = 0; i < s.length; i += CHUNK) parts.push(s.slice(i, i + CHUNK));
  sheet('snapshots').appendRow([key, parts.length].concat(parts));
}
function readSnap(key) {
  var row = snapRow(key);
  if (!row) return null;
  var sh = sheet('snapshots'), n = sh.getRange(row, 2).getValue();
  return JSON.parse(sh.getRange(row, 3, 1, n).getValues()[0].join(''));
}
function exportAll() {
  var comments = readAll().map(function (r) { return r.c; }), snaps = {};
  comments.forEach(function (c) { if (c.snapshot && !snaps[c.snapshot]) { var d = readSnap(c.snapshot); if (d) snaps[c.snapshot] = d; } });
  return { ok: true, format: 'dtms-prototype-review', version: 1, prototype: { build: 'shared' }, reviewer: 'shared',
    exportedAt: new Date().toISOString(), comments: comments, snapshots: snaps };
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
