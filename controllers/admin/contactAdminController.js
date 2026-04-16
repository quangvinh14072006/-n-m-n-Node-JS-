const contactModel = require("../../models/contactModel");

async function list(req, res, next) {
  try {
    const contacts = await contactModel.adminList();
    res.render("admin/layout", {
      content: "contacts/list",
      pageTitle: "Liên hệ",
      contacts,
      flash: req.session.flash,
    });
    delete req.session.flash;
  } catch (e) {
    next(e);
  }
}

async function detail(req, res, next) {
  try {
    const row = await contactModel.findById(req.params.id);
    if (!row) return res.status(404).send("Không tìm thấy");
    res.render("admin/layout", {
      content: "contacts/detail",
      pageTitle: "Chi tiết liên hệ",
      contact: row,
    });
  } catch (e) {
    next(e);
  }
}

async function setStatus(req, res, next) {
  try {
    const id = req.params.id;
    const reviewed = req.body.reviewed === "1" ? 1 : 0;
    await contactModel.setReviewed(id, reviewed);
    req.session.flash = { type: "success", text: "Đã cập nhật trạng thái." };
    res.redirect(`/admin/contacts/${id}`);
  } catch (e) {
    next(e);
  }
}

module.exports = { list, detail, setStatus };
