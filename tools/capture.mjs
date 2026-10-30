// Dựng từng trạng thái demo, serialize DOM để xuất Figma. Chạy: node prototype/dtms/tools/capture.mjs <thư-mục-ra> ["<trang Figma>"]
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
  /* Tờ trình đã có "Sự cần thiết" (chọn Chấp nhận gợi ý AI trong eForm task 11/12). */
  need: () => `Flow.setUiMany({ necessity: D.caseRef.doc.necessity, aiSuCanThiet: [{ key: 'suCanThiet', quyetDinh: 'Chấp nhận', noiDungSua: '' }] })`,
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
add(P0, 'phan-he', 'Trang phân hệ chưa dựng — Giám sát hoạt động thầu', [J.jump(1, 'minh'), J.hash('#/ph/giam-sat-thau')]);
add(P0, 'cho-chot', 'Điểm chưa chốt ❓', [J.jump(1, 'minh'), J.hash('#/cho-chot')]);

// Cảnh 1 (D-10, D-11): tạo ĐXMS → Chỉnh sửa ĐXMS › Tạo hồ sơ → Thêm mới hồ sơ (ĐXMS khoá, loại Phê duyệt chọn sẵn) → task 01.
const DX0 = `Flow.createDxms({ title: D.caseInfo.title, nv: 'NV-KHCN-2026-014', unit: D.caseInfo.unit, priority: D.caseInfo.priority, est: 183, period: D.caseInfo.period, secret: false, purpose: 'Trang bị thiết bị đo kiểm RF và OTA phục vụ phát triển trạm gNodeB thế hệ 2.' })`;
add(P1, 'SCR-01-minh', 'Việc của tôi — Minh (chưa có hồ sơ)', [J.scene(1), J.hash('#/viec-cua-toi')], { link: 'SCR-27-minh', linkSel: '.sb-nav [data-go="dxms"]' });
add(P1, 'SCR-27-minh', 'Danh sách ĐXMS — Minh', [J.scene(1), J.hash('#/dxms')], { link: 'SCR-28', linkSel: '[data-create="dxms"]' });
add(P1, 'SCR-28', 'Thêm mới ĐXMS', [J.scene(1), J.hash('#/dxms/create'), `document.querySelector('#x-title').value = D.caseInfo.title`, `document.querySelector('#x-est').value = '183'`], { link: 'SCR-28-edit', linkSel: '#x-save' });
add(P1, 'SCR-28-mat', 'Thêm mới ĐXMS — Mật: AI kiểm tra quy tắc bảo mật (comment #1, #12)', [J.scene(1), J.hash('#/dxms/create'), `document.querySelector('#x-title').value = 'Mua sắm anten mảng pha băng Ka'; document.querySelector('#x-title').dispatchEvent(new Event('input', { bubbles: true }))`,
  `document.querySelector('[data-vsel="x-nv"]').click(); document.querySelector('.vsel-panel [data-opt="NV-KHCN-2026-006"]').click()`, `document.querySelector('[data-vsel="x-sec"]').click(); document.querySelector('.vsel-panel [data-opt="Có"]').click()`]);
add(P1, 'SCR-28-edit', 'Chỉnh sửa ĐXMS — Danh sách hồ sơ trống, Tạo hồ sơ', [J.scene(1), DX0, J.hash('#/dxms/%C4%90XMS-2026-0117/edit')], { link: 'SCR-25', linkSel: '[data-dxms-profiles] .vcard-h .vbtn' });
add(P1, 'SCR-25', 'Thêm mới hồ sơ — ĐXMS khoá, loại Phê duyệt', [J.scene(1), DX0, J.hash('#/ho-so-dxms/create/%C4%90XMS-2026-0117')], { link: 'SCR-03', linkSel: '#c-save' });
add(P1, 'SCR-03', 'Chọn căn cứ · T01 · lọc theo quy trình', [J.jump(1, 'minh'), J.task(1)], { link: 'SCR-04-a' });
add(P1, 'SCR-04-a', 'Thông tin cơ bản · T04 · AI gợi ý (Chấp nhận / Sửa / Bỏ)', [J.jump(4, 'minh'), J.task(4)], { link: 'SCR-05' });
add(P1, 'SCR-05', 'Bóc tách danh mục · T05', [J.jump(5, 'minh'), J.task(5)], { link: 'SCR-06' });
add(P1, 'SCR-06', 'Kết quả rà soát tồn kho · T07', [J.jump(7, 'minh'), J.task(7)], { link: 'SCR-07-a' });
add(P1, 'SCR-07-a', 'Tạo YCBG · T08', [J.jump(8, 'minh'), J.task(8)], { link: 'SCR-07-b' });
add(P1, 'SCR-07-b', 'Báo giá · T10 · lần 1 Không đạt', [J.jump(10, 'minh'), J.task(10)], { link: 'SCR-07-c', linkLabel: 'Không đạt' });
add(P1, 'SCR-07-c', 'Báo giá · T10 · lần 2 Đạt', [J.jump(10, 'minh'), J.choose(10, 'Không đạt'), J.task(10)], { link: 'SCR-08-a' });
add(P1, 'SCR-08-a', 'Soạn hồ sơ · T12 · AI kiểm tra Không đạt (DX-01)', [J.jump(12, 'minh'), J.ui('aiCheck', { ketQua: 'Không đạt', lyDo: 'BM-01 thiếu mục bắt buộc “Sự cần thiết” (QT 10.2.1, BM-01 mục 1).' }), J.task(12)], { link: 'SCR-08-b' });
add(P1, 'SCR-08-b', 'Soạn hồ sơ · T12 · đã bổ sung', [J.jump(12, 'minh'), J.need(), J.task(12)], { link: 'SCR-09' });
add(P1, 'SCR-09', 'Chỉ huy duyệt dự thảo · T13', [J.jump(13, 'hai'), J.task(13)], { link: 'SCR-10' });
add(P1, 'SCR-10', 'Phiếu yêu cầu thẩm định & chọn CQCM · T16', [J.jump(16, 'minh'), J.ui('bm03File', true), J.task(16)], { link: 'SCR-22' });
add(P1, 'SCR-22', 'TTMS xác nhận danh sách CQCM · T17', [J.jump(17, 'lan'), J.ui('bm03File', true), J.task(17)], { link: 'SCR-21' });
add(P1, 'SCR-21', 'Hộp thoại trình ký BM-03', [J.jump(17, 'lan'), J.ui('bm03File', true), J.task(17), `document.querySelector('.task-acts [data-act].primary').click()`, `document.querySelector('.overlay #ok').click()`], { overlay: true, link: 'SCR-11-a', linkSel: '.overlay #go' });

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
add(P4, 'B-09', 'Chỉ huy không đồng ý · T13 → AI lọc (T14) → T12', [J.jump(13, 'hai'), J.choose(13, 'Không đồng ý'), J.persona('minh'), J.need(), J.task(12)]);
add(P4, 'B-22', 'TTMS trả lại danh sách CQCM · T17 → T16', [J.jump(17, 'lan'), J.choose(17, 'Chưa'), J.persona('minh'), J.ui('bm03File', true), J.task(16)]);
add(P4, 'B-14-a', 'Giải trình vòng 3/2 · T28', [J.jump(28, 'minh', { round: 2 }), J.task(28)], { link: 'B-14-b' });
add(P4, 'B-14-b', 'Cảnh báo & tổ chức họp · T30–31', [J.jump(28, 'minh', { round: 2 }), J.done(28), J.persona('lan'), J.task(31)], { link: 'B-14-c' });
add(P4, 'B-14-c', 'Cập nhật kết quả cuộc họp · T32', [J.jump(28, 'minh', { round: 2 }), J.done(28), J.done(31), J.persona('lan'), J.ui('minutesFile', true), J.task(32)]);

