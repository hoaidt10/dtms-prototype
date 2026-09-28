// Dựng từng trạng thái demo, serialize DOM để xuất Figma. Chạy: node prototype/dtms/tools/capture.mjs <thư-mục-ra>
// Ra: <out>/NN-<id>.json cho mỗi màn, shell-*.json (topbar, sidebar), manifest.json (trang Figma, thứ tự, liên kết).
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, sleep } from './cdp.mjs';

const out = process.argv[2] || 'figma-capture';
mkdirSync(out, { recursive: true });
const SER = readFileSync(new URL('./serialize.js', import.meta.url), 'utf8');
const b = await launch({ width: 1440, height: 900 });
const { ev, open, send } = b;

// ?capture=1: ẩn nút (i), nút công cụ demo, toast — Figma sạch như app thật (rule C4).
await open('?capture=1#/viec-cua-toi');
await ev(`localStorage.clear()`);
await open('?capture=1#/viec-cua-toi');
await ev(SER);
await ev(`document.body.classList.add('cap')`);

// Các bước thao tác trong trang
const J = {
  scene: (n) => `Flow.jumpToScene(${n})`,
  jump: (task, who, vars, proc) => `Flow.jumpTo(${JSON.stringify(task)}, '${who}', ${JSON.stringify(vars || {})}${proc ? `, '${proc}'` : ''})`,
  ui: (k, v) => `Flow.setUi('${k}', ${JSON.stringify(v)})`,
  choose: (task, label) => `(() => { const t = Flow.state.tokens.find((k) => k.task === ${task}); const c = D.flow[${task}].choices.find((x) => x.label.startsWith(${JSON.stringify(label)})); Flow.complete(t.id, c, 'Nội dung thử'); })()`,
  done: (task) => `Flow.complete(Flow.state.tokens.find((k) => k.task === ${task}).id, null)`,
  /* Chạy tiếp theo nhánh chính (không qua validate) cho tới khi có token ở `task`. */
  until: (task) => `(() => { let g = 0; while (!Flow.state.tokens.some((k) => k.task === ${task}) && g++ < 300) { const t = Flow.state.tokens[0]; Flow.complete(t.id, Flow.mainChoice(t.task), 'Nội dung thử'); } })()`,
  task: (task, cqcm) => `location.hash = '#/task/' + Flow.state.tokens.find((k) => k.task === ${JSON.stringify(task)}${cqcm ? ` && k.cqcm === '${cqcm}'` : ''}).id`,
  persona: (p) => `Flow.setPersona('${p}')`,
  hash: (h) => `location.hash = '${h}'`,
};

/* page: trang Figma; link: tên màn kế tiếp khi bấm nút chính (hoặc dòng đầu của danh sách).
   Số task theo BPMN chuẩn ĐTMS.drawio / MS01 v1.1 (61 task). */
const S = [];
const add = (page, id, title, steps, extra) => S.push(Object.assign({ page, id, title, steps }, extra || {}));

// Prototype link của Figma chỉ nối trong cùng page → cả kịch bản 9 cảnh nằm trên một page, chia section.
const P0 = 'Khung & màn khác', P1 = 'Cảnh 1–3 · Khởi tạo → Gửi CQCM', P2 = 'Cảnh 4–6 · Góp ý CQCM → BM-05', P3 = 'Cảnh 7–9 · Tập đoàn → Phê duyệt → Tổng kết', P4 = 'Nhánh phụ';

add(P0, 'SCR-00', 'Chọn vai demo', [J.jump(1, 'minh'), J.hash('#/chon-vai')]);
add(P0, 'SCR-02', 'Danh sách hồ sơ ĐXMS', [J.jump(1, 'minh'), J.hash('#/ho-so-dxms')]);
add(P0, 'SCR-29', 'Chi tiết ĐXMS — hồ sơ Phê duyệt + Điều chỉnh', [J.jump(1, 'minh'), J.hash('#/dxms/%C4%90XMS-2026-0077')], { link: 'SCR-20-e', linkSel: '[data-dxms-profiles] a.link' });
add(P0, 'SCR-20-e', 'Chi tiết hồ sơ Điều chỉnh (MS02)', [J.jump(1, 'minh'), J.hash('#/ho-so-dxms/HS-2026-0126')]);
add(P0, 'SCR-25-dc', 'Thêm mới hồ sơ — loại Điều chỉnh', [J.jump(1, 'minh'), J.hash('#/ho-so-dxms/create/%C4%90XMS-2026-0103')]);
add(P0, 'tong-quan', 'Tổng quan', [J.scene(4), J.hash('#/tong-quan')]);
add(P0, 'phan-he', 'Trang phân hệ chưa dựng — Gói thầu', [J.jump(1, 'minh'), J.hash('#/ph/goi-thau')]);
add(P0, 'cho-chot', 'Điểm chưa chốt ❓', [J.jump(1, 'minh'), J.hash('#/cho-chot')]);

