const express = require("express");
const router = express.Router();

const homeController = require("../controllers/client/homeController");
const newsController = require("../controllers/client/newsController");

// =============================================
// ROUTES PHÍA NGƯỜI DÙNG (PUBLIC)
// =============================================

//Trang chủ
router.get(["/", "/home"], homeController.renderHomePage);

//Trang danh sách tin tức (có tìm kiếm, phân trang)
router.get("/tin-tuc", homeController.getNewsPage);

//Trang tin tức theo chuyên mục
router.get("/chuyen-muc/:id", homeController.getNewsPage);

//Trang chi tiết bài viết
router.get("/tin-tuc/:id", newsController.renderDetailPage);

//Gửi bình luận bài viết
router.post("/tin-tuc/:id/binh-luan", newsController.submitComment);

//Trang liên hệ
router.get("/lien-he", homeController.getContactPage);

//Xử lý gửi form liên hệ
router.post("/lien-he", homeController.submitContact);

//Đăng ký nhận tin (subscribe)
router.post("/subscribe", homeController.subscribe);

module.exports = router;
