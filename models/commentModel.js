const query = require("../utils/dbQuery");

async function listByPost(postId) {
  return query(
    "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC",
    [postId],
  );
}

async function create({ post_id, email, content }) {
  const insertResult = await query(
    "INSERT INTO comments (post_id, email, content) VALUES (?, ?, ?)",
    [post_id, email, content],
  );
  return insertResult.insertId;
}

module.exports = {
  listByPost,
  create,
};