// Cảnh 1 (D-10, D-11): tạo ĐXMS → Chỉnh sửa ĐXMS › Tạo hồ sơ → Thêm mới hồ sơ (ĐXMS khoá, loại Phê duyệt chọn sẵn) → task 01.
const DX0 = `Flow.createDxms({ title: D.caseInfo.title, unit: D.caseInfo.unit, priority: D.caseInfo.priority, est: 183, period: D.caseInfo.period, secret: false, purpose: 'Trang bị thiết bị đo kiểm RF và OTA phục vụ phát triển trạm gNodeB thế hệ 2.' })`;
add(P1, 'SCR-01-minh', 'Việc của tôi — Minh (chưa có hồ sơ)', [J.scene(1), J.hash('#/viec-cua-toi')], { link: 'SCR-27-minh', linkSel: '.sb-nav [data-go="dxms"]' });
add(P1, 'SCR-27-minh', 'Danh sách ĐXMS — Minh', [J.scene(1), J.hash('#/dxms')], { link: 'SCR-28', linkSel: '[data-create="dxms"]' });
add(P1, 'SCR-28', 'Thêm mới ĐXMS', [J.scene(1), J.hash('#/dxms/create'), `document.querySelector('#x-title').value = D.caseInfo.title`, `document.querySelector('#x-est').value = '183'`], { link: 'SCR-28-edit', linkSel: '#x-save' });
add(P1, 'SCR-28-edit', 'Chỉnh sửa ĐXMS — Danh sách hồ sơ trống, Tạo hồ sơ', [J.scene(1), DX0, J.hash('#/dxms/%C4%90XMS-2026-0117/edit')], { link: 'SCR-25', linkSel: '[data-dxms-profiles] .vcard-h .vbtn' });
add(P1, 'SCR-25', 'Thêm mới hồ sơ — ĐXMS khoá, loại Phê duyệt', [J.scene(1), DX0, J.hash('#/ho-so-dxms/create/%C4%90XMS-2026-0117')], { link: 'SCR-03', linkSel: '#c-save' });
add(P1, 'SCR-03', 'Chọn căn cứ · T01 · lọc theo quy trình', [J.jump(1, 'minh'), J.task(1)], { link: 'SCR-04-a' });
add(P1, 'SCR-04-a', 'Thông tin cơ bản · T04 · AI gợi ý', [J.jump(4, 'minh'), J.task(4)], { link: 'SCR-04-b', linkSel: '[data-ai-all]' });
add(P1, 'SCR-04-b', 'Thông tin cơ bản · T04 · đã nhận gợi ý', [J.jump(4, 'minh'), J.ui('ai', { purposeText: 'accepted', scope: 'accepted', value: 'accepted', fund: 'accepted', period: 'accepted' }), J.task(4)], { link: 'SCR-05' });
add(P1, 'SCR-05', 'Bóc tách danh mục · T05', [J.jump(5, 'minh'), J.task(5)], { link: 'SCR-06' });
add(P1, 'SCR-06', 'Kết quả rà soát tồn kho · T07', [J.jump(7, 'minh'), J.task(7)], { link: 'SCR-07-a' });
add(P1, 'SCR-07-a', 'Tạo YCBG · T08', [J.jump(8, 'minh'), J.task(8)], { link: 'SCR-07-b' });
add(P1, 'SCR-07-b', 'Báo giá · T10 · lần 1 Không đạt', [J.jump(10, 'minh'), J.task(10)], { link: 'SCR-07-c', linkLabel: 'Không đạt' });
add(P1, 'SCR-07-c', 'Báo giá · T10 · lần 2 Đạt', [J.jump(10, 'minh'), J.choose(10, 'Không đạt'), J.task(10)], { link: 'SCR-08-a' });
add(P1, 'SCR-08-a', 'Soạn hồ sơ · T12 · AI Fail', [J.jump(12, 'minh'), J.ui('aiFail', true), J.task(12)], { link: 'SCR-08-b', linkSel: '[data-ui="necessity"]' });
add(P1, 'SCR-08-b', 'Soạn hồ sơ · T12 · đã bổ sung', [J.jump(12, 'minh'), J.ui('necessity', true), J.task(12)], { link: 'SCR-09' });
add(P1, 'SCR-09', 'Chỉ huy duyệt dự thảo · T13', [J.jump(13, 'hai'), J.task(13)], { link: 'SCR-10' });
add(P1, 'SCR-10', 'Phiếu yêu cầu thẩm định & chọn CQCM · T16', [J.jump(16, 'minh'), J.ui('bm03File', true), J.task(16)], { link: 'SCR-22' });
add(P1, 'SCR-22', 'TTMS xác nhận danh sách CQCM · T17', [J.jump(17, 'lan'), J.ui('bm03File', true), J.task(17)], { link: 'SCR-21' });
add(P1, 'SCR-21', 'Hộp thoại trình ký BM-03', [J.jump(17, 'lan'), J.ui('bm03File', true), J.task(17), `document.querySelector('.task-acts [data-act].primary').click()`], { overlay: true, link: 'SCR-11-a', linkSel: '.overlay #go' });

