const db = require("../../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// =============================================
// CÁC HÀM QUẢN LÝ CHUYÊN MỤC (CATEGORIES)
// =============================================

//Lấy tất cả chuyên mục
async function getAllCategories() {
  return await query("SELECT * FROM categories ORDER BY id ASC");
}

//Tìm chuyên mục theo ID
async function getCategoryById(id) {
  const rows = await query("SELECT * FROM categories WHERE id = ?", [id]);
  return rows[0] || null;
}

//Thêm chuyên mục mới
async function createCategory(data) {
  return await query(
    "INSERT INTO categories (name, slug) VALUES (?, ?)",
    [data.name, data.slug || null]
  );
}

//Cập nhật chuyên mục
async function updateCategory(id, data) {
  return await query(
    "UPDATE categories SET name=?, slug=? WHERE id=?",
    [data.name, data.slug || null, id]
  );
}

//Xóa chuyên mục
async function deleteCategory(id) {
  return await query("DELETE FROM categories WHERE id=?", [id]);
}

//Đếm số bài viết trong chuyên mục (dùng để kiểm tra trước khi xóa)
async function countNewsByCategory(id) {
  const rows = await query("SELECT COUNT(*) AS total FROM news WHERE category_id=?", [id]);
  return rows[0].total;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  countNewsByCategory,
};
