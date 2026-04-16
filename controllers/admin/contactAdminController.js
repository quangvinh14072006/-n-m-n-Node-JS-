const contactModel = require("../../models/contactModel");

async function list(req, res, next) {
  try {
    const contactRows = await contactModel.adminList();

    res.render("admin/layout", {
      content: "contacts/list",
      pageTitle: "Liên hệ",
      contacts: contactRows,
      flash: req.session.flash,
    });

    delete req.session.flash;
  } catch (e) {
    next(e);
  }
}

async function detail(req, res, next) {
  try {
    const contactId = req.params.id;
    const contact = await contactModel.findById(contactId);

    if (!contact) {
      return res.status(404).send("Không tìm thấy");
    }

    res.render("admin/layout", {
      content: "contacts/detail",
      pageTitle: "Chi tiết liên hệ",
      contact,
    });
  } catch (e) {
    next(e);
  }
}

async function setStatus(req, res, next) {
  try {
    const contactId = req.params.id;
    const reviewed = req.body.reviewed === "1" ? 1 : 0;

    await contactModel.setReviewed(contactId, reviewed);
    req.session.flash = { type: "success", text: "Đã cập nhật trạng thái." };

    res.redirect(`/admin/contacts/${contactId}`);
  } catch (e) {
    next(e);
  }
}

module.exports = { list, detail, setStatus };
