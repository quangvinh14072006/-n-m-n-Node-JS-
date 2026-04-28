const db = require("../../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// =============================================
// CÁC HÀM QUẢN LÝ BÌNH LUẬN (COMMENTS)
// =============================================

//Lấy tất cả bình luận của một bài viết
async function getCommentsByNewsId(newsId) {
  return await query(
    "SELECT * FROM comments WHERE news_id = ? ORDER BY created_at DESC",
    [newsId]
  );
}

//Thêm bình luận mới
async function createComment(data) {
  return await query(
    "INSERT INTO comments (news_id, email, content) VALUES (?, ?, ?)",
    [data.news_id, data.email, data.content]
  );
}

//Xóa bình luận
async function deleteComment(id) {
  return await query("DELETE FROM comments WHERE id=?", [id]);
}

module.exports = {
  getCommentsByNewsId,
  createComment,
  deleteComment,
};
