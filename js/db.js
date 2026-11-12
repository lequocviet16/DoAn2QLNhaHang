/**
 * LEVIET RESTAURANT - DATABASE & LOCALSTORAGE ENGINE (db.js) - VERSION 3.0
 * Điều chỉnh lại toàn bộ bảng giá phòng, món ăn và ưu đãi theo chuẩn thị trường nhà hàng F&B Việt Nam hiện nay.
 */

const DB_VERSION = 'leviet_db_v3_0';

const DB_KEYS = {
  VERSION: 'leviet_version',
  ROOM_TYPES: 'leviet_room_types',
  ROOMS: 'leviet_rooms',
  CATEGORIES: 'leviet_categories',
  MENU_ITEMS: 'leviet_menu_items',
  PROMOTIONS: 'leviet_promotions',
  BOOKINGS: 'leviet_bookings',
  ORDERS: 'leviet_orders',
  INVOICES: 'leviet_invoices',
  CURRENT_USER: 'leviet_current_user'
};

// DỮ LIỆU MẪU CHUẨN GIÁ THỰC TẾ (REALISTIC MARKET PRICING)
const SEED_DATA = {
  // 1. CÁC LOẠI PHÒNG (Mức phụ thu phòng riêng hợp lý theo giờ sử dụng)
  roomTypes: [
    { 
      id: 1, 
      name: 'Phòng VIP Hoàng Gia', 
      hourlyRate: 150000, // 150k/h (Bao gồm dàn Karaoke chọn bài JBL, máy lạnh, phục vụ riêng)
      capacity: '12 - 16 người', 
      desc: 'Thiết kế phong cách cung đình châu Âu, dàn âm thanh Karaoke JBL chọn bài tablet, phục vụ riêng tại phòng.', 
      badge: 'VIP Thượng Hạng',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
    },
    { 
      id: 2, 
      name: 'Phòng Tiệc Gia Đình', 
      hourlyRate: 80000, // 80k/h (Phụ thu điện lạnh & dọn dẹp)
      capacity: '8 - 10 người', 
      desc: 'Không gian ấm cúng, bàn tròn kính xoay thông minh, ánh sáng vàng dịu nhẹ tạo sự gắn kết thân mật.', 
      badge: 'Gia Đình',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600'
    },
    { 
      id: 3, 
      name: 'Hầm Rượu Vang & Cigar', 
      hourlyRate: 180000, // 180k/h
      capacity: '6 - 10 người', 
      desc: 'Tường ốp gỗ sồi cổ điển, tủ bảo quản rượu vang chuẩn nhiệt độ 16°C, sofa da bò nhập khẩu Ý.', 
      badge: 'Đẳng Cấp',
      img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600'
    },
    { 
      id: 4, 
      name: 'Phòng Nhật Bản Tatami', 
      hourlyRate: 100000, // 100k/h
      capacity: '6 - 8 người', 
      desc: 'Trang trí phong cách tối giản Zen Nhật Bản, chiếu Tatami êm ái, vách trượt Shoji cách âm riêng tư.', 
      badge: 'Văn Hóa Á Đông',
      img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600'
    },
    { 
      id: 5, 
      name: 'Khu Vườn Rooftop Sky View', 
      hourlyRate: 120000, // 120k/h
      capacity: '15 - 25 người', 
      desc: 'Tọa lạc tại tầng thượng với view toàn cảnh thành phố về đêm, gió trời thoáng đãng, đèn dây lãng mạn.', 
      badge: 'Ngoài Trời',
      img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600'
    },
    { 
      id: 6, 
      name: 'Hội Trường Tiệc Lớn & Sự Kiện', 
      hourlyRate: 250000, // 250k/h (Bao gồm màn chiếu LED, loa mic hội thảo)
      capacity: '30 - 60 người', 
      desc: 'Sân khấu mini, màn hình chiếu LED 150 inch, hệ thống âm thanh ánh sáng chuyên nghiệp cho hội thảo/sinh nhật.', 
      badge: 'Sự Kiện Lớn',
      img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600'
    },
    { 
      id: 7, 
      name: 'Bàn Tiêu Chuẩn (Sảnh Chung)', 
      hourlyRate: 0, // Miễn phí hoàn toàn
      capacity: '4 - 6 người', 
      desc: 'Khu vực đại sảnh tầng 1 thoáng mát, thiết kế hiện đại, miễn phí tiền giờ sử dụng.', 
      badge: 'Sảnh Chung',
      img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600'
    }
  ],

  // 2. DANH SÁCH PHÒNG THEO TẦNG
  rooms: [
    // Tầng 1: Sảnh chung
    { id: 101, code: 'S.101', name: 'Bàn Sảnh 101', typeId: 7, floor: 1, status: 'AVAILABLE', currentOrderId: null },
    { id: 102, code: 'S.102', name: 'Bàn Sảnh 102', typeId: 7, floor: 1, status: 'AVAILABLE', currentOrderId: null },
    { id: 103, code: 'S.103', name: 'Bàn Sảnh 103', typeId: 7, floor: 1, status: 'NEEDS_CLEANING', currentOrderId: null },
    { id: 104, code: 'S.104', name: 'Bàn Sảnh 104', typeId: 7, floor: 1, status: 'AVAILABLE', currentOrderId: null },
    // Tầng 2: Phòng Gia Đình & Phòng Nhật Bản
    { id: 201, code: 'GĐ.201', name: 'Phòng Sen Vàng', typeId: 2, floor: 2, status: 'OCCUPIED', currentOrderId: 'ORD-1001' },
    { id: 202, code: 'GĐ.202', name: 'Phòng Trúc Xanh', typeId: 2, floor: 2, status: 'AVAILABLE', currentOrderId: null },
    { id: 203, code: 'NB.203', name: 'Phòng Sakura Nhật', typeId: 4, floor: 2, status: 'AVAILABLE', currentOrderId: null },
    { id: 204, code: 'NB.204', name: 'Phòng Fuji Nhật', typeId: 4, floor: 2, status: 'AVAILABLE', currentOrderId: null },
    // Tầng 3: Phòng VIP & Hầm Rượu Vang
    { id: 301, code: 'VIP.301', name: 'VIP Hoàng Gia 1', typeId: 1, floor: 3, status: 'AVAILABLE', currentOrderId: null },
    { id: 302, code: 'VIP.302', name: 'VIP Hoàng Gia 2', typeId: 1, floor: 3, status: 'AVAILABLE', currentOrderId: null },
    { id: 303, code: 'RV.303', name: 'Hầm Rượu Bordeaux', typeId: 3, floor: 3, status: 'AVAILABLE', currentOrderId: null },
    // Tầng 4: Hội Trường Lớn
    { id: 401, code: 'HT.401', name: 'Hội Trường Đông Đô', typeId: 6, floor: 4, status: 'AVAILABLE', currentOrderId: null },
    { id: 402, code: 'HT.402', name: 'Hội Trường Thăng Long', typeId: 6, floor: 4, status: 'AVAILABLE', currentOrderId: null },
    // Tầng Thượng: Rooftop Sky View
    { id: 501, code: 'RT.501', name: 'Rooftop Sky Terrace', typeId: 5, floor: 5, status: 'AVAILABLE', currentOrderId: null }
  ],

  // 3. DANH MỤC MÓN ĂN
  categories: [
    { id: 1, name: 'Khai Vị & Gỏi', icon: 'fa-leaf' },
    { id: 2, name: 'Đặc Sản Bò & Bê', icon: 'fa-drumstick-bite' },
    { id: 3, name: 'Hải Sản Tươi Sống', icon: 'fa-fish' },
    { id: 4, name: 'Món Chim & Gia Cầm', icon: 'fa-feather' },
    { id: 5, name: 'Lẩu Nước & Nướng LeViet', icon: 'fa-fire' },
    { id: 6, name: 'Cơm, Mỳ & Canh Dưỡng Sinh', icon: 'fa-bowl-rice' },
    { id: 7, name: 'Rượu Vang & Bia Nhập Khẩu', icon: 'fa-wine-glass-alt' },
    { id: 8, name: 'Đồ Uống & Tráng Miệng', icon: 'fa-cocktail' }
  ],

  // 4. DANH SÁCH MÓN ĂN (MỨC GIÁ HỢP LÝ THỰC TẾ)
  menuItems: [
    // 1. Khai vị (từ 65k - 125k)
    { id: 1, catId: 1, name: 'Salad Rong Biển Trứng Tôm', price: 75000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', isHot: true, desc: 'Rong biển giòn mát trộn sốt mè rang và trứng tôm Nhật.' },
    { id: 2, catId: 1, name: 'Súp Bào Ngư Vi Cá LeViet', price: 125000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', isHot: true, desc: 'Bào ngư cao cấp hầm thuốc bắc bồi bổ sức khỏe.' },
    { id: 3, catId: 1, name: 'Gỏi Củ Hũ Dừa Tôm Thịt', price: 95000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1505253758473-96b3015f240a?w=400', isHot: false, desc: 'Củ hũ dừa Bến Tre giòn ngọt, tôm sú tươi kèm nước mắm chua ngọt truyền thống.' },
    { id: 4, catId: 1, name: 'Nem Ốc Hoàng Thành Giòn Rụm', price: 85000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', isHot: false, desc: 'Ốc nhồi thịt nấm hương cuốn bánh tráng rế chiên vàng ươm.' },

    // 2. Bò & Bê (từ 165k - 320k)
    { id: 5, catId: 2, name: 'Bò Wagyu Nướng Tảng Sốt Tiêu Phú Quốc', price: 320000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', isHot: true, desc: 'Bò Wagyu vân mỡ mọng nước nướng xém cạnh, sốt tiêu đen cay nồng.' },
    { id: 6, catId: 2, name: 'Bê Chao Bản Mường Tương Gừng', price: 165000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', isHot: true, desc: 'Thịt bê non chao dầu giòn bì mềm thịt, chấm tương bần gừng non.' },
    { id: 7, catId: 2, name: 'Bò Tơ Cuốn Rau Rừng Bánh Tráng', price: 185000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400', isHot: false, desc: 'Bắp bò tơ hấp gừng sả thái mỏng, cuốn đọt mỏ quạ, sao nhái, chấm mắm nêm.' },
    { id: 8, catId: 2, name: 'Sườn Bò Mỹ Nướng Sốt BBQ Mật Ong', price: 260000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400', isHot: true, desc: 'Dẻ sườn bò ướp sốt BBQ 24 giờ đút lò than hoa dậy mùi thơm quyến rũ.' },

    // 3. Hải sản (từ 165k - 480k)
    { id: 9, catId: 3, name: 'Tôm Hùm Bông Bỏ Lò Phô Mai Mozzarella', price: 480000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400', isHot: true, desc: 'Tôm hùm Nha Trang tươi sống phủ phô mai Mozzarella đút lò thơm béo ngậy.' },
    { id: 10, catId: 3, name: 'Cá Hồi NaUy Áp Chảo Sốt Cam Tây', price: 195000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', isHot: false, desc: 'Phi lê cá hồi NaUy áp chảo mọng nước, dùng kèm măng tây và sốt cam thanh.' },
    { id: 11, catId: 3, name: 'Mực Trứng Hấp Hành Gừng Tươi', price: 165000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', isHot: false, desc: 'Mực câu đêm nhồi đầy trứng béo bùi, hấp rượu vang trắng thơm nức.' },
    { id: 12, catId: 3, name: 'Cua Cà Mau Sốt Me Chua Cay', price: 350000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', isHot: true, desc: 'Cua thịt chắc nịch sốt me sánh đậm, ăn kèm bánh mì bơ nướng giòn.' },

    // 4. Chim & Gia cầm (từ 135k - 185k)
    { id: 13, catId: 4, name: 'Gà Đồi Tiên Yên Hấp Lá Chanh (Nửa Con)', price: 185000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', isHot: false, desc: 'Gà thả đồi da vàng giòn, thịt dai ngọt đậm đà chấm muối tiêu chanh ớt hiểm.' },
    { id: 14, catId: 4, name: 'Chim Câu Pháp Quay Mắc Mật (1 Con)', price: 135000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', isHot: true, desc: 'Chim bồ câu nhồi lá mắc mật rừng quay giòn bì, thịt mềm thơm ngọt tự nhiên.' },

    // 5. Lẩu & Nướng (từ 350k - 390k cho set 3-4 người)
    { id: 15, catId: 5, name: 'Lẩu Riêu Cua Bắp Bò Sườn Sụn', price: 350000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isHot: true, desc: 'Nước dùng riêu cua đồng chua thanh thơm mùi giấm bỗng, bắp bò ta hoa tươi.' },
    { id: 16, catId: 5, name: 'Lẩu Hải Sản TomYum Cốt Dừa', price: 380000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=400', isHot: true, desc: 'Vị chua cay đậm đà chuẩn vị Thái, ngập tràn tôm sú, mực nháy, ngao hoa.' },
    { id: 17, catId: 5, name: 'Set Nướng Thượng Hạng LeViet', price: 390000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', isHot: true, desc: 'Khay nướng tổng hợp dẻ sườn bò, ba chỉ ướp sốt sa tế cung đình nướng không khói.' },

    // 6. Cơm, Mỳ, Canh (từ 95k - 110k)
    { id: 18, catId: 6, name: 'Cơm Chiên Hải Sản Hoàng Kim', price: 95000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', isHot: false, desc: 'Hạt cơm tơi xốp bao trứng muối vàng óng, xào cùng tôm mực tươi và hạt sen.' },
    { id: 19, catId: 6, name: 'Mỳ Ý Sốt Kem Nấm Truffle Bò Mỹ', price: 110000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?w=400', isHot: false, desc: 'Sợi mỳ dẻo dai hòa quyện dầu nấm Truffle đen và thịt bò băm.' },
    { id: 20, catId: 6, name: 'Canh Nấm Linh Chi Sườn Non Hầm Sen', price: 95000, station: 'KITCHEN', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', isHot: false, desc: 'Món canh bổ dưỡng thanh mát giải nhiệt, giải rượu sau bữa tiệc.' },

    // 7. Rượu vang & Đồ uống có cồn (từ 55k - 550k)
    { id: 21, catId: 7, name: 'Rượu Vang Đỏ Chateau Bordeaux Pháp (Chai)', price: 550000, station: 'BAR', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', isHot: true, desc: 'Vang đỏ cao cấp hương mận chín, thoang thoảng mùi gỗ sồi và tuyết tùng.' },
    { id: 22, catId: 7, name: 'Rượu Vang Trắng Ý Pinot Grigio (Chai)', price: 490000, station: 'BAR', img: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=400', isHot: false, desc: 'Thích hợp dùng kèm các món hải sản và khai vị thanh nhẹ.' },
    { id: 23, catId: 7, name: 'Bia Tươi Bỉ Leffe Nâu (Ly 500ml)', price: 55000, station: 'BAR', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400', isHot: false, desc: 'Bia thầy tu hương thơm caramel đậm đà, vị đắng êm dịu.' },

    // 8. Đồ uống & Tráng miệng (từ 35k - 55k)
    { id: 24, catId: 8, name: 'Nước Ép Dưa Hấu Bạc Hà Nhiệt Đới', price: 35000, station: 'BAR', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400', isHot: false, desc: 'Nước ép dưa hấu tươi 100% kết hợp lá bạc hà the mát sảng khoái.' },
    { id: 25, catId: 8, name: 'Trà Đào Cam Sả Hạt Chia', price: 35000, station: 'BAR', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', isHot: false, desc: 'Vị trà thơm nồng, đào ngâm giòn ngọt, bổ sung dinh dưỡng hạt chia.' },
    { id: 26, catId: 8, name: 'Chè Yến Sào Tuyết Nhĩ Hạt Sen', price: 55000, station: 'BAR', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', isHot: true, desc: 'Món tráng miệng cung đình thanh lọc cơ thể, dưỡng da và an thần.' }
  ],

  // 5. CHƯƠNG TRÌNH ƯU ĐÃI (ĐIỀU KIỆN ĐƠN HỢP LÝ VỚI MỨC CHI TIÊU THỰC TẾ)
  promotions: [
    {
      id: 1,
      code: 'LEVIETVIP',
      title: 'Đặc Quyền Khách VIP',
      discountType: 'PERCENT',
      discountValue: 10,
      minBill: 800000, // Đơn từ 800.000 đ (thay vì 1tr)
      desc: 'Giảm 10% tổng hóa đơn khi đặt tiệc tại các hạng Phòng VIP & Hầm Rượu Vang.',
      validUntil: '2026-12-31',
      badge: 'HOT NHẤT',
      applicableRoomTypes: [1, 3]
    },
    {
      id: 2,
      code: 'TIECSINHNHAT',
      title: 'Ưu Đãi Tiệc Sinh Nhật',
      discountType: 'PERCENT',
      discountValue: 15,
      minBill: 1200000, // Đơn từ 1.200.000 đ (rất dễ đạt với bàn tiệc sinh nhật 6-10 người)
      desc: 'Giảm ngay 15% tổng hóa đơn món ăn + Tặng gói trang trí hoa tươi & bóng bay.',
      validUntil: '2026-12-31',
      badge: 'SINH NHẬT',
      applicableRoomTypes: [1, 2, 6]
    },
    {
      id: 3,
      code: 'HAPPYHOUR',
      title: 'Khung Giờ Vàng Buổi Trưa (11h - 14h)',
      discountType: 'PERCENT',
      discountValue: 20,
      minBill: 300000, // Đơn từ 300.000 đ
      desc: 'Giảm 20% tiền phòng cho tất cả các đơn đặt phòng trong khung giờ trưa Thứ 2 - Thứ 6.',
      validUntil: '2026-11-30',
      badge: 'GIỜ VÀNG',
      applicableRoomTypes: [1, 2, 3, 4, 5]
    },
    {
      id: 4,
      code: 'TRIAN100K',
      title: 'Voucher Tri Ân Khách Hàng',
      discountType: 'FIXED',
      discountValue: 100000, // Giảm 100k
      minBill: 600000, // Đơn từ 600.000 đ
      desc: 'Giảm trực tiếp 100.000 VNĐ cho hóa đơn tiệc từ 600.000 VNĐ trở lên.',
      validUntil: '2026-12-15',
      badge: 'TIỀN MẶT',
      applicableRoomTypes: [1, 2, 3, 4, 5, 6, 7]
    }
  ],

  // 6. ĐƠN MẪU ĐƯỢC CẬP NHẬT GIÁ MỚI
  orders: [
    {
      id: 'ORD-1001',
      roomId: 201,
      customerName: 'Anh Trần Hoàng',
      phone: '0988123456',
      checkinTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'SERVING',
      promoCode: 'LEVIETVIP',
      items: [
        { id: 1, menuItemId: 5, name: 'Bò Wagyu Nướng Tảng Sốt Tiêu', price: 320000, quantity: 2, status: 'COOKED', note: 'Chín vừa (Medium)' },
        { id: 2, menuItemId: 1, name: 'Salad Rong Biển Trứng Tôm', price: 75000, quantity: 1, status: 'SERVED', note: 'Ít chua' },
        { id: 3, menuItemId: 21, name: 'Rượu Vang Đỏ Chateau Bordeaux', price: 550000, quantity: 1, status: 'COOKING', note: 'Ướp lạnh trước' }
      ]
    }
  ],

  // 7. LỊCH ĐẶT PHÒNG TRƯỚC
  bookings: [
    {
      id: 'BK-501',
      customerName: 'Chị Nguyễn Phương Thảo',
      phone: '0912345678',
      roomTypeId: 1,
      guestCount: 14,
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: '18:30',
      promoCode: 'TIECSINHNHAT',
      note: 'Tiệc sinh nhật công ty, cần phòng trang trí sẵn hoa tươi và bóng bay',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    },
    {
      id: 'BK-502',
      customerName: 'Anh Vũ Đình Trọng',
      phone: '0977889900',
      roomTypeId: 3,
      guestCount: 8,
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: '19:00',
      promoCode: 'LEVIETVIP',
      note: 'Tiếp đối tác quan trọng, chuẩn bị sẵn tủ rượu vang 16 độ',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    }
  ]
};

// ================= CƠ SỞ DỮ LIỆU SINGLETON =================
const DB = {
  init() {
    const currentVer = localStorage.getItem(DB_KEYS.VERSION);
    if (currentVer !== DB_VERSION) {
      this.forceReset();
      localStorage.setItem(DB_KEYS.VERSION, DB_VERSION);
    }
  },

  forceReset() {
    localStorage.setItem(DB_KEYS.ROOM_TYPES, JSON.stringify(SEED_DATA.roomTypes));
    localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(SEED_DATA.rooms));
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(SEED_DATA.categories));
    localStorage.setItem(DB_KEYS.MENU_ITEMS, JSON.stringify(SEED_DATA.menuItems));
    localStorage.setItem(DB_KEYS.PROMOTIONS, JSON.stringify(SEED_DATA.promotions));
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(SEED_DATA.orders));
    localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(SEED_DATA.bookings));
    localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.VERSION, DB_VERSION);
  },

  notifyChange(eventName, data) {
    localStorage.setItem('leviet_last_event', JSON.stringify({ event: eventName, data, timestamp: Date.now() }));
  },

  // ================= ROOM APIS =================
  getRooms() {
    return JSON.parse(localStorage.getItem(DB_KEYS.ROOMS) || '[]');
  },

  getRoomById(id) {
    return this.getRooms().find(r => r.id === Number(id));
  },

  getRoomTypes() {
    return JSON.parse(localStorage.getItem(DB_KEYS.ROOM_TYPES) || '[]');
  },

  getRoomTypeById(id) {
    return this.getRoomTypes().find(t => t.id === Number(id));
  },

  updateRoomStatus(roomId, newStatus, currentOrderId = null) {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.id === Number(roomId));
    if (room) {
      room.status = newStatus;
      if (currentOrderId !== undefined) {
        room.currentOrderId = currentOrderId;
      }
      localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(rooms));
      this.notifyChange('ROOM_STATUS_CHANGED', { roomId, status: newStatus });
    }
  },

  // ================= MENU APIS =================
  getCategories() {
    return JSON.parse(localStorage.getItem(DB_KEYS.CATEGORIES) || '[]');
  },

  getMenuItems() {
    return JSON.parse(localStorage.getItem(DB_KEYS.MENU_ITEMS) || '[]');
  },

  getMenuItemById(id) {
    return this.getMenuItems().find(i => i.id === Number(id));
  },

  saveMenuItem(item) {
    const items = this.getMenuItems();
    if (item.id) {
      const idx = items.findIndex(i => i.id === Number(item.id));
      if (idx !== -1) items[idx] = { ...items[idx], ...item };
    } else {
      item.id = Date.now();
      items.push(item);
    }
    localStorage.setItem(DB_KEYS.MENU_ITEMS, JSON.stringify(items));
    this.notifyChange('MENU_CHANGED', item);
  },

  deleteMenuItem(id) {
    let items = this.getMenuItems();
    items = items.filter(i => i.id !== Number(id));
    localStorage.setItem(DB_KEYS.MENU_ITEMS, JSON.stringify(items));
    this.notifyChange('MENU_CHANGED', { deletedId: id });
  },

  // ================= PROMOTION / ƯU ĐÃI APIS =================
  getPromotions() {
    return JSON.parse(localStorage.getItem(DB_KEYS.PROMOTIONS) || '[]');
  },

  getPromotionByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return this.getPromotions().find(p => p.code.toUpperCase() === cleanCode);
  },

  calculateDiscount(promoCode, totalAmount) {
    const promo = this.getPromotionByCode(promoCode);
    if (!promo) return { valid: false, discountAmount: 0, message: 'Mã ưu đãi không tồn tại.' };

    if (totalAmount < promo.minBill) {
      return { 
        valid: false, 
        discountAmount: 0, 
        message: `Mã ${promo.code} áp dụng cho hóa đơn từ ${promo.minBill.toLocaleString()} đ trở lên.` 
      };
    }

    let discountAmount = 0;
    if (promo.discountType === 'PERCENT') {
      discountAmount = Math.round((totalAmount * promo.discountValue) / 100);
    } else if (promo.discountType === 'FIXED') {
      discountAmount = Math.min(promo.discountValue, totalAmount);
    }

    return {
      valid: true,
      promo,
      discountAmount,
      message: `Áp dụng thành công "${promo.title}" (-${discountAmount.toLocaleString()} đ)`
    };
  },

  // ================= BOOKING APIS =================
  getBookings() {
    return JSON.parse(localStorage.getItem(DB_KEYS.BOOKINGS) || '[]');
  },

  createBooking(bookingData) {
    const bookings = this.getBookings();
    const newBooking = {
      id: 'BK-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
      ...bookingData
    };
    bookings.unshift(newBooking);
    localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notifyChange('NEW_BOOKING', newBooking);
    return newBooking;
  },

  // ================= ORDER & VẬN HÀNH APIS =================
  getOrders() {
    return JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]');
  },

  getOrderById(id) {
    return this.getOrders().find(o => o.id === id);
  },

  getOrderByRoomId(roomId) {
    return this.getOrders().find(o => o.roomId === Number(roomId) && o.status === 'SERVING');
  },

  createOrderForRoom(roomId, customerName = 'Khách tại phòng', phone = '', promoCode = '') {
    const orders = this.getOrders();
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      roomId: Number(roomId),
      customerName,
      phone,
      promoCode,
      checkinTime: new Date().toISOString(),
      status: 'SERVING',
      items: []
    };
    orders.unshift(newOrder);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));

    this.updateRoomStatus(roomId, 'OCCUPIED', newOrder.id);
    this.notifyChange('ORDER_CREATED', newOrder);
    return newOrder;
  },

  addItemsToOrder(orderId, itemsToAdd) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    itemsToAdd.forEach(item => {
      const existing = order.items.find(i => i.menuItemId === item.menuItemId && i.status === 'PENDING');
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        order.items.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          note: item.note || '',
          status: 'PENDING'
        });
      }
    });

    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyChange('ORDER_UPDATED', order);
    return order;
  },

  updateDishStatus(orderId, orderItemId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const item = order.items.find(i => i.id === Number(orderItemId));
    if (item) {
      item.status = newStatus;
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
      this.notifyChange('DISH_STATUS_CHANGED', { orderId, orderItemId, status: newStatus });
    }
  },

  // ================= CHECKOUT & THANH TOÁN =================
  checkoutRoom(roomId, paymentMethod = 'VIETQR', appliedPromoCode = '') {
    const room = this.getRoomById(roomId);
    if (!room || !room.currentOrderId) return null;

    const orders = this.getOrders();
    const order = orders.find(o => o.id === room.currentOrderId);
    if (!order) return null;

    const roomType = this.getRoomTypeById(room.typeId);
    const checkoutTime = new Date();
    const checkinTime = new Date(order.checkinTime);
    const diffHours = Math.max(1, Math.ceil((checkoutTime - checkinTime) / (1000 * 60 * 60)));
    const roomFee = (roomType.hourlyRate || 0) * diffHours;

    const foodTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const subTotal = foodTotal + roomFee;

    const promoCodeToUse = appliedPromoCode || order.promoCode || '';
    const discountResult = this.calculateDiscount(promoCodeToUse, subTotal);
    const discountAmount = discountResult.valid ? discountResult.discountAmount : 0;
    const finalTotal = Math.max(0, subTotal - discountAmount);

    const invoice = {
      invoiceId: 'INV-' + Math.floor(100000 + Math.random() * 900000),
      orderId: order.id,
      roomId: room.id,
      roomName: room.name,
      customerName: order.customerName,
      checkinTime: order.checkinTime,
      checkoutTime: checkoutTime.toISOString(),
      hoursUsed: diffHours,
      roomRate: roomType.hourlyRate,
      roomFee,
      foodTotal,
      subTotal,
      promoCode: discountResult.valid ? promoCodeToUse : null,
      discountAmount,
      totalAmount: finalTotal,
      paymentMethod,
      items: [...order.items],
      createdAt: checkoutTime.toISOString()
    };

    const invoices = JSON.parse(localStorage.getItem(DB_KEYS.INVOICES) || '[]');
    invoices.unshift(invoice);
    localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify(invoices));

    order.status = 'COMPLETED';
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));

    // Chuyển sang CẦN DỌN DẸP
    this.updateRoomStatus(roomId, 'NEEDS_CLEANING', null);

    this.notifyChange('ROOM_CHECKOUT', invoice);
    return invoice;
  },

  startCleaningRoom(roomId) {
    this.updateRoomStatus(roomId, 'CLEANING');
  },

  finishCleaningRoom(roomId) {
    this.updateRoomStatus(roomId, 'AVAILABLE', null);
  },

  getStats() {
    const invoices = JSON.parse(localStorage.getItem(DB_KEYS.INVOICES) || '[]');
    const rooms = this.getRooms();
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const servingRoomsCount = rooms.filter(r => r.status === 'OCCUPIED').length;
    const cleaningRoomsCount = rooms.filter(r => r.status === 'NEEDS_CLEANING' || r.status === 'CLEANING').length;
    const availableRoomsCount = rooms.filter(r => r.status === 'AVAILABLE').length;

    return {
      totalRevenue,
      invoiceCount: invoices.length,
      servingRoomsCount,
      cleaningRoomsCount,
      availableRoomsCount,
      totalRooms: rooms.length
    };
  },

  // ================= EXPORT / IMPORT JSON (CHUYỂN DỮ LIỆU GIỮA CÁC MÁY) =================
  exportAllData() {
    return {
      app: 'LeViet_Restaurant_Management',
      exportedAt: new Date().toISOString(),
      version: DB_VERSION,
      data: {
        roomTypes: this.getRoomTypes(),
        rooms: this.getRooms(),
        categories: this.getCategories(),
        menuItems: this.getMenuItems(),
        promotions: this.getPromotions(),
        bookings: this.getBookings(),
        orders: this.getOrders(),
        invoices: JSON.parse(localStorage.getItem(DB_KEYS.INVOICES) || '[]')
      }
    };
  },

  importAllData(payload) {
    if (!payload || typeof payload !== 'object' || !payload.data) {
      return { success: false, message: 'Định dạng file JSON không hợp lệ hoặc thiếu trường "data".' };
    }

    const d = payload.data;
    if (!Array.isArray(d.rooms) || !Array.isArray(d.menuItems) || !Array.isArray(d.roomTypes)) {
      return { success: false, message: 'File JSON không chứa đủ dữ liệu cốt lõi (rooms, menuItems, roomTypes).' };
    }

    localStorage.setItem(DB_KEYS.ROOM_TYPES, JSON.stringify(d.roomTypes));
    localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(d.rooms));
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(d.categories || SEED_DATA.categories));
    localStorage.setItem(DB_KEYS.MENU_ITEMS, JSON.stringify(d.menuItems));
    localStorage.setItem(DB_KEYS.PROMOTIONS, JSON.stringify(d.promotions || SEED_DATA.promotions));
    localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(d.bookings || []));
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(d.orders || []));
    localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify(d.invoices || []));
    localStorage.setItem(DB_KEYS.VERSION, DB_VERSION);

    this.notifyChange('DATA_IMPORTED', { importedAt: new Date().toISOString() });
    return {
      success: true,
      message: `Nhập thành công ${d.rooms.length} phòng, ${d.menuItems.length} món ăn, ${ (d.orders || []).length } đơn hàng và ${ (d.invoices || []).length } hóa đơn!`
    };
  }
};

// Tự động khởi tạo ngay phiên bản mới
DB.init();
