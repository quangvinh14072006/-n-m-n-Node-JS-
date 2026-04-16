const websiteModel = require("../../models/websiteModel");

function mapWebsiteFormData(body) {
  return {
    address: body.address,
    email: body.email,
    phone: body.phone,
    facebook_link: body.facebook_link,
    youtube_link: body.youtube_link,
    copyright_text: body.copyright_text,
  };
}

async function editForm(req, res, next) {
  try {
    const websiteInfo = await websiteModel.getInfo();

    res.render("admin/layout", {
      content: "website/form",
      pageTitle: "Thông tin website (footer)",
      info: websiteInfo,
      flash: req.session.flash,
    });

    delete req.session.flash;
  } catch (e) {
    next(e);
  }
}

async function editSubmit(req, res, next) {
  try {
    const websiteData = mapWebsiteFormData(req.body);

    await websiteModel.updateInfo(websiteData);
    req.session.flash = { type: "success", text: "Đã lưu thông tin website." };

    res.redirect("/admin/website");
  } catch (e) {
    next(e);
  }
}

module.exports = { editForm, editSubmit };
