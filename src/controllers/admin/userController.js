const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModels");

// =============================================
// CONTROLLER QUẢN LÝ NGƯỜI DÙNG (ADMIN)
// =============================================

//Hiển thị danh sách người dùng
async function listUsers(req, res, next) {
  try {
    const users = await userModel.getAllUsers();

    res.render("admin/admin-layout", {
      content: "pages/user-list",
      user: req.session.user,
      users: users,
      success: req.query.success || null,
    });
  } catch (e) {
    next(e);
  }
}

//Xử lý thêm người dùng
async function addUser(req, res, next) {
  try {
    const { user_name, password, fullname, email, role } = req.body;

    //Kiểm tra username đã tồn tại chưa
    const existing = await userModel.findByUsername(user_name);
    if (existing) {
      const users = await userModel.getAllUsers();
      return res.render("admin/admin-layout", {
        content: "pages/user-list",
        user: req.session.user,
        users: users,
        success: "error_exists",
      });
    }

    //Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.createUser({
      user_name, password: hashedPassword, fullname, email, role: role || 0
    });

    res.redirect("/admin/nguoi-dung?success=add");
  } catch (e) {
    console.log("Lỗi thêm người dùng:", e);
    next(e);
  }
}

//Hiển thị form sửa người dùng
async function editUserForm(req, res, next) {
  try {
    const id = req.params.id;
    const [editUser, users] = await Promise.all([
      userModel.findByid(id),
      userModel.getAllUsers(),
    ]);

    if (!editUser) {
      return res.redirect("/admin/nguoi-dung");
    }

    res.render("admin/admin-layout", {
      content: "pages/user-list",
      user: req.session.user,
      users: users,
      editUser: editUser,
      success: null,
    });
  } catch (e) {
    next(e);
  }
}

//Xử lý cập nhật người dùng
async function updateUser(req, res, next) {
  try {
    const id = req.params.id;
    const { fullname, email, role } = req.body;

    await userModel.updateUser(id, { fullname, email, role });
    res.redirect("/admin/nguoi-dung?success=edit");
  } catch (e) {
    console.log("Lỗi cập nhật người dùng:", e);
    next(e);
  }
}

//Xử lý reset mật khẩu (đặt lại thành 123456)
async function resetPassword(req, res, next) {
  try {
    const id = req.params.id;
    const hashedPassword = await bcrypt.hash("123456", 10);
    await userModel.updatePassword(id, hashedPassword);
    res.redirect("/admin/nguoi-dung?success=reset");
  } catch (e) {
    console.log("Lỗi reset mật khẩu:", e);
    next(e);
  }
}

//Xóa người dùng
async function deleteUser(req, res, next) {
  try {
    const id = req.params.id;

    //Không cho phép xóa chính mình
    if (parseInt(id) === req.session.user.user_id) {
      return res.redirect("/admin/nguoi-dung?success=error_self");
    }

    await userModel.deleteUser(id);
    res.redirect("/admin/nguoi-dung?success=delete");
  } catch (e) {
    console.log("Lỗi xóa người dùng:", e);
    next(e);
  }
}

module.exports = {
  listUsers,
  addUser,
  editUserForm,
  updateUser,
  resetPassword,
  deleteUser,
};
