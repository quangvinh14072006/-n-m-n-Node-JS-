const db = require("../../config/db"); //Nhập kết nối từ file db.js
const util = require("util");
const query = util.promisify(db.query).bind(db);

// =============================================
// CÁC HÀM QUẢN LÝ NGƯỜI DÙNG (USER)
// =============================================

//Tìm người dùng theo tên đăng nhập
async function findByUsername(user_name) {
  const rows = await query("SELECT * FROM user WHERE user_name = ?", [user_name]);
  return rows[0] || null;
}

//Tìm người dùng theo ID
async function findByid(user_id) {
  const rows = await query("SELECT * FROM user WHERE user_id = ?", [user_id]);
  return rows[0] || null;
}

//Lấy tất cả người dùng
async function getAllUsers() {
  return await query("SELECT user_id, user_name, fullname, email, role, created_at FROM user ORDER BY user_id ASC");
}

//Thêm người dùng mới
async function createUser(data) {
  return await query(
    "INSERT INTO user (user_name, password, fullname, email, role) VALUES (?, ?, ?, ?, ?)",
    [data.user_name, data.password, data.fullname, data.email || null, data.role || 0]
  );
}

//Cập nhật thông tin người dùng
async function updateUser(user_id, data) {
  return await query(
    "UPDATE user SET fullname=?, email=?, role=? WHERE user_id=?",
    [data.fullname, data.email, data.role, user_id]
  );
}

//Cập nhật (reset) mật khẩu
async function updatePassword(user_id, hashedPassword) {
  return await query("UPDATE user SET password=? WHERE user_id=?", [hashedPassword, user_id]);
}

//Xóa người dùng
async function deleteUser(user_id) {
  return await query("DELETE FROM user WHERE user_id=?", [user_id]);
}

module.exports = { findByUsername, findByid, getAllUsers, createUser, updateUser, updatePassword, deleteUser };
