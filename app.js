/**
 * Điểm vào ứng dụng (theo kiểu Express trong giáo trình / chap0304):
 * 1) Cấu hình view tĩnh, EJS, đọc form (body-parser)
 * 2) Session cho đăng nhập admin
 * 3) Gắn route khách (/) và route quản trị (/admin)
 */
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");

const { loadPublicLocals } = require("./middleware/localsMiddleware");
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-quanlybaiviet-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  }),
);

app.use(loadPublicLocals);

app.use("/", publicRoutes);
app.use("/admin", adminRoutes);

app.use((err, req, res, next) => {
  if (err && err.message === "Chỉ chấp nhận file ảnh") {
    req.session.flash = { type: "danger", text: err.message };
    return res.redirect(req.get("referer") || "/admin/posts");
  }
  console.error(err);
  res.status(500).send("Lỗi máy chủ. Kiểm tra kết nối CSDL và migration.");
});

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Admin:  http://localhost:${PORT}/admin/login`);
});
