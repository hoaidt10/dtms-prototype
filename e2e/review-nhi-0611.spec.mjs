// Review nhi 06/11 (prototype/prototype-review/review-nhi-2026-11-060934.json, 17 comment): Lập ĐXMS, bước 10 / 10.1, 12, 13, 16, 16.1.
import { test, expect } from '@playwright/test';
import { fresh, openForm } from './helpers.mjs';

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

test('#1 Lập ĐXMS: không còn khối Thông tin cơ bản; Nhóm mục đích, Nguồn vốn ở Thông tin chung, AI gợi ý ở popup của khối', async ({ page }) => {
  await fresh(page, '#/luong/create');
  await expect(page.locator('[data-lf-basic]')).toHaveCount(0);
  const chung = page.locator('[data-lf-chung]');
  await expect(chung.locator('[data-vsel="lf-purpose"]')).toHaveCount(1);
  await expect(chung.locator('[data-vsel="lf-fund"]')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

test('#2 #3 #7 bước 10: không có card so sánh báo giá; Báo giá đạt = tệp + giá trị cuối cùng; 10.1 Đồng ý / Từ chối', async ({ page }) => {
  await fresh(page);
  await jump(page, 10);
  await expect(page.locator('[data-bg-card]')).toHaveCount(0);
  await expect(acts(page)).toHaveText(['Báo giá đạt', 'Không đạt — tạo YCBG mới']);
  const f = await openForm(page, 'Báo giá đạt');
  await expect(f).not.toContainText('So sánh báo giá');
  await expect(f).not.toContainText('Kết quả AI kiểm tra báo giá');
  await expect(f.locator('[data-ef="giaTriBaoGia"]')).toBeVisible();
  await expect(f.locator('.ef-docs')).toContainText('Báo giá —');
  // Thiếu tệp báo giá → chặn.
  await f.locator('#ok').click();
  await expect(f).toBeVisible();
  for (const inp of await f.locator('[data-ef-doc^="quote_"]').all()) await inp.setInputFiles({ name: 'BG.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await f.locator('[data-ef="giaTriBaoGia"]').fill('150000000000');
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => [String(t.task), t.who]))).toContainEqual(['10.1', 'thauch']);
  expect(await page.evaluate(() => Flow.state.vars.totalQ)).toBe(150);

  // 10.1: Chỉ huy Thầu thấy giá trị và tệp; Đồng ý → theo giá trị (150 tỷ < 160) sang bước 11 (BM-09).
  const k = await page.evaluate(() => { const t = Flow.state.tokens.find((x) => String(x.task) === '10.1'); Flow.setPersona(t.who); location.hash = '#/task/' + t.id; return t.id; });
  expect(k).toBeTruthy();
  await expect(acts(page)).toHaveText(['Đồng ý', 'Từ chối']);
  const f2 = await openForm(page, 'Đồng ý');
  await expect(f2).toContainText('150.000.000.000 đồng');
  await expect(f2.locator('.ef-table')).toContainText('Đã tải lên');
  await f2.locator('#ok').click();
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toContain('11');
  expect(page.errors).toEqual([]);
});

test('#7 Không đạt — tạo YCBG mới hỏi lý do, không mở form báo giá; 10.1 Từ chối về bước 10', async ({ page }) => {
  await fresh(page);
  await jump(page, 10);
  await acts(page).filter({ hasText: 'Không đạt' }).click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect(page.locator('.vmodal textarea')).toBeVisible();
  await page.locator('.vmodal [data-close]').first().click();
  await jump(page, '10.1');
  await acts(page).filter({ hasText: 'Từ chối' }).click();
  await page.locator('.vmodal textarea').fill('Thiếu báo giá NCC Gamma.');
  await page.locator('.vmodal #ok, .vmodal #go').first().click();
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toContain('10');
});

test('#4 #5 #6 #8 #9 bước 12: mục 1–6 theo mẫu BM-01, phụ lục trong Checklist 01 có tệp + tải thêm, Xem trước BM-01', async ({ page }) => {
  await fresh(page);
  await jump(page, 12);
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  const heads = await f.locator('.ef-gh').allInnerTexts();
  for (const h of ['1. Mục đích', '2. Phạm vi, quy mô đề xuất mua sắm', '3. Giá trị của đề xuất mua sắm', '4. Nguồn vốn và thời gian thực hiện', '5. Đánh giá hiệu quả', '6. Biện pháp và kế hoạch'])
    expect(heads.some((x) => x.startsWith(h)), h).toBe(true);
  expect(heads.some((x) => x.startsWith('BM-01'))).toBe(true);
  await expect(f).not.toContainText('Hồ sơ kèm theo và phụ lục (Có / Không)');
  const cl = f.locator('.ef-dl', { hasText: 'Checklist 01 — danh mục hồ sơ' });
  await expect(cl).toBeVisible();
  const pl = cl.locator('.ef-row', { hasText: 'Phụ lục Chỉ tiêu kỹ thuật' });
  await expect(pl.locator('[data-ef-radio$="kemTheo"]')).toHaveCount(2);
  await expect(cl.locator('.ef-row', { hasText: 'Văn bản căn cứ' })).toContainText('.pdf');
  // Chọn Có cho một phụ lục → hiện Tải thêm; tải tệp → không còn báo thiếu.
  await pl.locator('[data-ef-radio$="kemTheo"]', { hasText: 'Có' }).click();
  await pl.locator('[data-ef-file]').setInputFiles({ name: 'PL-CTKT.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await expect(cl.locator('.ef-row', { hasText: 'Phụ lục Chỉ tiêu kỹ thuật' })).toContainText('PL-CTKT.pdf');
  // Tài liệu đính kèm của popup không lặp phụ lục.
  await expect(f.locator('.ef-docs')).not.toContainText('Phụ lục');
  // Xem trước BM-01 với nội dung đang nhập (chưa lưu).
  await f.locator('[data-ef="mucDich"]').fill('Mục đích thử nghiệm xem trước.');
  await f.locator('[data-ef-pv]').click();
  const pv = page.locator('.vmodal').last();
  await expect(pv.locator('[data-doc="BM-01"]')).toContainText('Mục đích thử nghiệm xem trước.');
  await expect(pv.locator('[data-doc="BM-01"]')).toContainText('Phụ lục Chỉ tiêu kỹ thuật');
  expect(page.errors).toEqual([]);
});

test('#8 #9 hồ sơ dưới 160 tỷ: bước 11 dùng BM-09 và Checklist 02', async ({ page }) => {
  await fresh(page);
  await jump(page, 11, 'MS01.03', 'ĐXMS-2026-0098');
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  expect((await f.locator('.ef-gh').allInnerTexts()).some((x) => x.startsWith('BM-09'))).toBe(true);
  await expect(f.locator('.ef-dl', { hasText: 'Checklist 02 — danh mục hồ sơ' })).toBeVisible();
  await expect(f).toContainText('Tờ trình BM-09');
  await f.locator('[data-ef-pv]').click();
  await expect(page.locator('.vmodal').last().locator('[data-doc="BM-09"]')).toBeVisible();
});

test('#10 #11 #12 bước 13: hộp thoại "Tờ trình đề xuất mua sắm", từng phần hiện nội dung đã điền, có Xem trước', async ({ page }) => {
  await fresh(page);
  await jump(page, 13);
  const f = await openForm(page, 'Đồng ý');
  await expect(f.locator('.vmodal-h h3')).toHaveText('Tờ trình đề xuất mua sắm');
  await expect(f.locator('.ef-row', { hasText: '1. Mục đích' })).toContainText('Mục đích:');
  await expect(f.locator('.ef-row', { hasText: '4. Nguồn vốn' })).toContainText('Thời gian thực hiện mua sắm');
  await expect(f.locator('[data-ef-pv]')).toHaveText(/Xem trước BM-01/);
});

test('#13–#17 bước 16 / 16.1: nhãn nút, CQCM dropdown + bảng, form BM-03, Xem trước BM-03', async ({ page }) => {
  await fresh(page);
  await jump(page, 16);
  await expect(acts(page).first()).toHaveText('Lập phiếu yêu cầu thẩm định');
  const f = await openForm(page, 'Lập phiếu yêu cầu thẩm định');
  await expect(f.locator('[data-vsel="ef-cqcmSel"]')).toHaveCount(1);
  await expect(f.locator('.ef-dl', { hasText: 'Cơ quan chuyên môn đã chọn' })).toContainText('Ban Pháp chế');
  for (const k of ['bm03Vv', 'bm03CanCu', 'bm03NoiDung', 'dmDienThoai', 'dmEmail', 'bm03NoiNhan']) await expect(f.locator(`[data-ef="${k}"]`)).toHaveCount(1);
  await f.locator('[data-ef="bm03NoiNhan"]').fill('Như trên; Ban Tổng Giám đốc; Lưu: VT.');
  await f.locator('[data-ef-pv]').click();
  const pv = page.locator('.vmodal').last();
  await expect(pv.locator('[data-doc="BM-03"]')).toContainText('Ban Tổng Giám đốc');
  await expect(pv.locator('[data-doc="BM-03"]')).toContainText('Ban Pháp chế');
  await jump(page, '16.1');
  await expect(acts(page).first()).toHaveText('Phê duyệt phiếu yêu cầu thẩm định');
  expect(page.errors).toEqual([]);
});
