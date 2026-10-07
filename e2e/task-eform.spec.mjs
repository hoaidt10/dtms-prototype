// T16 B0.4 (2) — màn xử lý task = khung chung my-task-detail + eForm (Camunda Form schema) mở bằng dialog khi bấm nút hành động (D-24).
// Duyệt eForm của mọi user task MS01.01 / MS01.03 / MS13; hành vi dialog (my-task-eform-dialog): Hủy / Lưu nháp / Xác nhận, validate,
// nút từ chối mở dialog nhận xét (G6), tài liệu bắt buộc ở Danh sách tài liệu (E3), schema JSON trong nút (i).
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, openForm, closeForm } from './helpers.mjs';

// Chữ của BA / mã nội bộ không được lọt vào form (rule A — chỉ nằm trong nút (i)).
const BA = /SCR-\d|UC-\d|task \d|bước \d|Prototype|minh hoạ|giả lập|WBS|\bD-\d|\bP-\d|DX-\d|DEV-\d/i;
const BAD = /\{\{|\bnull\b|\bundefined\b|\bNaN\b|\[object/;

const SETS = [
  { proc: 'MS01.01', tasks: [1, 4, 5, 7, 8, 10, 12, 13, 16, 17, 19, 20, 26, 27, 28, 35, 36, 42, 43, 46, 47, 48, 50, 51, 53, 54, 55, 56, 58, 59, 60] },
  { proc: 'MS01.03', dxms: 'ĐXMS-2026-0098', tasks: [11, 16, 38, 39, 60] },
  { proc: 'MS13', kdt: true, tasks: [1, 4, 5, 7, 8, 10, 11, 12, 14, 16, 36, 37, 38, 39, 24, 26, 28, 29, 31, 32, 33, 42, 44, 46, 47, 48, 51, 54] },
  { proc: 'MS13', kdt: 'KĐT-2026-0031', tasks: [18, 19, 20, 21, 55, 56] },
];

async function jump(page, set, task) {
  return page.evaluate(([t, s]) => {
    const dx = s.kdt ? (s.kdt === true ? D.demoSets.find((d) => d.key === 'MS13').kdt : s.kdt) : s.dxms || undefined;
    Flow.jumpTo(t, 'minh', {}, s.kdt ? 'MS13' : s.proc, dx, null, false);
    const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
    if (!k) return null;
    Flow.setPersona(k.who);
    location.hash = '#/task/' + k.id;
    return k.id;
  }, [task, set]);
}

for (const set of SETS) {
  test(`eForm của mọi task ${set.proc}${typeof set.kdt === 'string' ? ' (gộp BM-00)' : ''}: mở được, không lỗi, không rò chữ BA`, async ({ page }) => {
    test.setTimeout(180_000);
    await fresh(page);
    for (const task of set.tasks) {
      expect(await jump(page, set, task), `có việc ở task ${task}`).toBeTruthy();
      // Khung chung: không còn card nội dung riêng giữa Quy trình và Danh sách tài liệu.
      await expect(page.locator('.tmain > section > h3, .tmain > section > .vcard-h > h3')).toHaveText(['Thông tin chung', 'Quy trình', 'Danh sách tài liệu', 'Văn bản đầu ra']);
      const f = await openForm(page);
      await expect(f.locator('.ef-body')).toHaveAttribute('data-ef-form', /^dtms-ms(01|13)-/);
      const txt = await f.innerText();
      expect(txt, `task ${task}`).not.toMatch(BA);
      expect(txt, `task ${task}`).not.toMatch(BAD);
      await closeForm(page);
    }
    expect(page.errors).toEqual([]);
  });
}

test('dialog eForm: tiêu đề = nhãn nút, 85vw; Hủy / Lưu nháp / Xác nhận; validate bắt buộc; lưu nháp giữ giá trị', async ({ page }) => {
  await fresh(page);
  await jump(page, { proc: 'MS01.01' }, 4);
  const f = await openForm(page);
  await expect(f.locator('.vmodal-h h3')).toHaveText('Hoàn thành');
  await expect(f.locator('.vmodal-acts .vbtn')).toHaveText(['Hủy', 'Lưu nháp', 'Xác nhận']);
  const w = await f.evaluate((el) => el.getBoundingClientRect().width / window.innerWidth);
  expect(w).toBeGreaterThan(0.84);
  // Bắt buộc: xoá tên → Xác nhận bị chặn, báo dưới ô.
  await f.locator('[data-ef="tenDeXuat"]').fill('');
  await f.locator('[data-ef="tenDeXuat"]').blur();
  await f.locator('#ok').click();
  await expect(f.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập tên đề xuất']);
  // G2: chọn "Sửa" mới hiện ô Nội dung sửa (bắt buộc).
  const row = f.locator('.ef-row', { hasText: 'Phạm vi, quy mô' });
  await expect(row.locator('textarea')).toHaveCount(0);
  await row.locator('[data-ef-radio$="quyetDinh"]', { hasText: 'Sửa' }).click();
  await expect(row.locator('textarea')).toHaveCount(1);
  // Lưu nháp: đóng dialog, giữ giá trị cho lần mở sau, task chưa hoàn thành.
  await f.locator('[data-ef="tenDeXuat"]').fill('Tên nháp');
  await f.locator('#ef-draft').click();
  expect(await lastToast(page)).toContain('Đã lưu nháp biểu mẫu');
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => t.task))).toEqual([4]);
  const f2 = await openForm(page);
  await expect(f2.locator('[data-ef="tenDeXuat"]')).toHaveValue('Tên nháp');
  await expect(f2.locator('.ef-row', { hasText: 'Phạm vi, quy mô' }).locator('textarea')).toHaveCount(1);
  await f2.locator('#ok').click();
  await expect(f2.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập nội dung sửa']);
  await closeForm(page);
  expect(page.errors).toEqual([]);
});

test('G6: nút từ chối mở dialog nhận xét, không mở eForm; E3: tài liệu bắt buộc ở Danh sách tài liệu', async ({ page }) => {
  await fresh(page);
  await jump(page, { proc: 'MS01.01' }, 17);
  await page.locator('.task-acts [data-act]', { hasText: 'Chưa đúng' }).click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect(page.locator('.vmodal-h h3')).toHaveText('Chưa đúng/đủ — trả lại');
  await expect(page.locator('#rsn')).toBeVisible();
  await page.locator('.vmodal [data-close]').first().click();
  // Task 16: dòng BM-03 "bắt buộc, chưa tải lên" ở Danh sách tài liệu; Xác nhận bị BE chặn tới khi tải lên.
  await jump(page, { proc: 'MS01.01' }, 16);
  const docs = page.locator('section.vcard', { hasText: 'Danh sách tài liệu' });
  await expect(docs.locator('.doc-req')).toContainText('Phiếu yêu cầu thẩm định (BM-03) đã ký nháy — bắt buộc, chưa tải lên');
  const f = await openForm(page);
  await f.locator('#ok').click();
  expect(await lastToast(page)).toContain('Danh sách tài liệu');
  await closeForm(page);
  await docs.locator('[data-req-up="bm03File"]').click();
  await expect(docs.locator('.doc-req')).toHaveCount(0);
  await expect(docs).toContainText('_ky-nhay.pdf');
  // Văn bản đầu ra: BM-03 sinh từ dữ liệu form + mẫu — xem trước PDF.
  await page.locator('[data-preview]', { hasText: 'BM-03' }).click();
  await expect(page.locator('.pdf-view')).toContainText('PHIẾU YÊU CẦU THẨM ĐỊNH');
  expect(page.errors).toEqual([]);
});

test('nút (i): tên form, loại nút, Xem schema JSON Camunda Form', async ({ page }) => {
  await fresh(page);
  await jump(page, { proc: 'MS01.01' }, 26);
  await expect(page.locator('.task-acts [data-act]')).toHaveText(['Hoàn thành']);
  await page.locator('.pg-title .info-i').click();
  await expect(page.locator('.info-pop')).toContainText('dtms-ms01-t26-ket-qua-bm04');
  await expect(page.locator('.info-pop')).toContainText('DX-02');
  await page.locator('.info-pop [data-ef-schema]').click();
  const json = JSON.parse(await page.locator('pre.json').innerText());
  expect(json.id).toBe('dtms-ms01-t26-ket-qua-bm04');
  expect(json.executionPlatform).toBe('Camunda Cloud');
  expect(json.components.map((c) => c.type)).toContain('dynamiclist');
  expect(page.errors).toEqual([]);
});

test('MS01 họp thống nhất (task 31–34): form mở được từ nhánh giải trình vượt vòng', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-branch="3"]').click();
  expect(await primary(page, 'Gửi giải trình')).toBe(true);
  const go = async (task) => page.evaluate((t) => { const k = Flow.state.tokens.find((x) => x.task === t); Flow.setPersona(k.who); location.hash = '#/task/' + k.id; }, task);
  await go(31);
  let f = await openForm(page);
  await expect(f).toContainText('Cảnh báo vượt số vòng giải trình');
  await expect(f.locator('[data-vsel="ef-thanhPhanHop"]')).not.toBeEmpty();
  await f.locator('#ok').click();
  await go(32);
  await page.locator('[data-req-up="minutesFile"]').click();
  expect(await primary(page, 'Chưa thống nhất')).toBe(true);
  await go(33);
  expect(await primary(page)).toBe(true);
  await go(34);
  f = await openForm(page, 'Thống nhất phương án');
  await expect(f.locator('[data-ef="ketLuan"]')).not.toHaveValue('');
  await f.locator('#ok').click();
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => t.task))).toEqual([27]);
  expect(await page.evaluate(() => Flow.state.history.filter((h) => h.task === 34).pop().reason)).toContain('Chấp nhận giải trình');
  expect(page.errors).toEqual([]);
});
