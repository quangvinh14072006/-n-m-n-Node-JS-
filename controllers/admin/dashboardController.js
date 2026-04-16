const postModel = require("../../models/postModel");
const contactModel = require("../../models/contactModel");

async function index(req, res, next) {
  try {
    const { total: postTotal } = await postModel.adminList({
      page: 1,
      pageSize: 1,
    });
    const contacts = await contactModel.adminList();
    const pendingContacts = contacts.filter((c) => !c.reviewed).length;
    res.render("admin/layout", {
      content: "dashboard",
      pageTitle: "Bảng điều khiển",
      postTotal,
      contactTotal: contacts.length,
      pendingContacts,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { index };
