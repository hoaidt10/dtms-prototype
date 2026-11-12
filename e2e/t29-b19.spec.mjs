// T29 B19 (plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md §3.12, DX-11): màn Lập đề xuất mua sắm = bước 1–5 của BPMN MS01 v1.1
// trên một màn — người làm 1, 4, 5; AI làm 2 (lấy dữ liệu căn cứ), 3 (gợi ý thông tin cơ bản), 6 (đối chiếu bóc tách) ngay trên màn.
import { test, expect } from '@playwright/test';
import { fresh, lastToast, aiApply } from './helpers.mjs';

const gop = async (page, hash = '#/luong') => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.setItem('dtms-proto-menu', 'gop'));
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
  // Review nhi 06/11 #18: bảng AI bước 6 tạm ẩn (D.bocHide) — các test này kiểm bảng nên bật lại cờ; kiểm khi ẩn ở review-nhi-0611b.
  await page.evaluate(() => { D.bocHide = false; });
};
const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};
const upload = (page, names) => page.locator('#lf-file').setInputFiles(names.map((name) => ({ name, mimeType: 'application/pdf', buffer: Buffer.alloc(16) })));

// Bước 1: đề tài + tệp căn cứ bắt buộc, rồi bấm Gợi ý từ AI ở khối Căn cứ và khối Thông tin cơ bản, Áp dụng (P-216: AI chạy theo nút).
async function step1(page, ai = true) {
  await page.locator('#lf-title').fill('Luồng mua sắm thiết bị đo kiểm B19');
  await pick(page, 'lf-nv', 'NV-KHCN-2026-014');
  await upload(page, ['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf']);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  if (ai) await aiApply(page);
}

