// @ts-check
// T71 S1 (D-121): Dự án sản xuất — SX-02 danh sách, SX-03 thêm mới / chỉnh sửa, SX-04 chi tiết (Thông tin chung, Kế hoạch & mốc, Tài liệu, Lịch sử).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const pick = async (page, id, val) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };

test('SX-02: danh sách đủ cột, mọi dòng mở được chi tiết, tìm kiếm theo từ khoá, không chữ BA', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await expect(page.locator('.pg-title')).toContainText('Danh sách dự án sản xuất');
  await expect(page.locator('.vtable thead th')).toHaveText(['STT', 'Trạng thái', 'Mã dự án', 'Tên dự án', 'Sản phẩm · phiên bản', 'Khối', 'Mô hình tổ chức', 'Số lượng',
    'Đơn vị sản xuất', 'Giám đốc dự án', 'Ngày bắt đầu', 'Ngày kết thúc', 'Tiến độ', 'Mốc chậm']);
  await expect(page.locator('.vtable tbody tr')).toHaveCount(4);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  for (const code of ['DA-SX-2026-001', 'DA-SX-2026-002', 'DA-SX-2026-003', 'DA-SX-2026-004']) {
    await page.evaluate(() => { location.hash = '#/sx/du-an'; });
    await page.locator('.vtable a.link', { hasText: code }).click();
    await expect(page.locator('.pg-title')).toContainText('Xem chi tiết dự án sản xuất');
    await expect(page.locator('.ginfo')).toContainText(code);
    await expect(page.locator('.sb-nav [data-go="sx/du-an"]')).toHaveClass(/active/);
    expect(await page.locator('main').innerText()).not.toMatch(BA);
  }
  await page.evaluate(() => { location.hash = '#/sx/du-an'; });
  await page.locator('#sxda-kw').fill('WM-6');
  await page.locator('#sxda-kw').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody tr')).toContainText('DA-SX-2026-003');
  expect(page.errors).toEqual([]);
});

test('Phạm vi dữ liệu theo vai: Khối 1, Khối 2, Nhà máy; chỉ PM thấy Thêm mới; vai không được xem bị chặn khi mở thẳng', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-go="sx/du-an/create"]')).toBeVisible();
  await as(page, 'sxk2', '#/sx/du-an');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  await expect(page.locator('.vtable tbody')).toContainText('DA-SX-2026-003');
  await as(page, 'sxnm', '#/sx/du-an');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('[data-go="sx/du-an/create"]')).toHaveCount(0);
  await as(page, 'sxnm', '#/sx/du-an/DA-SX-2026-001');
  await expect(page.locator('main')).toContainText('Không tìm thấy dự án sản xuất hoặc bạn không có quyền xem.');
  await as(page, 'sxqa', '#/sx/du-an');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(4);
  expect(page.errors).toEqual([]);
});

