#!/usr/bin/env python3
"""Sinh bảng truy vết Backlog → prototype (plan T16 bước B0).

  python prototype/dtms/tools/backlog-truy-vet.py

Nguồn: project-knowledge/ĐTMS_BA_Tiến độ.xlsx (mã BA-TD), sheet "Backlog (051026)".
Kết quả: docs/dtms/backlog-W1T10-truy-vet.csv (UTF-8 BOM để Excel đọc đúng tiếng Việt).

Mỗi dòng Backlog nhận: màn / route prototype, Trạng thái (Có / Thiếu / Để sau), bước plan T16 sẽ làm, ghi chú.
Luật ở RULES: khớp (module, regex tính năng cấp 1, regex nội dung cấp 2 + 3) — luật đầu tiên khớp thắng.
Khi dựng thêm màn ở B1–B3, sửa luật tương ứng rồi chạy lại.
"""
import csv, re, sys
from collections import Counter
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "project-knowledge" / "ĐTMS_BA_Tiến độ.xlsx"
SHEET = "Backlog (051026)"
OUT = ROOT / "docs" / "dtms" / "backlog-W1T10-truy-vet.csv"

# Hạn theo sheet W1_T10 (051026), PIC phuctd7 — plan T16 §1.
DUE = {
    "Tổng quan": "09/10", "Việc của tôi": "Done", "Tích hợp": "chưa giao", "Quản lý quy trình": "Done",
    "Danh mục dùng chung": "07/10", "Thông báo": "09/10", "Quản lý đề xuất mua sắm": "07/10",
    "Quản lý khoản đầu tư": "08/10", "Quản lý thầu": "08/10", "Quản lý hợp đồng": "09/10", "Báo Cáo": "09/10",
    "Trợ lý AI": "chưa giao",
}

C, T, S = "Có", "Thiếu", "Để sau"
TASK = "Có trong luồng (màn xử lý task + eForm, B0.4)"

