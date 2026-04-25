const newsModels = require("../../models/newsModel");

async function RenderGetDetail(req, res, next) {
  try {
    const id = Number(req.params.id); //Lấy id từ url
    //Lấy chi tiết bài viết = id
    const newsDetail = await newsModels.getNewsByid(id);
    console.log(`Lấy bài viết : ${newsDetail.id}`);
    //Kiểm tra nếu không có bài viết trong db
    if (!newsDetail) {
      return res.status(404).send("Bài viết không tồn tại");
    }
    res.render("./client/client-layout", {
      content: "pages/detail",
      news: newsDetail, //Dữ liệu bài viết chính
      title: "Trang chi tiết",
    });
  } catch (e) {
    console.log("Không có bài viết");
    next(e);
  }
}
module.exports = { RenderGetDetail };
