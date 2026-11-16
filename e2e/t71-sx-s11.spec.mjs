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
  await expect(page.locator('[data-sx-docs] tbody tr').first()).toContainText('Phương án xử lý bất thường — DA-SX-2026-002.docx');
  await expect(page.locator('[data-sx-docs] tbody tr').first()).toContainText('Phương án xử lý bất thường (BM.QLBT.02)');
  // Dừng hoạt động mẫu trong danh mục → không còn trong Chọn mẫu.
  await page.evaluate(() => { Catalog.rows('sx-bieu-mau').find((r) => r.code === 'BM.QLBT.02').active = false; });
  await page.locator('[data-sx-tpl]').click();
  await expect(page.locator('.vmodal [data-sx-tpl-use]')).toHaveCount(6);
  expect(page.errors).toEqual([]);
});

test('Hồ sơ dự án: gom tài liệu theo nhóm, phạm vi vai; tải lên, chọn mẫu, sửa, xoá tài liệu người dùng thêm', async ({ page }) => {
  await fresh(page, '#/sx/ho-so');
  await as(page, 'sxpm', '#/sx/ho-so');
  await expect(page.locator('.pg-title')).toContainText('Hồ sơ dự án');
  const n0 = await page.locator('.vtable tbody tr.click').count();
  expect(n0).toBeGreaterThan(0);
  await expect(page.locator('.vtable tbody')).not.toContainText('DA-SX-2026-003'); // Khối 2
  // Tài liệu có sẵn chỉ xem.
  await expect(row(page, 'PAKD 214-PAKD-VHT.pdf').locator('[data-sxhs-del]')).toHaveCount(0);
  await expect(row(page, 'PAKD 214-PAKD-VHT.pdf')).toContainText('Kế hoạch và căn cứ');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Chọn mẫu tài liệu.
  await page.locator('[data-sxhs-tpl]').click();
  await pickEf(page, 'hsProject', 'DA-SX-2026-001');
  await pickEf(page, 'hsTpl', 'BM.QLHDSX.04');
  await page.locator('.vmodal #ok').click();
  await expect(row(page, 'Biên bản làm việc Tổng công ty với nhà máy — DA-SX-2026-001.docx')).toContainText('Từ biểu mẫu');
  await expect(row(page, 'Biên bản làm việc Tổng công ty với nhà máy — DA-SX-2026-001.docx')).toContainText('Chuẩn bị sản xuất');
  // Sửa tên, loại.
  await row(page, 'Biên bản làm việc Tổng công ty với nhà máy — DA-SX-2026-001.docx').locator('[data-sxhs-edit]').click();
  await page.locator('.vmodal [data-ef="hsName"]').fill('Biên bản làm việc với VMC tháng 11.docx');
  await page.locator('.vmodal [data-ef="hsVer"]').fill('v1.0');
  await page.locator('.vmodal #ok').click();
  await expect(row(page, 'Biên bản làm việc với VMC tháng 11.docx')).toContainText('v1.0');
  // Tab Tài liệu của dự án thấy cùng tài liệu.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="docs"]').click();
  await expect(page.locator('[data-sx-docs]')).toContainText('Biên bản làm việc với VMC tháng 11.docx');
  // Xoá.
  await as(page, 'sxpm', '#/sx/ho-so');
  await row(page, 'Biên bản làm việc với VMC tháng 11.docx').locator('[data-sxhs-del]').click();
  await page.locator('#cf-ok').click();
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(n0);
  // Bấm dòng mở Xem chi tiết.
  await row(page, 'PAKD 214-PAKD-VHT.pdf').locator('td').nth(3).click();
  await expect(page.locator('.vmodal')).toContainText('Xem chi tiết tài liệu');
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
