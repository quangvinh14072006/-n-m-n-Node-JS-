const newsModel = require("../../models/newsModel");
const commentModel = require("../../models/commentModel");
const websiteModel = require("../../models/websiteModel");

// =============================================
// CONTROLLER TRANG CHI TIẾT BÀI VIẾT
// =============================================

async function renderDetailPage(req, res, next) {
  try {
    const id = Number(req.params.id); //Lấy id từ thanh địa chỉ (URL)

    //1. Lấy chi tiết bài viết
    const newsDetail = await newsModel.getNewsById(id);

    //Kiểm tra nếu không có bài viết trong db
    if (!newsDetail) {
      return res.status(404).send("Bài viết không tồn tại");
    }

    //2. Tăng lượt xem
    await newsModel.increaseViews(id);

    //3. Lấy dữ liệu song song
    const [categories, relatedNews, comments, websiteInfo] = await Promise.all([
      newsModel.getAllCategories(),                              //Danh sách chuyên mục
      newsModel.getRelatedNews(newsDetail.category_id, id),     //Bài viết liên quan
      commentModel.getCommentsByNewsId(id),                      //Bình luận
      websiteModel.getWebsiteInfo(),                             //Thông tin website
    ]);

    res.render("./client/client-layout", {
      content: "pages/detail",       //File giao diện chi tiết
      news: newsDetail,               //Dữ liệu bài viết chính
      categories: categories,         //Dữ liệu cho menu
      relatedNews: relatedNews,       //Bài viết liên quan
      comments: comments,             //Danh sách bình luận
      websiteInfo: websiteInfo,       //Thông tin website
    });
  } catch (e) {
    console.log("Lỗi trang chi tiết:", e);
    next(e);
  }
}

// =============================================
// XỬ LÝ GỬI BÌNH LUẬN
// =============================================

async function submitComment(req, res, next) {
  try {
    const newsId = Number(req.params.id);
    const { email, content } = req.body;

    //Tạo bình luận mới
    await commentModel.createComment({
      news_id: newsId,
      email: email,
      content: content,
    });

    //Quay lại trang chi tiết bài viết
    res.redirect("/tin-tuc/" + newsId + "#comments");
  } catch (e) {
    console.log("Lỗi gửi bình luận:", e);
    next(e);
  }
}

module.exports = { renderDetailPage, submitComment };
