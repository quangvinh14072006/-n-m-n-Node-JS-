const express = require("express");
const app = express();
require("dotenv").config(); //Đọc file .env (chứa cài đặt bí mật)
const PORT = process.env.PORT || 3010;
const path = require("path"); //Thư viện xử lý đường dẫn file
const bodyParser = require("body-parser"); //Đọc dữ liệu từ client

const publicRouter = require("./src/routes/publicRouter");
const adminRouter = require("./src/routes/adminRouter");

app.use(express.static("public")); //Cho phép truy cập file tĩnh (ảnh, CSS, JavaScript) trong thư mục public
app.use(bodyParser.urlencoded({ extended: true })); //Nhận dữ liệu từ form HTML
app.use(bodyParser.json()); //Nhận dữ liệu JSON từ API
app.set("view engine", "ejs");

app.set("views", [path.join(__dirname, "views")]); //views: Thư mục chứa file template .ejs

//Cấu hình session
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "chuoi-bi-mat", //Dùng để mã hóa session ID
    resave: false, // Không lưu lại session nếu không có thay đổi gì
    saveUninitialized: true, // Tạo một session trống ngay cả khi khách chưa đăng nhập
    cookie: { maxAge: 3600000 }, //Session tồn tại trong 1 tiếng (3.600.000 miligiây)
  }),
);

app.use("/", publicRouter); // "Mọi đường dẫn bắt đầu bằng / hãy dùng publicRouter"
app.use("/admin", adminRouter); // "/admin và những gì sau nó hãy dùng adminRouter"

//Xử lý trang 404
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
