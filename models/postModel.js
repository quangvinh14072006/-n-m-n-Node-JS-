// SQL cho bảng posts
const db = require("../config/database");
const Post = {
  //lấy bài viết theo danh mục
  getByCategoryId: (cateId, callback) => {
    const sql = "SELECT * FROM posts WHERE category_id=?";
    db.query(sql, [cateId], callback);
  },
};
module.exports = Post;
