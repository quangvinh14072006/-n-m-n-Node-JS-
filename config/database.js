// Nơi cấu hình kết nối MySQL duy nhất
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quanlybaivietdb", // Tên database
});
db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL: ", err);
  } else {
    console.log("Kết nối thành công với MySQL!");
  }
});

module.exports = db;
