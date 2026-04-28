const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// =============================================
// CẤU HÌNH MULTER (Upload ảnh)
// =============================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../..", "public/client/img")); //Lưu ảnh vào thư mục public/client/img
  },
  filename: function (req, file, cb) {
    //Đặt tên file: thời gian hiện tại + tên gốc
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

// =============================================
// IMPORT CONTROLLERS
// =============================================
const authController = require("../controllers/admin/authController");
const dashboardController = require("../controllers/admin/dashboardController");
const newsController = require("../controllers/admin/newsController");
const categoryController = require("../controllers/admin/categoryController");
const userController = require("../controllers/admin/userController");
const contactController = require("../controllers/admin/contactController");
const subscriberController = require("../controllers/admin/subscriberController");

// =============================================
// ROUTES ĐĂNG NHẬP / ĐĂNG XUẤT
// =============================================
router.get("/dang-nhap", authController.loginForm);
router.post("/dang-nhap", authController.loginProcess);
router.get("/dang-xuat", authController.logout);

// =============================================
// TẤT CẢ ROUTES BÊN DƯỚI ĐỀU ĐƯỢC BẢO VỆ BỞI isLogin
// =============================================
router.use(authController.isLogin);

// --- DASHBOARD ---
router.get("/dashboard", dashboardController.renderDashboard);

// --- QUẢN LÝ BÀI VIẾT ---
router.get("/bai-viet", newsController.listNews);
router.get("/bai-viet/them", newsController.addNewsForm);
router.post("/bai-viet/them", upload.single("image"), newsController.addNewsProcess);
router.get("/bai-viet/sua/:id", newsController.editNewsForm);
router.post("/bai-viet/sua/:id", upload.single("image"), newsController.editNewsProcess);
router.post("/bai-viet/trang-thai/:id", newsController.toggleStatus);
router.get("/bai-viet/xoa/:id", newsController.deleteNews);

// --- QUẢN LÝ CHUYÊN MỤC ---
router.get("/chuyen-muc", categoryController.listCategories);
router.post("/chuyen-muc/them", categoryController.addCategory);
router.get("/chuyen-muc/sua/:id", categoryController.editCategoryForm);
router.post("/chuyen-muc/sua/:id", categoryController.updateCategory);
router.get("/chuyen-muc/xoa/:id", categoryController.deleteCategory);

// --- QUẢN LÝ NGƯỜI DÙNG ---
router.get("/nguoi-dung", userController.listUsers);
router.post("/nguoi-dung/them", userController.addUser);
router.get("/nguoi-dung/sua/:id", userController.editUserForm);
router.post("/nguoi-dung/sua/:id", userController.updateUser);
router.get("/nguoi-dung/reset/:id", userController.resetPassword);
router.get("/nguoi-dung/xoa/:id", userController.deleteUser);

// --- QUẢN LÝ LIÊN HỆ ---
router.get("/lien-he", contactController.listContacts);
router.get("/lien-he/xem/:id", contactController.viewContact);
router.post("/lien-he/duyet/:id", contactController.approveContact);
router.get("/lien-he/xoa/:id", contactController.deleteContact);

// --- QUẢN LÝ SUBSCRIBER ---
router.get("/subscribers", subscriberController.listSubscribers);
router.get("/subscribers/xoa/:id", subscriberController.deleteSubscriber);

module.exports = router;
