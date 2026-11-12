<<<<<<< HEAD
# HỆ THỐNG QUẢN LÝ NHÀ HÀNG LEVIET
## ĐỒ ÁN 2: THIẾT KẾ WEB CƠ BẢN (FRONT-END / WEB TĨNH)
**Khoa Công nghệ Thông tin - Trường Đại học Sư phạm Kỹ thuật Hưng Yên (UTEHY)**

---

### 1. Giới thiệu kiến trúc Web tĩnh (Static Client-side Architecture)
Dự án được xây dựng 100% bằng công nghệ Web Front-end:
* **HTML5 ngữ nghĩa**, **CSS3 (Flexbox/Grid, Responsive Web Design)**, **Bootstrap 5**, **Font Awesome 6**.
* **JavaScript ES6+** thuần (Vanilla JS), không phụ thuộc framework nặng.
* **Cơ chế lưu trữ CSDL Client-side:** Sử dụng `Web Storage API (localStorage)` trong file `js/db.js` để mô phỏng toàn bộ dữ liệu thực tế (Phòng, Món ăn, Đơn đặt, Hóa đơn).
* **Đồng bộ thời gian thực giữa các Tab:** Sử dụng sự kiện `window.addEventListener('storage', ...)` giúp khi bạn mở song song nhiều tab trình duyệt (Tab 1: Lễ tân, Tab 2: Bếp, Tab 3: Bê món, Tab 4: Vệ sinh), thao tác ở một tab sẽ tự động cập nhật ngay lập tức sang các tab còn lại mà **không cần cài đặt Backend Server!**

---

### 2. Cấu trúc thư mục dự án
```
Project/
├── index.html                 # Trang chủ giới thiệu & đặt tiệc nhanh
├── rooms.html                 # Danh sách các loại phòng (VIP, Gia đình, Hội nghị, Sảnh)
├── menu.html                  # Thực đơn món ăn (Bộ lọc danh mục, tìm kiếm)
├── booking.html               # Form đặt bàn / đặt phòng trực tuyến
│
├── admin/                     # Phân hệ Điều hành & Vận hành nội bộ
│   ├── index.html             # Cổng điều hướng nhanh vai trò
│   ├── room-map.html          # Sơ đồ phòng trực quan (Dành cho Lễ tân)
│   ├── kitchen.html           # Màn hình KDS Bếp (Dành cho Đầu bếp)
│   ├── runner.html            # Màn hình Nhân viên bê món (Food Runner)
│   ├── housekeeping.html      # Màn hình Dọn vệ sinh phòng (Housekeeping)
│   ├── pos.html               # Màn hình Thu ngân & Thanh toán VietQR
│   └── dashboard.html         # Báo cáo doanh thu & Quản lý thực đơn
│
├── css/
│   ├── style.css              # Giao diện khách hàng (Sang trọng, ấm cúng)
│   └── admin.css              # Giao diện vận hành trực quan
└── js/
    └── db.js                  # Cơ sở dữ liệu Mock DB & LocalStorage Engine
```

---

### 3. Kịch bản Demo thực tế cho Hội đồng chấm thi
Để đạt điểm tối đa khi báo cáo tiến độ tuần 12 hoặc bảo vệ tuần 16:
1. **Bước 1 (Khách đặt phòng):** Mở `booking.html`, đặt một phòng "VIP Hoàng Gia 1" với ghi chú "Tiệc sinh nhật".
2. **Bước 2 (Lễ tân nhận phòng):** Mở `admin/room-map.html`, thấy phòng trống bấm vào để "Mở phòng cho khách" $\rightarrow$ Phòng chuyển màu cam (`OCCUPIED`). Bấm "Gọi thêm món" gửi "Bò Wagyu Nướng Tảng" xuống bếp.
3. **Bước 3 (Bếp nấu món):** Mở `admin/kitchen.html` (trên tab mới), thấy món vừa được gọi, bấm "Bắt đầu nấu" $\rightarrow$ sau đó bấm "Nấu xong (Báo bê)".
4. **Bước 4 (Runner bê món):** Mở `admin/runner.html` (trên tab mới), thấy món vừa nấu xong kèm số phòng, bấm "Đã bê lên bàn".
5. **Bước 5 (Thu ngân tính tiền):** Mở `admin/pos.html`, chọn phòng, hệ thống tự tính tiền phòng theo giờ + tiền món, hiển thị mã VietQR động để quét. Bấm "Hoàn tất thanh toán & Trả phòng".
6. **Bước 6 (Vệ sinh dọn phòng):** Ngay khi thanh toán, phòng chuyển sang màu đỏ `NEEDS_CLEANING`. Mở `admin/housekeeping.html`, bấm "Bắt đầu dọn" $\rightarrow$ "Đã dọn sạch" $\rightarrow$ Quay lại tab Lễ tân thấy phòng đã xanh trở lại, sẵn sàng đón khách mới!
7. **Bước 7 (Báo cáo):** Mở `admin/dashboard.html` để xem doanh thu vừa được cộng vào hệ thống biểu đồ.
=======
# DoAn2QLNhaHang
QLnhahang
>>>>>>> e16c05e16c14a7ea0325c793019d6fa505761e28
