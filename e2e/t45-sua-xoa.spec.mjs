// T45 — SRS 12 V0.4 mục 3.1.3 (DTMS_CN_0138): Sửa, Xóa ĐXMS chưa gửi hoặc bị Chỉ huy ĐVĐX trả lại ở bước 5.1.
import { test, expect } from '@playwright/test';
import { fresh, createDxms, createCase } from './helpers.mjs';

const row = (page, code) => page.locator(`tr[data-code="${code}"]`);

// Gửi việc Lập (bước 1 → 4 → 5) bằng engine, rồi Chỉ huy ĐVĐX Trả lại ở 5.1.
async function sendAndReturn(page, reason) {
  await page.evaluate((r) => {
    for (let g = 0; g < 6; g++) {
      const t = Flow.state.tokens.find((k) => ['1', '4', '5'].includes(String(k.task)));
      if (!t) break;
      Flow.complete(t.id, String(t.task) === '5' ? Flow.mainChoice(5) : null);
    }
    const t51 = Flow.state.tokens.find((k) => String(k.task) === '5.1');
    Flow.complete(t51.id, D.flow['5.1'].choices.find((c) => c.label === 'Trả lại'), r);
  }, reason);
}

test('Chưa gửi: icon Sửa / Xóa cho người lập (ĐXMS chưa có hồ sơ và đã Lưu nháp), người khác không thấy', async ({ page }) => {
  await fresh(page);
  const code = await createDxms(page);
  await page.evaluate(() => { location.hash = '#/luong'; });
  // ĐXMS chưa có hồ sơ (Chưa khởi tạo): Sửa mở màn Lập trên chính ĐXMS đó.
  await expect(row(page, code)).toContainText('Chưa khởi tạo');
  await expect(row(page, code).locator('[data-lg-edit]')).toHaveAttribute('data-go', /^luong\/create\//);
  await createCase(page, null, code);
  await page.evaluate(() => { location.hash = '#/luong'; });
  await expect(row(page, code).locator('[data-lg-edit]')).toHaveAttribute('data-go', /^task\//);
  // SRS 12 mục 2.3, BR-LDX-C-03: đã Lưu nháp, chưa Gửi → Chưa khởi tạo (không giữ phần dự toán).
  await expect(row(page, code)).toContainText('Chưa khởi tạo');
  await expect(row(page, code).locator('[data-lg-edit]')).toHaveCount(1);
  await expect(row(page, code).locator('[data-lg-del]')).toHaveCount(1);
  await expect(row(page, code).locator('[data-lg-ret]')).toHaveCount(0);
  await page.evaluate(() => Flow.setPersona('hai'));
  await expect(row(page, code).locator('[data-lg-edit], [data-lg-del]')).toHaveCount(0);
});

test('Bị trả lại: tag Bị trả lại, Sửa mở màn Lập có Lý do trả lại và nút Xóa; Gửi lại thì tag mất', async ({ page }) => {
  await fresh(page);
  const code = await createDxms(page);
  await createCase(page, null, code);
  await sendAndReturn(page, 'Thiếu báo giá tham khảo');
  await page.evaluate(() => { location.hash = '#/luong'; });
  await expect(row(page, code)).toContainText('Đang phê duyệt');
  await expect(row(page, code).locator('[data-lg-ret]')).toHaveText('Bị trả lại');
  await row(page, code).locator('[data-lg-edit]').click();
  await expect(page.locator('[data-luong-form]')).toBeVisible();
  await expect(page.locator('[data-lf-ret]')).toContainText('Chỉ huy đơn vị đề xuất đã trả lại lúc');
  await expect(page.locator('[data-lf-ret]')).toContainText('Thiếu báo giá tham khảo');
  await expect(page.locator('#lf-del')).toBeVisible();
  // BR-LDX-03-03, AC-0138-08: Còn lại khả dụng không trừ phần của chính ĐXMS này → không có cảnh báo vượt giả.
  await expect(page.locator('[data-lf-cost] tbody tr').first()).toBeVisible();
  await expect(page.locator('[data-lf-cwarn]')).toHaveCount(0);
  // Gửi lại (engine): việc Lập xong, quy trình về 5.1 → không còn tag, không còn Sửa / Xóa.
  await page.evaluate(() => { const t = Flow.state.tokens.find((k) => String(k.task) === '5'); Flow.complete(t.id, Flow.mainChoice(5)); location.hash = '#/luong'; });
  await expect(row(page, code).locator('[data-lg-ret]')).toHaveCount(0);
  await expect(row(page, code).locator('[data-lg-edit], [data-lg-del]')).toHaveCount(0);
});

test('Xóa: hộp thoại, Hủy giữ nguyên; Xóa thì ĐXMS và việc Lập không còn, mã không dùng lại', async ({ page }) => {
  await fresh(page);
  const code = await createDxms(page);
  await createCase(page, null, code);
  await page.evaluate(() => { location.hash = '#/luong'; });
  await row(page, code).locator('[data-lg-del]').click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toContainText('Xóa đề xuất mua sắm');
  await expect(dlg).toContainText(`- ${code} không? Đề xuất sẽ không còn trên danh sách`);
  await dlg.getByRole('button', { name: 'Hủy' }).click();
  await expect(row(page, code)).toHaveCount(1);
  await row(page, code).locator('[data-lg-del]').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Xóa', exact: true }).click();
  await expect(page.locator('.toast, [role="status"]').filter({ hasText: 'Xóa đề xuất mua sắm thành công.' }).first()).toBeVisible();
  await expect(row(page, code)).toHaveCount(0);
  expect(await page.evaluate(() => Flow.state.tokens.length)).toBe(0);
  const next = await createDxms(page, 'ĐXMS mới sau khi xóa');
  expect(next).not.toBe(code);
});

test('Xóa từ màn Lập của ĐXMS bị trả lại → về Danh sách', async ({ page }) => {
  await fresh(page);
  const code = await createDxms(page);
  await createCase(page, null, code);
  await sendAndReturn(page, 'Sai đơn vị đề xuất');
  await page.evaluate(() => { location.hash = '#/task/' + Flow.state.tokens.find((k) => String(k.task) === '5').id; });
  await page.locator('#lf-del').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Xóa', exact: true }).click();
  await expect(page).toHaveURL(/#\/luong$/);
  await expect(row(page, code)).toHaveCount(0);
});
