const contactModel = require("../../models/contactModel");

// =============================================
// CONTROLLER QUẢN LÝ LIÊN HỆ (ADMIN)
// =============================================

//Hiển thị danh sách liên hệ
async function listContacts(req, res, next) {
  try {
    const contacts = await contactModel.getAllContacts();

    res.render("admin/admin-layout", {
      content: "pages/contact-list",
      user: req.session.user,
      contacts: contacts,
      success: req.query.success || null,
    });
  } catch (e) {
    next(e);
  }
}

//Xem chi tiết liên hệ
async function viewContact(req, res, next) {
  try {
    const id = req.params.id;
    const contact = await contactModel.getContactById(id);

    if (!contact) {
      return res.redirect("/admin/lien-he");
    }

    const contacts = await contactModel.getAllContacts();

    res.render("admin/admin-layout", {
      content: "pages/contact-list",
      user: req.session.user,
      contacts: contacts,
      viewContact: contact,
      success: null,
    });
  } catch (e) {
    next(e);
  }
}

//Cập nhật trạng thái duyệt liên hệ
async function approveContact(req, res, next) {
  try {
    const id = req.params.id;
    const { status } = req.body;
    await contactModel.updateContactStatus(id, status);
    res.redirect("/admin/lien-he?success=approve");
  } catch (e) {
    next(e);
  }
}

//Xóa liên hệ
async function deleteContact(req, res, next) {
  try {
    const id = req.params.id;
    await contactModel.deleteContact(id);
    res.redirect("/admin/lien-he?success=delete");
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listContacts,
  viewContact,
  approveContact,
  deleteContact,
};