// Danh mục dùng chung (T8): vai Quản trị hệ thống; dữ liệu mẫu của danh mục (localStorage đã xoá ở đầu).
const P5 = 'Danh mục dùng chung';
const dm = (key) => [J.jump(1, 'minh'), J.persona('qt'), J.hash('#/dmdc' + (key ? '/' + key : ''))];
const click = (sel) => `document.querySelector(${JSON.stringify(sel)}).click()`;
// T24 B2: chụp dạng bảng trước vì lựa chọn thẻ / bảng lưu localStorage; dạng thẻ đặt lại mặc định.
add(P5, 'SCR-101-bang', 'Danh sách Phân hệ — dạng bảng', [J.jump(1, 'minh'), J.hash('#/phan-he'), click('[data-ss-view="TABLE"]')]);
add(P5, 'SCR-101', 'Danh sách Phân hệ', [J.jump(1, 'minh'), J.hash('#/phan-he'), click('[data-ss-view="GRID"]')], { link: 'SCR-30', linkSel: '[data-ss="common-catalog"]' });
add(P5, 'SCR-30', 'Tổng quan Danh mục dùng chung', dm(), { link: 'SCR-31', linkSel: '.ov-tile[href="#/dmdc/nha-cung-cap"]' });
/* D-14: vai Chuyên viên TTMS — menu con và ô chỉ còn Nhà cung cấp, Loại hàng hoá (P-36). */
add(P5, 'SCR-30-ttms', 'Tổng quan Danh mục dùng chung — vai Chuyên viên TTMS', [J.jump(1, 'minh'), J.persona('lan'), J.hash('#/dmdc')]);
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
// T16 B1: 6 danh mục theo Backlog W1_T10 + hộp thoại Xem chi tiết (bấm Mã).
[['SCR-67', 'loai-doi-tac', 'loại đối tác'], ['SCR-68', 'don-vi-tinh', 'đơn vị tính'], ['SCR-69', 'tien-te', 'tiền tệ'],
  ['SCR-70', 'loai-goi-thau', 'loại gói thầu'], ['SCR-71', 'phuong-phap-danh-gia', 'phương pháp đánh giá'], ['SCR-72', 'hinh-thuc-bao-dam', 'hình thức bảo đảm']]
  .forEach(([id, key, name]) => add(P5, id, 'Danh sách ' + name, dm(key)));
add(P5, 'SCR-69-view', 'Xem chi tiết tiền tệ (hộp thoại chỉ xem)', [...dm('tien-te'), click('[data-cat-view]')], { overlay: true });
add(P5, 'SCR-40', 'Danh sách ngưỡng phân luồng', dm('nguong-phan-luong'), { link: 'SCR-40-edit', linkSel: '[data-cat-edit]' });
add(P5, 'SCR-40-edit', 'Chỉnh sửa ngưỡng phân luồng', [...dm('nguong-phan-luong'), click('[data-cat-edit]')], { overlay: true });
add(P5, 'SCR-100', 'Phân cấp thẩm quyền KĐT (bước 13 MS13)', dm('phan-cap-tham-quyen'));
add(P5, 'SCR-99', 'Loại tài liệu căn cứ (T17 · căn cứ đầu vào luồng mua sắm)', dm('loai-tai-lieu-can-cu'));

// Quản trị quy trình (T9): vai Quản trị hệ thống; hồ sơ đang chạy ở task 26 để Giám sát tiến trình có dòng Đang chạy.
const P6 = 'Quản trị quy trình';
const qt = (h) => [J.jump(26, 'minh'), 'MaTran.reset()', J.persona('qt'), J.hash(h)];
const V2 = '2251799813690112';
add(P6, 'SCR-48', 'Giám sát tiến trình', qt('#/giam-sat-tien-trinh'));
add(P6, 'SCR-41', 'Danh sách quy trình (mở MS01.01)', [...qt('#/quy-trinh'), click('[data-vtt-key="DTMS_MS01_01"]')], { link: 'SCR-42', linkSel: '.vtt tbody tr.child a.link' });
add(P6, 'SCR-41-adv', 'Danh sách quy trình — tìm kiếm nâng cao', [...qt('#/quy-trinh'), click('[data-wf="adv"]')]);
// T24 B4: sau Đồng bộ từ Camunda (MS14 có phiên bản mới, phiên bản 1 Dừng hoạt động); bước sau đưa dữ liệu về mẫu. Vai chỉ xem: không có nút đồng bộ.
add(P6, 'SCR-41-dong-bo', 'Danh sách quy trình — sau Đồng bộ từ Camunda (mở MS14)', [...qt('#/quy-trinh'), click('[data-wf="sync"]'), 'new Promise((r) => setTimeout(r, 900))', click('[data-vtt-key="DTMS_MS14"]')]);
add(P6, 'SCR-41-qlqt', 'Danh sách quy trình — vai Người dùng quản trị quy trình', ['QuyTrinh.resetSync()', ...qt('#/quy-trinh'), J.persona('qlqt')]);
add(P6, 'SCR-42-qlqt', 'Chi tiết quy trình — không có quyền xem lịch sử phiên bản', [...qt('#/quy-trinh/' + V2), J.persona('qlqt')]);
add(P6, 'SCR-42', 'Chi tiết quy trình MS01 v1.1', qt('#/quy-trinh/' + V2), { link: 'SCR-41', linkSel: '.pg-head .vbtn.back' });
add(P6, 'SCR-42-el', 'Chi tiết quy trình — chọn phần tử (task 11)', [...qt('#/quy-trinh/' + V2),
  `document.dispatchEvent(new CustomEvent('bpmn-element', { detail: { key: 'wf/${V2}', page: 'MS01 v1.1', id: 'Activity_11' } }))`]);
add(P6, 'SCR-42-svc', 'Chi tiết quy trình — Service Task, Job type và Mô tả Job Type', [...qt('#/quy-trinh/' + V2),
  `document.dispatchEvent(new CustomEvent('bpmn-element', { detail: { key: 'wf/${V2}', page: 'MS01 v1.1', id: BPMN_DIAGRAMS['MS01 v1.1'].nodes.find((n) => n.el && n.el.type === 'serviceTask').el.id } }))`]);
add(P6, 'SCR-43-qlqt', 'Luật hiển thị hành động — vai chỉ xem', [...qt('#/ma-tran/display-rule'), J.persona('qlqt')]);
add(P6, 'SCR-43', 'Ma trận hành động — Luật hiển thị hành động', qt('#/ma-tran/display-rule'), { link: 'SCR-44-new', linkSel: 'main .pg-head .r .vbtn.primary' });
add(P6, 'SCR-44-new', 'Thêm mới luật hiển thị hành động', qt('#/ma-tran/display-rule/create'), { link: 'SCR-43', linkSel: '.pg-head .vbtn.back' });
add(P6, 'SCR-44-view', 'Xem chi tiết luật hiển thị hành động', [...qt('#/ma-tran/display-rule'), `location.hash = '#/ma-tran/display-rule/' + MaTran.rules()[0].id + '/view'`], { link: 'SCR-43', linkSel: '.pg-head .vbtn.back' });
add(P6, 'SCR-45', 'Ma trận hành động — Đối soát BPMN', qt('#/ma-tran/bpmn-reconcile'), { link: 'SCR-45-sync', linkSel: '[data-mt="sync"]' });
add(P6, 'SCR-45-sync', 'Xác nhận đồng bộ luật từ BPMN', [...qt('#/ma-tran/bpmn-reconcile'), click('[data-mt="sync"]')], { overlay: true });
add(P6, 'SCR-46', 'Ma trận hành động — Danh mục hành động', qt('#/ma-tran/action-catalog'), { link: 'SCR-47', linkSel: 'main table tbody a.link' });
add(P6, 'SCR-47', 'Xem chi tiết hành động GUI_DUYET', qt('#/ma-tran/action-catalog/GUI_DUYET'), { link: 'SCR-42', linkSel: 'main table tbody a.link' });

// Quản lý E-Form (T10): vai Quản trị hệ thống; dữ liệu mẫu 12 biểu mẫu (EForm.reset). id 4 = BM-04 Phiếu nhận xét.
const P7 = 'Quản lý E-Form';
const ef = (h) => [J.jump(1, 'minh'), 'EForm.reset()', J.persona('qt'), J.hash(h)];
const pickTask13 = `document.dispatchEvent(new CustomEvent('bpmn-element', { detail: { key: 'wf/${V2}', page: 'MS01 v1.1', id: 'Activity_13' } }))`;
add(P7, 'SCR-49', 'Danh sách biểu mẫu e-form', ef('#/eform'), { link: 'SCR-50-new', linkSel: '[data-ef-new]' });
add(P7, 'SCR-49-imp', 'Nhập biểu mẫu — kết quả kiểm tra', [...ef('#/eform'), click('[data-ef-import]'), click('[data-imp-zone]'), click('#imp-go')], { overlay: true });
add(P7, 'SCR-50-new', 'Thêm mới biểu mẫu (hộp thoại 560)', [...ef('#/eform'), click('[data-ef-new]')], { overlay: true });
add(P7, 'SCR-50-err', 'Thêm mới biểu mẫu — lỗi bỏ trống', [...ef('#/eform'), click('[data-ef-new]'), click('#ef-save')], { overlay: true });
add(P7, 'SCR-50-edit', 'Chỉnh sửa biểu mẫu e-form BM-04', [...ef('#/eform'), click('[data-ef-edit="4"]')], { overlay: true });
add(P7, 'SCR-53', 'Lịch sử cập nhật biểu mẫu BM-04', [...ef('#/eform'), click('[data-ef-hist="4"]')], { overlay: true });
add(P7, 'SCR-51', 'Thiết kế biểu mẫu BM-04 — đang chọn trường', ef('#/eform/4/thiet-ke'), { link: 'SCR-52', linkSel: '[data-efd-preview]' });
add(P7, 'SCR-51-none', 'Thiết kế biểu mẫu — chưa chọn trường', [...ef('#/eform/4/thiet-ke'), click('[data-efd-close]')]);
add(P7, 'SCR-52', 'Xem trước biểu mẫu BM-04', [...ef('#/eform/4/thiet-ke'), click('[data-efd-preview]')], { overlay: true });
add(P7, 'SCR-42-form', 'Chi tiết quy trình — Biểu mẫu phần tử là link (task 13)', [...ef('#/quy-trinh/' + V2), pickTask13], { link: 'SCR-51', linkSel: '.wf-el a[data-ef-open]' });
add(P7, 'SCR-51-ro', 'Thiết kế biểu mẫu — chỉ xem (Dừng hoạt động, mở từ Chi tiết quy trình)',
  [...ef('#/quy-trinh/' + V2), `EForm.rows().find((r) => r.id === 1).active = false`, `EForm.openFrom(1, 'quy-trinh/${V2}')`], { link: 'SCR-42-form', linkSel: '.efd-back' });

