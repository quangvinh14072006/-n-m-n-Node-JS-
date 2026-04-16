const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");

async function list(req, res, next) {
  try {
    const users = await userModel.listAll();
    res.render("admin/layout", {
      content: "users/list",
      pageTitle: "Người dùng",
      users,
      flash: req.session.flash,
    });
    delete req.session.flash;
  } catch (e) {
    next(e);
  }
}

function createForm(req, res) {
  res.render("admin/layout", {
    content: "users/form",
    pageTitle: "Thêm người dùng",
    user: null,
    error: null,
  });
}

async function createSubmit(req, res, next) {
  try {
    const { username, password, fullname, role } = req.body;
    if (!username || !password || !fullname) {
      return res.render("admin/layout", {
        content: "users/form",
        pageTitle: "Thêm người dùng",
        user: null,
        error: "Điền đủ thông tin bắt buộc.",
      });
    }
    const hash = await bcrypt.hash(password, 10);
    await userModel.create({
      username,
      password: hash,
      fullname,
      role: parseInt(role, 10) || 1,
    });
    req.session.flash = { type: "success", text: "Đã tạo người dùng." };
    res.redirect("/admin/users");
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.render("admin/layout", {
        content: "users/form",
        pageTitle: "Thêm người dùng",
        user: null,
        error: "Username đã tồn tại.",
      });
    }
    next(e);
  }
}

async function editForm(req, res, next) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).send("Không tìm thấy");
    res.render("admin/layout", {
      content: "users/form",
      pageTitle: "Sửa người dùng",
      user,
      error: null,
    });
  } catch (e) {
    next(e);
  }
}

async function editSubmit(req, res, next) {
  try {
    const id = req.params.id;
    const { username, fullname, role, new_password } = req.body;
    if (!username || !fullname) {
      const user = await userModel.findById(id);
      return res.render("admin/layout", {
        content: "users/form",
        pageTitle: "Sửa người dùng",
        user,
        error: "Username và họ tên là bắt buộc.",
      });
    }
    await userModel.update(id, {
      username,
      fullname,
      role: parseInt(role, 10) || 1,
    });
    if (new_password && new_password.length >= 6) {
      const hash = await bcrypt.hash(new_password, 10);
      await userModel.updatePassword(id, hash);
    }
    req.session.flash = { type: "success", text: "Đã cập nhật người dùng." };
    res.redirect("/admin/users");
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    if (String(id) === String(req.session.user.userid)) {
      req.session.flash = {
        type: "danger",
        text: "Không thể xóa chính tài khoản đang đăng nhập.",
      };
      return res.redirect("/admin/users");
    }
    await userModel.remove(id);
    req.session.flash = { type: "success", text: "Đã xóa người dùng." };
    res.redirect("/admin/users");
  } catch (e) {
    next(e);
  }
}

module.exports = {
  list,
  createForm,
  createSubmit,
  editForm,
  editSubmit,
  remove,
};
