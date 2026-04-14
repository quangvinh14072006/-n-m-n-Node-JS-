const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mysql = require("mysql");
const indexRouter = require("./routes/home");
const path = require("path");

app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "admin"),
]);

//Khai báo engine và thư mục public
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "admin"),
]);

app.use(express.static("public"));

//Đọc dữ liệu from
app.use(bodyParser.urlencoded({ extended: true }));

//Định nghĩa router
app.use("/", indexRouter);

//Gọi listen chạy
app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
  console.log("Admin: http://localhost:3000/login");
});