// Khoản đầu tư (T11, plan docs/dtms/prototype-KDT-chuan-bi.md): KĐT-2026-0032 hai giai đoạn (BM-01 → BM-03), KĐT-2026-0031 gộp BM-00,
// KĐT-2026-0033 chuyển MS14. kj = tua hồ sơ KĐT tới bước; kc = làm bước bằng nút có nhãn (đưa hồ sơ sang nhánh phụ).
const P8 = 'Khoản đầu tư';
const K2 = 'KĐT-2026-0032', KG = 'KĐT-2026-0031', K3 = 'KĐT-2026-0033';
const kj = (task, who, kdt, vars, settle) => `Flow.jumpTo(${task}, '${who}', ${JSON.stringify(vars || null)}, 'MS13', '${kdt || K2}', null, ${settle ? 'true' : 'false'})`;
const kc = (task, label) => `(() => { const t = Flow.state.tokens.find((k) => String(k.task) === '${task}'); Flow.complete(t.id, ${label ? `Flow.choices(t.task).find((c) => c.label.startsWith(${JSON.stringify(label)}))` : 'Flow.mainChoice(t.task)'}, 'Nội dung thử'); })()`;
const kt = (task, who, kdt) => [kj(task, who, kdt), J.task(task)];
const kh = (h) => `location.hash = '${h.replace(/Đ/g, '%C4%90')}'`;
add(P8, 'SCR-54', 'Danh sách khoản đầu tư', [kj(1, 'minh'), kh('#/kdt')], { link: 'SCR-56-0031', linkSel: 'main tbody a.link[data-go="kdt/K%C4%90T-2026-0031"]' });
add(P8, 'SCR-55', 'Thêm mới khoản đầu tư', [kj(1, 'minh'), kh('#/kdt/create')]);
add(P8, 'SCR-56-0031', 'Chi tiết KĐT-2026-0031 — hồ sơ gộp BM-00 đang xử lý', [kj(1, 'minh'), kh(`#/kdt/${KG}`)], { link: 'SCR-20-kdt-0031', linkSel: '[data-kdt-profiles] tbody a.link' });
add(P8, 'SCR-55-edit', 'Chỉnh sửa KĐT-2026-0033 — Danh sách hồ sơ, Tạo hồ sơ', [kj(1, 'minh'), kh(`#/kdt/${K3}/edit`)], { link: 'SCR-25-kdt', linkSel: '[data-kdt-profiles] .vcard-h .vbtn' });
add(P8, 'SCR-25-kdt', 'Thêm mới hồ sơ KĐT — Quy trình do hệ thống xác định', [kj(1, 'minh'), kh(`#/kdt/${K3}/tao-ho-so`)]);
add(P8, 'SCR-03-kdt', 'Chọn căn cứ KĐT · T01', kt(1, 'minh'), { link: 'SCR-04-kdt' });
add(P8, 'SCR-04-kdt', 'Thông tin cơ bản KĐT · T04', kt(4, 'minh'), { link: 'SCR-07-kdt' });
add(P8, 'SCR-07-kdt', 'Chốt tổng mức vốn · T10', kt(10, 'minh'), { link: 'SCR-57' });
add(P8, 'SCR-57', 'Ban Tài chính xác nhận hình thành TSCĐ · T11', kt(11, 'thu'), { link: 'SCR-58' });
add(P8, 'SCR-58', 'TTMS xác nhận 04 yếu tố, kết quả phân luồng · T12', [kj(12, 'lan', K2, null, true), J.task(12)], { link: 'SCR-59-15' });
add(P8, 'SCR-66', 'Thông báo chuyển luồng MS14 (KĐT-2026-0033)', [kj(12, 'lan', K3, null, true), kc(12), J.persona('minh'), kh(`#/kdt/${K3}/chuyen-luong`)]);
// T18 (BPMN 12/10, 78 bước): số bước theo trang MS13 của ĐTMS-121026.drawio; khối chung 25–38 (vòng BM-01), khối ký chung 75–78.
// kb(i) = mở nhánh phụ thứ i của Công cụ demo (bộ MS13); kf = mở hộp thoại Trình ký (nút chính → Xác nhận eForm) để chụp kèm overlay.
const kb = (i) => `(() => { const b = D.demoSets.find((d) => d.key === 'MS13').branches[${i}]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); })()`;
const kf = [`(async () => { const w = async (sel) => { for (let i = 0; i < 40 && !document.querySelector(sel); i++) await new Promise((r) => setTimeout(r, 50)); return document.querySelector(sel); };
  (await w('.task-acts [data-act].primary')).click(); (await w('.vmodal.ef #ok')).click(); await w('.overlay [data-mode]'); })()`];
