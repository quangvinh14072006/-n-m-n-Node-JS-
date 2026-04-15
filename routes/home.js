// routes/home.js
const express = require("express");
const router = express.Router();

// Import Controllers
const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

// Import Middlewares - ĐẢM BẢO TÊN THƯ MỤC LÀ 'middlewares'
const { loadMenu, isAdmin } = require("../middlewares/authMiddleware");

// 1. Áp dụng loadMenu cho tất cả các route công khai
router.use(loadMenu);

// 2. Router liên quan đến đăng nhập
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);

// 3. Router dành cho người dùng
router.get(["/", "/home"], homeController.getHomePage);
router.get("/category", homeController.getCategory);
router.get("/category/:id", homeController.getCategoryPage);
router.get("/single-news", homeController.getSingleNews);
router.get("/detail/:id", homeController.getDetailPage);
router.get("/search", homeController.searchPosts);
router.get("/contact", homeController.getContactPage);
router.post("/contact", homeController.postContact);

// 4. Router dành cho Admin (Có kiểm tra quyền isAdmin)
router.get("/admin/dashboard", isAdmin, adminController.getDashboard);

module.exports = router;
