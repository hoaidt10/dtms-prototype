// T29 B12 — form và danh sách Luồng mua sắm theo RV-PROTO-0511 bản 2 + review Huylx4 05/11 (docs/dtms/prototype-T29-review-0511.md,
// prototype-T29-review-huylx4-0511.md): Đề tài lên đầu (#11, Huylx4 #2, #10), Lý do ưu tiên (#1), Ngày tạo một trường (#2), Hình thức trình ký (D-74),
// bỏ Mục đích (#7), menu Quản lý hồ sơ (D-78), ẩn Thầu / Hợp đồng (D-76).
import { test, expect } from '@playwright/test';
import { fresh, aiApply } from './helpers.mjs';

const pickSel = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};

const gop = async (page, hash = '#/luong') => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.setItem('dtms-proto-menu', 'gop'));
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};

test('SCR-96: Đề tài / dự án và khối bóc tách đứng đầu; Căn cứ pháp lý; Khẩn / Thượng khẩn bắt buộc Lý do ưu tiên', async ({ page }) => {
  await gop(page, '#/luong/create');
  const cards = await page.locator('form[data-luong-form] > section.vcard h3').allInnerTexts();
  // T29 B19: thẻ đầu là bước 1 (Căn cứ và nội dung mua sắm — Thông tin dự án / đề tài).
  expect(cards[0]).toContain('Thông tin dự án / đề tài');
  expect(cards[1]).toBe('Thông tin chung');
  expect(cards).toContain('Căn cứ pháp lý');
  expect(cards).not.toContain('Căn cứ đầu vào');
  expect(cards).not.toContain('Danh sách người thẩm định');
  await expect(page.locator('[data-lf-cost] [data-vsel="lf-nv"]')).toHaveCount(1);
  await expect(page.locator('#lf-purpose')).toHaveCount(0);
  // Lý do ưu tiên chỉ hiện khi Khẩn / Thượng khẩn, bắt buộc.
  await expect(page.locator('#lf-priReason')).toHaveCount(0);
  await page.locator('#lf-title').fill('Luồng mua sắm khẩn');
  await pick(page, 'lf-nv', 'NV-KHCN-2026-014');
  await pick(page, 'lf-pri', 'Khẩn');
  await expect(page.locator('#lf-priReason')).toBeVisible();
  await page.locator('#lf-draft').click();
  await expect(page.locator('.vfield', { has: page.locator('#lf-priReason') }).locator('.msg')).toHaveText('Bạn cần nhập Lý do ưu tiên.');
  await pick(page, 'lf-pri', 'Thường');
  await expect(page.locator('#lf-priReason')).toHaveCount(0);
  await pick(page, 'lf-pri', 'Thượng khẩn');
  await page.locator('#lf-priReason').fill('Phục vụ đợt thử nghiệm hiện trường tháng 01/2027');
  const up = (names) => page.locator('#lf-file').setInputFiles(names.map((name) => ({ name, mimeType: 'application/pdf', buffer: Buffer.alloc(16) })));
  await up(['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf']);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  const x = await page.evaluate(() => { const d = Flow.findDxms(Flow.state.dxms); return { code: d.code, pr: d.priReason, sign: d.sign }; });
  expect(x.pr).toContain('thử nghiệm hiện trường');
  expect(x.sign).toBe('VOffice');
  // T29 B19: bước 1–5 trên màn Lập ĐXMS — Gửi rồi xem màn xử lý bước 5.1 (Chỉ huy ĐVĐX).
  await aiApply(page);
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  await page.evaluate(() => { const t = Flow.state.tokens[0]; Flow.setPersona(t.who); location.hash = '#/task/' + t.id; });
  // Màn xử lý việc: Thông tin chung mang lại các trường đã nhập khi tạo luồng.
  const gi = page.locator('.tmain .ginfo').first();
  const val = (k) => gi.locator(':scope > div', { has: page.locator('.k', { hasText: new RegExp('^' + k + '$') }) }).locator('.v');
  await expect(val('Đề tài / dự án')).toContainText('NV-KHCN-2026-014');
  await expect(val('Lý do ưu tiên')).toContainText('thử nghiệm hiện trường');
  await expect(val('Hình thức trình ký')).toHaveText('VOffice');
  await expect(val('Căn cứ đã được phê duyệt')).toHaveText('Chưa phê duyệt');
  await expect(val('Người tạo')).not.toHaveText('-');
  await expect(val('Nội dung căn cứ pháp lý')).not.toHaveText('');
  // Khối Nhân sự thực hiện (chỉ xem): mỗi vai trò của quy trình một dòng, chưa chỉ định thì theo vai trò.
  const ns = page.locator('[data-members-info] tbody tr');
  expect(await ns.count()).toBeGreaterThan(1);
  await expect(page.locator('[data-members-info]')).toContainText('(theo vai trò)');
  // Chi tiết luồng: Lý do ưu tiên, Hình thức trình ký; không còn Mục đích.
  await page.evaluate((c) => { location.hash = '#/luong/' + encodeURIComponent(c); }, x.code);
  await expect(page.locator('main .gen')).toContainText('Lý do ưu tiên');
  await expect(page.locator('main .gen')).toContainText('Hình thức trình ký');
  await expect(page.locator('main .gen')).not.toContainText('Mục đích');
  await page.locator('[data-ltab="can-cu"]').click();
  await expect(page.locator('main h3').first()).toHaveText('Căn cứ pháp lý');
  expect(page.errors).toEqual([]);
});

