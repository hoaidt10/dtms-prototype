// T29 B8 — bảng dự toán đề tài / dự án nhập tại ĐTMS (D-65): tính thuế (P-199), lưu / xoá dòng, chỉ số theo đợt ĐXMS (YC-DXMS-PROTO §3.3);
// D.nhiemVu là danh mục Đề tài / dự án có Loại, Loại chi tiết, Nguồn (D-66).
// Chạy: node --test prototype/dtms/test/de-tai.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('../js/', import.meta.url);

function boot() {
  const store = {};
  const window = {};
  const ctx = vm.createContext({ window, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } }, console });
  for (const f of ['bpmn-tasks.js', 'bpmn-tasks-ms13.js', 'bpmn-tasks-ms02.js', 'data.js', 'flow.js']) vm.runInContext(readFileSync(new URL(f, dir), 'utf8'), ctx, { filename: f });
  window.Flow.init();
  return window;
}

test('D-66: mọi đề tài / dự án có Loại, Loại chi tiết, Nguồn; nhiệm vụ KHCN là Loại KHCN, nguồn KHCN', () => {
  const { D } = boot();
  const LOAI = ['SXKD', 'Dự án đầu tư', 'KHCN', 'Hoạt động TX', 'Dự án đầu tư khác', 'Dự án kinh doanh khác'];
  for (const n of D.nhiemVu) {
    assert.ok(LOAI.includes(n.loai), n.code);
    assert.ok(n.loaiCt, n.code);
    assert.ok(['khcn', 'hrtool', 'cu'].includes(n.nguon), n.code);
    // T36 (P-227): HR Tool chỉ cấp Loại SXKD, Dự án đầu tư.
    if (n.nguon === 'hrtool') assert.ok(['SXKD', 'Dự án đầu tư'].includes(n.loai), n.code);
    assert.equal(n.kind === 'Nhiệm vụ KHCN', n.loai === 'KHCN', n.code);
    assert.equal(n.nguon === 'khcn', n.loai === 'KHCN', n.code);
  }
  assert.ok(D.nvOf('009-26-VHT-RDP-DS'), 'dòng TPL-DADT-EX');
});

test('P-199: Thuế GTGT = trước thuế × %VAT khi không Nhập tay; Nhập tay lấy số đã nhập; sau thuế = trước thuế + thuế', () => {
  const { D } = boot();
  assert.deepEqual({ ...D.duToanCalc({ pre: 1.2, vat: 10, manual: false }) }, { tax: 0.12, value: 1.32 });
  assert.deepEqual({ ...D.duToanCalc({ pre: 2.5, vat: 8, manual: false }) }, { tax: 0.2, value: 2.7 });
  assert.deepEqual({ ...D.duToanCalc({ pre: 1.2, vat: 10, manual: true, tax: 0.1 }) }, { tax: 0.1, value: 1.3 });
});

test('D-65: dự toán mẫu cho mọi Loại; nv.total có thì tổng sau thuế đúng Tổng dự toán; dòng 1 giữ id, loại của cách 1', () => {
  const { D } = boot();
  for (const n of D.nhiemVu) assert.ok(D.duToanOf(n.code).length > 0, n.code);
  const sum = (c) => D.duToanOf(c).reduce((s, l) => s + l.value, 0);
  assert.ok(Math.abs(sum('009-26-VHT-RDP-DS') - 108.35) < 0.05);
  assert.ok(Math.abs(sum('DA-2026-002') - 420) < 0.05);
  const l1 = D.duToanOf('NV-KHCN-2026-014')[0];
  assert.equal(l1.id, 'NV-KHCN-2026-014-1');
  assert.equal(l1.type, 'PL2');
  assert.ok(l1.value > 64 && l1.value < 999);
  for (const l of D.duToanOf('NV-KHCN-2026-014')) assert.equal(l.value, Math.round((l.pre + l.tax) * 100) / 100);
});

test('Lưu / xoá dòng dự toán: thêm mới cấp id kế tiếp, cập nhật giữ id, tính lại thuế; reset về dữ liệu mẫu', () => {
  const { D } = boot();
  const c = 'NV-KHCN-2026-014', n0 = D.duToanOf(c).length;
  const a = D.duToanSave(c, { type: 'PL2', item: 'Bộ nguồn', qty: 5, uom: 'Bộ', pre: 1.2, vat: 10, manual: false });
  assert.equal(a.id, `${c}-${n0 + 1}`);
  assert.equal(a.value, 1.32);
  assert.equal(a.buy, false);
  const b = D.duToanSave(c, { ...a, manual: true, tax: 0.1 });
  assert.equal(b.id, a.id);
  assert.equal(b.value, 1.3);
  assert.equal(D.duToanOf(c).length, n0 + 1);
  D.duToanDel(c, a.id);
  assert.equal(D.duToanOf(c).length, n0);
  D.duToanSave(c, { ...D.duToanOf(c)[4], buy: true });
  D.duToanReset();
  assert.equal(D.duToanOf(c)[4].buy, false);
});

test('Chỉ số dòng: đã đăng ký = ĐXMS đã phê duyệt, đang giữ = đang phê duyệt / điều chỉnh, còn lại, thực hiện, tiết kiệm', () => {
  const { D } = boot();
  const l = { value: 100 };
  const s = D.duToanStats(l, [{ st: 'OK', qty: 2, value: 40 }, { st: 'PD', qty: 1, value: 25 }, { st: 'DC', qty: null, value: 5 }, { st: 'STOP', qty: 3, value: 30 }]);
  assert.deepEqual({ ...s }, { ok: 40, held: 30, qty: 3, exec: 37.6, saving: 2.4, remain: 30 });
  assert.equal(D.duToanStats(l, [{ st: 'OK', qty: 1, value: 120 }]).remain, -20);
  assert.equal(D.duToanStats(l, []).remain, 100);
});