# (module, regex tính năng cấp 1, regex cấp 2 + cấp 3, route, trạng thái, bước, ghi chú)
RULES = [
    # ---- Tổng quan
    ("Tổng quan", r"Bộ lọc", r"", "#/tong-quan (SCR-92) khối lọc", C, "B3", "Năm / khoảng ngày, đơn vị, lĩnh vực, loại nghiệp vụ, trạng thái; Làm mới; Làm mới dữ liệu + Cập nhật lúc"),
    ("Tổng quan", r"", r"", "#/tong-quan (SCR-92) tab", C, "B3", "7 tab theo report-dashboard hr-tools; số liệu tính từ dữ liệu nghiệp vụ + Giám sát tiến trình"),
    # ---- Việc của tôi
    ("Việc của tôi", r"Danh sách", r"", "#/viec-cua-toi (SCR-01)", C, "", "Có tìm kiếm nâng cao (Trạng thái, hạn…)"),
    ("Việc của tôi", r"Xử lý gắn Eform", r"", "#/task/<id> — eForm mở dialog khi bấm nút", C, "", "Khung chung + eForm (D-24, B0.4)"),
    ("Việc của tôi", r"Xử lý task", r"", "#/task/<id>", C, "", "Nút theo Luật hiển thị (Ma trận hành động)"),
    ("Việc của tôi", r"", r"", "#/task/<id>", C, "", "Lịch sử xử lý: card Lịch sử hồ sơ ở Chi tiết hồ sơ"),
    # ---- Tích hợp (chưa giao PIC)
    ("Tích hợp", r"Camunda", r"bị xóa từ Camunda", "#/quy-trinh (SCR-41)", C, "B1", "Quy trình xoá trên Camunda → DELETED, hiện \"Dừng hoạt động\" (WORKFLOW_STATUS_LABEL_MAP của source); không thêm trạng thái mới"),
    ("Tích hợp", r"Camunda", r"Đối soát Process Definition|Đồng bộ thủ công", "#/quy-trinh (SCR-41)", C, "", "Nút Đồng bộ từ Camunda ở SCR-41; phần engine là BE"),
    ("Tích hợp", r"Camunda", r"Mapping User Task – hành động|Mapping action", "#/ma-tran (SCR-43…47)", C, "", "Ma trận hành động: luật hiển thị nút theo User Task"),
    ("Tích hợp", r"Camunda", r"Mapping User Task – E-Form", "#/quy-trinh/<id> (SCR-42) panel Biểu mẫu phần tử", C, "", "Gắn E-Form theo phần tử BPMN (T10 B4)"),
    ("Tích hợp", r"", r"", "#/ph/tich-hop…", S, "", "Module chưa giao PIC (W1_T10); phần lớn là BE / vận hành engine"),
    # ---- Quản lý quy trình
    ("Quản lý quy trình", r"Quản lý quy trình", r"Tìm kiếm nâng cao", "#/quy-trinh (SCR-41)", C, "B1", "Mã, Mã Camunda, Tên, Trạng thái, Ngày deploy, Có hồ sơ đang xử lý"),
    ("Quản lý quy trình", r"Quản lý quy trình", r"chi tiết", "#/quy-trinh/<id> (SCR-42)", C, "", ""),
    ("Quản lý quy trình", r"Quản lý quy trình", r"Đồng bộ", "#/quy-trinh (SCR-41)", C, "", "Nút Đồng bộ từ Camunda"),
    ("Quản lý quy trình", r"Quản lý quy trình", r"", "#/quy-trinh (SCR-41)", C, "", ""),
    ("Quản lý quy trình", r"Ma trận", r"Danh mục nút", "#/ma-tran/action-catalog (SCR-46/47)", C, "", ""),
    ("Quản lý quy trình", r"Ma trận", r"Đối soát BPMN", "#/ma-tran/bpmn-reconcile (SCR-45)", C, "", ""),
    ("Quản lý quy trình", r"Ma trận", r"Apply", "#/task/<id>", C, "", "Nút ở màn xử lý task lấy theo luật đang hoạt động"),
    ("Quản lý quy trình", r"Ma trận", r"", "#/ma-tran/display-rule (SCR-43/44)", C, "", ""),
    ("Quản lý quy trình", r"Giám sát", r"", "#/giam-sat-tien-trinh (SCR-48)", C, "", ""),
    # ---- Danh mục dùng chung
    ("Danh mục dùng chung", r"E-form", r"Import", "#/eform (SCR-49)", C, "B1", "Nhập biểu mẫu: tệp schema Camunda Form → kiểm tra từng biểu mẫu → Xác nhận; nhập vào ở trạng thái Dừng hoạt động"),
    ("Danh mục dùng chung", r"E-form", r"Tích hợp Eform", "#/task/<id> — eForm dialog; Văn bản đầu ra", C, "", "B0.4: eForm trống / đổ dữ liệu từ biến quy trình / sinh văn bản (xem trước PDF)"),
    ("Danh mục dùng chung", r"E-form", r"Thiết kế", "#/eform/<id>/thiet-ke (SCR-51)", C, "", ""),
    ("Danh mục dùng chung", r"E-form", r"phiên bản", "#/eform — Xem lịch sử (SCR-53)", C, "", ""),
    ("Danh mục dùng chung", r"E-form", r"", "#/eform (SCR-49/50)", C, "", "D-16: menu chuyển vào Danh mục dùng chung"),
    ("Danh mục dùng chung", r"loại đối tác|đơn vị tính|tiền tệ|loại gói thầu|phương pháp đánh giá|hình thức bảo đảm", r"",
     "#/dmdc/<key> (SCR-67…72)", C, "B1", "Khuôn CATALOGS: Mã khoá khi sửa, Kích hoạt / Ngưng, Xoá khi chưa tham chiếu, Xem chi tiết (bấm Mã)"),
    ("Danh mục dùng chung", r"", r"chi tiết", "#/dmdc/<key> — bấm Mã", C, "B1",
     "Hộp thoại chế độ chỉ xem (Đóng / Chỉnh sửa); ecat chưa có — theo mode view của display-rule-form"),
    ("Danh mục dùng chung", r"", r"", "#/dmdc/<key> (SCR-31…39)", C, "",
     "Có sẵn: Loại hàng hoá/DV (SCR-36), Loại KĐT (SCR-34), Tính chất KĐT = Tính chất tài sản (SCR-35), Hình thức LCNT (SCR-37), Phương thức LCNT (SCR-38), Loại HĐ (SCR-39)"),
    # ---- Thông báo
    ("Thông báo", r"Mẫu", r"", "#/mau-thong-bao (SCR-88/89)", C, "B3", "Theo notification-template (list + form CREATE / EDIT / DETAIL), API sẵn có"),
    ("Thông báo", r"Kênh", r"", "#/kenh-thong-bao (SCR-90)", C, "B3", "Theo notification-channel; hộp thoại cấu hình theo khoá i18n CONFIG.* (dev nhỏ)"),
    ("Thông báo", r"Trigger", r"", "#/trigger-thong-bao (SCR-91)", C, "B3", "Bảng notification_event_config (BE có entity, chưa có API) — cần dev API + màn"),
    # ---- Quản lý ĐXMS
    ("Quản lý đề xuất mua sắm", r"Hồ sơ Đề xuất", r"Tìm kiếm", "#/ho-so-dxms (SCR-02)", C, "", ""),
    ("Quản lý đề xuất mua sắm", r"Hồ sơ Đề xuất", r"Chi tiết", "#/ho-so-dxms/<mã> (SCR-20)", C, "", ""),
    ("Quản lý đề xuất mua sắm", r"Hồ sơ Đề xuất", r"", "#/ho-so-dxms (SCR-02)", C, "", ""),
    ("Quản lý đề xuất mua sắm", r"Yêu cầu báo giá", r"", "#/ycbg (SCR-73, menu gộp cấp 1 Yêu cầu báo giá), #/ycbg/<mã> (SCR-74)", C, "B1", "Danh sách + tìm kiếm nâng cao + chi tiết + xuất file; YCBG sinh ở task 08/09 của hồ sơ; 12/11 gộp với YCBG KĐT, lọc Loại đối tượng"),
    ("Quản lý đề xuất mua sắm", r"", r"Thông tin Đề xuất.*Tìm kiếm", "#/dxms (SCR-27)", C, "B1", "Panel nâng cao: Mã, Tên, Nhiệm vụ / Đề tài, Đơn vị, Trạng thái, Mức ưu tiên, Ngày tạo"),
    ("Quản lý đề xuất mua sắm", r"", r"Thông tin Đề xuất.*Thêm mới", "#/dxms/create (SCR-28)", C, "", "B0.5: bắt buộc chọn Nhiệm vụ / Đề tài (P-69)"),
    ("Quản lý đề xuất mua sắm", r"", r"Thông tin Đề xuất.*Chỉnh sửa", "#/dxms/<mã>/edit (SCR-28)", C, "", ""),
    ("Quản lý đề xuất mua sắm", r"", r"Thông tin Đề xuất.*kết quả", "#/dxms/<mã> (SCR-29) tab Kết quả & văn bản phê duyệt", C, "B1", "Hồ sơ Hoàn thành + văn bản phê duyệt (BM-08 / BM-09 / QĐ điều chỉnh), hiệu lực"),
    ("Quản lý đề xuất mua sắm", r"", r"Thông tin Đề xuất.*chi tiết", "#/dxms/<mã> (SCR-29)", C, "", ""),
    ("Quản lý đề xuất mua sắm", r"", r"Thông tin Đề xuất", "#/dxms (SCR-27)", C, "", ""),
    ("Quản lý đề xuất mua sắm", r"", r"Căn cứ và hạng mục", "#/dxms/<mã> (SCR-29) tab Căn cứ & hạng mục", C, "B1",
     "Nhập ở task 01 / 05 (eForm); tab chỉ xem: căn cứ (đã dùng / đang giữ / còn lại — BE tính), hạng mục gắn dòng căn cứ"),
    ("Quản lý đề xuất mua sắm", r"", r"Rà soát tồn kho", "#/dxms/<mã> (SCR-29) tab Rà soát tồn kho", C, "B1",
     "Kết quả task 06/07 (tích hợp kho ❓), cột Tạm giữ, Lịch sử rà soát (bản theo hồ sơ MS02); giữ chỗ / snapshot cần dev BE"),
    ("Quản lý đề xuất mua sắm", r"", r"Yêu cầu báo giá.*Import", "#/dxms/<mã> (SCR-29) tab Yêu cầu báo giá", T, "B1", "Chưa dựng: chờ mẫu tệp import YCBG (P-74)"),
    ("Quản lý đề xuất mua sắm", r"", r"Yêu cầu báo giá", "#/dxms/<mã> (SCR-29) tab Yêu cầu báo giá", C, "B1",
     "Tạo ở task 08, báo giá ở task 10; tab: danh sách YCBG, so sánh báo giá + cơ sở giá + tổng giá trị, lịch sử cơ sở giá"),
    ("Quản lý đề xuất mua sắm", r"", r"Hồ sơ ĐXMS.*(phiên bản|So sánh)", "#/dxms/<mã> (SCR-29) tab Lịch sử phiên bản", C, "B1", "v1 lập dự thảo (task 11/12), v2 hoàn chỉnh (task 27), phiên bản hiện tại, so sánh (DEV-1)"),
    ("Quản lý đề xuất mua sắm", r"", r"Hồ sơ ĐXMS.*quyết định", "#/dxms/<mã> (SCR-29) tab Kết quả & văn bản phê duyệt", C, "B1", "Mỗi văn bản phê duyệt gắn mã hồ sơ tạo ra nó"),
    ("Quản lý đề xuất mua sắm", r"", r"Hồ sơ ĐXMS.*Khởi tạo", "#/ho-so-dxms/create/<mã ĐXMS> (SCR-25)", C, "", ""),
    ("Quản lý đề xuất mua sắm", r"", r"Hồ sơ ĐXMS.*(chi tiết|văn bản|kết quả ký)", "#/ho-so-dxms/<mã> (SCR-20)", C, "", "Danh sách tài liệu, Văn bản đầu ra, Lịch sử hồ sơ"),
    ("Quản lý đề xuất mua sắm", r"", r"Hồ sơ ĐXMS", "#/dxms/<mã> (SCR-29) card Danh sách hồ sơ", C, "", ""),
    ("Quản lý đề xuất mua sắm", r"", r"Thẩm định.*BM-04 theo phiên bản", "#/dxms/<mã> (SCR-29) tab Lịch sử phiên bản", C, "B1", "Cột BM-04 đã ký / CQCM theo phiên bản; bản cũ ghi hết hiệu lực"),
    ("Quản lý đề xuất mua sắm", r"", r"Thẩm định", "#/task/<id> + #/ho-so-dxms/<mã>", C, "",
     TASK + ": chọn / xác nhận CQCM, BM-04 từng CQCM, tổng hợp ý kiến (task 26), đếm vòng giải trình, họp khi > 2 vòng"),
    ("Quản lý đề xuất mua sắm", r"", r"Điều chỉnh ĐXMS Danh sách hồ sơ", "#/dxms/<mã> (SCR-29) card Danh sách hồ sơ", C, "", "Hồ sơ Điều chỉnh (MS02) chỉ ghi nhận"),
    ("Quản lý đề xuất mua sắm", r"", r"Điều chỉnh ĐXMS", "—", S, "", "Luồng MS02 Điều chỉnh để sau đợt W1 (D-18)"),
    # ---- Quản lý KĐT
    ("Quản lý khoản đầu tư", r"Hồ sơ KĐT", r"Chi tiết", "#/ho-so-kdt/<mã>", C, "", ""),
    ("Quản lý khoản đầu tư", r"Hồ sơ KĐT", r"", "#/ho-so-kdt (SCR-75)", C, "B2", "Danh sách hồ sơ KĐT (profile-list) + tìm kiếm nâng cao: mã, KĐT, tên, đơn vị, nhóm, nhánh, trạng thái"),
    ("Quản lý khoản đầu tư", r"Yêu cầu báo giá", r"", "#/ycbg lọc Loại đối tượng = KĐT (SCR-73 gộp, thay SCR-76), #/ycbg-kdt/<mã> (SCR-77)", C, "B2", "Cùng khuôn / cơ chế YCBG ĐXMS (bước 8–10 MS13); 12/11 gộp vào menu cấp 1 Yêu cầu báo giá; Xuất excel, Xuất file"),
    ("Quản lý khoản đầu tư", r"", r"Thông tin khoản đầu tư.*Tạo", "#/kdt/create (SCR-55)", C, "", ""),
    ("Quản lý khoản đầu tư", r"", r"Thông tin khoản đầu tư.*Chỉnh sửa", "#/kdt/<mã>/edit (SCR-55)", C, "", ""),
    ("Quản lý khoản đầu tư", r"", r"Thông tin khoản đầu tư.*chi tiết", "#/kdt/<mã> (SCR-56)", C, "", ""),
    ("Quản lý khoản đầu tư", r"", r"Thông tin khoản đầu tư", "#/kdt (SCR-54)", C, "", "Có tìm kiếm nâng cao"),
    ("Quản lý khoản đầu tư", r"", r"Căn cứ và hạng mục.*Thành phần", "#/kdt/<mã> tab Thành phần tham gia; #/goi-thau/<mã> tab Thành phần tham gia", C, "B2",
     "KĐT: CQCM thẩm định theo giai đoạn (bước 21 / 38 / 48); Tổ chuyên gia ở gói thầu — ❓ P-75 (MS13 không có bước lập Tổ chuyên gia)"),
    ("Quản lý khoản đầu tư", r"", r"Căn cứ và hạng mục", "#/kdt/<mã> tab Căn cứ & hạng mục", C, "B2", TASK + " (bước 1, 5 MS13) + tab chỉ xem ở Chi tiết KĐT"),
    ("Quản lý khoản đầu tư", r"", r"Rà soát tồn kho", "#/kdt/<mã> tab Rà soát tồn kho", C, "B2", TASK + " (bước 6, 7) + tab chỉ xem: tạm giữ, còn phải mua, lịch sử rà soát"),
    ("Quản lý khoản đầu tư", r"", r"Yêu cầu báo giá.*Import", "—", T, "", "Import YCBG chưa dựng — ❓ P-74 (chưa rõ nhập gì, mẫu tệp)"),
    ("Quản lý khoản đầu tư", r"", r"Yêu cầu báo giá", "#/kdt/<mã> tab Yêu cầu báo giá; #/ycbg-kdt/<mã>", C, "B2", TASK + " (bước 8–10) + so sánh báo giá, cơ sở giá, tổng giá trị, lịch sử cơ sở giá"),
    ("Quản lý khoản đầu tư", r"", r"Phân loại và định danh", "#/kdt/<mã> tab Phân loại & định danh", C, "B2",
     "04 yếu tố + xác nhận TTMS (bước 12), TSCĐ (bước 11), nhóm theo Ngưỡng phân luồng, 3 điều kiện gộp BM-00, cấp thẩm quyền (QT-8.6.5)"),
    ("Quản lý khoản đầu tư", r"", r"Hồ sơ KĐT.*(Danh sách|chi tiết|văn bản)", "#/kdt/<mã> card Danh sách hồ sơ; #/ho-so-kdt/<mã>", C, "", ""),
    ("Quản lý khoản đầu tư", r"", r"Hồ sơ KĐT.*(gộp|Khởi tạo hồ sơ phê duyệt|chủ trương)", "#/kdt/<mã>/tao-ho-so; #/ho-so-kdt/<mã>", C, "",
     "MS13 cấp VHT: nhánh gộp BM-00 và tách BM-01 → BM-03 (T11); MS14 để sau (D-18)"),
    ("Quản lý khoản đầu tư", r"", r"Thẩm định.*HĐĐT", "—", S, "", "Ý kiến HĐĐT thuộc MS14 — để sau (D-18)"),
    ("Quản lý khoản đầu tư", r"", r"Thẩm định", "#/task/<id> + #/ho-so-kdt/<mã>", C, "", TASK + " MS13: CQCM, ý kiến, vòng check / họp, xác nhận sau họp (T11 B3–B4)"),
    ("Quản lý khoản đầu tư", r"", r"Kết quả và triển khai", "#/kdt/<mã> tab Kết quả & triển khai", C, "B2",
     "Kết quả chủ trương, QĐ phê duyệt, tổng mức vốn + nguồn vốn được duyệt, chỉ đạo dừng, KHLCNT lập từ KĐT (nút Lập KHLCNT)"),
    # ---- Quản lý thầu (tĩnh, D-17) — thau.js
    ("Quản lý thầu", r"Kế hoạch lựa chọn", r"Đấu thầu trước", "—", S, "", "Phương án đấu thầu trước — ngoài phạm vi màn tĩnh B2"),
    ("Quản lý thầu", r"Kế hoạch lựa chọn", r"Tạo KHLCNT|giá trị được phê duyệt", "#/khlcnt/create (SCR-79)", C, "B2", "Chỉ ĐXMS / KĐT đã phê duyệt; giá trị + văn bản phê duyệt chỉ xem; DADT chưa có phân hệ"),
    ("Quản lý thầu", r"Kế hoạch lựa chọn", r"Thông tin KHLCNT", "#/khlcnt (SCR-78), #/khlcnt/<mã> (SCR-80)", C, "B2", "Danh sách + tìm kiếm nâng cao + chi tiết"),
    ("Quản lý thầu", r"Kế hoạch lựa chọn", r"Phân bổ công việc|Kiểm soát giá trị", "#/khlcnt/<mã> tab Phân bổ công việc", C, "B2", "4 phần a–d theo Điều 23 khoản 2 + tổng hợp e đối chiếu giá trị được duyệt"),
    ("Quản lý thầu", r"Kế hoạch lựa chọn", r"Phân chia gói", "#/khlcnt/<mã> tab Gói thầu", C, "B2", "Cơ sở phân chia; một gói / nhiều gói"),
    ("Quản lý thầu", r"Kế hoạch lựa chọn", r"Điều chỉnh", "#/khlcnt/<mã> tab Phiên bản & điều chỉnh", C, "B2", "Điều chỉnh KHLCNT = phiên bản mới (lý do bắt buộc); so sánh trước / sau = DEV-1"),
    ("Quản lý thầu", r"Kế hoạch lựa chọn", r"Kết quả", "#/khlcnt/<mã> tab Kết quả KHLCNT", C, "B2", "BM-01 / BM-02 / BM-03 + kết quả kiểm tra; tên mẫu Báo cáo kiểm tra ❓ P-76"),
    ("Quản lý thầu", r"Quản lý gói thầu", r"Tra cứu.*(Danh sách|Tìm kiếm)", "#/goi-thau (SCR-81)", C, "B2", "Danh sách + tìm kiếm nâng cao"),
    ("Quản lý thầu", r"Quản lý gói thầu", r"Phương án", "#/goi-thau/<mã> tab Phương án LCNT", C, "B2", "Hình thức / phương thức (DMDC), trong nước / quốc tế, qua mạng, mua sắm tập trung"),
    ("Quản lý thầu", r"Quản lý gói thầu", r"", "#/goi-thau/<mã> (SCR-82) tab Thông tin chung", C, "B2", "Loại gói, nguồn 1..n, phạm vi + chia phần, giá + cơ sở giá + dự toán thay thế, nguồn vốn, tiến độ, loại HĐ"),
    ("Quản lý thầu", r"Lựa chọn nhà thầu", r"", "#/goi-thau/<mã> tab Thành phần tham gia", C, "B2", "Tổ chuyên gia, Tổ thẩm định, vai trò, kiểm tra xung đột, danh sách ngắn ≥ 03"),
    ("Quản lý thầu", r"hồ sơ lựa chọn", r"", "#/goi-thau/<mã> tab Hồ sơ mời thầu", C, "B2", "Loại hồ sơ theo hình thức, phiên bản, tiêu chuẩn + PP đánh giá, bảo đảm ≤ 3%, làm rõ / sửa đổi, HSDT, biên bản mở thầu"),
    ("Quản lý thầu", r"Tổ chức lựa chọn", r"", "#/goi-thau/<mã> tab Phương án LCNT (Trình tự thực hiện)", C, "B2", "11 hình thức có gói mẫu; trình tự theo Điều 12–21; MS19 chưa có BPMN ❓ P-77"),
    ("Quản lý thầu", r"Đánh giá", r"Chuyển kết quả", "#/goi-thau/<mã> nút Tạo hợp đồng", C, "B2", "Mở Quản lý hợp đồng (dựng ở B3)"),
    ("Quản lý thầu", r"Đánh giá", r"", "#/goi-thau/<mã> tab Đánh giá & KQLCNT", C, "B2", "Hợp lệ / năng lực / kỹ thuật / tài chính, làm rõ, xếp hạng, giá thấp bất thường (❓ P-79), thương thảo, KQLCNT, lý do không trúng"),
    ("Quản lý thầu", r"Tình huống", r"", "#/goi-thau/<mã> tab Tình huống & kiến nghị", C, "B2", "Huỷ thầu, tình huống (0 / 1 nhà thầu, vượt giá, thương thảo không thành), kiến nghị, tạm dừng ký HĐ"),
    ("Quản lý thầu", r"Nhà thầu & Kiểm soát", r"Danh mục nhà thầu|Nhà thầu vi phạm", "#/nha-thau (SCR-83)", C, "B2", "Nhà thầu / hãng chiến lược, nhà thầu bị cấm (cờ DMDC NCC), lịch sử vi phạm; nguồn ❓ P-78"),
    ("Quản lý thầu", r"Nhà thầu & Kiểm soát", r"", "—", S, "", "Cảnh báo rủi ro / tuân thủ (AI, quy tắc) — sau W1"),
    ("Quản lý thầu", r"Công khai|Giám sát hoạt động", r"", "#/ph/cong-khai-thau, #/ph/giam-sat-thau", S, "", "Tích hợp Cổng đấu thầu / KPI thầu — sau W1 (KPI đưa vào Báo cáo B3)"),
    # ---- Quản lý hợp đồng (B3, tĩnh D-22) — hop-dong.js
    ("Quản lý hợp đồng", r"Thỏa thuận khung", r"", "#/thoa-thuan-khung[/<mã>] (SCR-87)", C, "B3", "Giá trị đã gọi / còn lại, thời hạn; quy trình đơn hàng ❓ P-81"),
    ("Quản lý hợp đồng", r"^Hợp đồng$", r"Danh sách|Tìm kiếm", "#/hop-dong (SCR-84)", C, "B3", "Danh sách + tìm kiếm nâng cao (trạng thái, hiệu lực, tiến độ)"),
    ("Quản lý hợp đồng", r"^Hợp đồng$", r"Khởi tạo|Sao chép|Liên kết", "#/hop-dong/create[/<gói>] (SCR-85)", C, "B3", "Từ gói thầu Đã có KQLCNT; nhà thầu, giá, phạm vi, hình thức, loại HĐ sao chép chỉ xem"),
    ("Quản lý hợp đồng", r"^Hợp đồng$", r"Import", "#/hop-dong nút Nhập hợp đồng", C, "B3", "vht-import-dialog; hợp đồng nhập từ dữ liệu cũ"),
    ("Quản lý hợp đồng", r"Thanh toán hợp đồng", r"SAP", "#/hop-dong/<mã> tab Thanh toán", C, "B3", "Cột Đồng bộ SAP (trạng thái); tích hợp SAP chưa giao PIC"),
    ("Quản lý hợp đồng", r"", r"", "#/hop-dong/<mã> (SCR-86) — tab", C, "B3", "10 tab theo MS22 / MS23.01–04 / MS24; Thêm phụ lục (kiểm soát giá trị), Tạo hồ sơ thanh toán từ nghiệm thu"),
    # ---- Báo cáo (B3) — bao-cao.js
    ("Báo Cáo", r"Tính năng dùng chung", r"", "#/bao-cao/<nhóm> (SCR-93) khuôn chung", C, "B3", "Lọc, drill-down (ô chỉ tiêu / thanh biểu đồ), mở đối tượng, sắp xếp, phân trang, Xuất báo cáo"),
    ("Báo Cáo", r"", r"", "#/bao-cao/<nhóm> (SCR-93) tab báo cáo", C, "B3", "14 báo cáo cấu hình trên khuôn chung (+ KPI xử lý theo bước)"),
    # ---- Trợ lý AI
    ("Trợ lý AI", r"", r"", "#/ph/ai", S, "", "Module chưa giao PIC; khung Gợi ý AI tĩnh ở màn task (D-20, B0.5)"),
]