add(P8, 'SCR-59-15', 'Dự thảo đề xuất KĐT · T15', kt(15, 'minh'), { link: 'SCR-59-17' });
add(P8, 'SCR-59-17', 'Hoàn thiện đề xuất, thẩm quyền phê duyệt · T17', kt(17, 'minh'), { link: 'SCR-59-39' });
add(P8, 'SCR-59-39', 'Hồ sơ chủ trương BM-01 + Checklist 01 · T39', kt(39, 'minh'), { link: 'SCR-59-40' });
add(P8, 'SCR-59-40', 'Kiểm tra hồ sơ đủ điều kiện trình · T40', kt(40, 'minh'), { link: 'SCR-60-41' });
add(P8, 'SCR-60-41', 'Chọn CQCM, đơn vị chủ trì · T41', kt(41, 'minh'), { link: 'SCR-60-42' });
add(P8, 'SCR-60-42', 'CQCM chủ trì xác nhận danh sách CQCM · T42', kt(42, 'lan'), { link: 'SCR-60-43' });
add(P8, 'SCR-60-43', 'Trình hồ sơ chủ trương · T43', kt(43, 'minh'), { link: 'SCR-61-27' });
add(P8, 'SCR-61-27', 'TTMS thẩm định (khối chung, vòng BM-01) · T27', kt(27, 'lan'), { link: 'SCR-61-29' });
add(P8, 'SCR-61-29', 'CQCM gửi ý kiến thẩm định · T29', kt(29, 'hoa'), { link: 'SCR-62-31' });
add(P8, 'SCR-62-31', 'ĐVĐX bổ sung, giải trình · T31', kt(31, 'minh'), { link: 'SCR-62-32' });
add(P8, 'SCR-62-32', 'Họp thống nhất lần 1/2 · T32', kt(32, 'lan'), { link: 'SCR-62-34' });
add(P8, 'SCR-62-34', 'Chuyên quản xác nhận sau họp · T34', kt(34, 'minh'), { link: 'SCR-62-35' });
add(P8, 'SCR-62-35', 'Chỉ huy xác nhận sau họp · T35', kt(35, 'hai'), { link: 'SCR-62-36' });
add(P8, 'SCR-62-36', 'Cập nhật hồ sơ sau họp · T36', kt(36, 'minh'), { link: 'SCR-61-46' });
add(P8, 'SCR-61-46', 'TTMS thẩm định và hoàn chỉnh chủ trương · T46', kt(46, 'lan'), { link: 'SCR-21-47' });
add(P8, 'SCR-21-47', 'Ký thẩm định trên tờ trình · T47', kt(47, 'lan'), { link: 'SCR-21-75' });
add(P8, 'SCR-21-75', 'Trình ký BM-01 — chọn hình thức ký VOffice / Bản cứng · T75', [...kt(47, 'lan'), ...kf], { overlay: true, link: 'SCR-21-48' });
add(P8, 'SCR-21-48', 'TGĐ VHT ký duyệt chủ trương BM-01 · T48', kt(48, 'tgd'), { link: 'SCR-64-50' });
add(P8, 'SCR-64-50', 'Hồ sơ phê duyệt KĐT BM-03 + Checklist 02 · T50', kt(50, 'minh'), { link: 'SCR-64-51' });
add(P8, 'SCR-64-51', 'Kiểm tra hồ sơ KĐT, trình · T51', kt(51, 'minh'), { link: 'SCR-60-52' });
add(P8, 'SCR-60-52', 'Chọn CQCM thẩm định KĐT · T52', kt(52, 'minh'), { link: 'SCR-60-53' });
add(P8, 'SCR-60-53', 'CQCM chủ trì xác nhận danh sách CQCM KĐT · T53', kt(53, 'lan'), { link: 'SCR-61-55' });
add(P8, 'SCR-61-55', 'TTMS thẩm định và hoàn chỉnh KĐT · T55', kt(55, 'lan'), { link: 'SCR-21-56' });
add(P8, 'SCR-21-56', 'Chỉ huy ĐVĐX ký tờ trình BM-03 · T56', kt(56, 'hai'), { link: 'SCR-65' });
add(P8, 'SCR-65', 'TTMS ký báo cáo thẩm định BM-14, trình dự thảo BM-18 · T57', kt(57, 'lan'), { link: 'SCR-21-60' });
add(P8, 'SCR-21-60', 'TGĐ VHT ký Quyết định phê duyệt KĐT BM-18 · T60', kt(60, 'tgd'), { link: 'SCR-56-0032' });
add(P8, 'SCR-56-0032', 'Chi tiết KĐT-2026-0032 — đã phê duyệt, Tạo gói thầu', ['Flow.jumpToScene("K10", "MS13")', kh(`#/kdt/${K2}`)], { link: 'SCR-20-kdt', linkSel: '[data-kdt-profiles] tbody a.link' });
add(P8, 'SCR-20-kdt', 'Chi tiết hồ sơ KĐT — đã phê duyệt (BM-01, BM-14, BM-18)', ['Flow.jumpToScene("K10", "MS13")', 'location.hash = "#/ho-so"'], { link: 'SCR-20-kdt-bpmn', linkLabel: 'Xem BPMN' });
add(P8, 'SCR-20-kdt-bpmn', 'Chi tiết BPMN hồ sơ KĐT — TTMS thẩm định, khối chung vòng BM-01 (bước 27)', ['Flow.jumpToScene("K5", "MS13")', 'location.hash = "#/ho-so/bpmn"']);
add(P8, 'SCR-62-26', 'Nhánh: hồ sơ chưa đủ điều kiện thẩm định → AI gợi ý, ĐVĐX sửa · T26', [kb(8), J.task(26)]);
add(P8, 'SCR-62-37', 'Nhánh: họp đủ 02 lần chưa thống nhất → báo cáo · T37', [kj(32, 'lan', K2, { meet: { CT: 1 } }), kc(32, 'Chưa thống nhất'), J.task(37)], { link: 'SCR-62-38' });
add(P8, 'SCR-62-38', 'Nhánh: Thủ trưởng kết luận nội dung chưa thống nhất · T38', [kj(32, 'lan', K2, { meet: { CT: 1 } }), kc(32, 'Chưa thống nhất'), kc(37), J.persona('tgd'), J.task(38)]);
add(P8, 'SCR-62-59', 'Nhánh: báo cáo BM-14 không được thông qua → hoàn chỉnh · T59', [kj(57, 'lan'), kc(57, 'Báo cáo không'), J.persona('minh'), J.task(59)]);
// Tuyến Tập đoàn 63–74 (T18 B4): kb(9) chủ trương thuộc Tập đoàn (→ 64), kb(12) → 67, kb(13) → 70, kb(14) → 73 (chủ trương), kb(15) → 72 (hồ sơ gộp KĐT-2026-0031).
add(P8, 'SCR-18-64', 'Tập đoàn: hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn · T64', [kb(9), J.task(64)], { link: 'SCR-21-65' });
add(P8, 'SCR-21-65', 'Tập đoàn: TGĐ VHT ký công văn trình — chọn hình thức ký · T65', [kb(9), kc(64), J.persona('tgd'), J.task(65), ...kf], { overlay: true, link: 'SCR-18-67' });
add(P8, 'SCR-18-67', 'Tập đoàn: các Ban chuyên môn gửi phiếu nhận xét BM-09 · T67', [kb(12), J.task(67)], { link: 'SCR-18-68' });
add(P8, 'SCR-18-68', 'Tập đoàn: ĐVĐX tiếp thu, lập báo cáo giải trình BM-06 · T68', [kb(12), kc(67), J.persona('minh'), J.task(68)], { link: 'SCR-21-69' });
add(P8, 'SCR-21-69', 'Tập đoàn: TGĐ VHT ký trình lại bộ hồ sơ hoàn thiện · T69', [kb(12), kc(67), kc(68), J.persona('tgd'), J.task(69)], { link: 'SCR-18-70' });
add(P8, 'SCR-18-70', 'Tập đoàn: Ban ĐTXD kiểm tra hồ sơ hoàn thiện · T70', [kb(13), J.task(70)], { link: 'SCR-18-71' });
add(P8, 'SCR-18-68-tl', 'Tập đoàn: Ban ĐTXD yêu cầu bổ sung → ĐVĐX tiếp thu lại · T68', [kb(13), kc(70, 'Chưa đạt'), J.persona('minh'), J.task(68)]);
add(P8, 'SCR-18-71', 'Tập đoàn: hoàn thiện hồ sơ chủ trương, các Ban ký BM-01 · T71', [kb(13), kc(70), J.task(71)], { link: 'SCR-18-73' });
add(P8, 'SCR-18-73', 'Tập đoàn: TGĐ Tập đoàn ký chủ trương BM-01 · T73', [kb(14), J.task(73)], { link: 'SCR-64-50-td' });
add(P8, 'SCR-64-50-td', 'Tập đoàn: chủ trương đã duyệt → lập hồ sơ KĐT BM-03 · T50', [kb(14), kc(73), J.persona('minh'), J.task(50)]);
add(P8, 'SCR-18-72', 'Tập đoàn: Ban ĐTXD lập BM-14 + dự thảo BM-18 (hồ sơ gộp KĐT-2026-0031) · T72', [kb(15), J.task(72)], { link: 'SCR-18-73-gop' });
add(P8, 'SCR-18-73-gop', 'Tập đoàn: TGĐ Tập đoàn ký BM-18 hồ sơ gộp · T73', [kb(15), kc(72), J.task(73)], { link: 'SCR-20-kdt-td' });
add(P8, 'SCR-20-kdt-td', 'Chi tiết hồ sơ KĐT-2026-0031 — hoàn tất phê duyệt cấp Tập đoàn', [kb(15), kc(72), kc(73), 'location.hash = "#/ho-so"'], { link: 'SCR-20-kdt-td-bpmn', linkLabel: 'Xem BPMN' });
add(P8, 'SCR-20-kdt-td-bpmn', 'Chi tiết BPMN hồ sơ KĐT — Ban ĐTXD kiểm tra hồ sơ hoàn thiện (bước 70)', [kb(13), 'location.hash = "#/ho-so/bpmn"']);
add(P8, 'SCR-21-75-mat', 'Khối ký chung: hồ sơ Mật — chỉ ký bản cứng · T75', [kb(10), J.task(47), ...kf], { overlay: true, link: 'SCR-21-77' });
add(P8, 'SCR-21-77', 'Khối ký chung: thực hiện ký bản cứng (hồ sơ Mật) · T77', [kb(10), kc(47), J.task(77)], { link: 'SCR-21-78' });
add(P8, 'SCR-21-78', 'Khối ký chung: cập nhật kết quả ký bản cứng, scan · T78', [kb(10), kc(47), kc(77), J.persona('minh'), J.task(78)]);
add(P8, 'SCR-21-76', 'Khối ký chung: gửi VOffice lỗi — Gửi lại · T76', [kb(11), kc(47), J.task(76)]);
add(P8, 'SCR-59-19', 'Gộp: lập văn bản BM-00 · T19 (KĐT-2026-0031)', kt(19, 'minh', KG), { link: 'SCR-59-21' });
add(P8, 'SCR-59-21', 'Gộp: Chỉ huy ĐVĐX cho ý kiến BM-00 · T21', kt(21, 'hai', KG), { link: 'SCR-60-22' });
add(P8, 'SCR-60-22', 'Gộp: chọn CQCM thẩm định hồ sơ gộp · T22', kt(22, 'minh', KG), { link: 'SCR-60-23' });
add(P8, 'SCR-60-23', 'Gộp: CQCM chủ trì xác nhận danh sách CQCM · T23', kt(23, 'lan', KG), { link: 'SCR-21-24' });
add(P8, 'SCR-21-24', 'Gộp: Chỉ huy ĐVĐX ký phiếu yêu cầu thẩm định · T24', kt(24, 'hai', KG), { link: 'SCR-65-61' });
add(P8, 'SCR-65-61', 'Gộp: TTMS ký BM-14, trình ký hồ sơ gộp · T61', kt(61, 'lan', KG), { link: 'SCR-21-62' });
add(P8, 'SCR-21-62', 'Gộp: TGĐ VHT ký BM-00 + BM-18 · T62', kt(62, 'tgd', KG));
add(P8, 'SCR-20-kdt-0031', 'Chi tiết hồ sơ KĐT mẫu — nhánh gộp BM-00', [kj(1, 'minh'), kh('#/ho-so-kdt/HS-2026-0031')]);
add(P8, 'SCR-01-kdt', 'Việc của tôi — Lan (việc KĐT)', ['Flow.jumpToScene("K8", "MS13")', J.hash('#/viec-cua-toi')], { link: 'SCR-65' });
add(P8, 'SCR-48-kdt', 'Giám sát tiến trình — hồ sơ KĐT', ['Flow.jumpToScene("K7", "MS13")', J.persona('qt'), J.hash('#/giam-sat-tien-trinh')]);

