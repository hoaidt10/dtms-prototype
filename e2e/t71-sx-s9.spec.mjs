// @ts-check
// T71 S9 (D-124): SX-16 Công việc — việc cá nhân / nhiệm vụ đơn vị, ô chỉ số lọc nhanh, công việc con nhiều cấp, cập nhật tiến độ,
// Giao việc từ tab Kế hoạch & mốc (% hạng mục theo công việc), kick-off tự giao nhiệm vụ, nhắc hạn (chuông + Việc của tôi), Nhập / Xuất Excel, Xoá.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const pick = async (page, id, val) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const row = (page, code) => page.locator('.vtable tbody tr', { hasText: code });
const tile = (page, t) => page.locator(`[data-sxcv-tile$="|${t}"]`);
const planRow = (page, name) => page.locator('[data-sx-plan] tbody tr', { hasText: name });

test('Danh sách nhiệm vụ đơn vị và việc cá nhân: ô chỉ số, lọc nhanh, quá hạn / sắp đến hạn, phạm vi xem', async ({ page }) => {
  await fresh(page, '#/sx/cong-viec/don-vi');
  await as(page, 'sxpm', '#/sx/cong-viec/don-vi');
  await expect(page.locator('.pg-title')).toContainText('Danh sách nhiệm vụ đơn vị');
  await expect(page.locator('.sb-nav [data-go="sx/cong-viec/don-vi"]')).toHaveClass(/active/);
  // sxpm thấy 3 nhiệm vụ Khối 1 (NV-001, 002, 003); NV-004 là Khối 2.
  await expect(page.locator('.vtable tbody tr')).toHaveCount(3);
  await expect(tile(page, 'all').locator('.n')).toHaveText('3');
  await expect(tile(page, 'done').locator('.n')).toHaveText('1');
  await expect(row(page, 'NV-SX-2026-001')).toContainText('63%'); // trung bình 3 việc con 50 / 40 / 100
  await expect(row(page, 'NV-SX-2026-001')).toContainText('2. Chuẩn bị sản xuất (4M)'); // T74 #94/#96: cột Giai đoạn thay Hạng mục kế hoạch
  await expect(row(page, 'NV-SX-2026-002')).toContainText('Hoàn thành');
  // Việc từ kế hoạch không có nút Xoá.
  await expect(row(page, 'NV-SX-2026-001').locator('[data-sxcv-del]')).toHaveCount(0);
  await tile(page, 'done').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await tile(page, 'done').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(3);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Xuất Excel theo bộ lọc.
  const dl = page.waitForEvent('download');
  await page.locator('[data-sxcv-export="DV"]').click();
  expect((await dl).suggestedFilename()).toBe('Danh sach nhiem vu don vi.csv');
  // Khối 2 chỉ thấy nhiệm vụ của mình.
  await as(page, 'sxk2', '#/sx/cong-viec/don-vi');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(row(page, 'NV-SX-2026-004')).toContainText('Đang thực hiện');
  // Việc cá nhân của Sub PM: một quá hạn, một sắp đến hạn; người khác không thấy việc cá nhân không liên quan.
  await as(page, 'sxsub', '#/sx/cong-viec/ca-nhan');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  await expect(row(page, 'CV-SX-2026-002')).toContainText('Quá hạn');
  await expect(row(page, 'CV-SX-2026-002').locator('.due-over')).toHaveCount(1);
  await expect(row(page, 'CV-SX-2026-001')).toContainText('2 ngày');
  await expect(tile(page, 'over').locator('.n')).toHaveText('1');
  await expect(tile(page, 'soon').locator('.n')).toHaveText('1');
  await as(page, 'sxqa', '#/sx/cong-viec/ca-nhan');
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(0);
  await expect(page.locator('.vtable-empty')).toContainText('Chưa có dữ liệu');
  expect(page.errors).toEqual([]);
});

test('Nhắc hạn: chuông và Việc của tôi; cập nhật tiến độ việc con → % việc cha và hạng mục kế hoạch', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxsub', '#/sx/viec-cua-toi');
  const base = await page.evaluate(() => SxFlow.pending('sxsub'));
  await expect(page.locator('.topbar .bell .count')).toHaveText(String(base + 2));
  await expect(page.locator('[data-sxcv-remind]')).toContainText('1 công việc quá hạn, 1 công việc sắp đến hạn');
  await page.locator('[data-sxcv-remind] .link').click();
  await expect(page.locator('.pg-title')).toContainText('Danh sách việc cá nhân');
  await expect(tile(page, 'mine')).toHaveClass(/on/);
  // Mở việc con quá hạn, cập nhật 100%.
  await row(page, 'CV-SX-2026-002').locator('a.link').first().click();
  await expect(page.locator('[data-sxcv-detail]')).toContainText('Công việc quá hạn 6 ngày');
  await expect(page.locator('[data-sxcv-detail]')).toContainText('NV-SX-2026-001');
  await page.locator('[data-sxcv-upd]').click();
  await page.locator('#cvu-pct').fill('120');
  await page.locator('#cvu-ok').click();
  await expect(page.locator('#cvu-err')).toContainText('từ 0 đến 100');
  await page.locator('#cvu-pct').fill('100');
  await page.locator('#cvu-note').fill('Hoàn thành Jig đo khối quang học');
  await page.locator('#cvu-ok').click();
  await expect(page.locator('[data-sxcv-detail] .vbadge', { hasText: 'Hoàn thành' }).first()).toBeVisible();
  await expect(page.locator('.topbar .bell .count')).toHaveText(String(base + 1));
  // Việc cha: 3 việc con, % = (50 + 100 + 100) / 3.
  await as(page, 'sxpm', '#/sx/cong-viec/NV-SX-2026-001');
  await expect(page.locator('[data-sxcv-detail]')).toContainText('83% (theo công việc con)');
  await expect(page.locator('[data-sxcv-upd]')).toHaveCount(0); // việc có việc con không cập nhật tay
  await page.locator('.tab', { hasText: 'Công việc con' }).click();
  await expect(page.locator('[data-sxcv-kids] tbody tr')).toHaveCount(3);
  // Hạng mục 7 của DA-SX-2026-002 đọc % từ công việc.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002/ke-hoach');
  await expect(planRow(page, '7. Bảo đảm máy móc')).toContainText('83%');
  await expect(planRow(page, '7. Bảo đảm máy móc')).toContainText('1 việc');
  await expect(planRow(page, '6. Bảo đảm nhân lực')).toContainText('100%');
  expect(page.errors).toEqual([]);
});

