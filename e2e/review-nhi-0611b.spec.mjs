// Review nhi 06/11 lần 2 (prototype/prototype-review/review-nhi-2026-11-061141.json, #18–#40). SCR-105 (#21, #31–33) kiểm ở t29-b3.
import { test, expect } from '@playwright/test';
import { fresh, openForm, aiFill, lastToast } from './helpers.mjs';

async function jump(page, task, proc = 'MS01.01', dxms) {
  return page.evaluate(([t, p, d]) => {
    Flow.jumpTo(t, 'minh', {}, p, d || undefined, null, false);
    const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
    Flow.setPersona(k.who);
    location.hash = '#/task/' + k.id;
    return { id: k.id, who: k.who };
  }, [task, proc, dxms]);
}
const acts = (page) => page.locator('.task-acts [data-act]');
const tasks = (page) => page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)));

test('#18 popup Bóc tách: bảng AI bước 6 tạm ẩn, Áp dụng vẫn điền bảng Loại chi phí; #20 không còn khối Phụ lục', async ({ page }) => {
  await fresh(page, '#/luong/create');
  await expect(page.locator('[data-lf-plcard]')).toHaveCount(0);
  await page.locator('[data-vsel="lf-nv"]').click();
  await page.locator('.vsel-panel [data-opt="NV-KHCN-2026-014"]').click();
  // T72 #83 (D-122 Q4): không còn nút / popup AI ở khối Căn cứ — chọn đề tài thì hệ thống bóc tách, điền bảng.
  await expect(page.locator('[data-lf-ai-sec="boc"]')).toHaveCount(0);
  await expect(page.locator('[data-lf-boc-sum]')).toContainText('5 / 5');
  await expect(page.locator('[data-lf-boc-sum]')).not.toContainText('Gợi ý lại');
  await expect(page.locator('[data-lf-cqty]').first()).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('#19 Lập ĐXMS mở lại ở Việc của tôi: có Nhân sự thực hiện; Lưu áp cho các bước chưa xong của vai trò', async ({ page }) => {
  await fresh(page);
  await jump(page, 1);
  await expect(page.locator('[data-luong-form]')).toHaveCount(1);
  await expect(page.locator('[data-lf-members]')).toHaveCount(1);
  await page.locator('[data-lf-add]').click();
  await page.locator('#lf-draft').click();
  await expect(page.locator('[data-lf-members] .msg').first()).toContainText('Vai trò thực hiện');
  await page.locator('[data-lf-members] [data-vsel^="lf-role-"]').click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Chỉ huy' }).first().click();
  await page.locator('[data-lf-members] [data-vsel^="lf-m-"]').click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  await page.locator('#lf-draft').click();
  await expect(page.locator('[data-lf-members] .msg')).toHaveCount(0);
  await expect.poll(() => lastToast(page)).toContain('Đã lưu nháp');
  expect(await page.evaluate(() => (Flow.state.memberLog || []).length)).toBeGreaterThan(0);
  expect(page.errors).toEqual([]);
});

test('#22 #23 #24 bước 8: nút Tạo yêu cầu báo giá; sửa tên, xoá, thêm hàng hoá; không còn Đối soát ĐXMS', async ({ page }) => {
  await fresh(page);
  await jump(page, 8);
  await expect(acts(page).first()).toHaveText('Tạo yêu cầu báo giá');
  const f = await openForm(page, 'Tạo yêu cầu báo giá');
  await expect(f).not.toContainText('Đối soát ĐXMS');
  await expect(f.locator('[data-ef="ycbgHang::0::hang"]')).toHaveValue('Máy phân tích phổ vector 44 GHz');
  await f.locator('[data-ef="ycbgHang::0::hang"]').fill('Máy phân tích phổ 44 GHz (đổi tên)');
  const n = await f.locator('[data-ef-del="ycbgHang"]').count();
  await f.locator('[data-ef-add="ycbgHang"]').click();
  await expect(f.locator('[data-ef-del="ycbgHang"]')).toHaveCount(n + 1);
  await f.locator(`[data-ef="ycbgHang::${n}::hang"]`).fill('Cáp đo RF');
  await f.locator(`[data-ef="ycbgHang::${n}::uom"]`).fill('Sợi');
  await f.locator(`[data-ef="ycbgHang::${n}::sl"]`).fill('4');
  await f.locator('[data-ef-del="ycbgHang"]').nth(1).click();
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  const rows = await page.evaluate(() => Flow.ui.ycbgHang.map((r) => r.hang));
  expect(rows[0]).toBe('Máy phân tích phổ 44 GHz (đổi tên)');
  expect(rows).toContain('Cáp đo RF');
  expect(rows).toHaveLength(n);
  expect(page.errors).toEqual([]);
});

test('#25 bước 10: popup Báo giá đạt không còn Căn cứ đã được phê duyệt; giữ giá trị khi tạo luồng', async ({ page }) => {
  await fresh(page);
  await jump(page, 10);
  const before = await page.evaluate(() => Flow.state.vars.basisTD);
  const f = await openForm(page, 'Báo giá đạt');
  await expect(f.locator('[data-vsel="ef-canCuDuyet"]')).toHaveCount(0);
  await expect(f).not.toContainText('Căn cứ đã được phê duyệt');
  for (const inp of await f.locator('[data-ef-doc^="quote_"]').all()) await inp.setInputFiles({ name: 'BG.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);
  expect(await page.evaluate(() => Flow.state.vars.basisTD)).toBe(before);
});

test('#26 #34 #35 bước 12: nhãn Soạn thảo tờ trình ĐXMS; ✦ Gợi ý từ AI tắt popup được, AI tự điền ô trống kèm nguồn, ô đã nhập giữ nguyên', async ({ page }) => {
  await fresh(page);
  await jump(page, 12);
  await expect(acts(page).first()).toHaveText('Soạn thảo tờ trình ĐXMS');
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  await expect(f.locator('.vmodal-h h3')).toHaveText('Soạn thảo tờ trình ĐXMS');
  await expect(f.locator('[data-ef-radio$="quyetDinh"]')).toHaveCount(0);
  await expect(f.locator('[data-ef="mucDich"]')).toHaveValue('');
  await expect(f.locator('[data-ef="suCanThiet"]')).toHaveValue('');
  await f.locator('[data-ef="hieuQua"]').fill('Hiệu quả do người soạn nhập.');
  await page.evaluate(() => { D.aiDelay = 400; });
  await f.locator('[data-ef-aifill]').click();
  // Đóng hộp thoại tiến trình: AI vẫn chạy nền, nút báo đang gợi ý.
  await expect(page.locator('[data-ef-ai-wait]')).toBeVisible();
  await page.locator('.vmodal:has([data-ef-ai-wait]) [data-close]').first().click();
  await expect(page.locator('[data-ef-ai-wait]')).toHaveCount(0);
  await expect(f.locator('[data-ef-aifill]')).toBeDisabled();
  await expect(f.locator('[data-ef="mucDich"]')).not.toHaveValue('');
  await expect(f.locator('[data-ef="suCanThiet"]')).not.toHaveValue('');
  await expect(f.locator('[data-ef="hieuQua"]')).toHaveValue('Hiệu quả do người soạn nhập.');
  await expect(f.locator('[data-ef-ai-src]').first()).toContainText('Nguồn:');
  expect(page.errors).toEqual([]);
});

test('#34 đóng cả form khi AI đang chạy: kết quả vào bản nháp, mở lại thấy ngay', async ({ page }) => {
  await fresh(page);
  await jump(page, 12);
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  await page.evaluate(() => { D.aiDelay = 300; });
  await f.locator('[data-ef-aifill]').click();
  await page.locator('.vmodal:has([data-ef-ai-wait]) [data-close]').first().click();
  await f.locator('[data-close]').first().click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect.poll(() => lastToast(page)).toContain('AI đã gợi ý xong');
  const f2 = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  await expect(f2.locator('[data-ef="mucDich"]')).not.toHaveValue('');
  expect(page.errors).toEqual([]);
});

test('#27 Checklist: Yêu cầu, Tình trạng radio Có / Không, tải về được; dòng bắt buộc chọn Không thì chặn gửi', async ({ page }) => {
  await fresh(page);
  await jump(page, 12);
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  await aiFill(page);
  const cl = f.locator('.ef-dl', { hasText: 'Checklist 01 — danh mục hồ sơ' });
  const can = cl.locator('.ef-row', { hasText: 'Văn bản căn cứ' });
  await expect(can).toContainText('Bắt buộc');
  await expect(can.locator('[data-ef-radio$="kemTheo"]')).toHaveText(['Có', 'Không']);
  await expect(can.locator('.vradio-opt.on')).toHaveText('Có');
  const url = page.url();
  await can.locator('a[data-dl]').first().click();
  expect(await lastToast(page)).toContain('Đã tải xuống');
  expect(page.url()).toBe(url);
  await can.locator('[data-ef-radio$="kemTheo"]', { hasText: 'Không' }).click();
  await f.locator('#ok').click();
  expect(await lastToast(page)).toContain('danh mục bắt buộc');
  await expect(f).toBeVisible();
  // Dòng không bắt buộc: chọn Có mà chưa có tệp thì cần tải lên.
  await can.locator('[data-ef-radio$="kemTheo"]', { hasText: 'Có' }).click();
  const hd = cl.locator('.ef-row', { hasText: 'Hợp đồng tương tự' });
  await expect(hd.locator('.vradio-opt.on')).toHaveText('Không');
  await hd.locator('[data-ef-radio$="kemTheo"]', { hasText: 'Có' }).click();
  await f.locator('#ok').click();
  expect(await lastToast(page)).toContain('cần tải tệp lên');
  await hd.locator('[data-ef-file]').setInputFiles({ name: 'HD-tuong-tu.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await expect(cl.locator('.ef-row', { hasText: 'Hợp đồng tương tự' }).locator('a[data-dl]')).toContainText('HD-tuong-tu.pdf');
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect.poll(() => tasks(page)).toEqual(['13']);
  expect(page.errors).toEqual([]);
});

test('#36 mục 3 sửa được: thành tiền, tổng, bằng chữ tự tính; lệch giá đã duyệt cảnh báo; vào Tờ trình', async ({ page }) => {
  await fresh(page);
  await jump(page, 12);
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  await aiFill(page);
  await expect(f).toContainText('182.900.000.000 VNĐ');
  await expect(f.locator('.banner-info', { hasText: 'lệch giá trị báo giá' })).toHaveCount(0);
  const sl = f.locator('[data-ef="phuLucEd::0::sl"]');
  await sl.fill('21');
  await sl.blur();
  await expect(f).toContainText('186.100.000.000 VNĐ');
  await expect(f.locator('.banner-info', { hasText: 'lệch giá trị báo giá' })).toBeVisible();
  // Danh mục mục 2b theo số lượng mới.
  await expect(f.locator('.ef-table', { hasText: 'Danh mục hàng hóa, dịch vụ' }).locator('tbody tr').first()).toContainText('21');
  await f.locator('[data-ef-pv]').click();
  const pv = page.locator('.vmodal').last();
  await expect(pv.locator('[data-doc="BM-01"]')).toContainText('186.100.000.000 VNĐ');
  await pv.locator('[data-close]').first().click();
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect.poll(() => tasks(page)).toEqual(['13']);
  expect(await page.evaluate(() => Flow.ci().total)).toBe(186.1);
  expect(page.errors).toEqual([]);
});

test('#36 qua ngưỡng 160 tỷ: gửi thì đổi sang BM-09 + Checklist 02, ở lại để kiểm tra, không sang bước 13', async ({ page }) => {
  await fresh(page);
  const k = await jump(page, 12);
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  await aiFill(page);
  const sl = f.locator('[data-ef="phuLucEd::0::sl"]');
  await sl.fill('5');
  await sl.blur();
  await expect(f.locator('.banner-info', { hasText: 'BM-09 và Checklist 02' })).toBeVisible();
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect.poll(() => tasks(page)).toEqual(['11']);
  expect(await lastToast(page)).toContain('BM-09');
  expect(await page.evaluate((id) => Flow.state.tokens[0].id === id && Flow.state.vars.process, k.id)).toBe('MS01.03');
  const f2 = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  expect((await f2.locator('.ef-gh').allInnerTexts()).some((x) => x.startsWith('BM-09'))).toBe(true);
  await expect(f2.locator('.ef-dl', { hasText: 'Checklist 02 — danh mục hồ sơ' })).toBeVisible();
  await expect(f2.locator('[data-ef="phuLucEd::0::sl"]')).toHaveValue('5');
  expect(page.errors).toEqual([]);
});

test('#28 #29 #38 #39 bước 13: một nút Phê duyệt; form có Đồng ý / Từ chối, Danh mục hàng hoá, Checklist không có Số văn bản, tải tệp được', async ({ page }) => {
  await fresh(page);
  await jump(page, 13);
  await expect(acts(page)).toHaveText(['Phê duyệt']);
  const f = await openForm(page, 'Phê duyệt');
  await expect(f.locator('#ok')).toHaveText('Đồng ý');
  await expect(f.locator('#ef-no')).toHaveText('Từ chối');
  await expect(f).not.toContainText('Cơ cấu chi phí');
  await expect(f.locator('.ef-table', { hasText: 'Danh mục hàng hoá, dịch vụ' })).toContainText('Chủng loại');
  const cl = f.locator('.ef-table', { hasText: 'Checklist hồ sơ' });
  await expect(cl.locator('thead')).not.toContainText('Số văn bản');
  await cl.locator('tr', { hasText: 'Văn bản căn cứ' }).locator('a[data-dl]').click();
  expect(await lastToast(page)).toContain('Đã tải xuống');
  // Từ chối = nhánh Không đồng ý của BPMN.
  await f.locator('.ef-row', { hasText: '1. Mục đích' }).locator('[data-ef-radio$="ketQua"]', { hasText: 'Không đạt' }).click();
  await f.locator('#ef-no').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect.poll(() => tasks(page)).toEqual(['12']);
  expect(await page.evaluate(() => Flow.lastOf(13).action)).toBe('Không đồng ý');
  expect(page.errors).toEqual([]);
});

test('#30 #38 bước 16.1: form hiện đủ phiếu BM-03; Từ chối bắt buộc ý kiến, về bước 16; Đồng ý sang 17', async ({ page }) => {
  await fresh(page);
  await jump(page, '16.1');
  await expect(acts(page)).toHaveText(['Phê duyệt phiếu yêu cầu thẩm định']);
  const f = await openForm(page, 'Phê duyệt phiếu yêu cầu thẩm định');
  for (const s of ['Trích yếu', 'Căn cứ', 'Nội dung đề nghị góp ý', 'Hạn góp ý', 'Đầu mối tiếp nhận', 'Điện thoại đầu mối', 'Email đầu mối', 'Nơi nhận', 'Phiếu BM-03 đã ký nháy']) await expect(f).toContainText(s);
  await expect(f).toContainText('V/v đề nghị góp ý dự thảo hồ sơ ĐXMS');
  await expect(f).not.toContainText('&quot;');
  await expect(f.locator('.ef-table', { hasText: 'Kính gửi' })).toContainText('Lê Thanh Hòa');
  await f.locator('#ef-no').click();
  expect(await lastToast(page)).toContain('ý kiến khi từ chối');
  await expect(f).toBeVisible();
  await f.locator('[data-ef="yKien"]').fill('Sửa lại hạn góp ý.');
  await f.locator('#ef-no').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect.poll(() => tasks(page)).toEqual(['16']);
  expect(await page.evaluate(() => Flow.lastOf('16.1').reason)).toBe('Sửa lại hạn góp ý.');
  expect(page.errors).toEqual([]);
});

test('#37 Xem trước BM-01: chỉ Xuất file Word; văn bản khác giữ Tải xuống', async ({ page }) => {
  await fresh(page);
  await jump(page, 12);
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  await f.locator('[data-ef-pv]').click();
  const pv = page.locator('.vmodal').last();
  await expect(pv.locator('[data-word="BM-01"]')).toBeVisible();
  await expect(pv.getByRole('button', { name: 'Tải xuống', exact: true })).toHaveCount(0);
  await pv.locator('[data-close]').first().click();
  await f.locator('[data-close]').first().click();
  await jump(page, 16);
  const f2 = await openForm(page);
  await f2.locator('[data-ef-pv]').click();
  await expect(page.locator('.vmodal').last().locator('[data-dl]')).toHaveCount(1);
  await expect(page.locator('.vmodal').last().locator('[data-word]')).toHaveCount(0);
});

test('#40 bước 16: chọn Người thẩm định của từng CQCM; bước 19 giao đúng người', async ({ page }) => {
  await fresh(page);
  await jump(page, 16);
  const f = await openForm(page);
  const dl = f.locator('.ef-dl', { hasText: 'Cơ quan chuyên môn đã chọn' });
  await expect(dl.locator('.ef-row', { hasText: 'Ban Pháp chế' }).locator('[data-vsel="ef-cqcmNguoiDs::0::nguoi"]')).toContainText('Lê Thanh Hòa');
  await dl.locator('[data-vsel="ef-cqcmNguoiDs::0::nguoi"]').click();
  await page.locator('.vsel-panel [data-opt="ngatt"]').click();
  await expect(dl.locator('[data-vsel="ef-cqcmNguoiDs::0::nguoi"]')).toContainText('Trần Thị Nga');
  for (const inp of await f.locator('[data-ef-doc]').all()) await inp.setInputFiles({ name: 'BM-03.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => Flow.ui.cqcmNguoi.PC)).toBe('ngatt');
  expect(await page.evaluate(() => Flow.cqcmDoer('PC'))).toBe('ngatt');
  expect(page.errors).toEqual([]);
});
