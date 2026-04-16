const subscriberModel = require("../../models/subscriberModel");

async function list(req, res, next) {
  try {
    const subscriberRows = await subscriberModel.listAll();

    res.render("admin/layout", {
      content: "subscribers/list",
      pageTitle: "Đăng ký nhận tin",
      subscribers: subscriberRows,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { list };
