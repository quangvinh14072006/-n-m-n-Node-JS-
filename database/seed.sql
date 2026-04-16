
-- Mật khẩu đăng nhập admin: admin123 (username: admin)

INSERT INTO `website_info` (`id`, `address`, `email`, `phone`, `facebook_link`, `youtube_link`, `copyright_text`)
VALUES (1, '123 Đường ABC, TP.HCM', 'contact@biznews.vn', '0281234567', 'https://facebook.com', 'https://youtube.com', '© 2026 BizNews. Mọi quyền được bảo lưu.')
ON DUPLICATE KEY UPDATE `address`=VALUES(`address`);

INSERT IGNORE INTO `users` (`userid`, `username`, `password`, `fullname`, `role`) VALUES
(1, 'admin', '$2b$10$bvaqRNwKgWn/ez9pV//2mO0NM.I6URpbDksMRgAjChwapIZ/CGFlK', 'Quản trị viên', 1);

INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `status`) VALUES
(1, 'Thời sự', 'thoi-su', 1),
(2, 'Công nghệ', 'cong-nghe', 1),
(3, 'Thể thao', 'the-thao', 1);

INSERT IGNORE INTO `posts` (`id`, `title`, `summary`, `content`, `image`, `views`, `category_id`, `user_id`, `status`) VALUES
(1, 'Chào mừng đến với BizNews', 'Tin tức được cập nhật từ cơ sở dữ liệu.', '<p>Nội dung bài viết <strong>mẫu</strong>. Bạn có thể chỉnh sửa trong trang quản trị với <em>CKEditor</em>.</p>', 'img/news-700x435-1.jpg', 120, 1, 1, 1),
(2, 'Node.js và Express trong thực tế', 'Xây dựng website tin tức với Node.js.', '<p>Express giúp định tuyến và tách lớp MVC rõ ràng.</p>', 'img/news-700x435-2.jpg', 85, 2, 1, 1),
(3, 'Bài nháp (không hiển thị ngoài trang chủ)', 'Chỉ admin thấy khi lọc nháp.', '<p>Nháp</p>', 'img/news-700x435-3.jpg', 0, 1, 1, 0);