// MS01.02 (ĐXMS-2026-0124) và MS01.03 (ĐXMS-2026-0098) — màn khác MS01.01 theo docs/dtms/prototype-MS01-02-03-chuan-bi.md §5.1, §5.2.
const P9 = 'MS01.02 · ĐXMS-2026-0124 (≥ 160 tỷ, căn cứ TĐ đã duyệt)', P10 = 'MS01.03 · ĐXMS-2026-0098 (< 160 tỷ, ký trực tiếp BM-09)';
const X2 = 'ĐXMS-2026-0124', X3 = 'ĐXMS-2026-0098';
const mj = (task, who, proc, dxms, vars) => `Flow.jumpTo(${JSON.stringify(task)}, '${who}', ${JSON.stringify(vars || {})}, '${proc}', '${dxms}')`;
const mt = (task, who, proc, dxms, cqcm) => [mj(task, who, proc, dxms), J.task(task, cqcm)];
const create = (key, dxms) => [`Flow.pickDemo('${key}')`, J.hash('#/ho-so-dxms/create/' + encodeURIComponent(dxms)),
  `document.querySelector('[data-vsel="c-proc"]').click()`, `document.querySelector('.vsel-panel [data-opt="${key}"]').click()`];

add(P9, 'SCR-25-0124', 'Thêm mới hồ sơ — ĐXMS khoá, chọn quy trình MS01.02', create('MS01.02', X2), { link: 'SCR-03-0124', linkSel: '#c-save' });
add(P9, 'SCR-03-0124', 'Chọn căn cứ · T01 · chỉ căn cứ TĐ đã duyệt', mt(1, 'minh', 'MS01.02', X2), { link: 'SCR-07-0124' });
add(P9, 'SCR-07-0124', 'Báo giá · T10 · khớp quy trình ≥ 160 tỷ', mt(10, 'minh', 'MS01.02', X2), { link: 'SCR-16-0124' });
add(P9, 'SCR-16-0124', 'TTMS xác định báo cáo Tập đoàn · T48 · khoá "Có báo cáo"', mt(48, 'lan', 'MS01.02', X2), { link: 'SCR-19-0124-a' });
add(P9, 'SCR-19-0124-a', 'Rà soát dự thảo BM-08 · T58 · không kèm BM-06/07', mt(58, 'lan', 'MS01.02', X2), { link: 'SCR-19-0124-b' });
add(P9, 'SCR-19-0124-b', 'Thủ trưởng VHT phê duyệt · T60', mt(60, 'tgd', 'MS01.02', X2), { link: 'SCR-20-0124' });
add(P9, 'SCR-20-0124', 'Chi tiết hồ sơ HS-2026-0124 (đã phê duyệt, không qua 49–56)', [`Flow.jumpToScene('2-4', 'MS01.02')`, J.hash('#/ho-so')], { link: 'SCR-20-0124-bpmn', linkLabel: 'Xem BPMN' });
add(P9, 'SCR-20-0124-bpmn', 'Chi tiết BPMN HS-2026-0124 (đã phê duyệt)', [`Flow.jumpToScene('2-4', 'MS01.02')`, J.hash('#/ho-so/bpmn')], { link: 'SCR-20-0124', linkLabel: 'Xem quy trình' });

add(P10, 'SCR-25-0098', 'Thêm mới hồ sơ — ĐXMS khoá, chọn quy trình MS01.03', create('MS01.03', X3), { link: 'SCR-03-0098', linkSel: '#c-save' });
add(P10, 'SCR-03-0098', 'Chọn căn cứ · T01 · Kế hoạch SXKD', mt(1, 'minh', 'MS01.03', X3), { link: 'SCR-06-0098' });
add(P10, 'SCR-06-0098', 'Kết quả rà soát tồn kho · T07 · dùng hết tồn kho', mt(7, 'minh', 'MS01.03', X3), { link: 'SCR-08-0098' });
add(P10, 'SCR-08-0098', 'Soạn hồ sơ · T11 · BM-09 + Checklist 02', [mj(11, 'minh', 'MS01.03', X3), J.ui('necessity', true), J.task(11)], { link: 'SCR-10-0098' });
add(P10, 'SCR-10-0098', 'Phiếu yêu cầu thẩm định · T16 · Ban Tài chính bắt buộc', [mj(16, 'minh', 'MS01.03', X3), J.ui('bm03File', true), J.task(16)], { link: 'SCR-11-0098' });
add(P10, 'SCR-11-0098', 'Phiếu nhận xét BM-04 · T19 · Tài chính', mt(19, 'thu', 'MS01.03', X3, 'TC'), { link: 'SCR-15-0098' });
add(P10, 'SCR-15-0098', 'Ký BM-04 & Checklist 02 · T36 · Tài chính', mt(36, 'thu', 'MS01.03', X3, 'TC'), { link: 'SCR-23-a' });
add(P10, 'SCR-23-a', 'TTMS ký thẩm định BM-09 · T38', mt(38, 'lan', 'MS01.03', X3), { link: 'SCR-23-b' });
add(P10, 'SCR-23-b', 'Phó TGĐ ký thẩm định BM-09 · T39', mt(39, 'binh', 'MS01.03', X3), { link: 'SCR-24' });
add(P10, 'SCR-24', 'Thủ trưởng VHT phê duyệt trên BM-09 · T60', mt(60, 'tgd', 'MS01.03', X3), { link: 'SCR-20-0098' });
add(P10, 'SCR-20-0098', 'Chi tiết hồ sơ HS-2026-0098 (đã phê duyệt, KPI ≤ 10 NLV)', [`Flow.jumpToScene('3-7', 'MS01.03')`, J.hash('#/ho-so')], { link: 'SCR-20-0098-bpmn', linkLabel: 'Xem BPMN' });
add(P10, 'SCR-20-0098-bpmn', 'Chi tiết BPMN HS-2026-0098 (đã phê duyệt)', [`Flow.jumpToScene('3-7', 'MS01.03')`, J.hash('#/ho-so/bpmn')], { link: 'SCR-20-0098', linkLabel: 'Xem quy trình' });
add(P10, 'B-3a', 'Nhánh B-3a: Thủ trưởng yêu cầu hoàn chỉnh · T60 → T26 (banner trả lại)', [mj(60, 'tgd', 'MS01.03', X3), J.choose(60, 'Yêu cầu hoàn chỉnh'), J.until(26), J.persona('minh'), J.task(26)]);
add(P10, 'B-3b', 'Nhánh B-3b: Phó TGĐ không đồng ý BM-09 · T39 → T26', [mj(39, 'binh', 'MS01.03', X3), J.choose(39, 'Không đồng ý'), J.until(26), J.persona('minh'), J.task(26)]);

