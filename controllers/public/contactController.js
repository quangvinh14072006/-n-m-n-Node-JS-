const contactModel = require("../../models/contactModel");
const { sendAlertThenRedirect } = require("../../utils/alertRedirect");

function contactPage(req, res) {
  res.render("layout", {
    content: "contact",
    pageTitle: "Liên hệ | BizNews",
    metaDescription: "Gửi thông tin liên hệ cho BizNews.",
    contactFlash: null,
  });
}

async function contactSubmit(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.render("layout", {
        content: "contact",
        pageTitle: "Liên hệ | BizNews",
        metaDescription: "Gửi thông tin liên hệ cho BizNews.",
        contactFlash: {
          type: "danger",
          text: "Vui lòng điền họ tên, email và nội dung.",
        },
      });
    }
    await contactModel.create({
      name,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
    });
    res.render("layout", {
      content: "contact",
      pageTitle: "Liên hệ | BizNews",
      metaDescription: "Gửi thông tin liên hệ cho BizNews.",
      contactFlash: {
        type: "success",
        text: "Cảm ơn bạn! Chúng tôi đã nhận được liên hệ.",
      },
    });
  } catch (e) {
    next(e);
  }
}

async function contactPopupSubmit(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    const back = req.get("referer") || "/";

    if (!name || !email || !message) {
      return sendAlertThenRedirect(
        res,
        "Vui lòng điền họ tên, email và nội dung.",
        back,
      );
    }

    await contactModel.create({
      name,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
    });
    sendAlertThenRedirect(res, "Đã gửi liên hệ thành công!", back);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  contactPage,
  contactSubmit,
  contactPopupSubmit,
};
