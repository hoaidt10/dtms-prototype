// T16 B0.4 (2) — màn xử lý task = khung chung my-task-detail + eForm (Camunda Form schema) mở bằng dialog khi bấm nút hành động (D-24).
// Duyệt eForm của mọi user task MS01.01 / MS01.03 / MS13; hành vi dialog (my-task-eform-dialog): Hủy / Lưu nháp / Xác nhận, validate,
// nút từ chối mở dialog nhận xét (G6), tài liệu bắt buộc ở Danh sách tài liệu (E3), schema JSON trong nút (i).
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, openForm, closeForm, aiApply } from './helpers.mjs';

// Chữ của BA / mã nội bộ không được lọt vào form (rule A — chỉ nằm trong nút (i)).
const BA = /SCR-\d|UC-\d|task \d|bước \d|Prototype|minh hoạ|giả lập|WBS|\bD-\d|\bP-\d|DX-\d|DEV-\d/i;
const BAD = /\{\{|\bnull\b|\bundefined\b|\bNaN\b|\[object/;

const SETS = [
  // T29 B16: thêm bốn bước chỉ huy duyệt của DX-10 (5.1, 7.1, 10.1, 16.1).
  // T29 B19 (DX-11): bước 1, 4, 5 của MS01 là màn Lập ĐXMS (không eForm) — kiểm ở test riêng bên dưới.
  { proc: 'MS01.01', tasks: ['5.1', 7, '7.1', 8, 10, '10.1', 12, 13, 16, '16.1', 17, 19, 20, 26, 27, 28, 35, 36, 42, 43, 46, 47, 48, 50, 51, 53, 54, 55, 56, 58, 59, 60] },
  { proc: 'MS01.03', dxms: 'ĐXMS-2026-0098', tasks: [11, 16, 38, 39, 60] },
  { proc: 'MS13', kdt: true, tasks: [1, 4, 5, 7, 8, 10, 11, 12, 15, 17, 39, 40, 41, 42, 43, 27, 29, 31, 32, 34, 35, 36, 46, 47, 48, 50, 51, 52, 53, 55, 56, 57, 60] },
  { proc: 'MS13', kdt: 'KĐT-2026-0031', tasks: [19, 20, 21, 22, 23, 24, 61, 62] },
  // T21 B2: MS02 dùng lại eForm MS01 cùng số (formId dtms-ms02-…); MS02.02 không qua 49–56, MS02.03 qua 11, 38–40.
  { proc: 'MS02', dxms: 'ĐXMS-2026-0103', tasks: [1, 4, 5, 7, 8, 10, 12, 13, 16, 17, 19, 20, 26, 27, 28, 35, 36, 42, 43, 46, 47, 48, 58, 59, 60] },
  { proc: 'MS02', dxms: 'ĐXMS-2026-0089', tasks: [1, 4, 7, 10, 11, 16, 38, 39, 60] },
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
  test(`eForm của mọi task ${set.proc}${typeof set.kdt === 'string' ? ' (gộp BM-00)' : set.proc === 'MS02' ? ' ' + set.dxms : ''}: mở được, không lỗi, không rò chữ BA`, async ({ page }) => {
    test.setTimeout(180_000);
    await fresh(page);
    for (const task of set.tasks) {
      expect(await jump(page, set, task), `có việc ở task ${task}`).toBeTruthy();
      // Khung chung: không còn card nội dung riêng giữa Quy trình và Danh sách tài liệu. Ngoại lệ T29 S9: bước 19 / 20 MS01 có card thẩm định CQCM;
      // T31 B4: bước 27 / 29 / 46 / 55 MS13 (KĐT).
      const td = set.proc !== 'MS02' && (set.kdt ? ['27', '29', '46', '55'] : ['19', '20']).includes(String(task));
      // T29 B3b: bước 10 MS01 có card Đánh giá báo giá và cơ sở giá.
      // T29 B16 (DX-10): 10.1 xem card báo giá; 7 / 7.1 (Kho trên sơ đồ) có card Kết quả rà soát tồn kho.
      // Review nhi 06/11 #2: card báo giá tạm ẩn (D.quoteManual).
      const bg = !(await page.evaluate(() => D.quoteManual)) && set.proc !== 'MS02' && !set.kdt && ['10', '10.1'].includes(String(task));
      const rk = set.proc !== 'MS02' && !set.kdt && ['7', '7.1'].includes(String(task));
      await expect(page.locator('.tmain > section > h3, .tmain > section > .vcard-h > h3')).toHaveText(['Thông tin chung'].concat(td ? ['Thẩm định của cơ quan chuyên môn'] : [], bg ? ['Đánh giá báo giá và cơ sở giá'] : [], rk ? ['Kết quả rà soát tồn kho'] : [], ['Quy trình', 'Danh sách tài liệu', 'Văn bản đầu ra']));
      // Review nhi 06/11 #21, #31: bước 7 MS01 nhập trên màn SCR-105, không mở eForm.
      if (rk && String(task) === '7') continue;
      const f = await openForm(page);
      await expect(f.locator('.ef-body')).toHaveAttribute('data-ef-form', set.proc === 'MS02' ? /^dtms-ms02-/ : /^dtms-ms(01|13)-/);
      const txt = await f.innerText();
      expect(txt, `task ${task}`).not.toMatch(BA);
      expect(txt, `task ${task}`).not.toMatch(BAD);
      await closeForm(page);
    }
    expect(page.errors).toEqual([]);
  });
}

test('T29 B19: bước 1, 4, 5 của MS01.01 mở màn Lập ĐXMS, không mở eForm', async ({ page }) => {
  await fresh(page);
  for (const task of [1, 4, 5]) {
    expect(await jump(page, { proc: 'MS01.01' }, task), `có việc ở task ${task}`).toBeTruthy();
    await expect(page.locator('[data-luong-form]')).toHaveCount(1);
    await expect(page.locator('.task-acts [data-act]')).toHaveCount(0);
    await aiApply(page);
    // Review nhi 06/11 #1: không còn khối Thông tin cơ bản; Nhóm mục đích, Nguồn vốn ở Thông tin chung.
    await expect(page.locator('[data-lf-basic]')).toHaveCount(0);
    await expect(page.locator('[data-lf-chung] [data-vsel="lf-fund"]')).toHaveCount(1);
  }
  expect(page.errors).toEqual([]);
});

// T29 B19: bước 4 của MS01 thành màn Lập ĐXMS — hành vi dialog eForm kiểm trên bước 4 của KĐT MS13 (cùng khuôn: tên, bảng gợi ý AI).
test('dialog eForm: tiêu đề = nhãn nút, 85vw; Hủy / Lưu nháp / Xác nhận; validate bắt buộc; lưu nháp giữ giá trị', async ({ page }) => {
  await fresh(page);
  await jump(page, { proc: 'MS13', kdt: true }, 4);
  const f = await openForm(page);
  await expect(f.locator('.vmodal-h h3')).toHaveText('Hoàn thành');
  await expect(f.locator('.vmodal-acts .vbtn')).toHaveText(['Hủy', 'Lưu nháp', 'Xác nhận']);
  const w = await f.evaluate((el) => el.getBoundingClientRect().width / window.innerWidth);
  expect(w).toBeGreaterThan(0.84);
  // Bắt buộc: xoá tên → Xác nhận bị chặn, báo dưới ô.
  await f.locator('[data-ef="tenDeXuat"]').fill('');
  await f.locator('[data-ef="tenDeXuat"]').blur();
  await f.locator('#ok').click();
  await expect(f.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập tên kđt']);
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
  await jump(page, { proc: 'MS01.01' }, 20);
  await page.locator('.task-acts [data-act]', { hasText: 'Không đồng ý' }).click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect(page.locator('.vmodal-h h3')).toHaveText('Không đồng ý');
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
  await expect(page.locator('.pdf-view')).toContainText('V/v đề nghị góp ý dự thảo hồ sơ ĐXMS');
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
  await page.locator('[data-branch="2"]').click();
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

test('Bước 12 Soạn thảo tờ trình (review nhi 06/11 #35): Sự cần thiết là ô nhập, không còn bảng Chấp nhận / Từ chối; nội dung tự nhập vào Tờ trình', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const id = await page.evaluate(() => { Flow.jumpTo(12, 'minh', {}, 'MS01.01', undefined, null, false); return Flow.state.tokens.find((t) => t.task === 12).id; });
  await page.evaluate((i) => { location.hash = `#/task/${i}`; }, id);
  const f = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  await expect(f.locator('[data-ef-radio$="quyetDinh"]')).toHaveCount(0);
  await f.locator('[data-ef="mucDich"]').fill('Mục đích mua sắm.');
  await f.locator('[data-ef="phamVi"]').fill('Danh mục theo bóc tách.');
  await f.locator('[data-ef="suCanThiet"]').fill('Nội dung sự cần thiết do đơn vị tự soạn.');
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  expect(await page.evaluate(() => Flow.ui.necessity)).toBe('Nội dung sự cần thiết do đơn vị tự soạn.');
});
