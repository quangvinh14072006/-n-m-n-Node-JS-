const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModels");

// =============================================
// CONTROLLER XÁC THỰC (AUTH) - ĐĂNG NHẬP / ĐĂNG XUẤT
// =============================================

//Hiển thị form đăng nhập
function loginForm(req, res) {
  res.render("admin/pages/login", { error: null });
}

//Xử lý đăng nhập
async function loginProcess(req, res) {
  const { user_name, password } = req.body;

  //Tìm user trong database
  const user = await userModel.findByUsername(user_name);

  if (user) {
    //So sánh mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      //Lưu thông tin user vào session
      req.session.user = user;
      return res.redirect("/admin/dashboard");
    }
  }

  //Nếu thất bại, quay lại trang login với thông báo lỗi
  res.render("admin/pages/login", { error: "Sai tên tài khoản hoặc mật khẩu!" });
}

//Đăng xuất
function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/admin/dang-nhap");
  });
}

// =============================================
// MIDDLEWARE KIỂM TRA ĐĂNG NHẬP
// =============================================

//Kiểm tra xem user đã đăng nhập và có quyền admin chưa
function isLogin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 1) {
    return next(); //Cho phép đi tiếp
  }
  //Nếu chưa đăng nhập, chuyển về trang login
  res.redirect("/admin/dang-nhap");
}

module.exports = { loginForm, loginProcess, logout, isLogin };