// T21 B3 — Điều chỉnh ĐXMS (MS02, bộ demo MS02): ĐXMS-2026-0103 (MS01.02 → MS02.02), chuyển ngưỡng xuống 150 tỷ (MS02.03), ĐXMS-2026-0072 lên 172 tỷ (MS02.01).
const P14 = 'Điều chỉnh ĐXMS · MS02', XA = 'ĐXMS-2026-0103', XB = 'ĐXMS-2026-0072';
const sc = (n) => `Flow.jumpToScene('${n}', 'MS02')`;
add(P14, 'SCR-25-dc-0103', 'Thêm mới hồ sơ — ĐXMS-2026-0103 đã phê duyệt, loại Điều chỉnh, quy trình MS02', [sc('A1'), J.hash('#/ho-so-dxms/create/' + encodeURIComponent(XA))], { link: 'MS02-T01', linkSel: '#c-save' });
add(P14, 'MS02-T01', 'Chọn ĐXMS cần điều chỉnh · T01 · căn cứ, văn bản cũ, kết quả đã thực hiện', [sc('A1'), mj(1, 'minh', 'MS02', XA), J.task(1)], { link: 'MS02-T04' });
add(P14, 'MS02-T04', 'Lý do, phạm vi, nội dung điều chỉnh · T04 · bảng trước – sau', [sc('A2'), J.task(4)], { link: 'MS02-T07' });
add(P14, 'MS02-T07', 'Rà soát tồn kho tại thời điểm điều chỉnh · T07 · kết quả cũ chỉ xem', [sc('A3'), J.task(7)], { link: 'MS02-T10' });
add(P14, 'MS02-T10', 'Báo giá điều chỉnh · T10 · so với báo giá hồ sơ cũ', [sc('A3'), J.until(10), J.task(10)], { link: 'MS02-T12' });
add(P14, 'MS02-T12', 'Dự thảo BM-01 điều chỉnh + Checklist 01 · T12', [sc('A3'), J.until(12), J.task(12)], { link: 'MS02-T48' });
add(P14, 'MS02-T48', 'TTMS xác định báo cáo Tập đoàn · T48 · chọn sẵn Không (căn cứ đã TĐ duyệt)', [sc('A4'), J.task(48)], { link: 'MS02-T58' });
add(P14, 'MS02-T58', 'Rà soát dự thảo BM-08 điều chỉnh · T58', [sc('A5'), J.task(58)], { link: 'MS02-T60' });
add(P14, 'MS02-T60', 'Thủ trưởng VHT phê duyệt điều chỉnh · T60', [sc('A5'), J.until(60), J.persona('tgd'), J.task(60)], { link: 'MS02-SCR-20' });
add(P14, 'MS02-SCR-20', 'Chi tiết hồ sơ Điều chỉnh đã phê duyệt — so sánh trước – sau', [sc('A6'), J.hash('#/ho-so')], { link: 'MS02-SCR-29', linkSel: '.ginfo a.link' });
add(P14, 'MS02-SCR-29', 'Chi tiết ĐXMS-2026-0103 — Đã phê duyệt (điều chỉnh lần 1), chuỗi hồ sơ', [sc('A6'), J.hash('#/dxms/' + encodeURIComponent(XA))]);
add(P14, 'MS02-T11-down', 'Chuyển ngưỡng xuống 150 tỷ → MS02.03 · T11 · dự thảo BM-09 điều chỉnh', [sc('A7'), J.task(11)], { link: 'MS02-T38' });
add(P14, 'MS02-T38', 'MS02.03 · TTMS ký thẩm định BM-09 điều chỉnh · T38', [sc('A8'), J.task(38)], { link: 'MS02-T39' });
add(P14, 'MS02-T39', 'MS02.03 · Phó TGĐ ký thẩm định BM-09 điều chỉnh · T39', [sc('A8'), J.persona('binh'), J.task(39)]);
add(P14, 'MS02-T12-up', 'ĐXMS-2026-0072 tăng 172 tỷ → MS02.01 · T12 · cảnh báo chuyển ngưỡng', [sc('A9'), J.task(12)], { link: 'MS02-T50' });
add(P14, 'MS02-T50', 'MS02.01 · báo cáo TGĐ Tập đoàn BM-06 · T50', [sc('A10'), J.task(50)]);
add(P14, 'MS02-B13', 'Nhánh phụ: Chỉ huy ĐVĐX không đồng ý dự thảo điều chỉnh · T13 → T14 → T12', [mj(13, 'hai', 'MS02', XA), J.choose(13, 'Không đồng ý'), J.until(12), J.persona('minh'), J.task(12)]);
add(P14, 'MS02-B47', 'Nhánh phụ: Phó TGĐ không đồng ý BM-05 · T47 → T26', [mj(47, 'binh', 'MS02', XA), J.choose(47, 'Không đồng ý'), J.until(26), J.persona('minh'), J.task(26)]);
add(P14, 'MS02-SCR-01-hai', 'Việc của tôi — Hải (việc trên hồ sơ Điều chỉnh mẫu HS-2026-0126)', [sc('A1'), J.persona('hai'), J.hash('#/viec-cua-toi')]);

/* B0.4 (2): nội dung của bước nằm trong eForm — màn xử lý task chụp kèm dialog eForm đang mở (bấm nút chính),
   như my-task-eform-dialog; liên kết Figma đi từ nút Xác nhận của dialog. */
const onTask = (st) => /location\.hash = '#\/task\/'/.test(st);
S.forEach((s) => {
  /* noForm: màn task không có nút hành động / eForm (MS13 bản 12/10 hiện không còn màn nào như vậy). */
  if (s.overlay || s.noForm || !s.steps.some(onTask) || s.id.startsWith('SCR-20')) return;
  s.steps.push(`(() => { const b = document.querySelector('.task-acts [data-act].primary'); if (b) b.click(); })()`);
  s.overlay = true;
  if (s.link) { s.linkSel = '.overlay #ok'; delete s.linkLabel; }
});

// Quản lý ĐXMS theo Backlog W1_T10 (T16 B1): tìm kiếm nâng cao SCR-27, tab Chi tiết ĐXMS (ĐXMS-2026-0077 đã phê duyệt, có hồ sơ điều chỉnh), YCBG SCR-73/74.
const P11 = 'Quản lý ĐXMS · Backlog W1_T10';
const DX77 = '#/dxms/' + encodeURIComponent('ĐXMS-2026-0077');
const dx = (h) => [J.jump(1, 'minh'), J.hash(h)];
add(P11, 'SCR-27-adv', 'Danh sách ĐXMS — tìm kiếm nâng cao', [...dx('#/dxms'), click('[data-xl="adv"]')]);
[['info', 'Thông tin chung'], ['can-cu', 'Căn cứ & hạng mục'], ['ton-kho', 'Rà soát tồn kho'], ['ycbg', 'Yêu cầu báo giá'], ['phien-ban', 'Lịch sử phiên bản'], ['ket-qua', 'Kết quả & văn bản phê duyệt']]
  .forEach(([k, name], i, a) => add(P11, 'SCR-29-' + k, 'Chi tiết ĐXMS-2026-0077 — tab ' + name, [...dx(DX77), click(`[data-dtab="${k}"]`)],
    i < a.length - 1 ? { link: 'SCR-29-' + a[i + 1][0], linkSel: `[data-dtab="${a[i + 1][0]}"]` } : {}));
add(P11, 'SCR-73', 'Danh sách yêu cầu báo giá', dx('#/ycbg'), { link: 'SCR-74', linkSel: 'main .vtable tbody a.link' });
add(P11, 'SCR-73-adv', 'Danh sách yêu cầu báo giá — tìm kiếm nâng cao', [...dx('#/ycbg'), click('[data-y="adv"]')]);
add(P11, 'SCR-74', 'Chi tiết yêu cầu báo giá', [...dx('#/ycbg'), `location.hash = '#/ycbg/' + encodeURIComponent(Ycbg.allYcbg().find((y) => y.dxms === 'ĐXMS-2026-0077').code)`], { link: 'SCR-73', linkSel: '.pg-head .vbtn.back' });

// T16 B2 (Backlog W1_T10): KĐT — Danh sách hồ sơ KĐT SCR-75, YCBG KĐT SCR-76/77, tab Chi tiết KĐT SCR-56 (KĐT-2026-0012 đã phê duyệt);
// Quản lý thầu — KHLCNT SCR-78…80, gói thầu SCR-81/82, nhà thầu & rủi ro SCR-83. Màn tĩnh (D-17).
const P12 = 'KĐT & Thầu · Backlog W1_T10';
const K12 = '#/kdt/' + encodeURIComponent('KĐT-2026-0012');
add(P12, 'SCR-75', 'Danh sách hồ sơ KĐT', dx('#/ho-so-kdt'));
add(P12, 'SCR-75-adv', 'Danh sách hồ sơ KĐT — tìm kiếm nâng cao', [...dx('#/ho-so-kdt'), click('[data-hk="adv"]')]);
add(P12, 'SCR-76', 'Danh sách yêu cầu báo giá KĐT', dx('#/ycbg-kdt'), { link: 'SCR-77', linkSel: 'main .vtable tbody a.link' });
add(P12, 'SCR-77', 'Chi tiết yêu cầu báo giá KĐT', [...dx('#/ycbg-kdt'), `location.hash = '#/ycbg-kdt/' + encodeURIComponent(Ycbg.allYcbg('kdt')[0].code)`], { link: 'SCR-76', linkSel: '.pg-head .vbtn.back' });
[['info', 'Thông tin chung'], ['can-cu', 'Căn cứ & hạng mục'], ['ton-kho', 'Rà soát tồn kho'], ['ycbg', 'Yêu cầu báo giá'], ['phan-loai', 'Phân loại & định danh'], ['thanh-phan', 'Thành phần tham gia'], ['ket-qua-kdt', 'Kết quả & triển khai']]
  .forEach(([k, name], i, a) => add(P12, 'SCR-56-' + k, 'Chi tiết KĐT-2026-0012 — tab ' + name, [...dx(K12), click(`[data-dtab="${k}"]`)],
    i < a.length - 1 ? { link: 'SCR-56-' + a[i + 1][0], linkSel: `[data-dtab="${a[i + 1][0]}"]` } : {}));
