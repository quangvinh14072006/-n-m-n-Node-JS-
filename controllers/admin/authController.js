const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");

function loginForm(req, res) {
  const user = req.session && req.session.user;
  if (user && user.role === 1) {
    return res.redirect("/admin");
  }
  res.render("admin/login", { error: null });
}

async function loginSubmit(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await userModel.findByUsername(username);
    if (!user || user.role !== 1) {
      return res.render("admin/login", {
        error: "Sai tên đăng nhập hoặc không có quyền quản trị.",
      });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.render("admin/login", {
        error: "Sai mật khẩu.",
      });
    }
    req.session.user = {
      userid: user.userid,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
    };
    res.redirect("/admin");
  } catch (e) {
    next(e);
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
}

module.exports = { loginForm, loginSubmit, logout };