add(P2, 'SCR-11-a', 'Phiếu nhận xét BM-04 · T19 · Pháp chế', [J.jump(19, 'hoa'), J.task(19, 'PC')], { link: 'SCR-11-b' });
add(P2, 'SCR-11-b', 'Chỉ huy CQCM ký BM-04 · T20', [J.jump(20, 'tung'), J.task(20, 'PC')], { link: 'SCR-12-a' });
add(P2, 'SCR-12-a', 'Tổng hợp ý kiến · T26 · lần 1', [J.jump(26, 'minh'), J.task(26)], { link: 'SCR-13-a' });
add(P2, 'SCR-13-a', 'Lập giải trình · T28', [J.jump(28, 'minh'), J.task(28)], { link: 'SCR-11-c' });
add(P2, 'SCR-11-c', 'BM-04 lần 02 sau giải trình · T19 · Tài chính', [J.jump(28, 'minh'), J.until(19), J.persona('thu'), J.task(19, 'TC')], { link: 'SCR-12-b' });
add(P2, 'SCR-12-b', 'Tổng hợp ý kiến · T26 · lần 2', [J.jump(28, 'minh'), J.until(26), J.persona('minh'), J.task(26)], { link: 'SCR-13-b' });
add(P2, 'SCR-13-b', 'Hoàn chỉnh hồ sơ · T27', [J.jump(27, 'minh'), J.task(27)], { link: 'SCR-15-a' });
add(P2, 'SCR-15-a', 'CQCM kiểm tra lại · T35', [J.jump(35, 'hoa'), J.task(35, 'PC')], { link: 'SCR-15-b' });
add(P2, 'SCR-15-b', 'Ký BM-04 & Checklist 01 · T36', [J.jump(36, 'hoa'), J.task(36, 'PC')], { link: 'SCR-16-a' });
add(P2, 'SCR-16-a', 'TTMS rà soát BM-05 · T42', [J.jump(42, 'lan'), J.task(42)], { link: 'SCR-16-b' });
add(P2, 'SCR-16-b', 'TTMS xác nhận & ký BM-05 · T43', [J.jump(43, 'lan'), J.task(43)], { link: 'SCR-17-a' });
add(P2, 'SCR-17-a', 'CQCM ký BM-05 · T46', [J.jump(46, 'hoa'), J.task(46, 'PC')], { link: 'SCR-17-b' });
add(P2, 'SCR-17-b', 'Phó TGĐ ký BM-05 · T47', [J.jump(47, 'binh'), J.task(47)], { link: 'SCR-16-c' });
add(P2, 'SCR-16-c', 'TTMS xác định báo cáo Tập đoàn · T48', [J.jump(48, 'lan'), J.task(48)], { link: 'SCR-18-a' });

