const contactModel = require("../../models/contactModel");
const { sendAlertThenRedirect } = require("../../utils/alertRedirect");

function buildContactPageModel(contactFlash = null) {
  return {
    content: "contact",
    pageTitle: "Liên hệ | BizNews",
    metaDescription: "Gửi thông tin liên hệ cho BizNews.",
    contactFlash,
  };
}

function mapContactFormData(body) {
  return {
    name: body.name,
    email: body.email,
    phone: body.phone || "",
    subject: body.subject || "",
    message: body.message,
  };
}

function contactPage(req, res) {
  res.render("layout", buildContactPageModel());
}

async function contactSubmit(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.render(
        "layout",
        buildContactPageModel({
          type: "danger",
          text: "Vui lòng điền họ tên, email và nội dung.",
        }),
      );
    }

    await contactModel.create(mapContactFormData({ name, email, phone, subject, message }));
    res.render(
      "layout",
      buildContactPageModel({
        type: "success",
        text: "Cảm ơn bạn! Chúng tôi đã nhận được liên hệ.",
      }),
    );
  } catch (e) {
    next(e);
  }
}

async function contactPopupSubmit(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    const backUrl = req.get("referer") || "/";

    if (!name || !email || !message) {
      return sendAlertThenRedirect(
        res,
        "Vui lòng điền họ tên, email và nội dung.",
        backUrl,
      );
    }

    await contactModel.create(mapContactFormData({ name, email, phone, subject, message }));
    sendAlertThenRedirect(res, "Đã gửi liên hệ thành công!", backUrl);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  contactPage,
  contactSubmit,
  contactPopupSubmit,
};