test('SCR-95: Ngày tạo một trường "từ – đến"', async ({ page }) => {
  await gop(page);
  await page.locator('[data-lg="adv"]').click();
  await expect(page.locator('[data-lgf="from"], [data-lgf="to"]')).toHaveCount(0);
  const all = await page.locator('.vtable tbody tr').count();
  const dates = await page.evaluate(() => Flow.dxmsAll().map((x) => x.created));
  await page.locator('[data-lgf="created"]').fill('01/09/2026 – 30/09/2026');
  await page.locator('[data-lgadv] button[type="submit"]').click();
  const want = dates.filter((d) => { const [dd, mm, yy] = d.split('/'); const k = yy + mm + dd; return k >= '20260901' && k <= '20260930'; }).length;
  await expect(page.locator('[data-pager="lg"] .tot')).toHaveText(`Tổng số bản ghi: ${want}`);
  expect(want).toBeLessThan(dates.length);
  expect(all).toBeGreaterThan(0);
  expect(page.errors).toEqual([]);
});

test('D-76, D-78, D-105: menu ẩn Quản lý thầu / hợp đồng (route giữ); Quản lý tài liệu ĐXMS (SRS 29) — văn bản đầu ra, lọc, mở ĐXMS', async ({ page }) => {
  await gop(page);
  await expect(page.locator('.sb-nav [data-toggle="Quản lý thầu"]')).toHaveCount(0);
  await expect(page.locator('.sb-nav [data-toggle="Quản lý hợp đồng"]')).toHaveCount(0);
  const kids = await page.evaluate(() => {
    let n = document.querySelector('.sb-nav [data-toggle="Quản lý đề xuất mua sắm"]').nextElementSibling;
    const out = [];
    for (; n && n.classList.contains('child'); n = n.nextElementSibling) out.push(n.querySelector('.l').textContent);
    return out;
  });
  expect(kids).toEqual(['Đề xuất mua sắm', 'Quản lý tài liệu ĐXMS', 'Yêu cầu báo giá ĐXMS']);
  // Route Thầu vẫn mở.
  await page.evaluate(() => { location.hash = '#/goi-thau'; });
  await expect(page.locator('.pg-title')).toHaveText('Danh sách gói thầu');

  await page.locator('.sb-nav [data-go="quan-ly-ho-so"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Quản lý tài liệu ĐXMS');
  await expect(page.locator('.sb-nav [data-go="quan-ly-ho-so"]')).toHaveClass(/active/);
  await expect(page.locator('main .vtable thead th')).toHaveText(['STT', 'Thao tác', 'Mã biểu mẫu', 'Tên văn bản', 'Mã ĐXMS', 'Tên đề xuất mua sắm', 'Loại ĐXMS', 'Trạng thái', 'Ngày cập nhật']);
  const n = await page.evaluate(() => QuanLyHoSo.rows().length);
  expect(n).toBeGreaterThan(10);
  // SRS 29 AC-0153-05: Loại biểu mẫu BM-08 + Trạng thái Đang hiệu lực.
  await page.locator('[data-qh="adv"]').click();
  await pick(page, 'qh-code', 'BM-08');
  await page.locator('[data-qhadv] button[type="submit"]').click();
  const rows = page.locator('main .vtable tbody tr');
  expect(await rows.count()).toBeGreaterThan(0);
  for (const t of await rows.allInnerTexts()) { expect(t).toMatch(/Quyết định phê duyệt|QĐ điều chỉnh/); expect(t).toMatch(/Đang hiệu lực|Đã thay thế|Đã ký/); }
  await pick(page, 'qh-st', 'Từ chối');
  await page.locator('.pg-title').click(); // đóng panel chọn nhiều
  await page.locator('[data-qhadv] button[type="submit"]').click();
  await expect(page.locator('main .vtable-empty')).toContainText('Không tìm thấy dữ liệu phù hợp');
  // AC-0153-14: ngày đầu lớn hơn ngày cuối.
  await page.fill('#qh-date', '10/11/2026 – 01/11/2026');
  await page.locator('[data-qhadv] button[type="submit"]').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText('Ngày cập nhật không hợp lệ.');
  await page.locator('[data-qh="reset"]').click();
  // AC-0153-10: bấm Mã ĐXMS mở Chi tiết, tab Tài liệu & văn bản.
  const dx = (await rows.first().locator('td').nth(4).innerText()).trim();
  await rows.first().locator('td').nth(4).locator('a').click();
  await expect.poll(() => decodeURIComponent(page.url())).toContain(dx + '/tai-lieu');
  // Bật cờ demo Thầu → menu hiện lại.
  await page.evaluate(() => { D.show.menuThau = true; App.render(); });
  await expect(page.locator('.sb-nav [data-toggle="Quản lý thầu"]')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

/* ---------- B12c: eForm bước 1 (D-81), 5 (Huylx4 #20), 8 (Huylx4 #26); Tổng giá trị (Huylx4 #4) ---------- */
async function jump(page, task) {
  return page.evaluate((t) => {
    Flow.jumpTo(t, 'minh', {}, 'MS01.01', undefined, null, false);
    const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
    Flow.setPersona(k.who);
    location.hash = '#/task/' + k.id;
    return k.id;
  }, task);
}
const form = (page) => page.locator('.vmodal.ef');

test('D-81, #4 + B19: bước 1 mở màn Lập ĐXMS (không popup), căn cứ + phần khả dụng trên màn; Tổng giá trị trống tới khi chốt báo giá', async ({ page }) => {
  await fresh(page);
  await jump(page, 1);
  // T29 B19 (DX-11): việc bước 1 của hồ sơ MS01 mở màn Lập ĐXMS — không còn hộp thoại "Xác nhận căn cứ".
  await expect(page.locator('[data-luong-form]')).toHaveCount(1);
  await expect(page.locator('.task-acts [data-act]')).toHaveCount(0);
  await expect(page.locator('[data-basis-avail]')).toHaveCount(0); // T37 (RV-PROTO-0911 #4): bỏ khối căn cứ khả dụng
  // P-216 (chốt 06/11): AI chạy khi bấm nút Gợi ý từ AI.
  await expect(page.locator('[data-lf-ai-sec="boc"]')).toHaveText('✦ Gợi ý từ AI');
  await aiApply(page);
  await expect(page.locator('[data-lf-ai2]')).toContainText('AI đã lấy dữ liệu căn cứ');
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  // Bước 5.1 (Chỉ huy ĐVĐX): Thông tin chung có Giá trị dự kiến, Tổng giá trị trống, phần khả dụng.
  await jump(page, '5.1');
  const gi = page.locator('.tmain .ginfo').first();
  await expect(gi).toContainText('Giá trị dự kiến');
  await expect(gi.locator('div', { has: page.locator('.k', { hasText: /^Tổng giá trị/ }) }).locator('.v')).toHaveText('-');
  await expect(page.locator('[data-basis-avail]')).toHaveCount(0); // T37 #4
  // Sau bước 10 (đã chốt báo giá) có Tổng giá trị.
  await jump(page, 13);
  await expect(page.locator('.tmain .ginfo').first()).not.toContainText('Giá trị dự kiến');
  await expect(page.locator('[data-basis-avail]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('#20 + B19: bóc tách trên màn Lập ĐXMS — bớt hạng mục, thêm hạng mục từ dự toán → rà soát tồn kho / YCBG dùng danh sách mới', async ({ page }) => {
  await fresh(page);
  await jump(page, 5);
  await expect(page.locator('[data-luong-form]')).toHaveCount(1);
  // Góp ý 06/11: bóc tách sửa trong popup (✦ Gợi ý lại) — bỏ hạng mục 5; thêm hạng mục từ dự toán = tự thêm khoản mục vào bảng Loại chi phí.
  await page.evaluate(() => { D.bocHide = false; }); // Review nhi 06/11 #18: bảng tạm ẩn — bật lại để kiểm.
  await page.locator('[data-lf-ai-sec="boc"]').click();
  await page.locator('[data-lf-pop-ion="5"]').uncheck();
  await page.locator('[data-lf-ai-apply]').click();
  await expect(page.locator('[data-lf-boc-sum]')).toContainText('4 / 5');
  await pickSel(page, 'lf-ctype', 'PL2');
  await page.locator('[data-vsel="lf-cline"]').click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  await page.locator('[data-lf-cadd]').click();
  const cid = await page.locator('[data-lf-cqty]').last().getAttribute('data-lf-cqty');
  // T45 — SRS 12 BR-LDX-C-03, BR-LDX-02-04 V0.3 (review khách 10/11): vượt Còn lại khả dụng (khoản mục còn 2 Bộ) thì chặn Gửi — nhập 2 (trước T45: 3, chỉ cảnh báo).
  await page.locator(`[data-lf-cqty="${cid}"]`).fill('2');
  await page.locator(`[data-lf-cval="${cid}"]`).fill('1.000.000');
  await aiApply(page, ['basic']);
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  const it = await page.evaluate(() => D.items.map((i) => [i.n, i.buy]));
  expect(it.map((x) => x[0])).not.toContain(5);
  expect(it.find((x) => x[0] === 101)).toEqual([101, 2]);
  // Bước 8 (biến ycbgHang): danh mục hàng hoá YCBG có hạng mục thêm, không có hạng mục đã bỏ.
  const v = await page.evaluate(() => EVars.of({ id: 'x8', task: 8, who: 'minh' }).ycbgHang.map((r) => r.n));
  expect(v).toContain(101);
  expect(v).not.toContain(5);
  expect(page.errors).toEqual([]);
});

test('#26: bước 8 theo màn Thêm mới YCBG của hệ thống cũ — Thông tin chung, Danh mục hàng hoá (Model, Yêu cầu kỹ thuật), Tài liệu kỹ thuật, Điều khoản', async ({ page }) => {
  await fresh(page);
  await jump(page, 8);
  await page.locator('.task-acts [data-act].primary').click();
  const f = form(page);
  const heads = await f.locator('.ef-text h4').allInnerTexts();
  expect(heads.slice(0, 4)).toEqual(['Thông tin chung', 'Nhà cung cấp nhận yêu cầu', 'Danh mục hàng hoá yêu cầu báo giá', 'Tài liệu kỹ thuật']);
  await expect(f.locator('[data-ef="maYcbg"]')).toHaveValue(/^YCBG-2026-0117-1$/);
  const da = f.locator('.ef-table', { hasText: 'Thông tin dự án / đề tài' });
  await expect(da.locator('thead th')).toHaveText(['Mã dự án / đề tài', 'Tên dự án / đề tài', 'Loại', 'Nguồn vốn']);
  await expect(da.locator('tbody tr').first()).toContainText('NV-KHCN-2026-014');
  await expect(da.locator('tbody tr').first()).toContainText('Quỹ phát triển KHCN');
  await expect(f.locator('[data-ef="ngayYcbg"]')).not.toHaveValue('');
  await f.locator('[data-ef="ycbgHang::0::model"]').fill('N9042B');
  await f.locator('[data-ef="ycbgHang::0::spec"]').fill('Dải tần 2 Hz – 44 GHz');
  await f.locator('[data-ef-file="tepKyThuat"]').setInputFiles({ name: 'Yeu-cau-ky-thuat.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(8) });
  await expect(f.locator('[data-ef-field="tepKyThuat"]')).toContainText('Yeu-cau-ky-thuat.pdf');
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);
  const u = await page.evaluate(() => ({ h: Flow.ui.ycbgHang[0], f: Flow.ui.tepKyThuat, t: Flow.ui.tenYcbg }));
  expect(u.h).toMatchObject({ model: 'N9042B', spec: 'Dải tần 2 Hz – 44 GHz' });
  expect(u.f).toBe('Yeu-cau-ky-thuat.pdf');
  expect(u.t).toContain('Yêu cầu báo giá');
  expect(page.errors).toEqual([]);
});
