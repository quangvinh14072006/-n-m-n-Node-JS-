CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Chèn dữ liệu mẫu cho chuyên mục
INSERT INTO categories (name) VALUES ('Thời sự'), ('Thể thao'), ('Công nghệ'), ('Giải trí');

CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    image VARCHAR(255), -- Lưu tên file ảnh như news-1.jpg
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);




INSERT INTO news (title, summary, content, image, category_id) VALUES 
(
    'Đội tuyển Việt Nam thắng lớn tại giải khu vực', 
    'Một chiến thắng kịch tính đến những phút cuối cùng của trận đấu.', 
    '<p>Nội dung chi tiết về trận đấu bóng đá...</p>', 
    'news-800x500-1.jpg', 
    2 -- ID của chuyên mục Thể thao
),
(
    'Công nghệ AI đang thay đổi thế giới như thế nào?', 
    'Trí tuệ nhân tạo không còn là phim viễn tưởng mà đang đi vào đời sống.', 
    '<p>Các ứng dụng của AI trong y tế, giáo dục và sản xuất...</p>', 
    'news-800x500-2.jpg', 
    3 -- ID của chuyên mục Công nghệ
),
(
    'Khai mạc lễ hội văn hóa tại thủ đô', 
    'Hàng ngàn người dân và du khách đã đổ về tham gia lễ hội.', 
    '<p>Không khí nhộn nhịp của buổi lễ khai mạc sáng nay...</p>', 
    'news-800x500-3.jpg', 
    4 -- ID của chuyên mục Giải trí
),
(
    'Dự báo thời tiết tuần tới: Nắng nóng gay gắt', 
    'Người dân cần chú ý giữ gìn sức khỏe trong những ngày tới.', 
    '<p>Thông tin chi tiết về nhiệt độ tại các tỉnh thành...</p>', 
    'news-800x500-4.jpg', 
    1 -- ID của chuyên mục Thời sự
);