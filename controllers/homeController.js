const db = require("../config/database"); // Đảm bảo file kết nối DB nằm ở đây

const homeController = {
  // Trang chủ
  getHomePage: (req, res) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, result) => {
      if (err) return res.status(500).send("Lỗi kết nối CSDL");
      res.render("layout", { path: "/home", content: "index", news: result });
    });
  },

  // Trang tĩnh Category
  getCategory: (req, res) => {
    res.render("layout", { path: "/category", content: "category" });
  },

  // Trang tĩnh Single News
  getSingleNews: (req, res) => {
    res.render("layout", { path: "/single-news", content: "single" });
  },

  // Trang Liên hệ (GET)
  getContactPage: (req, res) => {
    res.render("layout", { path: "/contact", content: "contact" });
  },

  // Xử lý gửi Form Liên hệ (POST)
  postContact: (req, res) => {
    const { name, email, message } = req.body;
    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
      if (err) throw err;
      res.send(
        "<script>alert('Cảm ơn bạn đã liên hệ !');window.location.href='/contact';</script>",
      );
    });
  },

  // Lọc bài viết theo danh mục
  getCategoryPage: (req, res) => {
    const cateId = req.params.id;
    const sql = "SELECT * FROM posts WHERE category_id = ?";
    db.query(sql, [cateId], (err, result) => {
      if (err) throw err;
      res.render("layout", {
        content: "category",
        posts: result,
        cateId: cateId,
        path: "/category",
      });
    });
  },

  // Chi tiết bài viết (ĐÃ SỬA LỖI SQL)
  getDetailPage: (req, res) => {
    const id = req.params.id;
    // Sửa categories thành posts
    const sql = "SELECT * FROM posts WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.render("layout", {
        content: "single",
        baiviet: result[0],
        path: "/detail",
      });
    });
  },

  // Tìm kiếm bài viết
  searchPosts: (req, res) => {
    const keyword = req.query.keyword;
    const sql = "SELECT * FROM posts WHERE title LIKE ?";
    db.query(sql, [`%${keyword}%`], (err, result) => {
      if (err) throw err;
      res.render("layout", {
        path: "/home",
        content: "index",
        news: result,
        title: "Kết quả tìm kiếm cho: " + keyword,
      });
    });
  },
};

module.exports = homeController;
