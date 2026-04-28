const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", //Địa chỉ máy chủ chứa Database (thường là localhost)
  user: process.env.DB_USER || "root", //Tên tài khoản MySQL (mặc định là root).
  password: process.env.DB_PASS || "", //Mật khẩu (thường để trống nếu dùng XAMPP).
  database: process.env.DB_NAME || "quanly",
  connectionLimit: 10, //Số lượng kết nối tối đa có thể chạy cùng lúc
});

pool.on("connection", () => {});
module.exports = pool;
  