add(P12, 'SCR-78', 'Danh sách kế hoạch lựa chọn nhà thầu', dx('#/khlcnt'), { link: 'SCR-80-info', linkSel: 'main .vtable tbody tr:last-child a.link' });
add(P12, 'SCR-78-adv', 'Danh sách KHLCNT — tìm kiếm nâng cao (Quy chế áp dụng, Cấp phê duyệt, Người phụ trách, Số / Ngày QĐ)', [...dx('#/khlcnt'), click('[data-tl$=":adv"]')]);
add(P12, 'SCR-79', 'Thêm mới KHLCNT — lập từ KĐT đã phê duyệt', dx('#/khlcnt/create/KDT/' + encodeURIComponent('KĐT-2026-0015')));
const KH9 = '#/khlcnt/KHLCNT-2026-0009';
[['info', 'Thông tin chung'], ['phan-bo', 'Phân bổ công việc'], ['goi', 'Gói thầu'], ['to-trinh', 'Tờ trình KHLCNT'], ['phien-ban', 'Phiên bản & điều chỉnh'], ['ket-qua', 'Kết quả KHLCNT']]
  .forEach(([k, name], i, a) => add(P12, 'SCR-80-' + k, 'Chi tiết KHLCNT-2026-0009 — tab ' + name, [...dx(KH9), click(`[data-ttab="${k}"]`)],
    i < a.length - 1 ? { link: 'SCR-80-' + a[i + 1][0], linkSel: `[data-ttab="${a[i + 1][0]}"]` } : {}));
add(P12, 'SCR-80-adj', 'Điều chỉnh KHLCNT — lý do', [...dx(KH9), click('[data-kh-adj]')], { overlay: true });
add(P12, 'SCR-81', 'Danh sách gói thầu', dx('#/goi-thau'), { link: 'SCR-82-info', linkSel: 'main .vtable tbody tr:last-child a.link' });
add(P12, 'SCR-81-adv', 'Danh sách gói thầu — tìm kiếm nâng cao', [...dx('#/goi-thau'), click('[data-tl="gtl:adv"]')]);
[['info', 'Thông tin chung'], ['pa', 'Phương án LCNT'], ['tp', 'Thành phần tham gia'], ['hs', 'Hồ sơ mời thầu'], ['dg', 'Đánh giá & KQLCNT'], ['th', 'Tình huống & kiến nghị']]
  .forEach(([k, name], i, a) => add(P12, 'SCR-82-' + k, 'Chi tiết GT-2026-0021 — tab ' + name, [...dx('#/goi-thau/GT-2026-0021'), click(`[data-ttab="${k}"]`)],
    i < a.length - 1 ? { link: 'SCR-82-' + a[i + 1][0], linkSel: `[data-ttab="${a[i + 1][0]}"]` } : {}));
add(P12, 'SCR-82-hc', 'Chi tiết GT-2026-0024 (đấu thầu hạn chế) — danh sách ngắn', [...dx('#/goi-thau/GT-2026-0024'), click('[data-ttab="tp"]')]);
[['cl', 'Nhà thầu chiến lược'], ['hang', 'Hãng sản xuất chiến lược'], ['cam', 'Nhà thầu bị cấm']]
  .forEach(([k, name]) => add(P12, 'SCR-83-' + k, 'Nhà thầu & kiểm soát rủi ro — ' + name, [...dx('#/nha-thau'), click(`[data-nttab="${k}"]`)]));
// Công khai & tích hợp đấu thầu SCR-94 (QC-12869 Điều 26, BPMN-MS18 bước 54–60).
[['dt', 'Theo dõi đăng tải'], ['log', 'Nhật ký đồng bộ'], ['cfg', 'Kết nối & thời hạn']]
  .forEach(([k, name]) => add(P12, 'SCR-94-' + k, 'Công khai & tích hợp đấu thầu — ' + name, [...dx('#/cong-khai-thau'), click(`[data-ck-tab="${k}"]`)]));
add(P12, 'SCR-94-gui-lai', 'Công khai & tích hợp đấu thầu — Gửi lại tin lỗi', [...dx('#/cong-khai-thau'), click('[data-ck-tab="dt"]'), click('[data-ck-pub="KHLCNT:KHLCNT-2026-0009:v2"]')], { overlay: true });

// T16 B3 (Backlog W1_T10): Quản lý hợp đồng SCR-84…87, Thông báo SCR-88…91, Tổng quan SCR-92, Báo cáo SCR-93. Màn tĩnh (D-17, D-22).
const P13 = 'Hợp đồng, Thông báo, Tổng quan & Báo cáo · Backlog W1_T10';
const HD87 = '#/hop-dong/' + encodeURIComponent('HĐ-2025-0187'), HD52 = '#/hop-dong/' + encodeURIComponent('HĐ-2026-0052');
const qtb = (h) => [J.jump(1, 'minh'), J.persona('qt'), J.hash(h)];
add(P13, 'SCR-84', 'Danh sách hợp đồng', dx('#/hop-dong'), { link: 'SCR-86-info', linkSel: `main .vtable tbody a.link[data-go="hop-dong/${encodeURIComponent('HĐ-2025-0187')}"]` });
add(P13, 'SCR-84-adv', 'Danh sách hợp đồng — tìm kiếm nâng cao', [...dx('#/hop-dong'), click('[data-tl="hdl:adv"]')]);
add(P13, 'SCR-85', 'Thêm mới hợp đồng từ KQLCNT (GT-2026-0027)', dx('#/hop-dong/create/GT-2026-0027'));
[['info', 'Thông tin chung'], ['dt', 'Đối tác'], ['hm', 'Hạng mục'], ['tt', 'Thương thảo & ký kết'], ['bd', 'Bảo đảm & bảo hành'], ['td', 'Tiến độ thực hiện'], ['bg', 'Bàn giao & nghiệm thu'], ['pay', 'Thanh toán'], ['vb', 'Văn bản phát sinh'], ['tl', 'Thanh lý']]
  .forEach(([k, name], i, a) => add(P13, 'SCR-86-' + k, 'Chi tiết HĐ-2025-0187 — tab ' + name, [...dx(HD87), click(`[data-ttab="${k}"]`)],
    i < a.length - 1 ? { link: 'SCR-86-' + a[i + 1][0], linkSel: `[data-ttab="${a[i + 1][0]}"]` } : {}));
add(P13, 'SCR-86-tt52', 'Chi tiết HĐ-2026-0052 — thương thảo, tạm dừng ký', [...dx(HD52), click('[data-ttab="tt"]')]);
add(P13, 'SCR-86-pl', 'HĐ-2026-0012 — Thêm phụ lục', [...dx('#/hop-dong/' + encodeURIComponent('HĐ-2026-0012')), click('[data-ttab="vb"]'), click('[data-hd-annex]')], { overlay: true });
add(P13, 'SCR-86-tl', 'Chi tiết HĐ-2025-0152 — đã thanh lý', [...dx('#/hop-dong/' + encodeURIComponent('HĐ-2025-0152')), click('[data-ttab="tl"]')]);
add(P13, 'SCR-87', 'Danh sách thỏa thuận khung', dx('#/thoa-thuan-khung'), { link: 'SCR-87-d', linkSel: 'main .vtable tbody a.link' });
add(P13, 'SCR-87-d', 'Chi tiết thỏa thuận khung TTK-2026-0003', dx('#/thoa-thuan-khung/TTK-2026-0003'));
add(P13, 'SCR-88', 'Mẫu thông báo', qtb('#/mau-thong-bao'), { link: 'SCR-89-d', linkSel: 'main .vtable tbody a.link' });
add(P13, 'SCR-89-c', 'Tạo mới mẫu thông báo', qtb('#/mau-thong-bao/create'));
add(P13, 'SCR-89-d', 'Xem chi tiết mẫu thông báo', qtb('#/mau-thong-bao/detail/1'));
add(P13, 'SCR-90', 'Kênh thông báo', qtb('#/kenh-thong-bao'));
add(P13, 'SCR-90-cfg', 'Cấu hình kênh Email', [...qtb('#/kenh-thong-bao'), click('[data-ch-cfg="EMAIL"]')], { overlay: true });
[['kpi', 'Chỉ số tổng quan'], ['td', 'Tiến độ nghiệp vụ'], ['gt', 'Phân tích giá trị'], ['dt', 'Phân tích đấu thầu'], ['hd', 'Phân tích hợp đồng'], ['tt', 'Thanh toán'], ['cb', 'Cảnh báo']]
  .forEach(([k, name]) => add(P13, 'SCR-92-' + k, 'Tổng quan — ' + name, [...dx('#/tong-quan'), click(`[data-tqtab="${k}"]`)]));
