const db = require("../../config/db.js");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// =============================================
// CÁC HÀM TRUY VẤN BÀI VIẾT (NEWS)
// =============================================

//Lấy tất cả bài viết kèm tên chuyên mục, sắp xếp mới nhất
async function getAllNews() {
  return await query(`
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    ORDER BY news.created_at DESC
  `);
}

//Lấy bài viết mới nhất (giới hạn số lượng)
async function getLatestNews(limit = 6) {
  return await query(`
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    ORDER BY news.created_at DESC 
    LIMIT ?
  `, [limit]);
}

//Lấy bài viết xem nhiều nhất (sắp xếp theo ngày tạo nếu chưa có cột views)
async function getMostViewedNews(limit = 6) {
  return await query(`
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    ORDER BY news.created_at DESC 
    LIMIT ?
  `, [limit]);
}

//Lấy bài viết theo chuyên mục (giới hạn số lượng)
async function getNewsByCategoryForHome(categoryId, limit = 4) {
  return await query(`
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    WHERE news.category_id = ?
    ORDER BY news.created_at DESC 
    LIMIT ?
  `, [categoryId, limit]);
}

//Tìm kiếm bài viết theo ID
async function getNewsById(id) {
  const rows = await query(`
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    WHERE news.id = ?
  `, [id]);
  return rows[0] || null;
}

//Tăng lượt xem khi đọc bài viết (bỏ qua nếu chưa có cột views)
async function increaseViews(id) {
  try {
    return await query("UPDATE news SET views = views + 1 WHERE id = ?", [id]);
  } catch (e) {
    // Bỏ qua nếu cột views chưa tồn tại
  }
}

//Lấy bài viết liên quan (cùng chuyên mục, loại trừ bài đang xem)
async function getRelatedNews(categoryId, currentNewsId, limit = 4) {
  return await query(`
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    WHERE news.category_id = ? AND news.id != ?
    ORDER BY news.created_at DESC
    LIMIT ?
  `, [categoryId, currentNewsId, limit]);
}

//Lấy bài viết theo chuyên mục
async function getNewsByCategoryId(categoryId) {
  return await query(`
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    WHERE news.category_id = ?
    ORDER BY news.created_at DESC
  `, [categoryId]);
}

// =============================================
// TÌM KIẾM & PHÂN TRANG (cho trang danh sách tin tức)
// =============================================

//Đếm tổng số bài viết (có lọc theo keyword và category)
async function countNews(keyword, categoryId) {
  let sql = "SELECT COUNT(*) AS total FROM news WHERE 1=1";
  const params = [];

  if (keyword) {
    sql += " AND (title LIKE ? OR summary LIKE ?)";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  if (categoryId) {
    sql += " AND category_id = ?";
    params.push(categoryId);
  }

  const rows = await query(sql, params);
  return rows[0].total;
}

//Lấy bài viết có phân trang (offset, limit) và lọc
async function getNewsPaginated(keyword, categoryId, offset, limit) {
  let sql = `
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    WHERE 1=1
  `;
  const params = [];

  if (keyword) {
    sql += " AND (news.title LIKE ? OR news.summary LIKE ?)";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  if (categoryId) {
    sql += " AND news.category_id = ?";
    params.push(categoryId);
  }

  sql += " ORDER BY news.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  return await query(sql, params);
}

// =============================================
// QUẢN TRỊ BÀI VIẾT (ADMIN)
// =============================================

//Đếm tổng bài viết cho admin
async function countAllNewsAdmin(keyword, categoryId) {
  let sql = "SELECT COUNT(*) AS total FROM news WHERE 1=1";
  const params = [];

  if (keyword) {
    sql += " AND (title LIKE ? OR summary LIKE ?)";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  if (categoryId) {
    sql += " AND category_id = ?";
    params.push(categoryId);
  }

  const rows = await query(sql, params);
  return rows[0].total;
}

//Lấy danh sách bài viết admin có phân trang, tìm kiếm, lọc
async function getAllNewsAdmin(keyword, categoryId, status, offset, limit) {
  let sql = `
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    WHERE 1=1
  `;
  const params = [];

  if (keyword) {
    sql += " AND (news.title LIKE ? OR news.summary LIKE ?)";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  if (categoryId) {
    sql += " AND news.category_id = ?";
    params.push(categoryId);
  }

  sql += " ORDER BY news.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  return await query(sql, params);
}

//Thêm bài viết mới
async function createNews(data) {
  return await query(
    "INSERT INTO news (title, summary, content, image, category_id) VALUES (?, ?, ?, ?, ?)",
    [data.title, data.summary, data.content, data.image, data.category_id]
  );
}

//Cập nhật bài viết
async function updateNews(id, data) {
  let sql = "UPDATE news SET title=?, summary=?, content=?, category_id=?";
  const params = [data.title, data.summary, data.content, data.category_id];

  //Nếu có ảnh mới thì cập nhật ảnh
  if (data.image) {
    sql += ", image=?";
    params.push(data.image);
  }

  sql += " WHERE id=?";
  params.push(id);

  return await query(sql, params);
}

//Cập nhật trạng thái bài viết (ẩn/hiện) - bỏ qua nếu chưa có cột
async function updateNewsStatus(id, status) {
  try {
    return await query("UPDATE news SET status = ? WHERE id = ?", [status, id]);
  } catch (e) {
    // Bỏ qua nếu cột status chưa tồn tại
  }
}

//Xóa bài viết
async function deleteNews(id) {
  return await query("DELETE FROM news WHERE id = ?", [id]);
}

// =============================================
// CHUYÊN MỤC (CATEGORIES)
// =============================================

//Lấy tất cả chuyên mục
async function getAllCategories() {
  return await query("SELECT * FROM categories ORDER BY id ASC");
}

module.exports = {
  getAllNews,
  getLatestNews,
  getMostViewedNews,
  getNewsByCategoryForHome,
  getNewsById,
  increaseViews,
  getRelatedNews,
  getNewsByCategoryId,
  countNews,
  getNewsPaginated,
  countAllNewsAdmin,
  getAllNewsAdmin,
  createNews,
  updateNews,
  updateNewsStatus,
  deleteNews,
  getAllCategories,
};
