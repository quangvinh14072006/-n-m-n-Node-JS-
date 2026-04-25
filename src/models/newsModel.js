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

module.exports = { getAllNews, getLatestNews };
