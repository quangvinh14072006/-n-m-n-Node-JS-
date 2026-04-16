const subscriberModel = require("../../models/subscriberModel");

async function list(req, res, next) {
  try {
    const subscribers = await subscriberModel.listAll();
    res.render("admin/layout", {
      content: "subscribers/list",
      pageTitle: "Đăng ký nhận tin",
      subscribers,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { list };
