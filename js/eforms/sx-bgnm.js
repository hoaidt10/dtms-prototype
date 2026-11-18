/*
 * eForm của luồng SX-BGNM Bàn giao tài liệu sản xuất cho đơn vị sản xuất — plan T71 §10 Q4 (QT-TTSX-4A11 §5.4 bước 5, BM.QLHDSX.03).
 * Checklist theo BM-QLHDSX-XLS sheet "Bàn giao VHT-M1" (❓ chưa xác nhận là BM.QLHDSX.03): tài liệu, revision, lần bàn giao Sản xuất → Nhà máy.
 * Danh sách tài liệu điền sẵn từ hồ sơ chuyển giao của sản phẩm (biến ckTaiLieu, sx-flow.js ctxOf); người lập bỏ chọn tài liệu không bàn giao.
 */
(function () {
  const { txt, ta, tf, num, sel, file, req, dl, opts } = window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const head = () => txt('**{{duAn.code}}** — {{duAn.name}}\nSản phẩm {{duAn.product}} · {{duAn.version}} · Đơn vị sản xuất: {{duAn.factoryText}}');
  const YN = opts([['Y', 'Có'], ['N', 'Không']]);
  const F = {
    ck: { id: 'sx-bgnm-t01-checklist', write: ['ckLan', 'ckTaiLieu', 'ckFile', 'ckGhiChu'],
      note: (v) => `Lần bàn giao ${v.ckLan || 1}: ${(v.ckTaiLieu || []).filter((x) => x.giao !== 'N').length} tài liệu`,
      schema: () => ({ components: [head(),
        txt('Rà soát tài liệu tiếp nhận từ R&D liên quan tới sản xuất, lập checklist bàn giao theo cấu trúc sản phẩm (BM.QLHDSX.03). Tài liệu được lưu trên VMMS sau khi bàn giao.'),
        num('ckLan', 'Lần bàn giao', req(Object.assign(L(6), { validate: { required: true, min: 1 } }))),
        dl('ckTaiLieu', 'Checklist tài liệu bàn giao', [txt('**{{this.ma}}** — {{this.ten}}', 9), tf('rev', 'Revision', L(3)), sel('giao', 'Bàn giao', Object.assign(L(4), { values: YN }))]),
        file('ckFile', 'Checklist bàn giao tài liệu đã ký (BM.QLHDSX.03)', req(L(10))),
        ta('ckGhiChu', 'Tài liệu khác chuẩn bị cùng đơn vị sản xuất (hướng dẫn công việc, tem nhãn…)')] }) },
    tn: { id: 'sx-bgnm-t02-tiep-nhan', write: ['tnYk'], note: (v) => v.tnYk || '',
      schema: (ctx, ch) => ({ components: [head(), txt('Lần bàn giao **{{ckLan}}** · checklist {{ckFile}}'),
        ta('tnYk', ch && ch[2] === 'no' ? 'Tài liệu cần bổ sung, sửa lại' : 'Ý kiến tiếp nhận', ch && ch[2] === 'no' ? req({ rows: 3 }) : { rows: 2 })] }) },
    kt: { id: 'sx-bgnm-t03-kiem-tra-qtcn', write: ['ktKetQua', 'ktFile'], note: (v) => v.ktKetQua || '',
      schema: (ctx, ch) => ({ components: [head(),
        txt('Kiểm tra quy trình công nghệ do đơn vị sản xuất thực hiện theo tài liệu đã bàn giao (QT bước 5); phối hợp Đơn vị Nghiên cứu phát triển.'),
        ta('ktKetQua', ch && ch[2] === 'no' ? 'Nội dung cần điều chỉnh' : 'Kết quả kiểm tra', req({ rows: 3 })), file('ktFile', 'Biên bản kiểm tra quy trình công nghệ', L(10))] }) },
    yk: { id: 'sx-bgnm-t04-phe-duyet', write: ['ykBg'], note: (v) => v.ykBg || '',
      schema: (ctx, ch) => ({ components: [head(), txt('Lần bàn giao **{{ckLan}}** · Kiểm tra quy trình công nghệ: {{ktKetQua}}'),
        ta('ykBg', ch && ch[2] === 'no' ? 'Nội dung cần chỉnh sửa' : 'Ý kiến', ch && ch[2] === 'no' ? req({ rows: 3 }) : { rows: 2 })] }) },
  };
  window.EForms.sx = Object.assign(window.EForms.sx || {}, { 'SX-BGNM': F });
})();
