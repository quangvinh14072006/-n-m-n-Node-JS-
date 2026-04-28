const newsModel = require("../../models/newsModel");
const categoryModel = require("../../models/categoryModel");
const contactModel = require("../../models/contactModel");
const subscriberModel = require("../../models/subscriberModel");
const userModel = require("../../models/userModels");

// =============================================
// CONTROLLER DASHBOARD (TRANG QUẢN TRỊ CHÍNH)
// =============================================

async function renderDashboard(req, res, next) {
  try {
    //Lấy thống kê nhanh
    const [allNews, allCategories, allContacts, allSubscribers, allUsers] = await Promise.all([
      newsModel.getAllNews(),
      categoryModel.getAllCategories(),
      contactModel.getAllContacts(),
      subscriberModel.getAllSubscribers(),
      userModel.getAllUsers(),
    ]);

    res.render("admin/admin-layout", {
      content: "pages/dashboard",
      user: req.session.user,
      stats: {
        totalNews: allNews.length,
        totalCategories: allCategories.length,
        totalContacts: allContacts.length,
        totalSubscribers: allSubscribers.length,
        totalUsers: allUsers.length,
      },
      latestNews: allNews.slice(0, 5),  //5 bài viết mới nhất
    });
  } catch (e) {
    console.log("Lỗi dashboard:", e);
    next(e);
  }
}

module.exports = { renderDashboard };