add(P3, 'SCR-18-a', 'Rà soát BM-06 · T50', [J.jump(50, 'lan'), J.task(50)], { link: 'SCR-18-b' });
add(P3, 'SCR-18-b', 'Thủ trưởng VHT xác nhận BM-06 · T51', [J.jump(51, 'tgd'), J.ui('bm06File', true), J.task(51)], { link: 'SCR-18-d' });
add(P3, 'SCR-18-d', 'TGĐ Tập đoàn cho ý kiến (giả lập) · T56', [J.jump(56, 'td'), J.task(56)], { link: 'SCR-19-a' });
add(P3, 'SCR-19-a', 'Rà soát dự thảo BM-08 · T58', [J.jump(58, 'lan'), J.task(58)], { link: 'SCR-19-b' });
add(P3, 'SCR-19-b', 'Thủ trưởng VHT phê duyệt · T60', [J.jump(60, 'tgd'), J.task(60)], { link: 'SCR-20-a' });
add(P3, 'SCR-20-a', 'Chi tiết hồ sơ (đã phê duyệt)', [J.scene(9), J.hash('#/ho-so')], { link: 'SCR-20-b', linkLabel: 'Xem BPMN' });
add(P3, 'SCR-20-b', 'Chi tiết BPMN (đã phê duyệt)', [J.scene(9), J.hash('#/ho-so/bpmn')], { link: 'SCR-20-a', linkLabel: 'Xem quy trình' });
add(P3, 'SCR-20-c', 'Chi tiết hồ sơ (đang xử lý · T26)', [J.jump(26, 'minh'), J.hash('#/ho-so')], { link: 'SCR-20-d', linkLabel: 'Xem BPMN' });
add(P3, 'SCR-20-d', 'Chi tiết BPMN (đang xử lý · T26)', [J.jump(26, 'minh'), J.hash('#/ho-so/bpmn')], { link: 'SCR-20-c', linkLabel: 'Xem quy trình' });

add(P4, 'B-3e-a', 'Chọn nhầm MS01.03 · T04 cảnh báo mềm', [J.jump(4, 'minh', {}, 'MS01.03'), J.task(4)], { link: 'B-3e-b' });
add(P4, 'B-3e-b', 'Không khớp quy trình · T10a (SCR-26)', [J.jump('10a', 'minh', {}, 'MS01.03'), J.task('10a')], { link: 'B-3e-c', linkLabel: 'Chuyển quy trình' });
add(P4, 'B-3e-c', 'Đã chuyển quy trình · hồ sơ cũ (T10b → End)', [J.jump('10a', 'minh', {}, 'MS01.03'), J.choose("'10a'", 'Chuyển'), J.hash('#/ho-so')], { link: 'B-3e-d', linkSel: '[data-open-new]' });
add(P4, 'B-3e-d', 'Hồ sơ mới HS-2026-0125 (cùng ĐXMS) · T01 · dữ liệu sao chép', [J.jump('10a', 'minh', {}, 'MS01.03'), J.choose("'10a'", 'Chuyển'), `Flow.openReplacement()`, J.task(1)]);
add(P4, 'B-09', 'Chỉ huy không đồng ý · T13 → AI lọc (T14) → T12', [J.jump(13, 'hai'), J.choose(13, 'Không đồng ý'), J.persona('minh'), J.ui('necessity', true), J.task(12)]);
add(P4, 'B-22', 'TTMS trả lại danh sách CQCM · T17 → T16', [J.jump(17, 'lan'), J.choose(17, 'Chưa'), J.persona('minh'), J.ui('bm03File', true), J.task(16)]);
add(P4, 'B-14-a', 'Giải trình vòng 3/2 · T28', [J.jump(28, 'minh', { round: 2 }), J.task(28)], { link: 'B-14-b' });
add(P4, 'B-14-b', 'Cảnh báo & tổ chức họp · T30–31', [J.jump(28, 'minh', { round: 2 }), J.done(28), J.persona('lan'), J.task(31)], { link: 'B-14-c' });
add(P4, 'B-14-c', 'Cập nhật kết quả cuộc họp · T32', [J.jump(28, 'minh', { round: 2 }), J.done(28), J.done(31), J.persona('lan'), J.ui('minutesFile', true), J.task(32)]);

