const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");

function isAdminSession(sessionUser) {
  return Boolean(sessionUser && sessionUser.role === 1);
}

function loginForm(req, res) {
  const currentUser = req.session && req.session.user;
  if (isAdminSession(currentUser)) {
    return res.redirect("/admin");
  }
  res.render("admin/login", { error: null });
}

async function loginSubmit(req, res, next) {
  try {
    const { username, password } = req.body;
    const foundUser = await userModel.findByUsername(username);

    if (!isAdminSession(foundUser)) {
      return res.render("admin/login", {
        error: "Sai tên đăng nhập hoặc không có quyền quản trị.",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, foundUser.password);
    if (!isCorrectPassword) {
      return res.render("admin/login", {
        error: "Sai mật khẩu.",
      });
    }

    req.session.user = {
      userid: foundUser.userid,
      username: foundUser.username,
      fullname: foundUser.fullname,
      role: foundUser.role,
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
