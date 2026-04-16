const postModel = require("../../models/postModel");
const contactModel = require("../../models/contactModel");

function countPendingContacts(contactRows) {
  return contactRows.filter((contact) => !contact.reviewed).length;
}

async function index(req, res, next) {
  try {
    const { total: totalPosts } = await postModel.adminList({
      page: 1,
      pageSize: 1,
    });

    const contactRows = await contactModel.adminList();
    const pendingContacts = countPendingContacts(contactRows);

    res.render("admin/layout", {
      content: "dashboard",
      pageTitle: "Bảng điều khiển",
      postTotal: totalPosts,
      contactTotal: contactRows.length,
      pendingContacts,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { index };
