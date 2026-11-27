// @ts-check
// T71 S11 (D-124): SX-18 Hồ sơ dự án, SX-19 Biểu mẫu tài liệu (danh mục sx-bieu-mau, nguồn của Chọn mẫu tài liệu), SX-20 Bài học kinh nghiệm (nháp → ban hành; đóng phiếu bất thường tạo nháp).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const pickEf = async (page, key, val) => { await page.locator(`.vmodal [data-vsel="ef-${key}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const row = (page, text) => page.locator('.vtable tbody tr', { hasText: text });

test('Biểu mẫu tài liệu: danh mục trong phân hệ, mẫu chưa có tệp không chọn được; Chọn mẫu ở dự án lấy từ danh mục', async ({ page }) => {
  await fresh(page, '#/sx/bieu-mau');
  await as(page, 'sxpm', '#/sx/bieu-mau');
  await expect(page.locator('.sb-nav [data-go="sx/bieu-mau"]')).toHaveClass(/active/);
  await expect(page.locator('main table tbody tr')).toHaveCount(9);
  await expect(page.locator('main table tbody')).toContainText('BM.VHT.TTSX.01-SXL.07');
  // Chọn mẫu tài liệu ở dự án: 7 mẫu có tệp (BM.QLHDSX.02, SXL.10 chưa có tệp).
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await page.locator('[data-ttab="docs"]').click();
  await page.locator('[data-sx-tpl]').click();
  await expect(page.locator('.vmodal [data-sx-tpl-use]')).toHaveCount(7);
  await expect(page.locator('.vmodal')).not.toContainText('BM.QLHDSX.02');
  await page.locator('.vmodal [data-sx-tpl-use="BM.QLBT.02"]').click();
  // T74 #97: tab Tài liệu chia theo loại — dòng mới nằm dưới nhóm loại của mẫu.
  await expect(page.locator('[data-sx-docs] tbody tr', { hasText: 'Phương án xử lý bất thường — DA-SX-2026-002.docx' })).toHaveCount(1);
  await expect(page.locator('[data-sx-docs] h4', { hasText: 'Phương án xử lý bất thường (BM.QLBT.02)' })).toHaveCount(1);
  // Dừng hoạt động mẫu trong danh mục → không còn trong Chọn mẫu.
  await page.evaluate(() => { Catalog.rows('sx-bieu-mau').find((r) => r.code === 'BM.QLBT.02').active = false; });
  await page.locator('[data-sx-tpl]').click();
  await expect(page.locator('.vmodal [data-sx-tpl-use]')).toHaveCount(6);
  expect(page.errors).toEqual([]);
});