test('Giao việc từ kế hoạch, công việc con (hạn không sau việc cha), Nhập Excel, Xoá, kick-off tự giao nhiệm vụ', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002/ke-hoach');
  await planRow(page, '4. Bảo đảm vật tư').locator('button', { hasText: 'Giao việc' }).click();
  await expect(page.locator('.pg-title')).toContainText('Thêm mới nhiệm vụ đơn vị');
  await expect(page.locator('[data-vsel="cvf-project"]')).toContainText('DA-SX-2026-002');
  await expect(page.locator('[data-vsel="cvf-plan"]')).toContainText('4. Bảo đảm vật tư');
  await page.locator('form [type="submit"]').click();
  await expect(page.locator('.vfield.invalid')).toHaveCount(3); // tên, người đầu mối, hạn
  await page.locator('#cvf-title').fill('Theo dõi vật tư leadtime dài đợt 1 về kho');
  await pick(page, 'cvf-owner', 'sxpm');
  await page.locator('#cvf-due').fill('15/12/2026');
  await page.locator('form [type="submit"]').click();
  await expect(page.locator('[data-sxcv-detail]')).toContainText('NV-SX-2026-005');
  await expect(page.locator('[data-sxcv-detail]')).toContainText('4. Bảo đảm vật tư');
  // Công việc con: hạn sau hạn việc cha bị chặn.
  await page.locator('[data-go^="sx/cong-viec/create/CN/cha/"]').click();
  await expect(page.locator('.pg-title')).toContainText('Thêm mới việc cá nhân');
  await page.locator('#cvf-title').fill('Đôn đốc nhà cung cấp FPGA');
  await pick(page, 'cvf-owner', 'sxsub');
  await page.locator('#cvf-due').fill('20/12/2026');
  await page.locator('form [type="submit"]').click();
  await expect(page.locator('.vfield.invalid')).toContainText('không được sau hạn của công việc cha (15/12/2026)');
  await page.locator('#cvf-due').fill('10/12/2026');
  await page.locator('form [type="submit"]').click();
  await expect(page.locator('[data-sxcv-detail]')).toContainText('CV-SX-2026-006');
  await expect(page.locator('[data-sxcv-detail]')).toContainText('NV-SX-2026-005');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002/ke-hoach');
  await expect(planRow(page, '4. Bảo đảm vật tư')).toContainText('1 việc');
  await expect(planRow(page, '4. Bảo đảm vật tư')).toContainText('0%');
  // Nhập Excel: 4/6 dòng hợp lệ.
  await as(page, 'sxpm', '#/sx/cong-viec/ca-nhan');
  const before = await page.locator('.vtable tbody tr').count();
  await page.locator('[data-sxcv-import="CN"]').click();
  await page.locator('.vmodal [data-imp-zone]').click();
  await page.locator('.vmodal #imp-go').click();
  await expect(page.locator('[data-sxcv-imp] .imp-sum')).toHaveText('4/6 dòng hợp lệ');
  await expect(page.locator('[data-sxcv-imp]')).toContainText('Người thực hiện Nguyễn Văn X không có trong hệ thống.');
  await page.locator('.vmodal #imp-ok').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(before + 4);
  // Xoá việc vừa nhập (chưa cập nhật tiến độ).
  await row(page, 'Lập danh sách vật tư tiêu hao đợt 2').locator('[data-sxcv-del]').click();
  await page.locator('#cf-ok').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(before + 3);
  await expect(page.locator('.pg-title')).toContainText('Danh sách việc cá nhân');
  // Kick-off (chốt kế hoạch gốc) tự giao nhiệm vụ đơn vị cho bước 4–8.
  const n = await page.evaluate(() => { SxFlow.ACT['kh.baseline']({ obj: 'DA-SX-2026-004', vars: { khSo: '05/KH-SX', koNgay: '16/11/2026' } }); return SxCv.all().filter((x) => x.project === 'DA-SX-2026-004' && x.src === 'KH').length; });
  expect(n).toBe(5);
  await as(page, 'sxk2', '#/sx/cong-viec/don-vi');
  await expect(page.locator('.vtable tbody tr', { hasText: 'DA-SX-2026-004' })).toHaveCount(5);
  // T74 #94/#96: bỏ cột Nguồn khỏi Nhiệm vụ đơn vị (bộ cột KHCN); nhiệm vụ bước 8 thuộc giai đoạn 3.
  await expect(page.locator('.vtable tbody tr', { hasText: 'Thống nhất phương án tổ chức sản xuất' })).toContainText('3. Tổ chức sản xuất và giao hàng');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
