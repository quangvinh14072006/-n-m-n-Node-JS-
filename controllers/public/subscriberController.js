const subscriberModel = require("../../models/subscriberModel");
const { isValidEmail } = require("../../utils/validation");
const { sendAlertThenRedirect } = require("../../utils/alertRedirect");

async function subscribe(req, res, next) {
  try {
    const back = req.get("referer") || "/";
    const email = (req.body.email || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return sendAlertThenRedirect(res, "Email không hợp lệ", back);
    }

    const r = await subscriberModel.subscribe(email);
    const msg = r.duplicate
      ? "Email này đã đăng ký trước đó."
      : "Đăng ký nhận tin thành công!";
    sendAlertThenRedirect(res, msg, back);
  } catch (e) {
    next(e);
  }
}

module.exports = { subscribe };
