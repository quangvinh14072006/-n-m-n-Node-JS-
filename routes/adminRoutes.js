/**
 * Route quản trị: /admin/...
 * Các URL sau middleware requireAdmin chỉ vào được khi đã đăng nhập (role = 1).
 */
const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const authController = require("../controllers/admin/authController");
const dashboardController = require("../controllers/admin/dashboardController");
const userAdminController = require("../controllers/admin/userAdminController");
const categoryAdminController = require("../controllers/admin/categoryAdminController");
const postAdminController = require("../controllers/admin/postAdminController");
const contactAdminController = require("../controllers/admin/contactAdminController");
const subscriberAdminController = require("../controllers/admin/subscriberAdminController");
const websiteAdminController = require("../controllers/admin/websiteAdminController");

router.get("/login", authController.loginForm);
router.post("/login", authController.loginSubmit);
router.get("/logout", authController.logout);

const protectedRouter = express.Router();
protectedRouter.use(requireAdmin);
protectedRouter.use((req, res, next) => {
  res.locals.currentUser = req.session.user || {};
  next();
});

protectedRouter.get("/", dashboardController.index);

protectedRouter.get("/users", userAdminController.list);
protectedRouter.get("/users/create", userAdminController.createForm);
protectedRouter.post("/users/create", userAdminController.createSubmit);
protectedRouter.get("/users/:id/edit", userAdminController.editForm);
protectedRouter.post("/users/:id/edit", userAdminController.editSubmit);
protectedRouter.post("/users/:id/delete", userAdminController.remove);

protectedRouter.get("/categories", categoryAdminController.list);
protectedRouter.get("/categories/create", categoryAdminController.createForm);
protectedRouter.post("/categories/create", categoryAdminController.createSubmit);
protectedRouter.get("/categories/:id/edit", categoryAdminController.editForm);
protectedRouter.post("/categories/:id/edit", categoryAdminController.editSubmit);
protectedRouter.post("/categories/:id/delete", categoryAdminController.remove);

protectedRouter.get("/posts", postAdminController.list);
protectedRouter.get("/posts/create", postAdminController.createForm);
protectedRouter.post(
  "/posts/create",
  upload.single("image"),
  postAdminController.createSubmit,
);
protectedRouter.get("/posts/:id/edit", postAdminController.editForm);
protectedRouter.post(
  "/posts/:id/edit",
  upload.single("image"),
  postAdminController.editSubmit,
);
protectedRouter.post("/posts/:id/delete", postAdminController.remove);

protectedRouter.get("/contacts", contactAdminController.list);
protectedRouter.get("/contacts/:id", contactAdminController.detail);
protectedRouter.post("/contacts/:id/status", contactAdminController.setStatus);

protectedRouter.get("/subscribers", subscriberAdminController.list);

protectedRouter.get("/website", websiteAdminController.editForm);
protectedRouter.post("/website", websiteAdminController.editSubmit);

router.use(protectedRouter);

module.exports = router;