// Danh mục dùng chung (T8): vai Quản trị hệ thống; dữ liệu mẫu của danh mục (localStorage đã xoá ở đầu).
const P5 = 'Danh mục dùng chung';
const dm = (key) => [J.jump(1, 'minh'), J.persona('qt'), J.hash('#/dmdc' + (key ? '/' + key : ''))];
const click = (sel) => `document.querySelector(${JSON.stringify(sel)}).click()`;
add(P5, 'SCR-30', 'Tổng quan Danh mục dùng chung', dm(), { link: 'SCR-31', linkSel: '.ov-tile[href="#/dmdc/nha-cung-cap"]' });
add(P5, 'SCR-31', 'Danh sách nhà cung cấp', dm('nha-cung-cap'), { link: 'SCR-31-new', linkSel: '[data-cat-new]' });
add(P5, 'SCR-31-new', 'Thêm mới nhà cung cấp (hộp thoại lg)', [...dm('nha-cung-cap'), click('[data-cat-new]')], { overlay: true });
add(P5, 'SCR-31-imp', 'Nhập từ Excel — kết quả kiểm tra', [...dm('nha-cung-cap'), click('[data-cat-import]'), click('[data-imp-zone]'), click('#imp-go')], { overlay: true });
add(P5, 'SCR-32', 'Danh sách nguồn vốn', dm('nguon-von'), { link: 'SCR-32-new', linkSel: '[data-cat-new]' });
add(P5, 'SCR-32-new', 'Thêm mới nguồn vốn (hộp thoại 520)', [...dm('nguon-von'), click('[data-cat-new]')], { overlay: true });
add(P5, 'SCR-32-off', 'Xác nhận dừng hoạt động', [...dm('nguon-von'), click('[data-cat-tg]')], { overlay: true });
[['SCR-33', 'linh-vuc', 'lĩnh vực đầu tư'], ['SCR-34', 'loai-kdt', 'loại khoản đầu tư'], ['SCR-35', 'tinh-chat-tai-san', 'tính chất tài sản'],
  ['SCR-36', 'loai-hang-hoa', 'loại hàng hoá, dịch vụ'], ['SCR-37', 'hinh-thuc-lcnt', 'hình thức lựa chọn nhà thầu'],
  ['SCR-38', 'phuong-thuc-lcnt', 'phương thức lựa chọn nhà thầu'], ['SCR-39', 'loai-hop-dong', 'loại hợp đồng']]
  .forEach(([id, key, name]) => add(P5, id, 'Danh sách ' + name, dm(key)));
add(P5, 'SCR-40', 'Danh sách ngưỡng phân luồng', dm('nguong-phan-luong'), { link: 'SCR-40-edit', linkSel: '[data-cat-edit]' });
add(P5, 'SCR-40-edit', 'Chỉnh sửa ngưỡng phân luồng', [...dm('nguong-phan-luong'), click('[data-cat-edit]')], { overlay: true });

// Quản trị quy trình (T9): vai Quản trị hệ thống; hồ sơ đang chạy ở task 26 để Giám sát tiến trình có dòng Đang chạy.
const P6 = 'Quản trị quy trình';
const qt = (h) => [J.jump(26, 'minh'), 'MaTran.reset()', J.persona('qt'), J.hash(h)];
const V2 = '2251799813690112';
add(P6, 'SCR-48', 'Giám sát tiến trình', qt('#/giam-sat-tien-trinh'));
add(P6, 'SCR-41', 'Danh sách quy trình (mở MS01.01)', [...qt('#/quy-trinh'), click('[data-vtt-key="DTMS_MS01_01"]')], { link: 'SCR-42', linkSel: '.vtt tbody tr.child a.link' });
add(P6, 'SCR-42', 'Chi tiết quy trình MS01 v1.1', qt('#/quy-trinh/' + V2), { link: 'SCR-41', linkSel: '.pg-head .vbtn.back' });
add(P6, 'SCR-42-el', 'Chi tiết quy trình — chọn phần tử (task 11)', [...qt('#/quy-trinh/' + V2),
  `document.dispatchEvent(new CustomEvent('bpmn-element', { detail: { key: 'wf/${V2}', page: 'MS01 v1.1', id: 'Activity_11' } }))`]);