test('SX-03: Thêm mới báo lỗi trường bắt buộc, lưu thành dự án Lập kế hoạch; kế hoạch theo bán thành phẩm; Chỉnh sửa ghi lịch sử', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an');
  await page.locator('[data-go="sx/du-an/create"]').click();
  await expect(page.locator('.pg-title')).toContainText('Thêm mới dự án sản xuất');
  await page.locator('[data-sx-form] button[type="submit"]').click();
  await expect(page.locator('.vfield.invalid .msg')).toContainText(['Bạn cần nhập Tên dự án.', 'Bạn cần chọn Căn cứ hình thành.']);
  await page.locator('#sxf-name').fill('Sản xuất đài ra-đa cảnh giới tầm thấp RĐ-40 đợt 1');
  await pick(page, 'sxf-basis', 'NV');
  await page.locator('#sxf-basisNo').fill('Quyết định số 2001/QĐ-VHT ngày 02/11/2026');
  await page.locator('#sxf-basisFile').setInputFiles({ name: 'QD-2001.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
  await pick(page, 'sxf-trial', 'Y');
  await pick(page, 'sxf-product', 'RĐ-40');
  await expect(page.locator('[data-sx-form]')).toContainText('Phiên bản');
  await pick(page, 'sxf-model', 'VHT_TU_SX');
  await page.locator('#sxf-qty').fill('6');
  await page.locator('#sxf-start').fill('01/12/2026');
  await page.locator('#sxf-end').fill('30/11/2026');
  await page.locator('[data-sx-form] button[type="submit"]').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Ngày kết thúc phải sau Ngày bắt đầu.']);
  await page.locator('#sxf-end').fill('30/09/2027');
  await page.locator('[data-sx-form] button[type="submit"]').click();
  await expect(page).toHaveURL(/#\/sx\/du-an\/DA-SX-2026-005$/);
  await expect(page.locator('.ginfo')).toContainText('Lập kế hoạch');
  await expect(page.locator('.ginfo')).toContainText('RĐ-40');
  await expect(page.locator('.ginfo')).toContainText('Khối 1');
  await page.locator('[data-ttab="plan"]').click();
  await expect(page.locator('[data-sx-plan] .cap')).toContainText('Chưa có kế hoạch gốc');
  await expect(page.locator('[data-sx-plan]')).toContainText('Bán thành phẩm: Khối quang học');
  await expect(page.locator('[data-sx-plan]')).toContainText('11. Thử nghiệm thực tế');
  expect(await page.evaluate(() => SxDuAn.progressOf(SxDuAn.byCode('DA-SX-2026-005')))).toBe(0);
  await page.locator('[data-go="sx/du-an/DA-SX-2026-005/edit"]').click();
  await expect(page.locator('#sxf-name')).toHaveValue('Sản xuất đài ra-đa cảnh giới tầm thấp RĐ-40 đợt 1');
  await page.locator('#sxf-name').fill('Sản xuất đài ra-đa RĐ-40 đợt 1 (6 bộ)');
  await page.locator('[data-sx-form] button[type="submit"]').click();
  await expect(page.locator('.ginfo')).toContainText('Sản xuất đài ra-đa RĐ-40 đợt 1 (6 bộ)');
  await page.locator('[data-ttab="hist"]').click();
  await expect(page.locator('main .vtable tbody tr')).toHaveCount(2);
  await expect(page.locator('main .vtable tbody tr').first()).toContainText('Cập nhật thông tin dự án');
  // Dự án đã có kế hoạch gốc không còn Chỉnh sửa.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await expect(page.locator('[data-go$="/edit"]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('SX-04 Kế hoạch & mốc: bước 9 theo mô hình tổ chức; giai đoạn Lập kế hoạch xong khi đã chốt kế hoạch gốc; mốc chậm có cảnh báo', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  const kids = await page.evaluate(() => Object.fromEntries(['DA-SX-2026-001', 'DA-SX-2026-002', 'DA-SX-2026-003'].map((c) => {
    const g3 = SxDuAn.planOf(SxDuAn.byCode(c))[2];
    return [c, { b9: g3.children.find((x) => x.key === 'B9').children.map((x) => x.key), b11: g3.children.some((x) => x.key === 'B11') }];
  })));
  // T74 #97: VMC tổng thầu — M1 Ký hợp đồng tổng thầu lên đầu giai đoạn 3, bỏ M2 Vật tư về đủ (trùng Tiến độ cung ứng của bước 4).
  expect(kids['DA-SX-2026-001']).toEqual({ b9: ['B9.M3', 'B9.M4'], b11: true });
  expect(await page.evaluate(() => SxDuAn.planOf(SxDuAn.byCode('DA-SX-2026-001'))[2].children.map((x) => x.key).slice(0, 2))).toEqual(['M1', 'B8']);
  expect(await page.evaluate(() => SxDuAn.planOf(SxDuAn.byCode('DA-SX-2026-003'))[1].children[0].children.map((x) => x.name))).toEqual(['Đề xuất mua sắm', 'Tiến độ cung ứng']);
  expect(kids['DA-SX-2026-002'].b9).toEqual(['B9.BTP1', 'B9.BTP2', 'B9.BTP3', 'B9.BTP4', 'B9.BTP5']);
  expect(kids['DA-SX-2026-003']).toEqual({ b9: ['B9.L1', 'B9.L2', 'B9.L3', 'B9.L4', 'B9.L5', 'B9.L6'], b11: false });
  const g1 = await page.evaluate(() => SxDuAn.planOf(SxDuAn.byCode('DA-SX-2026-002'))[0].pct);
  expect(g1).toBe(100);
  await page.evaluate(() => { location.hash = '#/sx/du-an/DA-SX-2026-002/ke-hoach'; });
  await expect(page.locator('[data-sx-plan] .cap')).toContainText('Kế hoạch gốc chốt ngày 12/06/2026');
  await expect(page.locator('.hd-alert.error')).toContainText('hạng mục chậm tiến độ');
  await expect(page.locator('[data-sx-plan] tbody')).toContainText('Bán thành phẩm: Vỏ cơ khí');
  // Thu gọn giai đoạn 3.
  await page.locator('[data-vtt="sx-plan"][data-vtt-key="G3"]').click();
  await expect(page.locator('[data-sx-plan] tbody')).not.toContainText('Bán thành phẩm: Vỏ cơ khí');
  expect(page.errors).toEqual([]);
});

test('SX-04 Tài liệu: Chọn mẫu tài liệu thêm dòng từ mẫu BM.QLHDSX.04 và ghi lịch sử', async ({ page }) => {
  await fresh(page, '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="docs"]').click();
  // T74 #97: tài liệu chia theo loại; bảng "Loại tài liệu chưa có" không tính.
  const docRows = page.locator('[data-sx-docs] tbody tr', { hasNotText: 'Chưa có tài liệu' });
  await expect(docRows).toHaveCount(3);
  await page.locator('[data-sx-tpl]').click();
  // T71 S11: mẫu lấy từ danh mục Biểu mẫu tài liệu sản xuất, chọn theo mã biểu mẫu.
  await page.locator('.vmodal [data-sx-tpl-use="BM.QLHDSX.04"]').click();
  await expect(docRows).toHaveCount(4);
  await expect(page.locator('[data-sx-docs] tbody tr', { hasText: 'Biên bản làm việc Tổng công ty với nhà máy — DA-SX-2026-001.docx' })).toHaveCount(1);
  await page.locator('[data-ttab="hist"]').click();
  await expect(page.locator('main .vtable tbody tr').first()).toContainText('Tạo tài liệu từ mẫu');
  expect(page.errors).toEqual([]);
});
