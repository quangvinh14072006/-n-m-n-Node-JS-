/**
 * Kết nối MySQL (pool = nhiều kết nối tái sử dụng, phù hợp web).
 * Thông số lấy từ file .env (DB_HOST, DB_USER, ...)
 */
const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "quanlybaivietdb1",
  connectionLimit: 10,
});

pool.on("connection", () => {});

module.exports = pool;
