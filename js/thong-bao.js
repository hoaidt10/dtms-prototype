/* Thông báo theo Backlog W1_T10 (T16 B3, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2k).
   Dựng theo source có sẵn: repo-khcn-bpmn-fe features/notification-template, features/notification-channel; BE be/messages
   (NotificationTemplateController, NotificationChannelConfigController, bảng notification_event_config cho Trigger).
   SCR-88 #/mau-thong-bao, SCR-89 #/mau-thong-bao/create | edit/<id> | detail/<id>, SCR-90 #/kenh-thong-bao. SCR-91 Trigger thông báo bỏ theo D-44 (team BA 30/10/2026): sự kiện do BE cấu hình (notification_event_config), không có màn quản trị. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, vSelect, badge, toast, vModal } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => S.head(o);
  const K = () => window.Thau.kit;
  const confirm = (o) => window.Catalog.confirm(o);

  /* ---------- Dữ liệu mẫu ----------
     Mã mẫu theo quy ước của NotificationDispatcherServiceImpl.findTemplate: <mã sự kiện>_<KÊNH> (hoặc đúng mã sự kiện). */
  const CH = { EMAIL: 'Email', IN_APP: 'In-app', SMS: 'SMS' };
  const CH_CLS = { EMAIL: 'em', IN_APP: 'ia', SMS: 'sm' };
  const VARS = '{{maHoSo}}, {{tenHoSo}}, {{loaiHoSo}}, {{tenQuyTrinh}}, {{tenBuoc}}, {{hanXuLy}}, {{nguoiXuLy}}, {{lyDo}}, {{thoiGianQuaHan}}, {{maDoiTuong}}, {{tenDoiTuong}}, {{maHopDong}}, {{tenNhaThau}}, {{ngayHetHan}}, {{giaTri}}, {{duongDan}}';
  /* T71 S12 (D-124): mẫu của phân hệ Quản lý sản xuất — mã tiền tố SX_ (app SX), chỉ hiện ở #/sx/mau-thong-bao; ĐTMS không thấy mẫu SX (BE: cột app / tenant của notification_template). */
  const T0 = [
    ['TASK_ASSIGNED_IN_APP', 'Giao việc xử lý hồ sơ', 'IN_APP', 'Bạn có việc mới: {{tenBuoc}} - {{maHoSo}}', 'Hồ sơ {{maHoSo}} - {{tenHoSo}} đang chờ bạn xử lý bước {{tenBuoc}}. Hạn xử lý: {{hanXuLy}}.', '12/08/2026'],
    ['TASK_ASSIGNED_EMAIL', 'Giao việc xử lý hồ sơ qua email', 'EMAIL', '[ĐTMS] Hồ sơ {{maHoSo}} chờ bạn xử lý', 'Kính gửi {{nguoiXuLy}},\nHồ sơ {{maHoSo}} - {{tenHoSo}} ({{tenQuyTrinh}}) đang chờ Anh/Chị xử lý bước {{tenBuoc}}.\nHạn xử lý: {{hanXuLy}}.\nTruy cập hệ thống: {{duongDan}}', '12/08/2026'],
    ['TASK_DUE_SOON_IN_APP', 'Nhắc việc sắp đến hạn xử lý', 'IN_APP', 'Sắp đến hạn: {{tenBuoc}} - {{maHoSo}}', 'Bước {{tenBuoc}} của hồ sơ {{maHoSo}} sẽ đến hạn xử lý vào {{hanXuLy}}.', '14/08/2026'],
    ['TASK_OVERDUE_EMAIL', 'Cảnh báo việc quá hạn xử lý', 'EMAIL', '[ĐTMS] Quá hạn xử lý hồ sơ {{maHoSo}}', 'Kính gửi {{nguoiXuLy}},\nBước {{tenBuoc}} của hồ sơ {{maHoSo}} đã quá hạn {{thoiGianQuaHan}}. Đề nghị Anh/Chị hoàn thành xử lý.\nTruy cập hệ thống: {{duongDan}}', '14/08/2026'],
    ['TASK_OVERDUE_SMS', 'Cảnh báo quá hạn xử lý qua tin nhắn', 'SMS', '', '[DTMS] Ho so {{maHoSo}} qua han xu ly buoc {{tenBuoc}} {{thoiGianQuaHan}}.', '14/08/2026', 'INACTIVE'],
    ['PROFILE_RETURNED_IN_APP', 'Hồ sơ bị trả lại', 'IN_APP', 'Hồ sơ {{maHoSo}} bị trả lại', 'Hồ sơ {{maHoSo}} bị trả lại ở bước {{tenBuoc}}. Lý do: {{lyDo}}.', '20/08/2026'],
    ['PROFILE_APPROVED_EMAIL', 'Hồ sơ được phê duyệt', 'EMAIL', '[ĐTMS] Hồ sơ {{maHoSo}} đã được phê duyệt', 'Kính gửi Anh/Chị,\nHồ sơ {{maHoSo}} - {{tenHoSo}} ({{loaiHoSo}}) đã được phê duyệt.\nTruy cập hệ thống: {{duongDan}}', '20/08/2026'],
    ['YCBG_SENT_EMAIL', 'Gửi yêu cầu báo giá đến nhà cung cấp', 'EMAIL', '[Viettel High Tech] Yêu cầu báo giá {{maDoiTuong}}', 'Kính gửi Quý Công ty,\nTổng công ty Công nghiệp Công nghệ cao Viettel đề nghị Quý Công ty gửi báo giá cho danh mục hàng hoá, dịch vụ kèm theo trước ngày {{ngayHetHan}}.', '02/09/2026'],
    ['CONTRACT_GUARANTEE_EXPIRING_EMAIL', 'Bảo đảm thực hiện hợp đồng sắp hết hạn', 'EMAIL', '[ĐTMS] Bảo đảm thực hiện hợp đồng {{maHopDong}} sắp hết hạn', 'Bảo đảm thực hiện hợp đồng {{maHopDong}} với {{tenNhaThau}} hết hiệu lực ngày {{ngayHetHan}} trong khi nghĩa vụ hợp đồng chưa hoàn thành. Đề nghị yêu cầu nhà thầu gia hạn bảo đảm.', '18/09/2026'],
    ['CONTRACT_MILESTONE_LATE_IN_APP', 'Hợp đồng chậm tiến độ', 'IN_APP', 'Hợp đồng {{maHopDong}} chậm tiến độ', 'Mốc {{tenBuoc}} của hợp đồng {{maHopDong}} đã quá hạn {{thoiGianQuaHan}}.', '18/09/2026'],
    ['CONTRACT_EXPIRING_EMAIL', 'Hợp đồng sắp hết hạn', 'EMAIL', '[ĐTMS] Hợp đồng {{maHopDong}} sắp hết hạn', 'Hợp đồng {{maHopDong}} với {{tenNhaThau}} hết hạn ngày {{ngayHetHan}}. Đề nghị rà soát nghĩa vụ còn lại, lập phụ lục gia hạn hoặc chuẩn bị thanh lý.', '18/09/2026'],
    ['PAYMENT_REQUEST_SIGNED_IN_APP', 'Đề nghị thanh toán đã được ký', 'IN_APP', 'Đề nghị thanh toán {{maDoiTuong}} đã ký', 'Đề nghị thanh toán {{maDoiTuong}} của hợp đồng {{maHopDong}} ({{giaTri}}) đã được ký, chuyển bộ phận tài chính thanh toán.', '25/09/2026'],
    ['FRAMEWORK_EXPIRING_EMAIL', 'Thỏa thuận khung sắp hết hạn', 'EMAIL', '[ĐTMS] Thỏa thuận khung {{maDoiTuong}} sắp hết hạn', 'Thỏa thuận khung {{maDoiTuong}} - {{tenDoiTuong}} hết hạn ngày {{ngayHetHan}}. Giá trị còn lại: {{giaTri}}.', '25/09/2026', 'INACTIVE'],
    ['SX_TASK_ASSIGNED_IN_APP', 'Giao việc xử lý hồ sơ sản xuất', 'IN_APP', 'Bạn có việc mới: {{tenBuoc}} - {{maHoSo}}', 'Hồ sơ {{maHoSo}} ({{tenQuyTrinh}}) của dự án {{maDoiTuong}} đang chờ bạn xử lý bước {{tenBuoc}}. Hạn xử lý: {{hanXuLy}}.', '16/11/2026'],
    ['SX_WORK_DUE_SOON_IN_APP', 'Nhắc công việc sắp đến hạn', 'IN_APP', 'Sắp đến hạn: {{tenDoiTuong}}', 'Công việc {{maDoiTuong}} - {{tenDoiTuong}} đến hạn hoàn thành vào {{ngayHetHan}}.', '16/11/2026'],
    ['SX_WORK_OVERDUE_EMAIL', 'Cảnh báo công việc quá hạn', 'EMAIL', '[QLSX] Công việc {{maDoiTuong}} quá hạn', 'Kính gửi {{nguoiXuLy}},\nCông việc {{maDoiTuong}} - {{tenDoiTuong}} đã quá hạn {{thoiGianQuaHan}}. Đề nghị Anh/Chị cập nhật tiến độ.\nTruy cập: {{duongDan}}', '16/11/2026'],
    ['SX_ISSUE_SLA_OVERDUE_EMAIL', 'Phiếu bất thường quá hạn xử lý', 'EMAIL', '[QLSX] Phiếu bất thường {{maHoSo}} quá hạn', 'Phiếu bất thường {{maHoSo}} - {{tenHoSo}} của dự án {{maDoiTuong}} đã quá thời hạn xử lý {{thoiGianQuaHan}} (bước {{tenBuoc}}, người xử lý {{nguoiXuLy}}).', '16/11/2026'],
    ['SX_PLAN_LATE_IN_APP', 'Hạng mục kế hoạch chậm tiến độ', 'IN_APP', 'Dự án {{maDoiTuong}} chậm tiến độ', 'Hạng mục {{tenBuoc}} của dự án {{maDoiTuong}} - {{tenDoiTuong}} chậm {{thoiGianQuaHan}} so với kế hoạch gốc.', '16/11/2026'],
    ['SX_MATERIAL_ORDER_DUE_IN_APP', 'Vật tư đến hạn đặt hàng', 'IN_APP', 'Vật tư đến hạn đặt hàng - {{maDoiTuong}}', 'Vật tư {{tenDoiTuong}} của dự án {{maDoiTuong}} cần đặt hàng trước {{ngayHetHan}} để kịp ngày cần (còn thiếu {{giaTri}}).', '16/11/2026'],
    ['SX_ECN_ISSUED_EMAIL', 'Ban hành thông báo thay đổi kỹ thuật', 'EMAIL', '[QLSX] Ban hành {{maHoSo}} cho dự án {{maDoiTuong}}', 'Kính gửi Nhà máy, Trung tâm Đảm bảo chất lượng,\nThông báo thay đổi kỹ thuật {{maHoSo}} ({{tenHoSo}}) đã ban hành, áp dụng cho dự án {{maDoiTuong}}. Đề nghị cập nhật tài liệu, thu hồi tài liệu cũ.', '16/11/2026'],
    ['SX_SIGN_REQUEST_IN_APP', 'Yêu cầu ký số tài liệu', 'IN_APP', 'Tài liệu chờ bạn ký số: {{tenHoSo}}', 'Tài liệu {{tenHoSo}} của hồ sơ {{maHoSo}} đang chờ bạn ký số trên ứng dụng MySign.', '16/11/2026'],
  ].map(([code, name, channel, subject, content, created, status], i) => ({ id: String(i + 1), code, name, channel, subject, content, status: status || 'ACTIVE', createdAt: created }));

  /* Kênh thông báo: bảng notification_channel_config; cấu hình theo khoá i18n NOTIFICATION_CHANNEL.CONFIG.* của source. */
  const CH0 = [
    { code: 'EMAIL', name: 'Email', on: true, desc: 'Gửi qua SMTP nội bộ Viettel', cfg: [['SMTP Host', 'smtp.viettel.com.vn'], ['Port', '587'], ['TLS', 'Bật'], ['From', 'dtms-noreply@viettel.com.vn'], ['Reply-To', 'ttms.vht@viettel.com.vn']] },
    { code: 'SMS', name: 'SMS', on: false, desc: 'Gửi qua tin nhắn trên điện thoại di động', cfg: [['API Endpoint', 'https://sms-gw.viettel.vn/api/v2/send'], ['Brandname', 'VIETTEL-HT'], ['Số dư', '12.450 tin'], ['Encoding', 'GSM 7-bit']] },
    { code: 'WEB', name: 'Web', on: true, desc: 'Chuông thông báo trong ứng dụng web', cfg: [['Giữ tin (ngày)', '90'], ['Badge tối đa', '99'], ['Âm thanh', 'Tắt'], ['Gom theo hồ sơ', 'Bật']] },
    { code: 'APP', name: 'App', on: true, desc: 'Gửi thông báo qua ứng dụng hệ thống', cfg: [['Provider', 'Firebase Cloud Messaging'], ['Topic prefix', 'dtms-'], ['TTL (giây)', '86400'], ['Deep link', 'dtms://task/{id}']] },
  ];
  const CH_ICON = {
    EMAIL: '<svg viewBox="0 0 24 24" fill="none"><rect x="2.5" y="4.5" width="19" height="15" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="m3 7 7.6 5.3a2.4 2.4 0 0 0 2.8 0L21 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    SMS: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5v-9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 9.5h8M8 12.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    WEB: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 10a6 6 0 1 1 12 0v4l1.5 3h-15L6 14v-4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    APP: '<svg viewBox="0 0 24 24" fill="none"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M11 18.5h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  };

  /* Sự kiện = notification_event_config: do workflow bắn (EVENT_DRIVEN) hoặc job Quartz quét mốc hạn (SCHEDULED). BE cấu hình,
     không có màn quản trị (D-44); chỉ dùng cho khối "Sự kiện sử dụng mẫu" của Mẫu thông báo. */
  const E0 = [
    ['TASK_ASSIGNED', 'Giao việc xử lý bước quy trình', 'BPMN', 'EVENT_DRIVEN', null, null, ['Người xử lý bước'], ['IN_APP', 'EMAIL'], '/my-tasks/{id}', 'Task người dùng được tạo (Camunda user task created)'],
    ['TASK_DUE_SOON', 'Nhắc việc sắp đến hạn xử lý', 'BPMN', 'SCHEDULED', 'BEFORE_DUE', 1, ['Người xử lý bước'], ['IN_APP'], '/my-tasks/{id}', 'Hạn xử lý của task (SLA theo bước)'],
    ['TASK_OVERDUE', 'Cảnh báo việc quá hạn xử lý', 'BPMN', 'SCHEDULED', 'AFTER_DUE', 0, ['Người xử lý bước', 'Lãnh đạo đơn vị đề xuất'], ['EMAIL', 'IN_APP', 'SMS'], '/my-tasks/{id}', 'Hạn xử lý của task (SLA theo bước)'],
    ['PROFILE_RETURNED', 'Hồ sơ bị trả lại', 'BPMN', 'EVENT_DRIVEN', null, null, ['Người lập hồ sơ'], ['IN_APP'], '/ho-so/{id}', 'Hành động Trả lại / Không đồng ý của bước duyệt'],
    ['PROFILE_APPROVED', 'Hồ sơ được phê duyệt', 'BPMN', 'EVENT_DRIVEN', null, null, ['Người lập hồ sơ', 'Lãnh đạo đơn vị đề xuất'], ['EMAIL'], '/ho-so/{id}', 'Kết thúc quy trình ở nhánh phê duyệt'],
    ['YCBG_SENT', 'Gửi yêu cầu báo giá đến nhà cung cấp', 'DTMS', 'EVENT_DRIVEN', null, null, ['Nhà cung cấp (ngoài hệ thống)'], ['EMAIL'], '', 'Gửi yêu cầu báo giá đến nhà cung cấp (quy trình ĐXMS, khoản đầu tư)'],
    ['CONTRACT_GUARANTEE_EXPIRING', 'Bảo đảm thực hiện hợp đồng sắp hết hạn', 'DTMS', 'SCHEDULED', 'BEFORE_DUE', 30, ['Đơn vị quản lý hợp đồng', 'Chuyên viên TTMS'], ['EMAIL', 'IN_APP'], '/hop-dong/{id}', 'Ngày hết hiệu lực bảo đảm thực hiện hợp đồng'],
    ['CONTRACT_MILESTONE_LATE', 'Hợp đồng chậm tiến độ', 'DTMS', 'SCHEDULED', 'AFTER_DUE', 1, ['Đơn vị quản lý hợp đồng'], ['IN_APP'], '/hop-dong/{id}', 'Ngày kế hoạch của mốc thực hiện hợp đồng (MS23)'],
    ['CONTRACT_EXPIRING', 'Hợp đồng sắp hết hạn', 'DTMS', 'SCHEDULED', 'BEFORE_DUE', 90, ['Đơn vị quản lý hợp đồng'], ['EMAIL', 'IN_APP'], '/hop-dong/{id}', 'Ngày hết hạn hợp đồng (hợp đồng đang thực hiện)'],
    ['PAYMENT_REQUEST_SIGNED', 'Đề nghị thanh toán đã được ký', 'DTMS', 'EVENT_DRIVEN', null, null, ['Phòng Tài chính', 'Đơn vị quản lý hợp đồng'], ['IN_APP'], '/hop-dong/{id}', 'Ký xong đề nghị chuyển tiền (MS24)'],
    ['FRAMEWORK_EXPIRING', 'Thỏa thuận khung sắp hết hạn', 'DTMS', 'SCHEDULED', 'BEFORE_DUE', 90, ['Đơn vị quản lý hợp đồng'], ['EMAIL'], '/thoa-thuan-khung/{id}', 'Ngày hết hạn thỏa thuận khung', 'INACTIVE'],
    /* T71 S12: sự kiện của phân hệ Quản lý sản xuất (app SX) — luồng D.sxFlows và job quét hạn công việc / SLA / kế hoạch / hạn đặt hàng. */
    ['SX_TASK_ASSIGNED', 'Giao việc xử lý bước quy trình sản xuất', 'SX', 'EVENT_DRIVEN', null, null, ['Người xử lý bước'], ['IN_APP'], '/sx/viec/{id}', 'Việc của luồng sản xuất được tạo'],
    ['SX_WORK_DUE_SOON', 'Nhắc công việc sắp đến hạn', 'SX', 'SCHEDULED', 'BEFORE_DUE', 2, ['Người thực hiện'], ['IN_APP'], '/sx/cong-viec/{id}', 'Hạn hoàn thành − Nhắc trước hạn của công việc'],
    ['SX_WORK_OVERDUE', 'Cảnh báo công việc quá hạn', 'SX', 'SCHEDULED', 'AFTER_DUE', 0, ['Người thực hiện', 'Người giao'], ['EMAIL'], '/sx/cong-viec/{id}', 'Hạn hoàn thành của công việc'],
    ['SX_ISSUE_SLA_OVERDUE', 'Phiếu bất thường quá hạn xử lý', 'SX', 'SCHEDULED', 'AFTER_DUE', 0, ['Giám đốc dự án', 'Lãnh đạo Khối'], ['EMAIL'], '/sx/bat-thuong/{id}', 'Hạn xử lý theo danh mục Loại bất thường và SLA'],
    ['SX_PLAN_LATE', 'Hạng mục kế hoạch chậm tiến độ', 'SX', 'SCHEDULED', 'AFTER_DUE', 1, ['Giám đốc dự án'], ['IN_APP'], '/sx/du-an/{id}', 'Ngày kết thúc kế hoạch gốc của hạng mục (tab Kế hoạch & mốc)'],
    ['SX_MATERIAL_ORDER_DUE', 'Vật tư đến hạn đặt hàng', 'SX', 'SCHEDULED', 'BEFORE_DUE', 7, ['Giám đốc dự án', 'Sub PM'], ['IN_APP'], '/sx/nhu-cau', 'Hạn đặt hàng của Nhu cầu vật tư (ngày cần − leadtime)'],
    ['SX_ECN_ISSUED', 'Ban hành thông báo thay đổi kỹ thuật', 'SX', 'EVENT_DRIVEN', null, null, ['Nhà máy', 'Đảm bảo chất lượng'], ['EMAIL'], '/sx/thay-doi/{id}', 'Bước 8 luồng Thay đổi kỹ thuật (cấp mã ECN)'],
    ['SX_SIGN_REQUEST', 'Yêu cầu ký số tài liệu', 'SX', 'EVENT_DRIVEN', null, null, ['Người ký'], ['IN_APP'], '/sx/viec/{id}', 'Bước có cấu hình ký số MySign của luồng sản xuất'],
  ].map(([code, name, app, trig, timing, offset, roles, channels, cta, src, status]) => ({ code, name, app, trig, timing, offset, roles, channels, cta, src, status: status || 'ACTIVE' }));

  const KEY = 'dtms-proto-thong-bao';
  let U = null;
  const load = () => { try { U = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { U = null; } if (!U) U = { t: JSON.parse(JSON.stringify(T0)), ch: CH0.map((c) => ({ code: c.code, on: c.on, cfg: c.cfg.map((x) => x[1]) })), ev: JSON.parse(JSON.stringify(E0)) };
    /* Dữ liệu lưu từ bản trước: bổ sung sự kiện / mẫu mới theo mã. */
    E0.filter((e) => !U.ev.some((x) => x.code === e.code)).forEach((e) => U.ev.push(JSON.parse(JSON.stringify(e))));
    T0.filter((t) => !U.t.some((x) => x.code === t.code)).forEach((t) => U.t.push(Object.assign(JSON.parse(JSON.stringify(t)), { id: String(Math.max(0, ...U.t.map((x) => Number(x.id) || 0)) + 1) }))); };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  load();
  const tOf = (id) => U.t.find((t) => t.id === id) || null;
  /* Mẫu dùng cho sự kiện theo kênh (findTemplate): <sự kiện>_<KÊNH> rồi đến đúng mã sự kiện. */
  const tplFor = (ev, ch) => U.t.find((t) => t.code === `${ev}_${ch}`) || U.t.find((t) => t.code === ev && t.channel === ch) || null;
  const usedBy = (t) => U.ev.filter((e) => e.channels.some((c) => tplFor(e.code, c) === t));
  const chPill = (c) => `<span class="ch-pill ${CH_CLS[c] || ''}">${esc(CH[c] || c)}</span>`;
  const sw = (on, attr, label) => `<button type="button" class="vswitch ${on ? 'on' : ''}" role="switch" aria-checked="${on}" aria-label="${label || 'Trạng thái'}" ${attr}><span></span></button>`;

  /* T71 S12: cùng màn cho phân hệ Quản lý sản xuất ở #/sx/mau-thong-bao — đường dẫn gốc theo phân hệ đang mở; mẫu SX = mã tiền tố SX_ hoặc tạo trong phân hệ SX. */
  const isSx = () => /^#\/sx\//.test(location.hash);
  const BASE = () => (isSx() ? 'sx/mau-thong-bao' : 'mau-thong-bao');
  const sxOf = (t) => t.app === 'SX' || /^SX_/.test(t.code);
  /* ---------- SCR-88 Mẫu thông báo ---------- */
  function tplList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/notification-template/notification-template.component.html (+ utils/notification-template-columns.utils.ts)
    const k = K();
    return k.listPage({
      id: 'mtb', title: 'Mẫu thông báo', ph: 'Tìm kiếm theo mã, tên mẫu thông báo',
      right: `<button class="vbtn primary" data-go="${BASE()}/create">${icon('add')} Thêm mới</button>`,
      rows: () => U.t.filter((t) => sxOf(t) === isSx()), kwText: (t) => `${t.code} ${t.name}`,
      empty: () => ({ code: '', name: '', channel: null, status: null }),
      match: (t, f) => k.has(f.code, t.code) && k.has(f.name, t.name) && (!f.channel || t.channel === f.channel) && (!f.status || t.status === f.status),
      adv: (txt, sel) => `${txt('code', 'Mã mẫu thông báo')}${txt('name', 'Tên mẫu thông báo')}
        ${sel('channel', 'Kênh thông báo', { searchable: false, placeholder: 'Tất cả', options: Object.entries(CH).map(([value, label]) => ({ value, label })) })}
        ${sel('status', 'Trạng thái', { searchable: false, placeholder: 'Tất cả', options: [{ value: 'ACTIVE', label: 'Đang hoạt động' }, { value: 'INACTIVE', label: 'Dừng hoạt động' }] })}`,
      cols: [['Thao tác', 90, 'c'], ['Trạng thái', 90, 'c'], ['Mã mẫu thông báo', 240], ['Tên mẫu thông báo', 320], ['Kênh thông báo', 140, 'c'], ['Ngày tạo', 140]],
      href: (t) => BASE() + '/detail/' + t.id,
      cell: (t) => `<td class="c"><div class="acts"><button type="button" class="cat-ic" data-tb-edit="${t.id}" aria-label="Chỉnh sửa">${icon('edit')}</button><span class="sep"></span>
          <button type="button" class="cat-ic del" data-tb-del="${t.id}" aria-label="Xóa">${icon('del')}</button></div></td>
        <td class="c">${sw(t.status === 'ACTIVE', `data-tb-tg="${t.id}"`)}</td>
        <td><a class="link" data-go="${BASE()}/detail/${t.id}">${esc(t.code)}</a></td><td>${k.clamp(t.name)}</td><td class="c">${chPill(t.channel)}</td><td class="num">${esc(t.createdAt)}</td>`,
      info: {
        scr: isSx() ? 'SX-21' : 'SCR-88', name: 'Mẫu thông báo', uc: isSx() ? 'SX-ULNL nhóm Quản lý thông báo; Backlog W1_T10 › Thông báo › Mẫu thông báo' : 'Backlog W1_T10 › Thông báo › Mẫu thông báo (dòng 183–187)',
        q: isSx() ? ['P-258'] : undefined,
        notes: (isSx() ? ['<b>Phân hệ Quản lý sản xuất</b> (T71 S12, D-124): cùng màn và API của ĐTMS, chỉ hiện mẫu của phân hệ (mã tiền tố SX_, BE lọc theo ứng dụng). Sự kiện SX: giao việc của luồng sản xuất, công việc sắp đến hạn / quá hạn, phiếu bất thường quá hạn SLA, hạng mục kế hoạch chậm, vật tư đến hạn đặt hàng, ban hành ECN, yêu cầu ký số MySign. Kênh gửi dùng chung Kênh thông báo của hệ thống.'] : []).concat([
          'Dùng nguyên màn notification-template của repo-khcn-bpmn-fe và API /message/api/v1/notification-templates (BE be/messages) — chỉ thay dữ liệu mẫu theo sự kiện ĐTMS.',
          'Mã mẫu theo quy ước của BE khi gửi: <b>&lt;mã sự kiện&gt;_&lt;KÊNH&gt;</b> (vd TASK_OVERDUE_EMAIL) — NotificationDispatcherServiceImpl.findTemplate tìm mẫu theo mã sự kiện của Trigger và kênh. Mẫu Dừng hoạt động thì kênh đó không gửi.',
          'Kênh của mẫu: Email, In-app, SMS (enum NotificationChannel của BE). Web / App ở Kênh thông báo đều nhận mẫu In-app.',
        ]),
        src: 'notification-template/notification-template.component · /notification-template',
      },
    });
  }

  /* ---------- SCR-89 Thêm mới / Chỉnh sửa / Xem chi tiết mẫu thông báo ---------- */
  const F = { mode: 'CREATE', id: null, v: {}, err: {}, snap: '' };
  function enterForm(mode, id) {
    const t = id ? tOf(id) : null;
    F.mode = mode; F.id = id; F.err = {};
    F.v = t ? { code: t.code, channel: t.channel, name: t.name, subject: t.subject, content: t.content } : { code: '', channel: 'EMAIL', name: '', subject: '', content: '' };
    F.snap = JSON.stringify(F.v);
  }
  const NAME_OK = /^[\p{L}0-9\s_-]+$/u;
  function tplForm() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/notification-template/components/notification-template-form/notification-template-form.component.html (+ utils/notification-template-form.utils.ts)
    const t = F.id ? tOf(F.id) : null;
    if (F.mode !== 'CREATE' && !t) return `<div class="pg">${head({ title: 'Xem chi tiết thông báo', back: BASE(), lg: true })}${K().emptyCard('Thông tin chung', 'Không tìm thấy mẫu thông báo')}</div>`;
    const view = F.mode === 'DETAIL', v = F.v, err = F.err, k = K();
    const title = { CREATE: 'Tạo mới mẫu thông báo', EDIT: 'Chỉnh sửa mẫu thông báo', DETAIL: 'Xem chi tiết thông báo' }[F.mode];
    const info = {
      scr: 'SCR-89', name: title, uc: 'Backlog W1_T10 › Mẫu thông báo › Tạo mới / Xem chi tiết / Chỉnh sửa (dòng 184–186)',
      notes: [
        'Theo notification-template-form (mode CREATE / EDIT / DETAIL): Mã (bắt buộc, tối đa 50, viết hoa, chỉ chữ, số, - và _), Kênh (mặc định Email), Tên (bắt buộc, tối đa 255), Tiêu đề (tối đa 255), Nội dung (tối đa 4.000). Rời trang khi đã sửa → hỏi xác nhận.',
        '"Biến hỗ trợ" là biến BE thay khi gửi (buildVariables). Danh sách biến ĐTMS (mã hồ sơ, tên bước, hạn xử lý, hợp đồng, nhà thầu…) cần BE bổ sung — biến KHCN của source không dùng cho ĐTMS.',
        'Trạng thái bật / tắt ở cột Trạng thái của danh sách, không có trong form (như source).',
      ],
      src: 'notification-template/components/notification-template-form · /notification-template/create, /edit/:id, /detail/:id',
    };
    if (view) {
      const used = usedBy(t);
      return `<div class="pg">
        ${head({ title, back: BASE(), lg: true, info, right: `<button type="button" class="vbtn primary" data-go="${BASE()}/edit/${t.id}">Chỉnh sửa</button>` })}
        <section class="vcard pad24"><h3>Thông tin chung</h3>
          <div class="ginfo c3">${k.kv('Mã mẫu thông báo', esc(t.code))}${k.kv('Kênh thông báo', esc(CH[t.channel]))}${k.kv('Trạng thái', t.status === 'ACTIVE' ? 'Đang hoạt động' : 'Dừng hoạt động')}
            ${k.kv('Tên mẫu thông báo', esc(t.name), 'span3')}${k.kv('Tiêu đề (Email/Web/App)', esc(t.subject), 'span3')}</div>
          <div><div class="tb-k">Nội dung mẫu</div><div class="tb-content">${esc(t.content || '-')}</div></div></section>
        ${k.card('Sự kiện sử dụng mẫu', k.table([['Mã sự kiện', 260], ['Tên sự kiện', 360], ['Trạng thái sự kiện', 170, 'c']], used,
          (e) => `<td>${esc(e.code)}</td><td>${k.clamp(e.name)}</td><td class="c">${e.status === 'ACTIVE' ? badge('Đang hoạt động', 'success') : badge('Dừng hoạt động', 'default')}</td>`))}
      </div>`;
    }
    const inp = (key, ph, max, extra) => `<input class="vctl" id="tb-${key}" data-tbf="${key}" maxlength="${max}" placeholder="${ph}" value="${esc(v[key])}" ${err[key] ? 'aria-invalid="true"' : ''} ${extra || ''}>`;
    return `<form class="pg" data-tb-form>
      ${head({ title, back: BASE(), lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-tb-cancel>Hủy</button><button type="submit" class="vbtn primary" id="tb-save">Lưu</button>` })}
      <section class="vcard pad24"><h3>Thông tin chung</h3>
        <div class="tb-grid2">
          ${k.field('Mã mẫu thông báo', inp('code', 'Nhập mã mẫu thông báo', 50, 'style="text-transform:uppercase"'), { req: true, err: err.code })}
          ${k.field('Kênh thông báo', vSelect({ id: 'tb-channel', value: v.channel, placeholder: 'Chọn kênh thông báo', options: Object.entries(CH).map(([value, label]) => ({ value, label })), onChange: (x) => { v.channel = x; rerender(); } }))}
        </div>
        ${k.field('Tên mẫu thông báo', inp('name', 'Nhập tên mẫu thông báo', 255), { req: true, err: err.name })}
        ${k.field('Tiêu đề (Email/Web/App)', inp('subject', 'Nhập tiêu đề thông báo', 255), { err: err.subject })}
        ${k.field('Nội dung mẫu', `<textarea class="vctl ta" id="tb-content" data-tbf="content" rows="6" maxlength="4000" placeholder="Nhập nội dung mẫu thông báo">${esc(v.content)}</textarea>`)}
        <div class="tb-hint">Biến hỗ trợ: ${esc(VARS)}</div></section></form>`;
  }
  const normCode = (s) => String(s || '').toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_-]/g, '');
  function saveTpl() {
    const v = F.v, err = F.err = {};
    v.code = normCode(v.code); v.name = String(v.name || '').replace(/[^\p{L}0-9\s_-]/gu, '').trim();
    if (!v.code) err.code = 'Bạn cần nhập Mã mẫu thông báo.';
    else if (U.t.some((t) => t.code === v.code && t.id !== F.id)) err.code = 'Mã mẫu thông báo đã tồn tại.';
    if (!v.name) err.name = 'Bạn cần nhập Tên mẫu thông báo.';
    else if (!NAME_OK.test(v.name)) err.name = 'Tên mẫu thông báo chỉ bao gồm chữ cái, chữ số, khoảng trắng, ký tự gạch ngang (-) và gạch dưới (_).';
    if (Object.keys(err).length) { rerender(); return; }
    if (F.mode === 'CREATE') U.t.unshift({ id: String(Math.max(...U.t.map((t) => Number(t.id)), 0) + 1), code: v.code, name: v.name, channel: v.channel, subject: v.subject.trim(), content: v.content.trim(), status: 'ACTIVE', app: isSx() ? 'SX' : undefined, createdAt: Flow.dateOf(Flow.state.clock) });
    else Object.assign(tOf(F.id), { code: v.code, name: v.name, channel: v.channel, subject: v.subject.trim(), content: v.content.trim() });
    persist();
    F.snap = JSON.stringify(F.v);
    toast(`<b>Thông báo</b><br>${F.mode === 'CREATE' ? 'Thêm mới mẫu thông báo thành công' : 'Lưu mẫu thông báo thành công'}`);
    location.hash = '#/' + BASE();
  }
  async function leave() {
    if (F.mode !== 'DETAIL' && JSON.stringify(F.v) !== F.snap) {
      const ok = await confirm({ sev: 'warning', title: 'Bạn có chắc chắn muốn rời khỏi trang?', desc: 'Dữ liệu bạn đã nhập sẽ không được lưu. Bạn có chắc chắn muốn tiếp tục?', hl: '', cancel: 'Tiếp tục chỉnh sửa', ok: 'Rời khỏi trang' });
      if (!ok) return;
    }
    F.snap = JSON.stringify(F.v);
    location.hash = '#/' + BASE();
  }

  /* ---------- SCR-90 Kênh thông báo ---------- */
  function channels() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/notification-channel/notification-channel.component.html (+ components/notification-channel-card)
    const info = {
      scr: 'SCR-90', name: 'Kênh thông báo', uc: 'Backlog W1_T10 › Thông báo › Kênh — Cấu hình Email / SMS / Web / App (dòng 188)',
      notes: [
        'Theo notification-channel: 4 thẻ, công tắc Bật / Tắt có hộp thoại xác nhận (Kích hoạt / Dừng). API /message/api/v1/notification-channels/{code}/status (sẵn có). Kênh tắt thì BE bỏ qua kênh đó với mọi sự kiện.',
        '<b>Chỉnh sửa cấu hình</b>: source đã có khoá i18n NOTIFICATION_CHANNEL.ACTIONS.EDIT_CONFIG và CONFIG.* (SMTP, Brandname, giữ tin, provider…) nhưng chưa có hộp thoại → cần dev nhỏ (FE hộp thoại + API cập nhật cấu hình kênh). Mật khẩu / khoá API không hiển thị.',
      ],
      src: 'notification-channel/notification-channel.component · /notification-channel',
    };
    const card = (c) => {
      const s = U.ch.find((x) => x.code === c.code);
      return `<article class="ch-card"><div class="ch-top">
          <div class="ch-l"><span class="ch-ic ${s.on ? 'on' : ''}">${CH_ICON[c.code]}</span><span class="ch-t">${esc(c.name)}</span>${s.on ? badge('Đang bật', 'success') : badge('Đang tắt', 'default')}</div>
          <div class="ch-r"><span class="ch-st ${s.on ? 'on' : ''}">${s.on ? 'Bật' : 'Tắt'}</span>${sw(s.on, `data-ch-tg="${c.code}"`, 'Bật / tắt kênh ' + c.name)}</div></div>
        <p class="ch-d">${esc(c.desc)}</p>
        <div class="ch-f"><button type="button" class="vbtn secondary sm" data-ch-cfg="${c.code}">${icon('edit')} Chỉnh sửa cấu hình</button></div></article>`;
    };
    return `<div class="pg">${head({ title: 'Kênh thông báo', info })}<div class="ch-grid">${CH0.map(card).join('')}</div></div>`;
  }
  function cfgDlg(code) {
    const c = CH0.find((x) => x.code === code), s = U.ch.find((x) => x.code === code);
    const m = vModal({ title: `Cấu hình ${c.name}`, size: 'w580', body: `<div class="tb-grid2">${c.cfg.map(([label], i) => `<div class="vfield"><div class="lr"><label>${esc(label)}</label></div><input class="vctl" data-cfg="${i}" value="${esc(s.cfg[i])}"></div>`).join('')}</div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="cfg-ok">Lưu</button>' });
    m.el.querySelector('#cfg-ok').onclick = () => {
      m.el.querySelectorAll('[data-cfg]').forEach((x) => { s.cfg[Number(x.dataset.cfg)] = x.value; });
      persist(); m.close();
      toast('<b>Thành công</b><br>Cập nhật cấu hình kênh thành công.');
    };
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener('input', (e) => {
    const f = e.target.closest && e.target.closest('[data-tbf]');
    if (f) F.v[f.dataset.tbf] = f.value;
  });
  document.addEventListener('submit', (e) => {
    if (e.target.matches('[data-tb-form]')) { e.preventDefault(); saveTpl(); }
  });
  document.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-tb-cancel]') || (t.closest('.pg-head .vbtn.back') && /^#\/(sx\/)?mau-thong-bao\/(create|edit)/.test(location.hash))) {
      e.preventDefault(); e.stopImmediatePropagation(); leave(); return;
    }
    const ed = t.closest('[data-tb-edit]');
    if (ed) { e.stopImmediatePropagation(); location.hash = `#/${BASE()}/edit/` + ed.dataset.tbEdit; return; }
    const del = t.closest('[data-tb-del]');
    if (del) {
      e.stopImmediatePropagation();
      const r = tOf(del.dataset.tbDel);
      const ok = await confirm({ sev: 'danger', title: 'Xác nhận xóa', desc: `Bạn có chắc muốn xóa mẫu thông báo ${r.name} - ${r.code} không?`, hl: `${r.name} - ${r.code}`, cancel: 'Hủy', ok: 'Xóa' });
      if (!ok) return;
      U.t = U.t.filter((x) => x.id !== r.id); persist();
      toast('<b>Thành công</b><br>Xóa mẫu thông báo thành công');
      rerender(); return;
    }
    const tg = t.closest('[data-tb-tg]');
    if (tg) {
      e.stopImmediatePropagation();
      const r = tOf(tg.dataset.tbTg), act = r.status !== 'ACTIVE', hl = `${r.name} - ${r.code}`;
      const ok = await confirm({ sev: act ? 'info' : 'warning', title: act ? 'Kích hoạt' : 'Dừng hoạt động', desc: `Bạn có chắc chắn muốn ${act ? 'kích hoạt' : 'dừng hoạt động'} mẫu thông báo: ${hl} không?`, hl, cancel: 'Không', ok: 'Có' });
      if (!ok) return;
      r.status = act ? 'ACTIVE' : 'INACTIVE'; persist();
      toast(`<b>Thành công</b><br>${act ? 'Kích hoạt' : 'Dừng hoạt động'} mẫu thông báo thành công`);
      rerender(); return;
    }
    const ct = t.closest('[data-ch-tg]');
    if (ct) {
      const s = U.ch.find((x) => x.code === ct.dataset.chTg), c = CH0.find((x) => x.code === s.code), act = !s.on;
      const ok = await confirm({ sev: act ? 'info' : 'warning', title: act ? 'Kích hoạt' : 'Dừng hoạt động', desc: `Bạn có chắc chắn muốn ${act ? 'kích hoạt' : 'dừng hoạt động'} kênh thông báo: ${c.name} không?`, hl: c.name, cancel: 'Không', ok: act ? 'Kích hoạt' : 'Dừng' });
      if (!ok) return;
      s.on = act; persist();
      toast(`<b>Thành công</b><br>${act ? 'Đã bật kênh thông báo thành công.' : 'Đã tắt kênh thông báo thành công.'}`);
      rerender(); return;
    }
    const cf = t.closest('[data-ch-cfg]');
    if (cf) { cfgDlg(cf.dataset.chCfg); return; }
  }, true);

  /* Router */
  function route(parts) {
    const [a, b, c] = parts;
    if (a === 'mau-thong-bao') return b ? tplForm() : tplList();
    return channels();
  }
  function enter(parts) {
    const [a, b, c] = parts;
    if (a === 'mau-thong-bao' && b) enterForm(b === 'create' ? 'CREATE' : b === 'edit' ? 'EDIT' : 'DETAIL', c || null);
  }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) { /* bỏ qua */ } U = null; load(); }
  window.ThongBao = { route, enter, reset, events: () => U.ev, templates: () => U.t };
})();
