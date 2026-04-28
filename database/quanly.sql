-- Tạo CSDL
CREATE DATABASE IF NOT EXISTS quanly;
USE quanly;

-- =============================================
-- 1. Bảng Người dùng (Users) - Quản lý tài khoản
-- =============================================
CREATE TABLE IF NOT EXISTS `user` (
    `user_id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `role` INT(11) NOT NULL DEFAULT 0, -- 1: Admin, 0: User thường
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 2. Bảng Chuyên mục (Categories) - Chủ đề bài viết
-- =============================================
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) DEFAULT NULL, -- Đường dẫn thân thiện, ví dụ: 'the-thao'
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 3. Bảng Tin tức (News) - Bài viết
-- =============================================
CREATE TABLE IF NOT EXISTS `news` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `summary` TEXT,                    -- Tóm tắt ngắn hiện ở trang chủ
    `content` LONGTEXT,                -- Nội dung chi tiết bài viết
    `image` VARCHAR(255),              -- Lưu tên file ảnh
    `category_id` INT,                 -- Khóa ngoại nối với bảng categories
    `author` VARCHAR(255) DEFAULT 'Admin', -- Tác giả bài viết
    `status` TINYINT(1) DEFAULT 1,     -- 1: Hiển thị, 0: Ẩn
    `views` INT DEFAULT 0,             -- Số lượt xem
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 4. Bảng Liên hệ (Contacts) - Lưu thông tin liên hệ
-- =============================================
CREATE TABLE IF NOT EXISTS `contacts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `subject` VARCHAR(255) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `status` TINYINT(1) DEFAULT 0,     -- 0: Chưa duyệt, 1: Đã duyệt
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 5. Bảng Bình luận (Comments) - Bình luận bài viết
-- =============================================
CREATE TABLE IF NOT EXISTS `comments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `news_id` INT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 6. Bảng Đăng ký nhận tin (Subscribers)
-- =============================================
CREATE TABLE IF NOT EXISTS `subscribers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 7. Bảng Thông tin website (Website Info) - Footer
-- =============================================
CREATE TABLE IF NOT EXISTS `website_info` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `site_name` VARCHAR(255) DEFAULT 'BizNews',
    `address` VARCHAR(255) DEFAULT '123 Đường ABC, TP.HCM',
    `phone` VARCHAR(20) DEFAULT '0123 456 789',
    `email` VARCHAR(255) DEFAULT 'info@biznews.com',
    `facebook` VARCHAR(255) DEFAULT '#',
    `youtube` VARCHAR(255) DEFAULT '#',
    `twitter` VARCHAR(255) DEFAULT '#',
    `instagram` VARCHAR(255) DEFAULT '#',
    `copyright` TEXT DEFAULT 'BizNews. All Rights Reserved.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- DỮ LIỆU MẪU
-- =============================================

-- Thêm tài khoản admin (mật khẩu: 123456 đã mã hóa bcrypt)
INSERT INTO `user` (`user_name`, `password`, `fullname`, `email`, `role`) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Quản trị viên', 'admin@biznews.com', 1);

-- Thêm chuyên mục
INSERT INTO `categories` (`name`, `slug`) VALUES
('Công nghệ', 'cong-nghe'),
('Thể thao', 'the-thao'),
('Giải trí', 'giai-tri'),
('Kinh doanh', 'kinh-doanh'),
('Sức khỏe', 'suc-khoe'),
('Giáo dục', 'giao-duc');

-- Thêm bài viết mẫu
INSERT INTO `news` (`title`, `summary`, `content`, `image`, `category_id`, `author`, `status`, `views`) VALUES
('AI và tương lai của công nghệ', 'Trí tuệ nhân tạo đang thay đổi mọi lĩnh vực trong cuộc sống, từ y tế đến giáo dục.', '<p>Trí tuệ nhân tạo (AI) đang trở thành một trong những công nghệ quan trọng nhất của thế kỷ 21. Từ việc hỗ trợ chẩn đoán bệnh trong y tế, tối ưu hóa quy trình sản xuất trong công nghiệp, đến việc cá nhân hóa trải nghiệm học tập trong giáo dục.</p><p>Các chuyên gia dự đoán rằng AI sẽ tạo ra hàng triệu việc làm mới trong thập kỷ tới, đồng thời cũng đặt ra những thách thức về đạo đức và quyền riêng tư mà xã hội cần phải đối mặt.</p>', 'news-700x435-4.jpg', 1, 'Admin', 1, 150),
('Giải bóng đá Việt Nam mùa 2026', 'Những thông tin mới nhất về giải bóng đá vô địch quốc gia V-League 2026.', '<p>Mùa giải V-League 2026 hứa hẹn sẽ mang đến nhiều trận đấu hấp dẫn và kịch tính. Các đội bóng đã tích cực bổ sung lực lượng trong kỳ chuyển nhượng mùa đông.</p><p>Đặc biệt, sự xuất hiện của nhiều cầu thủ trẻ tài năng từ lứa U23 sẽ mang lại luồng gió mới cho giải đấu.</p>', 'news-800x500-3.png', 2, 'Admin', 1, 230),
('Top phim hay nhất 2026', 'Điểm qua những bộ phim được mong đợi nhất trong năm 2026.', '<p>Năm 2026 hứa hẹn là một năm bùng nổ của điện ảnh với nhiều bom tấn được phát hành. Từ các phim siêu anh hùng đến các tác phẩm nghệ thuật đoạt giải Oscar.</p><p>Danh sách phim đáng chú ý bao gồm cả phim Việt Nam và phim quốc tế, phục vụ đa dạng sở thích của khán giả.</p>', 'news-700x435-4.jpg', 3, 'Admin', 1, 180),
('Xu hướng khởi nghiệp 2026', 'Những lĩnh vực khởi nghiệp tiềm năng trong năm 2026 và các bí quyết thành công.', '<p>Khởi nghiệp trong lĩnh vực công nghệ xanh, fintech và healthtech đang là những xu hướng nổi bật nhất năm 2026. Nhiều startup Việt Nam đã thành công gọi vốn từ các quỹ đầu tư quốc tế.</p><p>Bài viết phân tích chi tiết các cơ hội và thách thức cho các nhà khởi nghiệp trẻ.</p>', 'news-800x500-3.png', 4, 'Admin', 1, 95),
('Bí quyết sống khỏe mỗi ngày', 'Những thói quen đơn giản giúp bạn duy trì sức khỏe tốt và tinh thần minh mẫn.', '<p>Sức khỏe là tài sản quý giá nhất. Bài viết chia sẻ 10 thói quen đơn giản nhưng hiệu quả giúp bạn duy trì sức khỏe tốt: từ chế độ ăn uống, tập luyện đến giấc ngủ.</p><p>Các chuyên gia y tế khuyến cáo mỗi người nên dành ít nhất 30 phút mỗi ngày cho hoạt động thể chất.</p>', 'news-700x435-4.jpg', 5, 'Admin', 1, 320),
('Cách mạng giáo dục trực tuyến', 'Giáo dục trực tuyến đang thay đổi cách chúng ta học tập và phát triển kỹ năng.', '<p>Đại dịch đã thúc đẩy sự phát triển vượt bậc của giáo dục trực tuyến. Các nền tảng học trực tuyến như Coursera, Udemy và các trường đại học trực tuyến đã thu hút hàng triệu học viên.</p><p>Xu hướng học tập kết hợp (blended learning) đang trở nên phổ biến, kết hợp ưu điểm của cả học trực tuyến và trực tiếp.</p>', 'news-800x500-3.png', 6, 'Admin', 1, 275),
('Blockchain và tiền điện tử', 'Tìm hiểu về công nghệ blockchain và tương lai của tiền điện tử.', '<p>Blockchain không chỉ là nền tảng của tiền điện tử mà còn có nhiều ứng dụng trong logistics, y tế, và quản lý chuỗi cung ứng.</p><p>Các chính phủ trên thế giới đang dần có những khung pháp lý rõ ràng hơn cho tiền điện tử và công nghệ blockchain.</p>', 'news-700x435-4.jpg', 1, 'Admin', 1, 190),
('Olympic 2028 - Những kỳ vọng', 'Olympic Los Angeles 2028 hứa hẹn mang đến những khoảnh khắc thể thao đáng nhớ.', '<p>Olympic 2028 tại Los Angeles đang được chuẩn bị kỹ lưỡng với nhiều môn thể thao mới được bổ sung. Đoàn thể thao Việt Nam đang tích cực tập luyện với mục tiêu giành huy chương.</p>', 'news-800x500-3.png', 2, 'Admin', 1, 145),
('Ẩm thực Việt Nam vươn tầm thế giới', 'Phở, bánh mì và nhiều món ăn Việt Nam đang được thế giới yêu thích.', '<p>Ẩm thực Việt Nam ngày càng được thế giới công nhận và yêu thích. Nhiều nhà hàng Việt Nam ở nước ngoài đã nhận được sao Michelin, khẳng định vị thế của ẩm thực Việt trên bản đồ ẩm thực thế giới.</p>', 'news-700x435-4.jpg', 3, 'Admin', 1, 400);

-- Thêm thông tin website
INSERT INTO `website_info` (`site_name`, `address`, `phone`, `email`, `facebook`, `youtube`, `copyright`) VALUES
('BizNews', '123 Đường Nguyễn Văn A, Quận 1, TP.HCM', '0123 456 789', 'info@biznews.com', 'https://facebook.com/biznews', 'https://youtube.com/biznews', '© 2026 BizNews. All Rights Reserved.');

-- Thêm subscriber mẫu
INSERT INTO `subscribers` (`email`) VALUES
('user1@gmail.com'),
('user2@gmail.com');

-- Thêm bình luận mẫu
INSERT INTO `comments` (`news_id`, `email`, `content`) VALUES
(1, 'reader@gmail.com', 'Bài viết rất hay và bổ ích!'),
(1, 'tech@gmail.com', 'Cảm ơn tác giả đã chia sẻ thông tin hữu ích.');
