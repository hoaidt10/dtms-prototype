// T16 B2 — Backlog W1_T10 (docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2i): KĐT (Danh sách hồ sơ KĐT SCR-75, YCBG KĐT SCR-76/77,
// tab Chi tiết KĐT SCR-56) và Quản lý thầu (KHLCNT SCR-78…80, gói thầu SCR-81/82, nhà thầu & rủi ro SCR-83).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const as = async (page, who, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate((p) => Flow.setPersona(p), who);
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const KDT = (c) => '#/kdt/' + encodeURIComponent(c);

test('Menu: KĐT và Quản lý thầu mở màn thật; route cũ #/ph/… chuyển hướng', async ({ page }) => {
  await as(page, 'minh', '#/ph/ho-so-kdt');
  await expect(page).toHaveURL(/#\/ho-so-kdt$/);
  for (const [h, t] of [['#/ph/ycbg-kdt', 'Danh sách yêu cầu báo giá'], ['#/ph/khlcnt', 'Danh sách kế hoạch lựa chọn nhà thầu'], ['#/ph/goi-thau', 'Danh sách gói thầu'], ['#/ph/ds-cam', 'Nhà thầu & kiểm soát rủi ro']]) {
    await go(page, h);
    await expect(page.locator('.pg-title')).toHaveText(t);
    expect(await mainText(page)).not.toMatch(BA);
  }
  await expect(page.locator('.sb-nav .nav.active')).toHaveText('Nhà thầu & kiểm soát rủi ro');
  expect(page.errors).toEqual([]);
});

test('Danh sách hồ sơ KĐT: mọi hồ sơ mở được; tìm kiếm nâng cao theo Nhóm KĐT', async ({ page }) => {
  await as(page, 'minh', '#/ho-so-kdt');
  const n = await page.locator('main .vtable tbody tr').count();
  expect(n).toBe(10);
  await expect(page.locator('main .pager, main [data-pager="hkdt"]').first()).toContainText('13');
  await page.locator('#hk-kw').fill('HS-2026-0012');
  await page.locator('#hk-kw').press('Enter');
  await expect(page.locator('main .vtable tbody tr')).toHaveCount(1);
  await page.locator('main .vtable tbody tr', { hasText: 'HS-2026-0012' }).locator('a.link').first().click();
  await expect(page).toHaveURL(/#\/ho-so-kdt\/HS-2026-0012$/);
  await page.locator('.pg-head .vbtn.back').click();
  await expect(page).toHaveURL(/#\/ho-so-kdt$/);
  await page.locator('[data-hk="adv"]').click();
  await page.locator('[data-vsel="hkf-group"]').click();
  await page.locator('.vsel-panel [data-opt="MS14"]').click();
  await page.keyboard.press('Escape');
  await page.locator('[data-hk-adv] button[type="submit"]').click();
  await expect(page.locator('main .vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('main .vtable tbody tr')).toContainText('HS-2026-0019');
  expect(page.errors).toEqual([]);
});

test('YCBG KĐT: danh sách theo hồ sơ KĐT đã qua bước 8, chi tiết, xuất file', async ({ page }) => {
  await as(page, 'minh', '#/ycbg-kdt');
  const rows = page.locator('main .vtable tbody tr');
  await expect(rows.first()).toContainText('YCBG-KĐT-');
  const codes = await page.evaluate(() => Ycbg.allYcbg('kdt').map((y) => y.dxms));
  expect(codes).not.toContain('KĐT-2026-0033');
  expect(codes).toContain('KĐT-2026-0012');
  await page.locator('#y-kw').fill('KĐT-2026-0012');
  await page.locator('#y-kw').press('Enter');
  await page.locator('main .vtable tbody tr', { hasText: 'KĐT-2026-0012' }).locator('a.link').first().click();
  await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết yêu cầu báo giá');
  await expect(page.locator('.ginfo')).toContainText('Mã KĐT');
  await expect(card(page, 'So sánh báo giá')).toContainText('Tổng giá trị theo cơ sở giá');
  const dl = page.waitForEvent('download');
  await page.locator('.pg-head [data-y-export]').click();
  expect((await dl).suggestedFilename()).toMatch(/^YCBG-KĐT-2026-0012-01\.csv$/);
  await page.locator('.pg-head .vbtn.back').click();
  await expect(page).toHaveURL(/#\/ycbg-kdt$/);
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Chi tiết KĐT: 7 tab — căn cứ, tồn kho, YCBG, phân loại, thành phần, kết quả; KĐT đã duyệt có KHLCNT', async ({ page }) => {
  await as(page, 'minh', KDT('KĐT-2026-0012'));
  const tabs = page.locator('.dx-tabs [data-dtab]');
  await expect(tabs).toHaveText(['Thông tin chung', 'Căn cứ & hạng mục', 'Rà soát tồn kho', 'Yêu cầu báo giá', 'Phân loại & định danh', 'Thành phần tham gia', 'Kết quả & triển khai']);
  await expect(page.locator('[data-kdt-profiles]')).toBeVisible();
  await tabs.filter({ hasText: 'Căn cứ & hạng mục' }).click();
  await expect(card(page, 'Căn cứ hình thành KĐT')).toContainText('2318/QĐ-VHT');
  await expect(card(page, 'Hạng mục đầu tư').locator('tbody tr')).not.toHaveCount(0);
  await tabs.filter({ hasText: 'Rà soát tồn kho' }).click();
  await expect(card(page, 'Kết quả rà soát tồn kho')).toContainText('Đã chốt sử dụng');
  await tabs.filter({ hasText: 'Yêu cầu báo giá' }).click();
  await expect(card(page, 'Danh sách yêu cầu báo giá')).toContainText('YCBG-KĐT-2026-0012-01');
  await tabs.filter({ hasText: 'Phân loại' }).click();
  await expect(card(page, '04 yếu tố định danh').locator('tbody tr')).toHaveCount(4);
  await expect(card(page, 'Kết quả phân loại')).toContainText('MS13 · KĐT đơn giản');
  await expect(card(page, 'Điều kiện áp dụng hồ sơ gộp')).toContainText('hai giai đoạn');
  await expect(card(page, 'Cấp có thẩm quyền phê duyệt')).toContainText('Tổng Giám đốc VHT');
  await expect(card(page, 'Cấp có thẩm quyền phê duyệt')).toContainText('UQ-GUQ §1.2.2');
  await tabs.filter({ hasText: 'Thành phần tham gia' }).click();
  await expect(card(page, 'CQCM tham gia thẩm định').locator('tbody tr')).toHaveCount(2);
  await tabs.filter({ hasText: 'Kết quả & triển khai' }).click();
  await expect(card(page, 'Kết quả phê duyệt')).toContainText('138,50 tỷ đồng');
  await expect(card(page, 'Văn bản đầu ra').locator('tbody tr')).toHaveCount(3);
  await expect(card(page, 'Triển khai mua sắm')).toContainText('KHLCNT-2026-0013');
  // Đã có KHLCNT → không còn nút Lập KHLCNT
  await expect(page.locator('.pg-head', { hasText: 'Lập KHLCNT' })).toHaveCount(0);
  expect(await mainText(page)).not.toMatch(BA);
  // KĐT chưa có hồ sơ: các tab báo trống; KĐT dừng theo chỉ đạo có khối chỉ đạo
  await go(page, KDT('KĐT-2026-0033'));
  await page.locator('.dx-tabs [data-dtab="phan-loai"]').click();
  await expect(page.locator('main .empty-t')).toContainText('KĐT chưa có hồ sơ');
  await go(page, KDT('KĐT-2026-0021'));
  await page.locator('.dx-tabs [data-dtab="ket-qua-kdt"]').click();
  await expect(card(page, 'Chỉ đạo dừng / bàn giao xử lý')).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('KHLCNT: Lập KHLCNT từ KĐT đã duyệt → giá trị được duyệt chỉ xem → Lưu → chi tiết; nguồn chưa duyệt / trùng bị chặn; xoá dự thảo', async ({ page }) => {
  await as(page, 'minh', KDT('KĐT-2026-0015'));
  await page.locator('.pg-head [data-go^="khlcnt/create"]').click();
  await expect(page).toHaveURL(/#\/khlcnt\/create\/KDT\//);
  await expect(page.locator('[data-vsel="kh-kind"]')).toContainText('Khoản đầu tư');
  await expect(page.locator('#kh-approved')).toHaveValue('8,60');
  await expect(page.locator('#kh-title')).toHaveValue(/^KHLCNT /);
  // Chỉ đối tượng đã phê duyệt
  await page.locator('[data-vsel="kh-src"]').click();
  const kopts = await page.locator('.vsel-panel [data-opt]').evaluateAll((els) => els.map((e) => e.dataset.opt));
  expect(kopts.sort()).toEqual(['KĐT-2026-0012', 'KĐT-2026-0015']);
  await page.locator('.vsel-panel [data-opt="KĐT-2026-0012"]').click();
  await page.locator('#kh-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toContainText('Đối tượng nguồn đã có KHLCNT-2026-0013');
  await page.locator('[data-vsel="kh-src"]').click();
  await page.locator('.vsel-panel [data-opt="KĐT-2026-0015"]').click();
  await page.locator('#kh-save').click();
  expect(await lastToast(page)).toContain('Thêm mới kế hoạch lựa chọn nhà thầu thành công');
  await expect(page).toHaveURL(/#\/khlcnt\/KHLCNT-2026-0018$/);
  await expect(page.locator('.ginfo').first()).toContainText('Dự thảo');
  await expect(card(page, 'Kiểm soát giá trị')).toContainText('Chưa lập phân bổ');
  // KĐT đã có KHLCNT → hết nút Lập KHLCNT; tab Kết quả & triển khai liệt kê KHLCNT mới
  await go(page, KDT('KĐT-2026-0015'));
  await expect(page.locator('.pg-head [data-go^="khlcnt/create"]')).toHaveCount(0);
  await page.locator('.dx-tabs [data-dtab="ket-qua-kdt"]').click();
  await expect(card(page, 'Triển khai mua sắm')).toContainText('KHLCNT-2026-0018');
  // Danh sách: không có cột Thao tác (D-43); dự thảo mới hiện trong danh sách
  await go(page, '#/khlcnt');
  await expect(page.locator('main .vtable th', { hasText: 'Thao tác' })).toHaveCount(0);
  await expect(page.locator('main .vtable tbody tr', { hasText: 'KHLCNT-2026-0018' })).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Chi tiết KHLCNT: phân bổ công việc khớp giá trị được duyệt; gói thầu; điều chỉnh tạo phiên bản mới', async ({ page }) => {
  await as(page, 'minh', '#/khlcnt/' + encodeURIComponent('KHLCNT-2026-0009'));
  await expect(card(page, 'Kiểm soát giá trị')).toContainText('Khớp giá trị được duyệt');
  await page.locator('.dx-tabs [data-ttab="phan-bo"]').click();
  await expect(card(page, 'e) Tổng hợp giá trị')).toContainText('236,40');
  await page.locator('.dx-tabs [data-ttab="goi"]').click();
  await expect(card(page, 'Danh sách gói thầu').locator('tbody tr')).toHaveCount(2);
  await expect(card(page, 'Cơ sở phân chia gói thầu')).toContainText('KHLCNT nhiều gói thầu');
  await page.locator('.dx-tabs [data-ttab="phien-ban"]').click();
  await expect(card(page, 'So sánh KHLCNT trước / sau điều chỉnh').locator('tbody tr')).toHaveCount(3);
  await page.locator('.dx-tabs [data-ttab="ket-qua"]').click();
  await expect(card(page, 'Văn bản của KHLCNT').locator('tbody tr')).toHaveCount(5);
  await expect(card(page, 'Văn bản của KHLCNT')).toContainText('KH202609-006-00');
  await expect(card(page, 'Văn bản của KHLCNT')).toContainText('1000009790');
  await expect(card(page, 'Kết quả kiểm tra KHLCNT').locator('tbody tr')).toHaveCount(16);
  await page.locator('[data-kh-adj]').click();
  await page.locator('#adj-ok').click();
  await expect(page.locator('#adj-err')).toBeVisible();
  await page.locator('#adj-why').fill('Điều chỉnh tiến độ giao hàng gói dây chuyền');
  await page.locator('#adj-ok').click();
  expect(await lastToast(page)).toContain('Đã tạo phiên bản điều chỉnh KHLCNT');
  await page.locator('.dx-tabs [data-ttab="info"]').click();
  await expect(page.locator('.ginfo').first()).toContainText('Đang điều chỉnh');
  await page.locator('.dx-tabs [data-ttab="phien-ban"]').click();
  await expect(card(page, 'Lịch sử phiên bản KHLCNT').locator('tbody tr').first()).toContainText('v3');
  // KHLCNT đang kiểm tra: kết quả kiểm tra có nội dung chưa đạt
  await go(page, '#/khlcnt/' + encodeURIComponent('KHLCNT-2026-0016'));
  await page.locator('.dx-tabs [data-ttab="ket-qua"]').click();
  await expect(card(page, 'Kết quả kiểm tra KHLCNT').locator('tbody tr', { hasText: 'Không đáp ứng' })).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Gói thầu: danh sách mở được mọi dòng; 11 hình thức; tab theo giai đoạn', async ({ page }) => {
  await as(page, 'minh', '#/goi-thau');
  const forms = await page.evaluate(() => [...new Set(Thau.khAll().flatMap((k) => Thau.pkgsOf(k).map((g) => g.form)))].sort());
  expect(forms).toHaveLength(11);
  const codes = await page.evaluate(() => Thau.khAll().flatMap((k) => Thau.pkgsOf(k).map((g) => g.code)));
  for (const c of codes) {
    await go(page, '#/goi-thau/' + c);
    await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết gói thầu');
    for (const t of ['info', 'pa', 'tp', 'hs', 'dg', 'th']) {
      await page.locator(`.dx-tabs [data-ttab="${t}"]`).click();
      expect(await mainText(page)).not.toMatch(BA);
    }
  }
  // GT-2026-0021: xếp hạng, giá thấp bất thường, KQLCNT, kiến nghị đang tạm dừng ký HĐ → không có nút Tạo hợp đồng
  await go(page, '#/goi-thau/GT-2026-0021');
  await page.locator('.dx-tabs [data-ttab="dg"]').click();
  await expect(card(page, 'Kết quả đánh giá nhà thầu')).toContainText('Giá thấp bất thường');
  await expect(card(page, 'Kết quả lựa chọn nhà thầu')).toContainText('Iota Electronics');
  await expect(page.locator('.pg-head', { hasText: 'Tạo hợp đồng' })).toHaveCount(0);
  await go(page, '#/goi-thau/GT-2026-0027');
  await expect(page.locator('.pg-head [data-go="hop-dong/create/GT-2026-0027"]')).toHaveText('Tạo hợp đồng');
  // GT-2026-0024 đấu thầu hạn chế: danh sách ngắn ≥ 03
  await go(page, '#/goi-thau/GT-2026-0024');
  await page.locator('.dx-tabs [data-ttab="tp"]').click();
  await expect(card(page, 'Danh sách ngắn')).toContainText('đạt tối thiểu 03');
  // Tìm kiếm nâng cao theo trạng thái
  await go(page, '#/goi-thau');
  await page.locator('[data-tl="gtl:adv"]').click();
  await page.locator('[data-vsel="tf-gtl-st"]').click();
  await page.locator('.vsel-panel [data-opt="HUY"]').click();
  await page.keyboard.press('Escape');
  await page.locator('[data-tadv="gtl"] button[type="submit"]').click();
  await expect(page.locator('main .vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('main .vtable tbody tr')).toContainText('GT-2026-0030');
  expect(page.errors).toEqual([]);
});

test('Nhà thầu & kiểm soát rủi ro: 3 tab, nhà thầu bị cấm lấy từ danh mục NCC', async ({ page }) => {
  await as(page, 'minh', '#/nha-thau');
  await expect(card(page, 'Nhà thầu chiến lược').locator('tbody tr')).toHaveCount(4);
  await page.locator('[data-nttab="hang"]').click();
  await expect(card(page, 'Hãng sản xuất chiến lược').locator('tbody tr')).toHaveCount(3);
  await page.locator('[data-nttab="cam"]').click();
  await expect(card(page, 'Nhà thầu bị cấm / hạn chế')).toContainText('Cấm đến 31/12/2026');
  await expect(card(page, 'Lịch sử vi phạm và chế tài').locator('tbody tr')).toHaveCount(3);
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('T24 B3 — KHLCNT theo hệ thống cũ: cột, lọc Quy chế / Cấp phê duyệt / Ngày QĐ; form Quy chế áp dụng, Người phụ trách; Tổng bằng chữ; tab Tờ trình', async ({ page }) => {
  await as(page, 'minh', '#/khlcnt');
  await expect(page.locator('main .vtable th')).toHaveText(['STT', 'Trạng thái', 'Mã KHLCNT', 'Tên KHLCNT', 'Quy chế áp dụng', 'Cấp phê duyệt', 'Người phụ trách', 'Loại đối tượng nguồn', 'Mã đối tượng nguồn', 'Đơn vị lập',
    'Số QĐ KHLCNT', 'Ngày QĐ KHLCNT', 'Ngày đăng tải KHLCNT', 'Số gói thầu', 'Tổng giá gói thầu (tỷ đồng)', 'Ngày cập nhật']);
  const row9 = page.locator('main .vtable tbody tr', { hasText: 'KHLCNT-2026-0009' });
  await expect(row9).toContainText('0719/QĐ-VHT');
  await expect(row9).toContainText('03/09/2026');
  // Lọc: Theo luật chỉ còn KHLCNT-2026-0011; Tập đoàn chỉ còn 0016; khoảng ngày QĐ
  await page.locator('[data-tl="khl:adv"]').click();
  await page.locator('[data-vsel="tf-khl-qc"]').click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Theo luật' }).click();
  await page.locator('form[data-tadv="khl"] button[type="submit"]').click();
  await expect(page.locator('main .vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('main .vtable tbody tr')).toContainText('KHLCNT-2026-0011');
  await page.locator('[data-tl="khl:reset"]').click();
  await page.locator('[data-tf="khl:from"]').fill('01/09/2026');
  await page.locator('[data-tf="khl:to"]').fill('10/09/2026');
  await page.locator('form[data-tadv="khl"] button[type="submit"]').click();
  await expect(page.locator('main .vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('main .vtable tbody tr')).toContainText('KHLCNT-2026-0009');
  // Form: Quy chế mặc định MSTX, Người phụ trách mặc định người tạo; bỏ hai ô cũ
  await go(page, '#/khlcnt/create');
  await expect(page.locator('[data-vsel="kh-qc"]')).toContainText('Mua sắm thường xuyên');
  await expect(page.locator('[data-vsel="kh-level"]')).toContainText('Tổng Công ty');
  await expect(page.locator('[data-vsel="kh-owner"]')).toContainText('Nguyễn Văn Minh');
  await expect(page.locator('[data-vsel="kh-regular"]')).toHaveCount(0);
  // Chi tiết: Số gói thầu, Tổng bằng chữ; tab Tờ trình
  await go(page, '#/khlcnt/' + encodeURIComponent('KHLCNT-2026-0009'));
  await page.locator('.dx-tabs [data-ttab="goi"]').click();
  await expect(card(page, 'Danh sách gói thầu')).toContainText('21-2026-VHT-K2');
  await expect(page.locator('[data-kh-words]')).toHaveText('Hai trăm mười ba tỷ, sáu trăm triệu đồng');
  await page.locator('.dx-tabs [data-ttab="to-trinh"]').click();
  await expect(card(page, 'Thành viên Tổ thẩm định').locator('tbody tr')).toHaveCount(5);
  await expect(card(page, 'Giải trình nội dung KHLCNT').locator('tbody tr')).toHaveCount(9);
  await expect(card(page, 'Chi tiết danh mục mua sắm thuộc gói thầu').locator('tbody tr')).toHaveCount(6);
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('T24 B3 — Gói thầu theo form hệ thống cũ: trường định danh, tiền tệ + tỷ giá, nguồn n-n có Giá trị phân bổ, qua mạng', async ({ page }) => {
  await as(page, 'minh', '#/goi-thau/GT-2026-0032');
  const g = card(page, 'Thông tin chung gói thầu');
  for (const x of ['Số gói thầu', 'Ký hợp đồng', 'Không mật', 'Hỗn hợp', 'Đơn vị giám sát', 'Bên mời thầu', 'TGĐ Tập đoàn']) await expect(g).toContainText(x);
  const n = card(page, 'Nguồn gói thầu');
  await expect(n.locator('tbody tr')).toHaveCount(2);
  await expect(n.locator('tfoot')).toContainText('190,00');
  await page.locator('.dx-tabs [data-ttab="pa"]').click();
  await expect(card(page, 'Phương án lựa chọn nhà thầu')).toContainText('Qua mạng Viettel');
  await go(page, '#/goi-thau/GT-2026-0035');
  await expect(card(page, 'Giá gói thầu')).toContainText('USD');
  await expect(card(page, 'Giá gói thầu')).toContainText('25.400');
  await go(page, '#/goi-thau/GT-2026-0024');
  await expect(card(page, 'Thông tin chung gói thầu')).toContainText('Mật');
  await page.locator('.dx-tabs [data-ttab="pa"]').click();
  await expect(card(page, 'Phương án lựa chọn nhà thầu')).toContainText('Qua mạng đấu thầu quốc gia');
  await expect(card(page, 'Phương án lựa chọn nhà thầu')).toContainText('Áp dụng danh sách ngắn');
  await go(page, '#/goi-thau/GT-2026-0034');
  await expect(card(page, 'Tiến độ')).toContainText('Tháng 11/2026');
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
