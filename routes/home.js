const express = require("express");
const app = express();
const router = express.Router();
const mysql = require("mysql");

//Kết nối database
//Tạo kết nối database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quanlybaivietdb", // Tên database
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

// Middleware để trang nào cũng có dữ liệu categories:(Hàm này phải chạy trước tất cả Route khác)
router.use((req, res, next) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi lấy danh mục menu:", err);
      return next(); // Vẫn cho phép chạy tiếp dù lỗi để tránh treo server
    }
    res.locals.allCategories = result; // Lưu vào biến toàn cục của EJS
    next(); // Quan trọng: Phải có lệnh này để đi tiếp đến các route bên dưới
  });
});

//Render home
//Route Trang chủ
router.get(["/", "/home"], (req, res) => {
  const sql = "SELECT * FROM categories";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi:", err);
      return res.status(500).send("Lỗi kết nối CSDL");
    }
    // render LAYOUT, sau đó truyền INDEX và DATA vào
    res.render("layout", {
      content: "index", // Tên file muốn nhúng (không cần đuôi .ejs)
      news: result, // Dữ liệu lấy từ DB
    });
  });
});

// Render login
router.get("/login", (req, res) => {
  res.render("login-layout", {
    content: "login",
  });
});

//Render category
router.get("/category", (req, res) => {
  res.render("layout", {
    content: "category",
  });
});

//Render single
router.get("/single-news", (req, res) => {
  res.render("layout", {
    content: "single",
  });
});

//Render Contact
router.get("/contact", (req, res) => {
  res.render("layout", {
    content: "contact",
  });
});

//Lọc bài viết category
router.get("/category/:id", (req, res) => {
  const cateId = req.params.id;
  //Truy vấn SQL lọc bài viết
  const sql = "SELECT * FROM posts where category_id = ?";
  // Gọi db.query, sau đó render ra file EJS và truyền danh sách bài viết sang.
  db.query(sql, [cateId], (err, result) => {
    if (err) throw err;
    res.render("layout", {
      content: "category", // File hiển thị danh sách bài viết
      posts: result, // Danh sách bài đã lọc
      cateId: cateId, // Để biết đang ở danh mục nào
    });
  });
});

//Render detail
router.get("/detail/:id", (req, res) => {
  //Lấy id từ link trang web
  const id = req.params.id;

  //Truy vấn đúng bài viết từ database đó
  const sql = "SELECT * FROM categories WHERE id = " + id;

  db.query(sql, (err, result) => {
    if (err) throw err;

    //Render file chi tiết
    res.render("layout", {
      content: "single", //Nội dung nhúng vào file layout là trang single
      baiviet: result[0], //Gửi dữ liệu của bài viết tìm được sang trang chi tiết
    });
  });
});

//Xử lý thanh tìm kiếm
router.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const sql = "SELECT * FROM posts WHERE title LIKE ?";

  db.query(sql, [`%${keyword}%`], (err, result) => {
    if (err) throw err;
    res.render("layout", {
      content: "index",
      news: result,
      title: "Kết quả tìm kiếm cho: " + keyword,
    });
  });
});

//Route POST
router.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  const sql = "INSERT INTO contacts (name,email,message) VALUES(?,?,?)";

  db.query(sql, [name, email, message], (err, result) => {
    if (err) throw err;
    res.send(
      "<script>alert('Cảm ơn bạn đã liên hệ !');window.location.href='/contact';</script>",
    );
  });
});
module.exports = router;