def norm(v):
    return re.sub(r"\s+", " ", str(v)).strip() if v is not None else ""


def rows():
    ws = openpyxl.load_workbook(SRC, read_only=True, data_only=True)[SHEET]
    m = f1 = f2 = ""
    for i, r in enumerate(ws.iter_rows(values_only=True), start=1):
        if i == 1:
            continue
        r = [norm(c) for c in (list(r) + [None] * 6)[:6]]
        if not any(r[:4]):
            continue
        if r[0]:
            m, f1, f2 = r[0], "", ""
        if r[1]:
            f1, f2 = r[1], ""
        if r[2]:
            f2 = r[2]
        yield i, m, f1, f2, r[3], r[4]


def classify(m, f1, f2, f3):
    text = f"{f2} {f3}"
    for mod, rf, rt, route, st, step, note in RULES:
        if mod == m and re.search(rf, f1, re.I) and re.search(rt, text, re.I):
            return route, st, step, note
    sys.exit(f"Không có luật cho: {m} › {f1} › {text}")


def main():
    out, cnt = [], Counter()
    for i, m, f1, f2, f3, note in rows():
        route, st, step, why = classify(m, f1, f2, f3)
        cnt[(m, st)] += 1
        out.append([len(out) + 1, i, m, f1, f2, f3, note, DUE.get(m, ""), route, st, step, why])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["STT", "Dòng Backlog", "Module", "Tính năng", "Tính năng cấp 2", "Tính năng cấp 3", "Ghi chú Backlog",
                    "Hạn W1_T10", "Màn / route prototype", "Trạng thái", "Bước T16", "Ghi chú truy vết"])
        w.writerows(out)
    print(f"{len(out)} dòng → {OUT.relative_to(ROOT)}")
    for m in DUE:
        c = {s: cnt[(m, s)] for s in (C, T, S)}
        print(f"  {m:<26} Có {c[C]:>3} · Thiếu {c[T]:>3} · Để sau {c[S]:>3}")


if __name__ == "__main__":
    main()
