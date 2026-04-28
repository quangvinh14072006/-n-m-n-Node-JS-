const db = require("../../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// =============================================
// CÁC HÀM QUẢN LÝ ĐĂNG KÝ NHẬN TIN (SUBSCRIBERS)
// =============================================

//Lấy tất cả email đăng ký
async function getAllSubscribers() {
  return await query("SELECT * FROM subscribers ORDER BY created_at DESC");
}

//Thêm email đăng ký mới
async function createSubscriber(email) {
  return await query("INSERT INTO subscribers (email) VALUES (?)", [email]);
}

//Kiểm tra email đã tồn tại chưa
async function findByEmail(email) {
  const rows = await query("SELECT * FROM subscribers WHERE email = ?", [email]);
  return rows[0] || null;
}

//Xóa subscriber
async function deleteSubscriber(id) {
  return await query("DELETE FROM subscribers WHERE id=?", [id]);
}

module.exports = {
  getAllSubscribers,
  createSubscriber,
  findByEmail,
  deleteSubscriber,
};