add(P6, 'SCR-43', 'Ma trận hành động — Luật hiển thị hành động', qt('#/ma-tran/display-rule'), { link: 'SCR-44-new', linkSel: 'main .pg-head .r .vbtn.primary' });
add(P6, 'SCR-44-new', 'Thêm mới luật hiển thị hành động', qt('#/ma-tran/display-rule/create'), { link: 'SCR-43', linkSel: '.pg-head .vbtn.back' });
add(P6, 'SCR-44-view', 'Xem chi tiết luật hiển thị hành động', [...qt('#/ma-tran/display-rule'), `location.hash = '#/ma-tran/display-rule/' + MaTran.rules()[0].id + '/view'`], { link: 'SCR-43', linkSel: '.pg-head .vbtn.back' });
add(P6, 'SCR-45', 'Ma trận hành động — Đối soát BPMN', qt('#/ma-tran/bpmn-reconcile'), { link: 'SCR-45-sync', linkSel: '[data-mt="sync"]' });
add(P6, 'SCR-45-sync', 'Xác nhận đồng bộ luật từ BPMN', [...qt('#/ma-tran/bpmn-reconcile'), click('[data-mt="sync"]')], { overlay: true });
add(P6, 'SCR-46', 'Ma trận hành động — Danh mục hành động', qt('#/ma-tran/action-catalog'), { link: 'SCR-47', linkSel: 'main table tbody a.link' });
add(P6, 'SCR-47', 'Xem chi tiết hành động GUI_DUYET', qt('#/ma-tran/action-catalog/GUI_DUYET'), { link: 'SCR-42', linkSel: 'main table tbody a.link' });

const manifest = [];
for (let i = 0; i < S.length; i++) {
  const s = S[i];
  for (const st of s.steps) { await ev(st); await sleep(40); }
  await sleep(250);
  await ev(`document.querySelectorAll('.toast-wrap').forEach((t) => t.remove())`);
  // Cao theo nội dung; rộng cố định 1440.
  const h = await ev(`Math.max(900, document.querySelector('.main').scrollHeight + 60)`);
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: h, deviceScaleFactor: 1, mobile: false });
  await sleep(150);
  // Mục menu thành khung riêng để instance sidebar đổi được mục đang chọn
  await ev(`document.querySelectorAll('.nav').forEach((n) => { n.dataset.figName = 'nav:' + n.querySelector('.l').textContent.trim(); })`);
  // Đánh dấu điểm bấm để nối prototype
  if (s.link) {
    await ev(`(() => {
      let el = ${s.linkSel ? `document.querySelector(${JSON.stringify(s.linkSel)})` : s.linkLabel ? `[...document.querySelectorAll('.task-acts [data-act], .tab, .vbtn, .btn')].find((x) => x.textContent.includes(${JSON.stringify(s.linkLabel)}))` : `document.querySelector('.task-acts [data-act].primary') || document.querySelector('tr.click')`};
      if (el) { el.dataset.figName = 'link→${s.link}'; el.dataset.figLink = '${s.link}'; }
    })()`);
  }
  const main = JSON.parse(await ev(`JSON.stringify(__serialize('.main'))`));
  const overlay = s.overlay ? JSON.parse(await ev(`JSON.stringify(__serialize('.overlay'))`)) : null;
  const meta = JSON.parse(await ev(`JSON.stringify({ persona: Flow.state.persona, bell: Flow.tokensFor(Flow.state.persona).length, active: (document.querySelector('.nav.active') || {}).textContent?.trim() || '', openGroups: [...document.querySelectorAll('.nav.open')].map((n) => n.textContent.trim()) })`));
  const P = await ev(`JSON.stringify(UI.persona(Flow.state.persona))`);
  const file = `${String(i + 1).padStart(2, '0')}-${s.id}.json`;
  const data = { id: s.id, title: s.title, page: s.page, link: s.link || null, h, meta: Object.assign(meta, { p: JSON.parse(P) }), main, overlay };
  writeFileSync(join(out, file), JSON.stringify(data));
  // Shell: chụp một lần cho mỗi trạng thái sidebar khác nhau
  const skey = `${meta.active}|${meta.openGroups.join(',')}`;
  if (!manifest.some((m) => m.skey === skey)) {
    const shell = { topbar: JSON.parse(await ev(`JSON.stringify(__serialize('.topbar'))`)), sidebar: JSON.parse(await ev(`JSON.stringify(__serialize('.sidebar'))`)) };
    writeFileSync(join(out, `shell-${manifest.filter((m, j, a) => a.findIndex((x) => x.skey === m.skey) === j).length}.json`), JSON.stringify(Object.assign({ skey }, shell)));
  }
  manifest.push({ file, id: s.id, title: s.title, page: s.page, link: s.link || null, h, skey, persona: meta.persona, bell: meta.bell, bytes: JSON.stringify(data).length });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await ev(`document.querySelectorAll('.overlay').forEach((o) => o.remove())`);
}
writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log(manifest.map((m) => `${m.file.padEnd(28)} ${String(m.bytes).padStart(6)}B h=${m.h} ${m.skey}`).join('\n'), '\nerrors', b.errors);
b.close();
process.exit(0);