test('B19: mỗi khối có nút Gợi ý từ AI riêng → popup chỉ trả thông tin của khối; Hủy giữ nguyên; Áp dụng điền vào khối, vẫn sửa được trên màn', async ({ page }) => {
  await gop(page, '#/luong/create');
  await expect(page.locator('.pg-head h1, .pg-head h2').first()).toContainText('Lập đề xuất mua sắm');
  await expect(page.locator('#lf-draft')).toHaveText('Lưu nháp');
  await expect(page.locator('#lf-save')).toHaveText('Gửi');
  // Chưa chọn đề tài: chưa có nút Gợi ý từ AI.
  // Review nhi 06/11 #1: không còn khối Thông tin cơ bản.
  await expect(page.locator('[data-lf-basic]')).toHaveCount(0);
  await expect(page.locator('[data-lf-ai-sec]')).toHaveCount(0);
  await step1(page, false);
  // Chọn đề tài: AI chưa chạy — mỗi khối một nút Gợi ý từ AI.
  await expect(page.locator('[data-lf-cost] [data-lf-ai-sec="boc"]')).toHaveText('✦ Gợi ý từ AI');
  await expect(page.locator('[data-lf-ai-sec="basic"]')).toHaveCount(0);
  // Nhóm mục đích, Nguồn vốn điền sẵn theo đề tài / dự án (Loại KHCN, nguồn vốn của đề tài).
  await expect(page.locator('[data-lf-chung] [data-vsel="lf-purpose"]')).toContainText('Triển khai các hoạt động KHCN');
  await expect(page.locator('[data-lf-chung] [data-lf-ai-sec="chung"]')).toHaveCount(1);
  await expect(page.locator('[data-lf-basis] [data-lf-ai-sec="legal"]')).toHaveCount(1);
  // Bóc tách và đối chiếu nằm trong khối Căn cứ (bước 1).
  await expect(page.locator('[data-lf-cost] [data-lf-boc] h4')).toContainText('Bóc tách và đối chiếu');
  await expect(page.locator('[data-lf-boc] .lf-empty')).toContainText('Gợi ý từ AI');
  await page.locator('#lf-save').click();
  await expect(page.locator('[data-lf-boc] .lf-err')).toContainText('khối Căn cứ và nội dung mua sắm');
  // Khối Căn cứ → popup chỉ có bước 2 + bảng Bóc tách và đối chiếu; Hủy thì màn giữ nguyên.
  const pop = page.locator('[data-lf-ai-pop]');
  await page.locator('[data-lf-ai-sec="boc"]').click();
  await expect(pop).toContainText('Bước 2 · AI đã lấy dữ liệu căn cứ');
  await expect(pop).toContainText('Dự toán NV-KHCN-2026-014');
  await expect(pop.locator('[data-lf-pop-item]')).toHaveCount(5);
  await expect(pop.locator('[data-lf-pop-row]')).toHaveCount(0);
  await page.locator('.vmodal [data-close]').last().click();
  await expect(pop).toHaveCount(0);
  await expect(page.locator('[data-lf-boc] .lf-empty')).toContainText('Gợi ý từ AI');
  await page.locator('[data-lf-ai-sec="boc"]').click();
  // Góp ý 06/11: AI ghép hàng hoá vào khoản mục dự toán → điền vào bảng Loại chi phí khi Áp dụng.
  await expect(pop.locator('[data-lf-pop-line="1"]')).toContainText('Thiết bị, máy đo chuyên dụng');
  await expect(pop.locator('[data-lf-pop-line="5"]')).toContainText('Đào tạo, chuyển giao công nghệ');
  await expect(pop.locator('[data-lf-pop-cost]')).toHaveCount(2);
  await expect(page.locator('[data-lf-citem]')).toHaveCount(0);
  await pop.locator('[data-lf-pop-ion="5"]').uncheck();
  await page.locator('[data-lf-ai-apply]').click();
  expect(await lastToast(page)).toContain('Bóc tách và đối chiếu: 4 / 5 hạng mục, 1 khoản mục vào bảng Loại chi phí');
  await expect(page.locator('[data-lf-citem]')).toHaveCount(1);
  await expect(page.locator('[data-lf-citem]').first()).toContainText('Thiết bị, máy đo chuyên dụng');
  await expect(page.locator('[data-lf-cqty]').first()).not.toHaveValue('');
  await expect(page.locator('[data-lf-cval]').first()).not.toHaveValue('');
  // Gợi ý lại có hạng mục 5 → thêm khoản mục Đào tạo, giữ dòng Thiết bị (không nhân đôi).
  await page.locator('[data-lf-ai-sec="boc"]').click();
  await pop.locator('[data-lf-pop-ion="5"]').check();
  await page.locator('[data-lf-ai-apply]').click();
  await expect(page.locator('[data-lf-citem]')).toHaveCount(2);
  await page.locator('[data-lf-ai-sec="boc"]').click();
  await pop.locator('[data-lf-pop-ion="5"]').uncheck();
  await page.locator('[data-lf-ai-apply]').click();
  await expect(page.locator('[data-lf-citem]')).toHaveCount(1);
  await expect(page.locator('[data-lf-boc] [data-lf-ai2]')).toContainText('AI đã lấy dữ liệu căn cứ');
  // Màn không còn bảng bóc tách — chỉ dòng tóm tắt; kết quả nằm ở bảng Loại chi phí.
  await expect(page.locator('[data-lf-boc-sum]')).toContainText('Đã áp dụng 4 / 5 hạng mục');
  await expect(page.locator('[data-lf-boc] table')).toHaveCount(0);
  await expect(page.locator('[data-lf-ai-sec="boc"]')).toHaveText('✦ Gợi ý lại');
  // Khối Thông tin chung → Tên luồng, Giá trị dự kiến, Thời gian thực hiện, Nhóm mục đích, Nguồn vốn (review nhi 06/11 #1).
  await page.locator('[data-lf-ai-sec="chung"]').click();
  await expect(pop.locator('[data-lf-pop-row]')).toHaveCount(5);
  await expect(pop.locator('[data-lf-pop-row="purposeCode"]')).toContainText('Triển khai các hoạt động KHCN');
  await pop.locator('[data-lf-pop-on="est"]').uncheck();
  await page.locator('[data-lf-ai-apply]').click();
  expect(await lastToast(page)).toContain('Thông tin chung: 4 / 5 trường');
  await expect(page.locator('#lf-title')).toHaveValue('Luồng mua sắm cho Phát triển trạm gNodeB thế hệ 2');
  await expect(page.locator('#lf-period')).toHaveValue('01/2027 – 09/2027');
  await expect(page.locator('#lf-est')).toHaveValue('');
  // Khối Căn cứ pháp lý → loại tài liệu theo tên tệp, nội dung căn cứ pháp lý thêm văn bản phê duyệt đề tài.
  await page.locator('[data-lf-ai-sec="legal"]').click();
  await expect(pop.locator('[data-lf-pop-row="file-1"]')).toContainText('QĐ giao nhiệm vụ');
  await expect(pop.locator('[data-lf-pop-row="file-2"]')).toContainText('Kế hoạch mua sắm năm');
  await page.locator('[data-lf-ai-apply]').click();
  await expect(page.locator('#lf-legal')).toHaveValue(/1482\/QĐ-VHT ngày 12\/03\/2026/);
  expect(page.errors).toEqual([]);
});

