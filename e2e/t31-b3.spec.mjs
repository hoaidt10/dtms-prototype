// T31 B3 — K4 bóc tách dự toán khi tạo KĐT (D-68), K4b mục BM-8.6.5 trong eForm (plan docs/dtms/prototype-T31-kdt-ia-chuan-bi.md §3 K4, K4b).
// SCR-55: card Thông tin đề tài / dự án như SCR-96 (+ Thêm vào KĐT, cảnh báo vượt phần còn lại, chặn vượt dự toán), trường chỉ đọc Loại biểu mẫu /
// Cấp phê duyệt / Hình thức trình ký, Căn cứ pháp lý; khả dụng tính chung ĐXMS + KĐT; bước 01 hiện duToanChon; bước 50 có mục BM-03 / Phụ lục thuyết minh bổ sung.
import { test, expect } from '@playwright/test';
import { fresh, openForm, closeForm } from './helpers.mjs';

const enc = encodeURIComponent;
const DT = 'NV-KHCN-2026-014'; // ĐXMS-2026-0101 giữ 1 bộ dòng 1, 2 chiếc dòng 6; KĐT-2026-0030 giữ 1 bộ dòng 1
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const pickV = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};
const pickT = async (page, id, text) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: text }).first().click();
};
const optText = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  const t = await page.locator(`.vsel-panel [data-opt="${value}"]`).innerText();
  await page.locator('.pg-title').click();
  return t;
};

