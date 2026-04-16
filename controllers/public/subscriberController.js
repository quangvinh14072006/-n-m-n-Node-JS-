const subscriberModel = require("../../models/subscriberModel");
const { isValidEmail } = require("../../utils/validation");
const { sendAlertThenRedirect } = require("../../utils/alertRedirect");

async function subscribe(req, res, next) {
  try {
    const backUrl = req.get("referer") || "/";
    const email = (req.body.email || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return sendAlertThenRedirect(res, "Email không hợp lệ", backUrl);
    }

    const subscribeResult = await subscriberModel.subscribe(email);
    const alertMessage = subscribeResult.duplicate
      ? "Email này đã đăng ký trước đó."
      : "Đăng ký nhận tin thành công!";

    sendAlertThenRedirect(res, alertMessage, backUrl);
  } catch (e) {
    next(e);
  }
}

module.exports = { subscribe };
