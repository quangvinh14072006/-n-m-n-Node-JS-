const subscriberModel = require("../../models/subscriberModel");

// =============================================
// CONTROLLER QUẢN LÝ NEWSLETTER / SUBSCRIBER (ADMIN)
// =============================================

//Hiển thị danh sách email đăng ký
async function listSubscribers(req, res, next) {
  try {
    const subscribers = await subscriberModel.getAllSubscribers();

    res.render("admin/admin-layout", {
      content: "pages/subscriber-list",
      user: req.session.user,
      subscribers: subscribers,
      success: req.query.success || null,
    });
  } catch (e) {
    next(e);
  }
}

//Xóa subscriber
async function deleteSubscriber(req, res, next) {
  try {
    const id = req.params.id;
    await subscriberModel.deleteSubscriber(id);
    res.redirect("/admin/subscribers?success=delete");
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listSubscribers,
  deleteSubscriber,
};
