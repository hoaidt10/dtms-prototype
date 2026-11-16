/*
 * eForm của luồng SX-MS Phê duyệt đề xuất mua sắm từ sản xuất — T71 S10 (D-124). Khoá form ở cấu hình bước D.sxFlows['SX-MS'].
 * Một form ý kiến: Từ chối bắt buộc nội dung (G6). Nội dung đề xuất (dòng vật tư, dự toán) đọc ở thân màn xử lý việc (Chi tiết đề xuất).
 */
(function () {
  const { txt, ta, req } = window.EForms.b;
  const F = {
    yk: { id: 'sx-ms-t01-phe-duyet', write: ['ykNoiDung'], note: (v) => v.ykNoiDung || '',
      schema: (ctx, ch) => ({ components: [
        txt('**{{de.code}}** — {{de.title}}\nDự án {{de.project}} · Đợt {{de.dot}} · {{de.lines}} vật tư · Dự toán **{{de.totalText}} đồng**'),
        ch && ch[2] === 'no' ? txt('Đề xuất bị từ chối sẽ trả về người lập để chỉnh sửa và gửi phê duyệt lại.') : txt('Duyệt xong, hệ thống gửi đề xuất sang ĐTMS và tạo đề xuất mua sắm trên ĐTMS.'),
        ta('ykNoiDung', ch && ch[2] === 'no' ? 'Lý do từ chối' : 'Ý kiến', ch && ch[2] === 'no' ? req({ rows: 3 }) : { rows: 2 })] }) },
  };
  window.EForms.sx = Object.assign(window.EForms.sx || {}, { 'SX-MS': F });
})();
