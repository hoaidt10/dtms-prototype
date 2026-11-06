// T29 B17 — đối chiếu màn Soạn thảo TTr kinh phí của hệ thống cũ (HT-DXMS-IMG, HT-DXMS-TT):
// A3 căn cứ pháp lý điền sẵn (P-211); phụ lục Có / Không, Có thì tải tệp (P-212); A6 Xuất file Word Tờ trình theo mẫu cũ.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fresh, openForm, closeForm, aiApply } from './helpers.mjs';

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

test('SCR-96: căn cứ pháp lý điền sẵn; review nhi 06/11 #20: không còn khối Phụ lục, chưa tới bước lập dự thảo thì chưa có danh sách phụ lục', async ({ page }) => {
  await gop(page, '#/luong/create');
  await expect(page.locator('#lf-legal')).toHaveValue(/12868\/QĐ-CNVTQĐ ngày 20\/10\/2025/);
  await expect(page.locator('#lf-legal')).toHaveValue(/QT\.CNVTQĐ\.ĐTXD\.8\.6\.3\.23/);
  await expect(page.locator('[data-lf-plcard]')).toHaveCount(0);

  await page.locator('#lf-title').fill('Luồng mua sắm thiết bị đo B17');
  await pick(page, 'lf-nv', 'NV-KHCN-2026-014');
  await page.locator('#lf-file').setInputFiles([{ name: 'QD-1482-VHT.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) }, { name: 'KH-2026.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) }]);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  const r = await page.evaluate(() => {
    const d = EVars.h.draftTask(), x = Flow.findDxms(Flow.state.dxms);
    return { pl: Flow.state.vars.phuLuc, file: Flow.ui.plCtkt, legal: x.legal,
      req: EVars.reqDocs({ task: d }).filter((q) => q.key.startsWith('pl')).map((q) => [q.key, q.have, !!q.opt]),
      cl: EVars.of({ task: d }).checklist.filter((c) => c.muc.startsWith('Phụ lục')).map((c) => [c.muc, c.yeuCau, c.tinhTrang]) };
  });
  // T29 B19: bước 1–5 trên màn Lập ĐXMS — Gửi rồi xem màn xử lý bước 5.1 (Chỉ huy ĐVĐX).
  await aiApply(page);
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  await page.evaluate(() => { const t = Flow.state.tokens[0]; Flow.setPersona(t.who); location.hash = '#/task/' + t.id; });
  // Màn xử lý việc: chưa có khối Phụ lục; Danh sách tài liệu có tệp căn cứ gắn ĐXMS, cột Loại tài liệu / Gắn với.
  await expect(page.locator('[data-phu-luc]')).toHaveCount(0);
  const docs = page.locator('.vcard', { has: page.locator('h3', { hasText: 'Danh sách tài liệu' }) });
  await expect(docs.locator('thead')).toContainText('Gắn với');
  await expect(docs.locator('tbody tr', { hasText: 'QD-1482-VHT.pdf' })).toContainText('ĐXMS');
  expect(r.pl).toMatchObject({ plCtkt: 'Không', plBanVe: 'Không', plMuaSam: 'Không' });
  expect(r.legal).toContain('12868');
  expect(r.req).toEqual([]);
  expect(r.cl).toContainEqual(['Phụ lục Trích lục nguồn', 'Không', 'Không áp dụng']);
  expect(page.errors).toEqual([]);
});

test('Bước lập dự thảo: phụ lục Có thiếu tệp thì chặn gửi, đổi sang Không thì qua; Tờ trình in Danh mục hồ sơ kèm theo; review nhi 06/11 #37: Xuất file Word đúng văn bản đang xem, không còn Tải xuống', async ({ page }) => {
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
  // Review nhi 06/11 #4: phụ lục chọn / tải ở bảng Checklist của form.
  expect(chk.miss).toBe('Bạn cần tải lên Phụ lục Danh mục mua sắm chi tiết (bảng Checklist 01 của form hoặc Danh sách tài liệu), hoặc chọn Không kèm theo.');
  expect(chk.off || '').not.toContain('Phụ lục');

  // eForm bước lập dự thảo (review nhi 06/11 #4): 6 phụ lục là dòng của bảng Checklist 01, Kèm theo Có / Không theo lựa chọn khi tạo.
  const f = await openForm(page);
  const grp = f.locator('.ef-dl', { hasText: 'Checklist 01 — danh mục hồ sơ' });
  await expect(grp.locator('.ef-row', { hasText: 'Phụ lục Danh mục mua sắm chi tiết' }).first().locator('.vradio-opt.on[data-ef-radio$="kemTheo"]')).toHaveText('Có');
  await expect(grp.locator('.ef-row', { hasText: 'Phụ lục Chỉ tiêu kỹ thuật' }).locator('.vradio-opt.on[data-ef-radio$="kemTheo"]')).toHaveText('Không');
  await closeForm(page);

  // Xem trước Tờ trình (Văn bản đầu ra của bước) → mục Danh mục hồ sơ kèm theo + nút Xuất file Word.
  await page.locator('[data-preview]', { hasText: 'BM-01' }).first().click();
  const m = page.locator('.vmodal');
  await expect(m.locator('[data-doc-pl]')).toContainText('Phụ lục Danh mục mua sắm chi tiết');
  await expect(m.locator('[data-doc-pl]')).toContainText('Phụ lục Trích lục nguồn');
  await expect(m.locator('[data-doc-pl]')).not.toContainText('Chỉ tiêu kỹ thuật');
  await expect(m.locator('.vmodal-acts [data-dl]')).toHaveCount(0);
  const [dl] = await Promise.all([page.waitForEvent('download'), m.locator('[data-word="BM-01"]').click()]);
  expect(dl.suggestedFilename()).toMatch(/^BM-01_To-trinh_.+\.doc$/);
  const txt = readFileSync(await dl.path(), 'utf8');
  for (const s of ['TỜ TRÌNH', 'Kính gửi', '12868/QĐ-CNVTQĐ', '1. Mục đích', '2. Phạm vi, quy mô đề xuất mua sắm', '3. Giá trị của đề xuất mua sắm',
    '6. Biện pháp và kế hoạch tổ chức thực hiện', 'Hồ sơ kèm theo', 'Phụ lục Danh mục mua sắm chi tiết', 'Phụ lục Trích lục nguồn', 'Times New Roman']) expect(txt).toContain(s);
  expect(txt).not.toContain('I. THÔNG TIN CHUNG VỀ ĐỀ XUẤT MUA SẮM');
  expect(page.errors).toEqual([]);
});

test('Bước 1: văn bản căn cứ chính theo Đề tài / dự án chọn khi tạo luồng', async ({ page }) => {
  await gop(page, '#/luong/create');
  await page.locator('#lf-title').fill('Luồng mua sắm anten Ka');
  await pick(page, 'lf-nv', 'NV-KHCN-2026-006');
  await page.locator('#lf-file').setInputFiles([{ name: 'QD-0917-VHT.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) }, { name: 'KH-2026.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) }]);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  const av = page.locator('[data-basis-avail]');
  await expect(av).toContainText('Văn bản căn cứ và giá trị còn khả dụng');
  await expect(av).toContainText('0917/QĐ-VHT');
  await expect(av).not.toContainText('1482/QĐ-VHT');
  expect(page.errors).toEqual([]);
});
