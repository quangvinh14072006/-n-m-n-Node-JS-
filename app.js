const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session"); // Đưa lên đầu cho gọn
const path = require("path");
const indexRouter = require("./routes/home");

const app = express();

// 1. Cấu hình View Engine và Folder Views
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "admin"),
]);

// 2. Các Middleware xử lý dữ liệu và file tĩnh
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 3. Cấu hình Session (BẮT BUỘC PHẢI ĐẶT TRƯỚC ROUTER)
app.use(
  session({
    secret: "chuoi_bi_mat_bat_ky",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

// 4. Định nghĩa router (Sau khi đã có Session và BodyParser)
app.use("/", indexRouter);

// 5. Khởi động Server
app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
  console.log("Admin: http://localhost:3000/login");
});
