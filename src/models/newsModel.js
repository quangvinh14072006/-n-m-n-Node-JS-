const db = require("../../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

async function getAllNews() {
  return await query("select * from news order by created_at desc");
}

//Lấy bài viết mới nhất (giới hạn số lượng)
async function getLatestNews(limit = 6) {
  return await query(
    `
    SELECT news.*, categories.name AS category_name 
    FROM news 
    LEFT JOIN categories ON news.category_id = categories.id 
    ORDER BY news.created_at DESC 
    LIMIT ?
  `,
    [limit],
  );
}
//Lấy chi tiết bài viết bằng id
async function getNewsByid(id) {
  const rows = await query(
    "select news.* , categories.name from news left join categories on news.category_id=categories.id where news.id = ?",
    [id],
  );
  return rows[0] || null;
}

module.exports = { getAllNews, getLatestNews,getNewsByid };
