-- Chạy file này SAU KHI import quanlybaivietdb.sql (MariaDB/MySQL).
-- Một số lệnh có thể báo lỗi nếu cột/bảng đã tồn tại — bỏ qua dòng tương ứng.

-- Bảng đăng ký nhận tin (yêu cầu quản trị newsletter)
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trạng thái xuất bản bài viết: 1 = đã đăng, 0 = nháp
ALTER TABLE `posts` ADD COLUMN `status` tinyint(4) NOT NULL DEFAULT 1;

-- Liên hệ: đủ trường popup + trạng thái duyệt
ALTER TABLE `contacts` ADD COLUMN `phone` varchar(55) NOT NULL DEFAULT '';
ALTER TABLE `contacts` ADD COLUMN `subject` varchar(255) NOT NULL DEFAULT '';
ALTER TABLE `contacts` ADD COLUMN `reviewed` tinyint(1) NOT NULL DEFAULT 0;

-- Footer: dòng bản quyền tùy chỉnh
ALTER TABLE `website_info` ADD COLUMN `copyright_text` varchar(500) NOT NULL DEFAULT '';

-- website_info: cho phép AUTO_INCREMENT (nếu chưa có trong bản dump gốc)
ALTER TABLE `website_info` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
