// T29 B17 — đối chiếu màn Soạn thảo TTr kinh phí của hệ thống cũ (HT-DXMS-IMG, HT-DXMS-TT):
// A3 căn cứ pháp lý điền sẵn (P-211); phụ lục Có / Không, Có thì tải tệp (P-212); A6 Xuất file Word Tờ trình theo mẫu cũ.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fresh, openForm, closeForm } from './helpers.mjs';

const gop = async (page, hash) => {
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
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);

test('SCR-96: căn cứ pháp lý điền sẵn; phụ lục mặc định Không, chọn Có thì tải tệp; Lưu mang lựa chọn và tệp sang hồ sơ', async ({ page }) => {
  await gop(page, '#/luong/create');
  await expect(page.locator('#lf-legal')).toHaveValue(/12868\/QĐ-CNVTQĐ ngày 20\/10\/2025/);
  await expect(page.locator('#lf-legal')).toHaveValue(/QT\.CNVTQĐ\.ĐTXD\.8\.6\.3\.23/);
  const pl = page.locator('[data-lf-plcard]');
  await expect(pl.locator('tbody tr')).toHaveCount(6);
  await expect(pl.locator('.vradio-opt.on')).toHaveText(Array(6).fill('Không'));
  await expect(pl.locator('[data-lf-plup]')).toHaveCount(0);

  await page.locator('[data-lf-pl="plCtkt|Có"]').click();
  await page.locator('[data-lf-pl="plBanVe|Có"]').click();
  await expect(pl.locator('[data-lf-plup]')).toHaveCount(2);
  await page.locator('[data-lf-plup="plCtkt"]').click();
  await page.locator('#lf-plfile').setInputFiles({ name: 'Chi-tieu-ky-thuat.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) });
  await expect(page.locator('[data-lf-plf="plCtkt"]')).toContainText('Chi-tieu-ky-thuat.pdf');
  // Chọn lại Không thì bỏ tệp.
  await page.locator('[data-lf-pl="plBanVe|Không"]').click();
  await page.locator('[data-lf-pl="plBanVe|Có"]').click();
  await expect(page.locator('[data-lf-plf="plBanVe"] [data-lf-plup]')).toHaveCount(1);

  await page.locator('#lf-title').fill('Luồng mua sắm thiết bị đo B17');
  await pick(page, 'lf-nv', 'NV-KHCN-2026-014');
  await page.locator('#lf-file').setInputFiles([{ name: 'QD-1482-VHT.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) }, { name: 'KH-2026.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) }]);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  const r = await page.evaluate(() => {
    const d = EVars.h.draftTask(), x = Flow.findDxms(Flow.state.dxms);
    return { pl: Flow.state.vars.phuLuc, file: Flow.ui.plCtkt, legal: x.legal,
      req: EVars.reqDocs({ task: d }).filter((q) => q.key.startsWith('pl')).map((q) => [q.key, q.have, !!q.opt]),
      cl: EVars.of({ task: d }).checklist.filter((c) => c.muc.startsWith('Phụ lục')).map((c) => [c.muc, c.yeuCau, c.tinhTrang]) };
  });
  expect(r.pl).toMatchObject({ plCtkt: 'Có', plBanVe: 'Có', plMuaSam: 'Không' });
  expect(r.file).toBe('Chi-tieu-ky-thuat.pdf');
  expect(r.legal).toContain('12868');
  expect(r.req).toEqual([['plCtkt', true, false], ['plBanVe', false, false]]);
  expect(r.cl).toContainEqual(['Phụ lục Chỉ tiêu kỹ thuật', 'Bắt buộc', 'Đủ']);
  expect(r.cl).toContainEqual(['Phụ lục Danh mục bản vẽ', 'Bắt buộc', 'Thiếu']);
  expect(r.cl).toContainEqual(['Phụ lục Trích lục nguồn', 'Không', 'Không áp dụng']);
  expect(page.errors).toEqual([]);
});

test('Bước lập dự thảo: phụ lục Có thiếu tệp thì chặn gửi, đổi sang Không thì qua; Tờ trình in Danh mục hồ sơ kèm theo; Xuất file Word theo mẫu cũ', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(12, 'minh', { phuLuc: { plMuaSam: 'Có', plTrichLuc: 'Có' } }, 'MS01.01', undefined, null, false); });
  const tok = await page.evaluate(() => Flow.tokensFor('minh').find((t) => t.task === 12).id);
  await go(page, '#/task/' + tok);
  await expect(page.locator('.doc-req', { hasText: 'Phụ lục' })).toHaveCount(2);
  const chk = await page.evaluate(() => {
    const t = Flow.state.tokens.find((x) => x.task === 12), v = EVars.of(t);
    return { form: [v.pl_plMuaSam, v.pl_plCtkt], miss: EVars.check(t, { label: 'Gửi' }, {}),
      off: EVars.check(t, { label: 'Gửi' }, { pl_plMuaSam: 'Không', pl_plTrichLuc: 'Không' }) };
  });
  expect(chk.form).toEqual(['Có', 'Không']);
  expect(chk.miss).toBe('Bạn cần tải lên Phụ lục Danh mục mua sắm chi tiết ở Danh sách tài liệu.');
  expect(chk.off || '').not.toContain('Phụ lục');

  // eForm bước lập dự thảo: khối Hồ sơ kèm theo và phụ lục — 6 radio Có / Không theo lựa chọn khi tạo.
  const f = await openForm(page);
  const grp = f.locator('.ef-group', { hasText: 'Hồ sơ kèm theo và phụ lục' });
  await expect(grp.locator('.vradio-opt.on[data-ef-radio$="pl_plMuaSam"]')).toHaveText('Có');
  await expect(grp.locator('.vradio-opt.on[data-ef-radio$="pl_plCtkt"]')).toHaveText('Không');
  await closeForm(page);

  // Xem trước Tờ trình (Văn bản đầu ra của bước) → mục Danh mục hồ sơ kèm theo + nút Xuất file Word.
  await page.locator('[data-preview]', { hasText: 'BM-01' }).first().click();
  const m = page.locator('.vmodal');
  await expect(m.locator('[data-doc-pl]')).toContainText('Phụ lục Danh mục mua sắm chi tiết');
  await expect(m.locator('[data-doc-pl]')).toContainText('Phụ lục Trích lục nguồn');
  await expect(m.locator('[data-doc-pl]')).not.toContainText('Chỉ tiêu kỹ thuật');
  const [dl] = await Promise.all([page.waitForEvent('download'), m.locator('[data-word="BM-01"]').click()]);
  expect(dl.suggestedFilename()).toMatch(/^BM-01_To-trinh_.+\.doc$/);
  const txt = readFileSync(await dl.path(), 'utf8');
  for (const s of ['TỜ TRÌNH', 'Kính gửi', '12868/QĐ-CNVTQĐ', 'I. THÔNG TIN CHUNG VỀ ĐỀ XUẤT MUA SẮM', '1. Mục tiêu đề xuất mua sắm',
    '2.3. Đánh giá hiện trạng tồn kho hàng hóa', '4.1. Hạng mục và kinh phí đề xuất', '5.3. Tổ chức thực hiện', 'II. DANH MỤC HỒ SƠ KÈM THEO',
    '1. Phụ lục Danh mục mua sắm chi tiết', '2. Phụ lục Trích lục nguồn', 'Times New Roman']) expect(txt).toContain(s);
  expect(page.errors).toEqual([]);
});
