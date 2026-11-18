// @ts-check
// T71 S6 (D-121): SX-08 bất thường sản xuất — luồng SX-BT, hạn xử lý theo SLA (ngày làm việc), quá hạn, giao triển khai theo loại, NOK quay lại bước 3.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const ok = (page) => page.locator('.vmodal #ok').click();
const pickEf = async (page, key, val) => { await page.locator(`.vmodal [data-vsel="ef-${key}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const openTask = async (page, pid, step) => {
  await as(page, pid, '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: step }).first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText(step);
};
const row = (page, code) => page.locator('.vtable tbody tr', { hasText: code });

test('SX-08 danh sách: hạn theo SLA ngày làm việc, quá hạn tô đỏ, Loại 3 theo nhà máy, phiếu chờ tiếp nhận', async ({ page }) => {
  await fresh(page, '#/sx/bat-thuong');
  await as(page, 'sxqa', '#/sx/bat-thuong');
  await expect(page.locator('.pg-title')).toContainText('Danh sách phiếu bất thường');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(4);
  // T74 #98: trạng thái theo bước (bước 5 triển khai = Đang xử lý); quá hạn tô đỏ ở Hạn xử lý / Còn lại.
  await expect(row(page, 'BT-2026-002')).toContainText('Đang xử lý');
  await expect(row(page, 'BT-2026-002')).toContainText('12/11/2026');
  await expect(row(page, 'BT-2026-002')).toContainText('Quá 2 ngày');
  await expect(row(page, 'BT-2026-002')).toContainText('Phạm Thu Hằng'); // Loại 2 → R&D triển khai
  await expect(row(page, 'BT-2026-002').locator('.due-over')).toHaveCount(1);
  await expect(row(page, 'BT-2026-003')).toContainText('Theo nhà máy');
  await expect(row(page, 'BT-2026-001')).toContainText('Đã đóng');
  await expect(row(page, 'BT-2026-004')).toContainText('Chờ tiếp nhận');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await as(page, 'sxnm', '#/sx/bat-thuong');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1); // chỉ dự án của nhà máy
  // R&D có việc triển khai Loại 2, form có Đề nghị mở thay đổi kỹ thuật.
  await openTask(page, 'sxrd', 'Triển khai theo loại');
  await expect(page.locator('[data-sxbt-xl]')).toContainText('Gá đỡ cụm thấu kính');
  await expect(page.locator('.hd-alert.error')).toContainText('quá hạn xử lý 2 ngày');
  await page.locator('[data-sx-do]').click();
  await expect(page.locator('.vmodal')).toContainText('Đề nghị mở yêu cầu thay đổi kỹ thuật (ECR)');
  expect(page.errors).toEqual([]);
});

test('Luồng SX-BT: phân loại tính hạn, phê duyệt, triển khai, Không đạt quay lại bước 3, đạt thì đóng phiếu', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  // T74 #101 / Q10: bước 2 có Hoàn thành tiếp nhận + Trả lại người lập (bắt buộc lý do); người lập sửa phiếu ở bước 1 rồi gửi lại.
  await openTask(page, 'sxpm', 'Tiếp nhận');
  await expect(page.locator('[data-sx-do]')).toHaveCount(2);
  await page.locator('[data-sx-do]', { hasText: 'Trả lại người lập' }).click();
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await page.locator('.vmodal [data-ef="blLyDoTra"]').fill('Thiếu CO dừng cấp phát — mức độ phải là Rất nghiêm trọng.');
  await ok(page);
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await openTask(page, 'sxqa', 'Lập phiếu');
  await page.locator('[data-sx-do]').click();
  await expect(page.locator('.vmodal [data-ef="btTitle"]')).toHaveValue(/thiếu chứng từ xuất xứ/);
  await pickEf(page, 'btMucDo', '1');
  await ok(page);
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await openTask(page, 'sxpm', 'Tiếp nhận');
  await page.locator('[data-sx-do]', { hasText: 'Hoàn thành tiếp nhận' }).click();
  await expect(page.locator('.vmodal [data-vsel="ef-blLoai"]')).toHaveCount(0); // loại / mức độ đã chọn ở bước 1
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await page.locator('.vmodal [data-ef="blNguyenNhan"]').fill('Nhà cung cấp gửi thiếu CO lô 2.');
  await ok(page);
  // Rất nghiêm trọng Loại 1 = 17 ngày làm việc từ 16/11/2026 → 09/12/2026.
  expect(await page.evaluate(() => { const x = SxBt.byCode('BT-2026-004'); return [x.type, x.sev, x.due, x.handler]; })).toEqual(['L1', 1, '2026-12-09', 'sxpm']);
  const step = async (pid, name, btn, fill) => {
    await openTask(page, pid, name);
    await page.locator('[data-sx-do]', { hasText: btn }).click();
    for (const [k, v] of fill) await page.locator(`.vmodal [data-ef="${k}"]`).fill(v);
    await ok(page);
    await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  };
  await step('sxpm', 'Đề xuất phương án', 'Trình phê duyệt', [['paHan', '30/11/2026'], ['paBienPhap', 'Yêu cầu nhà cung cấp bổ sung CO, tạm dùng lô 1.']]);
  await step('sxld', 'Phê duyệt phương án', 'Phê duyệt', []);
  await step('sxpm', 'Triển khai theo loại', 'Hoàn thành triển khai', [['tkKetQua', 'Đã nhận bản sao CO.']]);
  // Không đạt (NOK) bắt buộc lý do → quay lại bước 3.
  await openTask(page, 'sxqa', 'Kiểm tra kết quả');
  await page.locator('[data-sx-do]', { hasText: 'Không đạt' }).click();
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await page.locator('.vmodal [data-ef="ktKetQua"]').fill('Bản sao CO chưa hợp pháp hoá lãnh sự.');
  await ok(page);
  expect(await page.evaluate(() => SxFlow.caseOf('HSBT-BT-2026-004-01').tokens.map((t) => [t.step, t.who]))).toEqual([[3, 'sxpm']]);
  await step('sxpm', 'Đề xuất phương án', 'Trình phê duyệt', [['paBienPhap', 'Yêu cầu CO bản gốc hợp pháp hoá.']]);
  await step('sxld', 'Phê duyệt phương án', 'Phê duyệt', []);
  await step('sxpm', 'Triển khai theo loại', 'Hoàn thành triển khai', [['tkKetQua', 'Đã nhận CO bản gốc.']]);
  await step('sxqa', 'Kiểm tra kết quả', 'Đạt (OK)', []);
  await step('sxpm', 'Lưu hồ sơ', 'Đóng phiếu', [['bhBaiHoc', 'Bổ sung điều khoản CO vào hợp đồng mua linh kiện.']]);
  await as(page, 'sxpm', '#/sx/bat-thuong/BT-2026-004');
  await expect(page.locator('.ginfo')).toContainText('Đã đóng');
  await expect(page.locator('.ginfo')).toContainText('Số lần kiểm tra không đạt');
  await page.locator('[data-ttab="xl"]').click();
  await expect(page.locator('[data-sxbt-xl]')).toContainText('Bổ sung điều khoản CO');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="hist"]').click();
  // T71 S11: đóng phiếu có bài học → thêm dòng Tạo bài học kinh nghiệm (sx-ho-so.js).
  const top2 = await page.locator('main .vtable tbody tr').evaluateAll((l) => l.slice(0, 2).map((r) => r.innerText).join(' | '));
  expect(top2).toContain('Đóng phiếu bất thường');
  expect(top2).toContain('Tạo bài học kinh nghiệm');
  expect(page.errors).toEqual([]);
});

test('Nhà máy lập phiếu từ tab dự án: ngày phát hiện không sau hôm nay; việc tiếp nhận về Giám đốc dự án', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxnm', '#/sx/du-an/DA-SX-2026-003');
  await page.locator('[data-ttab="bt"]').click();
  await expect(page.locator('[data-sx-bt] section').first().locator('tbody tr')).toHaveCount(1);
  await page.locator('[data-sxbt-new="DA-SX-2026-003"]').click();
  await page.locator('.vmodal [data-ef="btFound"]').fill('20/11/2026');
  await page.locator('.vmodal [data-ef="btFound"]').press('Tab');
  await page.locator('.vmodal [data-ef="btTitle"]').fill('Adapter 12V lô mới nóng bất thường');
  await page.locator('.vmodal [data-ef="btDesc"]').fill('Đo nhiệt adapter 68°C sau 30 phút.');
  await page.locator('.vmodal [data-ef="btPlace"]').fill('Trạm đóng gói — Hải Phòng');
  // T74 #100: Phân loại, Mức độ, phiếu BM.QLBT.01 bắt buộc khi lập phiếu.
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(3);
  await pickEf(page, 'btLoai', 'L3');
  await pickEf(page, 'btMucDo', '4');
  await page.locator('.vmodal [data-ef-file="btFileBm"]').setInputFiles({ name: 'BM.QLBT.01_adapter.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await page.locator('.vmodal [data-ef="btGuess"]').fill('Adapter lô mới đổi nhà cung cấp linh kiện nguồn.');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('không được sau ngày hiện tại');
  await page.locator('.vmodal [data-ef="btFound"]').fill('16/11/2026');
  await page.locator('.vmodal [data-ef="btFound"]').press('Tab');
  await ok(page);
  await expect(page).toHaveURL(/#\/sx\/bat-thuong\/BT-2026-005$/);
  await expect(page.locator('.ginfo')).toContainText('Chờ tiếp nhận');
  await expect(page.locator('.ginfo')).toContainText('Ít nghiêm trọng');
  await expect(page.locator('.ginfo')).toContainText('đổi nhà cung cấp linh kiện nguồn');
  await expect(page.locator('main')).toContainText('BM.QLBT.01_adapter.pdf');
  await as(page, 'sxk2', '#/sx/viec-cua-toi');
  await expect(page.locator('[data-sx-tasks] tbody tr', { hasText: 'BT-2026-005' })).toContainText('Tiếp nhận');
  expect(page.errors).toEqual([]);
});
