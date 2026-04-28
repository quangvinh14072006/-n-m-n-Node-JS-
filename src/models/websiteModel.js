const db = require("../../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// =============================================
// THÔNG TIN WEBSITE (FOOTER)
// =============================================

//Lấy thông tin website (dùng cho footer)
async function getWebsiteInfo() {
  const rows = await query("SELECT * FROM website_info LIMIT 1");
  return rows[0] || null;
}

module.exports = {
  getWebsiteInfo,
};
