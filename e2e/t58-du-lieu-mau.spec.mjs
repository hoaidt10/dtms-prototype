// T58 (12/11/2026, phuctd7): dữ liệu mẫu ĐXMS / KĐT phủ nhiều tình huống + hồ sơ mẫu chạy được (Flow.runSample).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const as = (page, id) => page.evaluate((p) => { Flow.setPersona(p); }, id);
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);

test('A: mọi hồ sơ mẫu đang xử lý của MS01.0x / MS13 nạp vào luồng chạy đúng bước, giữ mã và giá trị', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const bad = await page.evaluate(() => D.otherCases.concat(D.kdtCases).filter((c) => Flow.canRunSample(c)).map((c) => {
    const t = Flow.runSample(c.code);
    const ok = t && String(t.task) === String(c.task) && Flow.state.code === c.code && Flow.state.status === 'running' && (c.total == null || Flow.ci().total === c.total);
    return ok ? null : `${c.code}: ${t ? t.task : 'null'} / ${Flow.state.code} / ${Flow.ci().total}`;
  }).filter(Boolean));
  expect(bad).toEqual([]);
  expect(await page.evaluate(() => D.otherCases.concat(D.kdtCases).filter((c) => Flow.canRunSample(c)).length)).toBeGreaterThanOrEqual(28);
  expect(page.errors).toEqual([]);
});

test('B: Việc của tôi — mỗi vai có việc chờ trên hồ sơ mẫu; mở việc thì hồ sơ được nạp và mở màn xử lý việc', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  // Mỗi vai nghiệp vụ có ít nhất một việc chờ mở bằng #/chay-mau/<mã hồ sơ mẫu>.
  for (const id of ['minh', 'hai', 'lan', 'hoa', 'tung', 'binh', 'tgd', 'qlts', 'thau', 'td']) {
    await as(page, id);
    await go(page, '#/viec-cua-toi');
    await expect(page.locator('main [data-go^="chay-mau/"]').first(), `vai ${id}`).toBeAttached();
  }
  // Thầu TTMS: việc Tổng hợp báo giá của HS-2026-0134 (quá hạn).
  await as(page, 'thau');
  await go(page, '#/viec-cua-toi');
  const row = page.locator('main tbody tr', { hasText: 'ĐXMS-2026-0134' }).first();
  await expect(row).toBeVisible();
  await expect(row).toContainText('Quá hạn');
  await row.locator('a, button, [data-go]').first().click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => Flow.state.code)).toBe('HS-2026-0134');
  await expect(page.locator('[data-sbar="process"]')).toContainText('Đang chờ bạn xử lý');
  expect(page.errors).toEqual([]);
});

test('C: Chi tiết ĐXMS mẫu — thanh trạng thái có nút; bấm Phê duyệt thì hồ sơ được nạp và mở form của bước', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'tgd');
  await go(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0131'));
  const bar = page.locator('[data-sbar="process"]');
  await expect(bar).toContainText('Đang chờ bạn xử lý');
  await expect(bar).toContainText('Bước 60');
  const btn = bar.locator('[data-run-sample].primary').first();
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => Flow.state.code)).toBe('HS-2026-0131');
  await expect(page.locator('.vmodal').first()).toBeVisible();
  // Người khác xem: "Đang chờ <tên> xử lý", không nút.
  await page.keyboard.press('Escape');
  await as(page, 'minh');
  await go(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0130'));
  await expect(bar).toContainText(/Đang chờ .+ xử lý/);
  await expect(bar.locator('[data-run-sample]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('D: Chi tiết hồ sơ KĐT mẫu có nút; hồ sơ khác đang chạy thì hỏi trước khi thay', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.runSample('HS-2026-0034'));
  await as(page, 'minh');
  await go(page, '#/ho-so-kdt/HS-2026-0031');
  const bar = page.locator('[data-sbar="process"]');
  await expect(bar).toContainText('Bước 19');
  await bar.locator('[data-run-sample]').first().click();
  await expect(page.locator('.vmodal')).toContainText('HS-2026-0034');
  await page.locator('.vmodal [data-close]').last().click();
  expect(await page.evaluate(() => Flow.state.code)).toBe('HS-2026-0034');
  await bar.locator('[data-run-sample]').first().click();
  await page.locator('#rs-ok').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => Flow.state.code)).toBe('HS-2026-0031');
  // Hồ sơ KĐT bị thay giữ lại ở trạng thái lúc đó (bản ghi đóng băng), không còn là hồ sơ mẫu chạy được.
  expect(await page.evaluate(() => Flow.kdtCases().find((c) => c.code === 'HS-2026-0034').task)).toBe(29);
  expect(page.errors).toEqual([]);
});

test('E: màn danh sách / chi tiết của dữ liệu mới mở không lỗi', async ({ page }) => {
  await fresh(page, '#/luong');
  for (const h of ['#/luong', '#/kdt', '#/viec-cua-toi', '#/giam-sat-tien-trinh',
    '#/luong/' + encodeURIComponent('ĐXMS-2026-0140'), '#/luong/' + encodeURIComponent('ĐXMS-2026-0133'), '#/luong/' + encodeURIComponent('ĐXMS-2026-0139'),
    '#/kdt/' + encodeURIComponent('KĐT-2026-0040'), '#/kdt/' + encodeURIComponent('KĐT-2026-0039'), '#/kdt/' + encodeURIComponent('KĐT-2026-0037'),
    '#/ho-so-kdt/HS-2026-0039-2', '#/ho-so-kdt/HS-2026-0038', '#/ho-so-kdt/HS-2026-0037']) {
    await go(page, h);
    await expect(page.locator('main')).not.toBeEmpty();
  }
  await go(page, '#/luong');
  await expect(page.locator('main')).toContainText('ĐXMS-2026-0140');
  await go(page, '#/kdt');
  await expect(page.locator('main')).toContainText('KĐT-2026-0034');
  expect(page.errors).toEqual([]);
});
