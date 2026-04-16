/**
 * Route phía khách: trang chủ, tin tức, liên hệ, đăng ký nhận tin, v.v.
 */
const express = require("express");
const router = express.Router();

const homeController = require("../controllers/public/homeController");
const newsController = require("../controllers/public/newsController");
const contactController = require("../controllers/public/contactController");
const subscriberController = require("../controllers/public/subscriberController");

router.get(["/", "/home"], homeController.index);
router.get("/danh-muc", homeController.categoriesIndex);

router.get("/tin-tuc", newsController.list);
router.get("/bai-viet/:id", newsController.detail);
router.post("/bai-viet/:id/binh-luan", newsController.addComment);

router.get("/lien-he", contactController.contactPage);
router.post("/lien-he", contactController.contactSubmit);
router.post("/lien-he-popup", contactController.contactPopupSubmit);

router.post("/dang-ky-nhan-tin", subscriberController.subscribe);

router.get("/category", (req, res) => res.redirect("/danh-muc"));
router.get("/category/:id", (req, res) =>
  res.redirect(`/tin-tuc?category_id=${req.params.id}`),
);
router.get("/detail/:id", (req, res) =>
  res.redirect(`/bai-viet/${req.params.id}`),
);
router.get("/search", (req, res) => {
  const q = req.query.keyword ? `keyword=${encodeURIComponent(req.query.keyword)}` : "";
  res.redirect(`/tin-tuc${q ? `?${q}` : ""}`);
});

router.get("/login", (req, res) => res.redirect("/admin/login"));

module.exports = router;
