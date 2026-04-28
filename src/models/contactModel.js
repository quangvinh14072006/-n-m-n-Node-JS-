const db = require("../../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// =============================================
// CÁC HÀM QUẢN LÝ LIÊN HỆ (CONTACTS)
// =============================================

//Lấy tất cả liên hệ (sắp xếp mới nhất trước)
async function getAllContacts() {
  return await query("SELECT * FROM contacts ORDER BY created_at DESC");
}

//Tìm liên hệ theo ID
async function getContactById(id) {
  const rows = await query("SELECT * FROM contacts WHERE id = ?", [id]);
  return rows[0] || null;
}

//Thêm liên hệ mới (từ form liên hệ của người dùng)
async function createContact(data) {
  return await query(
    "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
    [data.name, data.email, data.phone || null, data.subject || null, data.message]
  );
}

//Cập nhật trạng thái duyệt liên hệ
async function updateContactStatus(id, status) {
  return await query("UPDATE contacts SET status=? WHERE id=?", [status, id]);
}

//Xóa liên hệ
async function deleteContact(id) {
  return await query("DELETE FROM contacts WHERE id=?", [id]);
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContactStatus,
  deleteContact,
};
