const bodyParser = require("body-parser");
const express = require("express");
const app = express();

//Khai báo engine và thư mục public
app.set("view engine", "ejs");
app.use(express.static("public"));

//Đọc dữ liệu from
app.use(bodyParser.urlencoded({ extended: true }));

//Route Trang chủ
app.get("/", (req, res) => {
  //Gọi layout.ejs và nhúng file index.ejs vào giữa
  res.render("layout", { content: "index.ejs" });
});

//Route chi tiết
app.get("/single", (req, res) => {
  res.render("layout", { content: "single.ejs" });
});
app.listen(3000, () => {
  console.log("Server đang chạy tại http://localhost:3000");
});
