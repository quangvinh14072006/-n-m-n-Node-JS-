const express = require("express");
const router = express.Router();
const homeController = require("../controllers/client/homeController");
const newsController = require("../controllers/client/newsController");

//Trang chủ
router.get("/", homeController.RenderHome);

//Trang chi tiết bài viết
router.get("/tin-tuc/:id", newsController.RenderGetDetail);
module.exports = router;
