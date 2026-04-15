// Xử lý logic Đăng nhập/Đăng xuất
const User = require("../models/userModel");
const authController = {
  //Render giao diện đăng nhập
  getLogin: (req, res) => {
    res.render("login-layout", { content: "login" });
  },
  //Xử lý khi người dùng ấn nút đăng nhập
  postLogin: (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //Gọi hàm từ Model truy vấn SQL
    User.findByUsernameAndPassword(username, password, (err, userResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi Server");
      }
      //Nếu tìm thấy tài khoản mảng kết quả sẽ > 0
      if (userResult.length > 0) {
        //Lưu session
        req.session.isAdmin = true;
        req.session.user = userResult[0]; //Lưu thông tin user hiển thị lên góc phải
        return res.redirect("/admin/dashboard");
        return res.redirect(
          "/login?error=" +
            encodeURIComponent("Tài khoản của bạn không có quyền Admin"),
        );
      } else {
        //Đăng nhập thất bại
        return res.redirect(
          "/login?error=" +
            encodeURIComponent("Tên đăng nhập hoặc mật khẩu không đúng"),
        );
      }
    });
  },
  //Xử lý đăng xuất
  logout: (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  },
};
module.exports = authController;
