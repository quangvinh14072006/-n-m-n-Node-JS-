const db = require("../config/database");

const adminController = {
  getDashboard: (req, res) => {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM posts) AS totalPosts,
        (SELECT COUNT(*) FROM categories) AS totalCategories,
        (SELECT COALESCE(SUM(views), 0) FROM posts) AS totalViews
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi khi tải dashboard admin");
      }
      res.render("dashboard", {
        stats: results[0],
      });
    });
  },
};

module.exports = adminController;
