const db = require("../config/database"); // Đảm bảo bạn đã tách file kết nối db như mình hướng dẫn trước đó

const authMiddleware = {
  // 1. Middleware lấy danh mục (Dùng cho tất cả các trang)
  loadMenu: (req, res, next) => {
    res.locals.path = req.path;
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Lỗi lấy danh mục menu:", err);
        return next();
      }
      res.locals.allCategories = result; // Truyền dữ liệu vào EJS
      next(); // Cho phép đi tiếp
    });
  },

  // 2. Middleware bảo vệ trang Admin (Chặn người lạ vào dashboard)
  isAdmin: (req, res, next) => {
    if (req.session && req.session.isAdmin) {
      next(); // Nếu là admin thì cho vào
    } else {
      res.redirect(
        "/login?error=" + encodeURIComponent("Bạn cần đăng nhập quyền Admin"),
      );
    }
  },
};

module.exports = authMiddleware;