[['tong-hop', 'dtms'], ['tong-hop', 'chuoi'], ['dxms', 'dxms'], ['kdt', 'kdt'], ['lcnt', 'khlcnt'], ['lcnt', 'to-chuc'], ['lcnt', 'kq'], ['lcnt', 'hieu-qua'], ['lcnt', 'nha-thau'], ['lcnt', 'kpi'],
  ['hop-dong', 'tinh-hinh'], ['hop-dong', 'thanh-toan'], ['tien-do', 'qua-han'], ['tien-do', 'kien-nghi'], ['tien-do', 'kpi-buoc']]
  .forEach(([g, k]) => add(P13, `SCR-93-${g}-${k}`, `Báo cáo — ${g} / ${k}`, [...dx('#/bao-cao/' + g), `document.querySelector('[data-rptab="${g}:${k}"]') && document.querySelector('[data-rptab="${g}:${k}"]').click()`]));

// T17 (plan docs/dtms/prototype-T17-luong-mua-sam-chuan-bi.md): phương án Gộp menu "Luồng mua sắm" — SCR-95…98. Đặt cuối danh sách vì công tắc Gộp lưu ở localStorage.
const P15 = 'Luồng mua sắm · T17 (phương án Gộp)', LT = 'Luồng mua sắm thiết bị đo kiểm RF 2026';
const GOP = `localStorage.setItem('dtms-proto-menu', 'gop')`;
const LG = [J.jump(1, 'minh'), GOP, `Flow.createLuong({ title: ${JSON.stringify(LT)}, nv: 'NV-KHCN-2026-014', unit: D.caseInfo.unit, priority: D.caseInfo.priority, est: 183, period: D.caseInfo.period, secret: false,
  purpose: 'Trang bị thiết bị đo kiểm RF và OTA phục vụ phát triển trạm gNodeB thế hệ 2.', members: { 17: ['mai'] },
  basis: [{ name: 'QD-1482-VHT.pdf', type: 'QD_NV', at: Flow.dateOf(Flow.state.clock) }, { name: 'KH-mua-sam-2026.pdf', type: 'KH_NAM', at: Flow.dateOf(Flow.state.clock) }] }, { process: 'MS01.01', name: ${JSON.stringify(LT)}, caseFiles: [] })`];
// Thay người bước 13 (Hải → Sơn) rồi tua nhánh chính tới bước 13: bước 01…12 đã xong — khoá, có lịch sử thay đổi nhân sự.
const LG13 = [...LG, `Flow.updateMembers({ task: '13', mode: 'replace', drop: ['hai'], add: ['son'], doc: 'QD-dieu-dong-123.pdf', reason: 'Đi công tác' })`,
  `(() => { for (let i = 0; i < 300 && !Flow.state.tokens.some((t) => String(t.task) === '13'); i++) { const t = Flow.state.tokens[0], c = Flow.mainChoice(t.task); Flow.complete(t.id, c, c && c.reason ? 'Nội dung thử' : null); } })()`, J.persona('minh')];
const LD = `location.hash = '#/luong/' + encodeURIComponent(Flow.state.dxms)`;
// Chọn trong vht-select: mở → (bước sau, panel đã vẽ) chọn → đóng.
const vpick = (id, vals, close) => [`document.querySelector('[data-vsel="${id}"]').click()`,
  ...vals.map((v) => `document.querySelector('.vsel-panel [data-opt="${v}"]').click()`), ...(close ? [click(close)] : [])];
add(P15, 'SCR-95', 'Danh sách luồng mua sắm', [...LG13, J.hash('#/luong')], { link: 'SCR-97-info', linkSel: 'main .vtable tbody tr.click a.link' });
add(P15, 'SCR-96', 'Thêm mới luồng mua sắm', [J.jump(1, 'minh'), GOP, J.hash('#/luong/create')], { link: 'SCR-96-nhap', linkSel: '[data-lf-add]' });
add(P15, 'SCR-96-nhap', 'Thêm mới luồng mua sắm — đã nhập: tệp căn cứ, quy trình, nhân sự bước 17', [J.jump(1, 'minh'), GOP, J.hash('#/luong/create'),
  `(() => { const e = document.querySelector('#lf-title'); e.value = ${JSON.stringify(LT)}; e.dispatchEvent(new Event('input', { bubbles: true })); })()`,
  ...vpick('lf-nv', ['NV-KHCN-2026-014']), ...vpick('lf-proc', ['MS01.01']),
  `(() => { const i = document.querySelector('#lf-file'), dt = new DataTransfer(); ['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf'].forEach((n) => dt.items.add(new File([new Uint8Array(16)], n, { type: 'application/pdf' }))); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); })()`,
  ...vpick('lf-type-1', ['QD_NV']), ...vpick('lf-type-2', ['KH_NAM']), click('[data-lf-add]'),
  `(() => { const id = [...document.querySelectorAll('[data-lf-members] tbody tr [data-row-step]')].pop().dataset.rowStep; document.querySelector('[data-vsel="lf-step-' + id + '"]').click(); document.querySelector('.vsel-panel [data-opt="17"]').click();
    document.querySelector('[data-vsel="lf-m-' + id + '"]').click(); document.querySelector('.vsel-panel [data-opt="mai"]').click(); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); })()`],
  { link: 'SCR-01-luong', linkSel: '#lf-save' });
add(P15, 'SCR-01-luong', 'Sau Lưu: task 01 của hồ sơ Phê duyệt vừa khởi tạo — nút Cập nhật nhân sự', [...LG, `location.hash = '#/task/' + Flow.state.tokens.find((t) => String(t.task) === '1').id`],
  { link: 'SCR-98-task', linkSel: '.task-acts [data-um-open]' });
[['info', 'Thông tin chung'], ['tien-trinh', 'Tiến trình'], ['can-cu', 'Căn cứ'], ['nhan-su', 'Nhân sự thực hiện'], ['van-ban', 'Văn bản & ký duyệt'], ['lich-su', 'Lịch sử thay đổi nhân sự']]
  .forEach(([k, l]) => add(P15, 'SCR-97-' + k, 'Chi tiết luồng — ' + l, [...LG13, LD, click(`[data-ltab="${k}"]`)], k === 'nhan-su' ? { link: 'SCR-98', linkSel: '[data-um-open="17"]' } : undefined));
add(P15, 'SCR-98', 'Cập nhật nhân sự — Thay người bước 17 (ảnh hưởng của thay đổi)', [...LG13, LD, click('[data-ltab="nhan-su"]'), click('[data-um-open="17"]'),
  ...vpick('um-drop', ['mai'], '.vmodal-h h3'), ...vpick('um-add', ['lan'], '.vmodal-h h3')], { overlay: true });
add(P15, 'SCR-98-task', 'Cập nhật nhân sự — mở từ màn xử lý task 01', [...LG, `location.hash = '#/task/' + Flow.state.tokens.find((t) => String(t.task) === '1').id`, click('.task-acts [data-um-open]')], { overlay: true });

/* Tuỳ chọn tham số 2: chỉ chụp các màn của một trang Figma (vd. "Khoản đầu tư"). */
const ONLY = process.argv[3] || null;
if (ONLY && !S.some((x) => x.page === ONLY)) { console.error('Không có trang', ONLY); process.exit(1); }
const manifest = [];
for (let i = 0; i < S.length; i++) {
  const s = S[i];
  if (ONLY && s.page !== ONLY) continue;
  if (process.env.CAP_DEBUG) console.error(s.id);
  for (const st of s.steps) { await ev(st); await sleep(40); }
  await sleep(250);
  /* Màn nặng (tua nhanh dài) có lúc chưa vẽ xong khung .main — chờ tối đa 2 giây. */
  for (let w = 0; w < 20 && !(await ev(`!!document.querySelector('.main')`)); w++) await sleep(100);
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
    const shell = { topbar: JSON.parse(await ev(`JSON.stringify(__serialize('.topbar'))`)), sidebar: JSON.parse(await ev(`document.querySelector('.sidebar') ? JSON.stringify(__serialize('.sidebar')) : 'null'`)) };
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
