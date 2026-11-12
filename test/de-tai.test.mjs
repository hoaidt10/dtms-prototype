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

test('Chỉ số dòng: đã đăng ký = ĐXMS đã phê duyệt, đang giữ = đang phê duyệt / điều chỉnh, còn lại; chưa có mốc thì ba mốc, tiết kiệm null', () => {
  const { D } = boot();
  const l = { id: 'X-1', value: 100 };
  const s = D.duToanStats(l, [{ st: 'OK', qty: 2, value: 40 }, { st: 'PD', qty: 1, value: 25 }, { st: 'DC', qty: null, value: 5 }, { st: 'STOP', qty: 3, value: 30 }]);
  assert.deepEqual({ ...s }, { ok: 40, held: 30, qty: 3, remain: 30, bid: null, hd: null, tt: null, saving: null });
  assert.equal(D.duToanStats(l, [{ st: 'OK', qty: 1, value: 120 }]).remain, -20);
  assert.equal(D.duToanStats(l, []).remain, 100);
});

test('SRS-DADT V1.4 BR-DADT-02-05: ba mốc cộng theo dòng con có mốc; tiết kiệm = dự toán của dòng con − mốc muộn nhất', () => {
  const { D } = boot();
  D.duToanMoc['X-1:A'] = [38, 37, 36.5];
  D.duToanMoc['X-1:B'] = [19, null, null];
  const l = { id: 'X-1', value: 100 };
  const s = D.duToanStats(l, [{ code: 'A', st: 'OK', qty: 1, value: 40 }, { code: 'B', st: 'OK', qty: 1, value: 20 }, { code: 'C', st: 'PD', qty: 1, value: 10 }]);
  assert.equal(s.bid, 57);
  assert.equal(s.hd, 37);
  assert.equal(s.tt, 36.5);
  assert.equal(s.saving, 4.5); // (40 − 36,5) + (20 − 19)
  assert.equal(D.duToanMocOf('X-1', 'A').latest, 36.5);
  assert.equal(D.duToanMocOf('X-1', 'B').latest, 19);
  assert.equal(D.duToanMocOf('X-1', 'C'), null);
  // Mốc mẫu: NV-KHCN-2026-006 khoản mục 1 có đủ ba mốc với ĐXMS-2026-0072.
  assert.deepEqual([...D.duToanMoc['NV-KHCN-2026-006-1:ĐXMS-2026-0072']], [176.8, 174.5, 173.95]);
});