test('B19: đổi đề tài sau khi đã gợi ý → khối Căn cứ báo đã đổi, chặn Gửi; Gợi ý lại thì gửi được', async ({ page }) => {
  await gop(page, '#/luong/create');
  await step1(page);
  await page.locator('[data-vsel="lf-nv"]').click();
  await page.locator('.vsel-panel [data-opt]:not([data-opt="NV-KHCN-2026-014"])').first().click();
  await expect(page.locator('[data-lf-boc]')).toContainText('Đề tài / dự án đã đổi');
  await page.locator('#lf-save').click();
  await expect(page.locator('[data-lf-boc] .lf-err')).toContainText('bấm Gợi ý lại ở khối Căn cứ');
  await page.locator('[data-lf-ai-sec="boc"]').click();
  await page.locator('[data-lf-ai-apply]').click();
  await expect(page.locator('[data-lf-boc] [data-lf-ai2]')).toContainText('AI đã lấy dữ liệu căn cứ');
  await expect(page.locator('[data-lf-boc] .lf-err')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('B19: AI bước 6 đối chiếu từng dòng bóc tách trong popup; vượt số còn được dùng không Áp dụng được; Gửi xong bước 01–05 → 5.1', async ({ page }) => {
  await gop(page, '#/luong/create');
  await step1(page, false);
  await page.locator('[data-lf-ai-sec="boc"]').click();
  const pop = page.locator('[data-lf-ai-pop]');
  await expect(pop.locator('[data-lf-pop-item]')).toHaveCount(5);
  // Dòng 1: SL gốc 24, đã dùng 4 → còn được dùng 20; dòng 4 có tồn kho sổ sách 8, đang giữ 2.
  await expect(pop.locator('[data-lf-pop-item="1"]')).toContainText('ĐXMS-2026-0042');
  await expect(pop.locator('[data-lf-pop-item="4"]')).toContainText('Có tồn kho sổ sách 8');
  await expect(pop.locator('[data-lf-pop-item="4"]')).toContainText('2 (ĐXMS-2026-0098)');
  await expect(pop.locator('[data-lf-pop-item="5"]')).toContainText('không có trong dự toán');
  await pop.locator('[data-lf-pop-q="1"]').fill('25');
  await page.locator('[data-lf-ai-apply]').click();
  await expect(pop.locator('[data-lf-pop-err="1"]')).toHaveText('Vượt số còn được dùng (20).');
  await expect(pop.locator('[data-lf-pop-msg]')).toContainText('Còn 1 hạng mục chưa hợp lệ');
  await pop.locator('[data-lf-pop-q="1"]').fill('20');
  await pop.locator('[data-lf-pop-ion="5"]').uncheck();
  await page.locator('[data-lf-ai-apply]').click();
  await expect(pop).toHaveCount(0);
  await expect(page.locator('[data-lf-boc-sum]')).toContainText('4 / 5');
  await expect(page.locator('[data-lf-boc-sum]')).toContainText('1 hạng mục có tồn kho sổ sách');
  await aiApply(page, ['basic']);
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(await lastToast(page)).toContain('xong bước 01–05');
  const st = await page.evaluate(() => ({
    hist: Flow.state.history.map((h) => String(h.task)), tok: Flow.state.tokens.map((t) => String(t.task)),
    ai: Flow.ui.aiGoiY.map((r) => r.quyetDinh), drop: Flow.ui.bocTachEdit.drop, items: D.items.map((i) => i.n), proc: Flow.state.vars.process,
  }));
  for (const k of ['1', '2', '3', '4', '5']) expect(st.hist).toContain(k);
  expect(st.tok).toEqual(['5.1']);
  expect(st.ai.every((d) => d === 'Chấp nhận')).toBe(true);
  expect(st.drop).toEqual([5]);
  expect(st.items).toEqual([1, 2, 3, 4]);
  expect(page.errors).toEqual([]);
});

test('B19: Lưu nháp → việc "Lập đề xuất mua sắm (bước 01–05)" mở lại màn (không popup), giữ quyết định; Chỉ huy Trả lại ở 5.1 → mở lại màn', async ({ page }) => {
  await gop(page, '#/luong/create');
  await step1(page);
  // Review nhi 06/11 #1: Nhóm mục đích ở Thông tin chung — đổi rồi Lưu nháp, mở lại giữ lựa chọn.
  await page.locator('[data-vsel="lf-purpose"]').click();
  await page.locator('.vsel-panel [data-opt="SX"]').click();
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  expect(await lastToast(page)).toContain('Đã lưu nháp');
  // Màn Lập ĐXMS ở chế độ mở lại: có Mã ĐXMS, không có popup / nút hành động của task.
  await expect(page.locator('[data-luong-form]')).toHaveCount(1);
  const code = await page.evaluate(() => Flow.state.dxms);
  await expect(page.locator('[data-luong-form] input[disabled]').first()).toHaveValue(code);
  await expect(page.locator('[data-vsel="lf-purpose"]')).toContainText('Bảo đảm tính liên tục');
  // Review nhi 06/11 #19: Nhân sự thực hiện hiện cả khi mở lại.
  await expect(page.locator('[data-lf-members]')).toHaveCount(1);
  // Việc của tôi: tên việc gộp.
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  await expect(page.locator('main')).toContainText('Lập đề xuất mua sắm (bước 01–05)');
  await page.evaluate(() => { location.hash = '#/task/' + Flow.state.tokens[0].id; });
  await expect(page.locator('[data-vsel="lf-purpose"]')).toContainText('Bảo đảm tính liên tục');
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toEqual(['5.1']);
  expect(await page.evaluate(() => Flow.ui.purposeCode)).toBe('SX');
  // Chỉ huy ĐVĐX Trả lại → bước 05 → người tạo mở lại màn Lập ĐXMS.
  await page.evaluate(() => { const t = Flow.state.tokens[0]; Flow.complete(t.id, Flow.choices(t.task).find((c) => c.label === 'Trả lại'), 'Bổ sung hạng mục'); Flow.setPersona('minh'); });
  const t5 = await page.evaluate(() => Flow.state.tokens.map((t) => ({ k: String(t.task), id: t.id }))[0]);
  expect(t5.k).toBe('5');
  await page.evaluate((id) => { location.hash = '#/task/' + id; }, t5.id);
  await expect(page.locator('[data-luong-form]')).toHaveCount(1);
  await expect(page.locator('[data-vsel="lf-purpose"]')).toContainText('Bảo đảm tính liên tục');
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toEqual(['5.1']);
  expect(page.errors).toEqual([]);
});