test('SCR-55: bóc tách 2 dòng, cảnh báo vượt còn lại, chặn vượt dự toán; Lưu → SCR-56, SCR-104, bước 01 có dòng đã bóc tách', async ({ page }) => {
  await fresh(page, '#/kdt/create');
  await expect(page.locator('[data-kc-cost]')).toContainText('Chọn Đề tài / dự án để bóc tách chi phí từ dự toán.');
  await expect(page.locator('#k-form')).toHaveValue(/Chưa xác định/);
  await expect(page.locator('#k-sign')).toHaveValue(/VOffice/);
  await pickT(page, 'k-sec', 'Có');
  await expect(page.locator('#k-sign')).toHaveValue('Bản cứng (hồ sơ Mật)');
  await pickT(page, 'k-sec', 'Không');

  await page.locator('#k-title').fill('Đầu tư thiết bị đo kiểm cho trạm gNodeB thế hệ 2');
  await pickV(page, 'k-nv', DT);
  await pickT(page, 'k-type', 'Khoa học công nghệ');
  await pickT(page, 'k-nature', 'Cần tích hợp');
  await page.locator('#k-est').fill('60');
  await expect(page.locator('#k-level')).toHaveValue(/Chủ trương: Tổng Giám đốc VHT · KĐT: Tổng Giám đốc VHT — dự kiến/);
  await page.locator('#k-legal').fill('QĐ 1482/QĐ-VHT ngày 12/03/2026 giao nhiệm vụ KHCN');

  // Khả dụng tính chung: dòng 6 đã giữ 2 chiếc ở ĐXMS-2026-0101 → còn 8; dòng 1 giữ 1 ở ĐXMS-2026-0101 + 1 ở KĐT-2026-0030 → còn 2.
  await pickV(page, 'kc-ctype', 'PL2');
  expect(await optText(page, 'kc-cline', `${DT}-6`)).toContain('còn 8 Chiếc');
  expect(await optText(page, 'kc-cline', `${DT}-1`)).toContain('còn 2 Bộ');
  await pickV(page, 'kc-cline', `${DT}-6`);
  await expect(page.locator('[data-kc-cadd]')).toHaveText(/Thêm vào KĐT/);
  await page.locator('[data-kc-cadd]').click();
  await pickV(page, 'kc-ctype', 'PL2');
  await pickV(page, 'kc-cline', `${DT}-1`);
  await page.locator('[data-kc-cadd]').click();
  await expect(page.locator('[data-kc-cost] tbody tr')).toHaveCount(2);
  await page.locator('[data-kc-cqty]').nth(0).fill('9');
  await page.locator('[data-kc-cval]').nth(0).fill('0,3');
  await page.locator('[data-kc-cqty]').nth(1).fill('2');
  await page.locator('[data-kc-cval]').nth(1).fill('500');
  await page.locator('[data-kc-cpkg]').nth(1).fill('Gói thầu thiết bị đo');
  // Vượt dự toán của dòng: chặn Lưu; vượt phần còn lại: cảnh báo đỏ (hiện sau khi vẽ lại), không chặn.
  await page.locator('#k-save').click();
  await expect(page).toHaveURL(/#\/kdt\/create$/);
  await expect(page.locator('[data-kc-cost] .msg')).toHaveText(/Vượt giá trị dự toán/);
  await expect(page.locator('[data-kc-cwarn]').first()).toHaveText('Vượt khối lượng còn lại (8).');
  await page.locator('[data-kc-cval]').nth(1).fill('50');
  await expect(page.locator('[data-kc-sum]')).toContainText('50,30 tỷ đồng');
  await page.locator('#k-save').click();
  await expect(page).toHaveURL(/#\/kdt$/);
  const x = await page.evaluate(() => { const k = Flow.kdtAll()[0]; return { code: k.code, cost: k.cost.map((r) => [r.line, r.qty, r.value, r.pkg]), legal: k.legal }; });
  expect(x.cost).toEqual([[`${DT}-6`, 9, 0.3, ''], [`${DT}-1`, 2, 50, 'Gói thầu thiết bị đo']]);
  expect(x.legal).toContain('1482/QĐ-VHT');

  // SCR-56: bảng chỉ xem.
  await go(page, '#/kdt/' + enc(x.code));
  await expect(page.locator('[data-kdt-cost] tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-kdt-cost]')).toContainText('Máy tính xách tay cấu hình cao');
  await expect(page.locator('main .ginfo').first()).toContainText('Nội dung căn cứ pháp lý');

  // SCR-104: dòng 6 có KĐT vừa tạo (đang giữ); KPI ghi ĐXMS / KĐT.
  await go(page, '#/de-tai/' + enc(DT));
  await page.locator('[data-dt-tab="du-toan"]').click();
  await expect(page.locator('[data-dt-kpi]')).toContainText('Đang giữ (ĐXMS / KĐT đang xử lý)');
  await page.locator(`[data-vtt-row="${DT}-6"] [data-vtt]`).click();
  const row = page.locator(`[data-vtt-row="${DT}-6:${x.code}"]`);
  await expect(row).toContainText(`KĐT — ${x.code}`);
  await expect(row).toContainText('Chưa có hồ sơ');

  // Chỉnh sửa (chưa có hồ sơ): sửa được, KĐT không tự trừ phần của chính nó (dòng 6 vẫn còn 8).
  await go(page, '#/kdt/' + enc(x.code) + '/edit');
  await expect(page.locator('[data-kc-cqty]')).toHaveCount(2);
  await expect(page.locator('[data-kc-cost] tbody tr').first()).toContainText('8 Chiếc');

  // Tạo hồ sơ → bước 01 hiện các dòng đã bóc tách (duToanChon).
  await page.locator('[data-kdt-profiles] .vcard-h [data-go$="/tao-ho-so"]').click();
  await page.locator('#kc-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  const f = await openForm(page);
  await expect(f).toContainText('Dòng dự toán đề tài / dự án đã bóc tách khi tạo KĐT');
  await expect(f).toContainText('Máy tính xách tay cấu hình cao');
  await expect(f).toContainText('Gói thầu thiết bị đo');
  await closeForm(page);
  expect(page.errors).toEqual([]);
});

test('Khả dụng chung: KĐT-2026-0030 làm giảm khả dụng ở Thêm mới luồng (SCR-96); KĐT đã có hồ sơ thì card chỉ xem', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.setItem('dtms-proto-menu', 'gop'));
  await page.goto(page.url().replace(/#.*$/, '') + '#/luong/create');
  await pickV(page, 'lf-nv', DT);
  await pickV(page, 'lf-ctype', 'PL2');
  expect(await optText(page, 'lf-cline', `${DT}-1`)).toContain('còn 2 Bộ');

  await go(page, '#/kdt/' + enc('KĐT-2026-0030') + '/edit');
  await expect(page.locator('[data-kc-cost]')).toContainText('KĐT đã có hồ sơ');
  await expect(page.locator('[data-kc-cost]')).toContainText('Thiết bị, máy đo chuyên dụng');
  await expect(page.locator('[data-kc-cadd]')).toHaveCount(0);
  await go(page, '#/de-tai/' + enc(DT));
  await page.locator('[data-dt-tab="du-toan"]').click();
  await page.locator(`[data-vtt-row="${DT}-1"] [data-vtt]`).click();
  await expect(page.locator(`[data-vtt-row="${DT}-1:KĐT-2026-0030"]`)).toContainText('Đang lập');
  expect(page.errors).toEqual([]);
});

test('Bước 50 (K4b): mục BM-03 / Phụ lục thuyết minh theo BM-8.6.5, phụ lục theo Loại tài liệu; bước 39 có 7. Đánh giá hiệu quả', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS13"]').click();
  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-scene="K7"]').click();
  await expect(page).toHaveURL(/#\/task\//);
  const f = await openForm(page);
  for (const t of ['Phân tích nhu cầu', 'Kết luận về sự cần thiết', 'Kết quả rà soát tồn kho (chỉ xem)', 'Quan điểm, định hướng', 'Phương án thiết kế',
    'Giải pháp triển khai', 'Phương pháp tính, cơ sở đơn giá', 'Đánh giá hiệu quả', 'Tổ chức thực hiện', 'Các mốc thời gian chính']) await expect(f).toContainText(t);
  await closeForm(page);
  // Phụ lục tải lên theo Loại tài liệu, không bắt buộc.
  await expect(page.locator('main')).toContainText('Phụ lục Chỉ tiêu kỹ thuật');
  await page.locator('[data-preview]', { hasText: 'PL-TM' }).first().click();
  const pl = await page.locator('.pdf-view').innerText();
  expect(pl).toContain('Phân tích nhu cầu');
  expect(pl).toContain('Quan điểm, định hướng');
  expect(pl).toContain('Phê duyệt KĐT: 12/2026');
  await page.locator('.overlay [data-close]').first().click();
  // Bước 39 (tờ trình chủ trương BM-01): form có trường 7. Đánh giá hiệu quả — kiểm schema của form.
  const has39 = await page.evaluate(() => JSON.stringify(window.EForms.MS13({ task: 39 }, window.EVars.h).schema(window.EVars.h, { task: 39 })).includes('7. Đánh giá hiệu quả'));
  expect(has39).toBe(true);
  expect(page.errors).toEqual([]);
});