// Góp ý 27/11 (hoaidt10): Hồ sơ dự án chuyển thành điều hướng tới tab Tài liệu của từng dự án — thêm / sửa / xoá tài liệu làm ở tab Tài liệu (thay ca cũ: tải lên, chọn mẫu, sửa, xoá ngay ở Hồ sơ dự án).
test('Hồ sơ dự án: danh sách dự án theo phạm vi, mở tab Tài liệu của dự án; thêm / sửa / xoá danh mục và tài liệu ở tab Tài liệu', async ({ page }) => {
  await fresh(page, '#/sx/ho-so');
  await as(page, 'sxpm', '#/sx/ho-so');
  await expect(page.locator('.pg-title')).toContainText('Hồ sơ dự án');
  await expect(page.locator('[data-sxhs-tpl], [data-sxhs-add]')).toHaveCount(0); // không thêm mới ở đây
  await expect(page.locator('.vtable tbody')).not.toContainText('DA-SX-2026-003'); // Khối 2
  await expect(row(page, 'DA-SX-2026-001').locator('a[title="Xem tài liệu của dự án"]')).toHaveCount(1);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Bấm dòng → tab Tài liệu của dự án.
  await row(page, 'DA-SX-2026-001').locator('td').nth(3).click();
  await expect(page).toHaveURL(/#\/sx\/du-an\/DA-SX-2026-001\/docs$/);
  await expect(page.locator('[data-sx-docs]')).toBeVisible();
  // Thêm danh mục → sửa tên → thêm tài liệu → sửa → xoá tài liệu → xoá danh mục.
  await page.locator('[data-sx-doccat]').click();
  await page.locator('#sx-ask').fill('Hồ sơ làm việc với VMC');
  await page.locator('#sx-ask-ok').click();
  await page.locator('[data-sx-doccat-edit$="|DM-1"]').click();
  await page.locator('#sx-ask').fill('Hồ sơ làm việc với VMC tháng 11');
  await page.locator('#sx-ask-ok').click();
  await expect(page.locator('[data-sx-docs]')).toContainText('Hồ sơ làm việc với VMC tháng 11');
  await page.locator('[data-sx-docadd$="|DM-1"]').click();
  await page.locator('#sx-ask').fill('Nhật ký làm việc VMC');
  await page.locator('#sx-ask-ok').click();
  const d = () => page.locator('[data-sx-docs] tr', { hasText: 'Nhật ký làm việc VMC' });
  await d().locator('[data-sx-doc-edit]').click();
  await page.locator('#sx-ask').fill('Nhật ký làm việc VMC tháng 11');
  await page.locator('#sx-ask-ok').click();
  await expect(d()).toContainText('Nhật ký làm việc VMC tháng 11');
  await expect(page.locator('[data-sx-doccat-del$="|DM-1"]')).toHaveCount(0); // danh mục còn tài liệu thì không xoá
  await d().locator('[data-sx-doc-del]').click();
  await page.locator('#cf-ok').click();
  await expect(d()).toHaveCount(0);
  await page.locator('[data-sx-doccat-del$="|DM-1"]').click();
  await page.locator('#cf-ok').click();
  await expect(page.locator('[data-sx-docs]')).not.toContainText('Hồ sơ làm việc với VMC');
  // Tài liệu sinh từ quy trình: không Sửa / Xoá.
  await expect(page.locator('[data-sx-docs] tr', { hasText: '.pdf' }).first().locator('[data-sx-doc-edit], [data-sx-doc-del]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Bài học kinh nghiệm: phạm vi nháp / ban hành, thêm mới, ban hành; đóng phiếu bất thường tạo bài học nháp', async ({ page }) => {
  await fresh(page, '#/sx/bai-hoc');
  await as(page, 'sxkd', '#/sx/bai-hoc');
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(2); // chỉ bài học đã ban hành
  await as(page, 'sxrd', '#/sx/bai-hoc');
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(3); // + nháp của mình
  await expect(row(page, 'BHKN-2026-003')).toContainText('Nháp');
  await expect(row(page, 'BHKN-2026-001')).toContainText('BT-2026-001');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Thêm mới (R&D) → nháp; PM ban hành.
  await page.locator('[data-sxbh-add]').click();
  await page.locator('.vmodal [data-ef="bhTitle"]').fill('Khóa phiên bản firmware trước khi đóng gói');
  await pickEf(page, 'bhKind', 'CN');
  await page.locator('.vmodal [data-ef="bhContext"]').fill('Lô WM-6 nạp nhầm firmware bản thử nghiệm.');
  await page.locator('.vmodal [data-ef="bhCause"]').fill('Trạm nạp firmware không khóa phiên bản.');
  await page.locator('.vmodal [data-ef="bhLesson"]').fill('Trạm nạp chỉ cho phép phiên bản đã phát hành.');
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('[data-sxbh-detail]')).toContainText('BHKN-2026-004');
  await expect(page.locator('[data-sxbh-pub]')).toHaveCount(0); // R&D không ban hành
  await as(page, 'sxpm', '#/sx/bai-hoc/BHKN-2026-004');
  await page.locator('[data-sxbh-pub]').click();
  await page.locator('#cf-ok').click();
  await expect(page.locator('[data-sxbh-detail]')).toContainText('Đã ban hành');
  await expect(page.locator('[data-sxbh-edit]')).toHaveCount(0);
  await as(page, 'sxkd', '#/sx/bai-hoc');
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(3);
  // Đóng phiếu BT-2026-003 (QA kiểm tra Đạt → PM đóng phiếu có bài học) → bài học nháp nguồn phiếu.
  await page.evaluate(() => {
    Flow.setPersona('sxqa');
    let c = SxFlow.cases('BT-2026-003', 'SX-BT').pop();
    SxFlow.complete(c.code, c.tokens[0].id, 0, { ktKetQua: 'Đạt sau khi hiệu chỉnh máy hàn' });
    Flow.setPersona('sxnm');
    c = SxFlow.caseOf(c.code);
    Flow.setPersona(c.tokens[0].who);
    SxFlow.complete(c.code, c.tokens[0].id, -1, { bhBaiHoc: 'Hiệu chỉnh nhiệt độ lò hàn theo lô linh kiện mới.' });
  });
  const l = await page.evaluate(() => SxHs.lessons().find((x) => x.src === 'BT-2026-003'));
  expect(l && [l.status, l.lesson]).toEqual(['DRAFT', 'Hiệu chỉnh nhiệt độ lò hàn theo lô linh kiện mới.']);
  expect(page.errors).toEqual([]);
});
