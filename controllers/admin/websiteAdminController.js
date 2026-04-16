const websiteModel = require("../../models/websiteModel");

async function editForm(req, res, next) {
  try {
    const info = await websiteModel.getInfo();
    res.render("admin/layout", {
      content: "website/form",
      pageTitle: "Thông tin website (footer)",
      info,
      flash: req.session.flash,
    });
    delete req.session.flash;
  } catch (e) {
    next(e);
  }
}

async function editSubmit(req, res, next) {
  try {
    const {
      address,
      email,
      phone,
      facebook_link,
      youtube_link,
      copyright_text,
    } = req.body;
    await websiteModel.updateInfo({
      address,
      email,
      phone,
      facebook_link,
      youtube_link,
      copyright_text,
    });
    req.session.flash = { type: "success", text: "Đã lưu thông tin website." };
    res.redirect("/admin/website");
  } catch (e) {
    next(e);
  }
}

module.exports = { editForm, editSubmit };
