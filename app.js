const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mysql = require("mysql");

//Khai báo engine và thư mục public
app.set("view engine", "ejs");
app.use(express.static("public"));

//Đọc dữ liệu from
app.use(bodyParser.urlencoded({ extended: true }));

//Tạo kết nối database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
<<<<<<< HEAD
  database: "quanlybaivietdb", // Tên database
=======
  database: "category", // Tên database
>>>>>>> 278526d09ed0fb4e5808317f8549f837b67eb003
});
//Kiểm tra kết nối
db.connect((err) => {
  if (err) {
    console.log("Lỗi kết nối MySQL: ", err);
  } else {
    //Chỉ khi không có lỗi mới render giao diện
    console.log("Kết nối thành công với MySQL!");
  }
});

//Route Trang chủ
app.get("/", (req, res) => {
<<<<<<< HEAD
  const sql = "SELECT * FROM categories";
=======
  const sql = "SELECT * FROM category1";
>>>>>>> 278526d09ed0fb4e5808317f8549f837b67eb003

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi:", err);
      return res.status(500).send("Lỗi kết nối CSDL");
    }

    // render LAYOUT, sau đó truyền INDEX và DATA vào
    res.render("layout", {
      content: "index", // Tên file muốn nhúng (không cần đuôi .ejs)
<<<<<<< HEAD
     news: result, // Dữ liệu lấy từ DB
=======
      news: result, // Dữ liệu lấy từ DB
>>>>>>> 278526d09ed0fb4e5808317f8549f837b67eb003
    });
  });
});

//Route chi tiết
// app.get("/single", (req, res) => {
//   res.render("layout", { cate_text: "single.ejs" });
// });
<<<<<<< HEAD
app.get("/category",(req,res)=>{
  res.render("layout",{
    content:"category"
  });
});
=======

>>>>>>> 278526d09ed0fb4e5808317f8549f837b67eb003
app.get("/detail/:id", (req, res) => {
  //Lấy id từ link trang web
  const id = req.params.id;

  //Truy vấn đúng bài viết từ database đó
<<<<<<< HEAD
  const sql = "SELECT * FROM categories WHERE id = " + id;
=======
  const sql = "SELECT * FROM category1 WHERE cate_id = " + id;
>>>>>>> 278526d09ed0fb4e5808317f8549f837b67eb003

  db.query(sql, (err, result) => {
    if (err) throw err;

    //Render file chi tiết
    res.render("layout", {
      content: "single", //Nội dung nhúng vào file layout là trang single
      baiviet: result[0], //Gửi dữ liệu của bài viết tìm được sang trang chi tiết
    });
  });
});

//Gọi listen chạy
app.listen(3000, () => {
  console.log("Server đang chạy tại http://localhost:3000");
});
