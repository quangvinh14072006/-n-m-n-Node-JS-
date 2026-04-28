const newsModel = require("../../models/newsModel");
const websiteModel = require("../../models/websiteModel");
const subscriberModel = require("../../models/subscriberModel");
const contactModel = require("../../models/contactModel");

// =============================================
// CONTROLLER TRANG CHỦ (HOME)
// =============================================

//Hiển thị trang chủ - lấy bài viết theo từng phân mục
async function renderHomePage(req, res, next) {
  try {
    //Lấy dữ liệu song song để tối ưu tốc độ
    const [latestNews, mostViewedNews, categories, websiteInfo] = await Promise.all([
      newsModel.getLatestNews(6),        //6 bài viết mới nhất
      newsModel.getMostViewedNews(6),     //6 bài xem nhiều nhất
      newsModel.getAllCategories(),       //Danh sách chuyên mục (cho menu)
      websiteModel.getWebsiteInfo(),     //Thông tin website (cho footer)
    ]);

    //Lấy bài viết theo từng chuyên mục (mỗi loại 4 bài)
    const newsByCategory = [];
    for (const cat of categories) {
      const articles = await newsModel.getNewsByCategoryForHome(cat.id, 4);
      if (articles.length > 0) {
        newsByCategory.push({ category: cat, articles: articles });
      }
    }

    res.render("./client/client-layout", {
      content: "pages/index",
      latestNews: latestNews,           //Bài viết mới nhất
      mostViewedNews: mostViewedNews,   //Bài viết xem nhiều
      newsByCategory: newsByCategory,   //Bài viết theo chuyên mục
      categories: categories,           //Danh sách chuyên mục
      websiteInfo: websiteInfo,         //Thông tin website
    });
  } catch (e) {
    console.log("Lỗi tại controller trang chủ:", e);
    next(e);
  }
}

// =============================================
// CONTROLLER TRANG DANH SÁCH TIN TỨC (có tìm kiếm, phân trang)
// =============================================

async function getNewsPage(req, res, next) {
  try {
    const catId = req.params.id || null;                    //ID chuyên mục từ URL
    const keyword = req.query.keyword || "";                //Từ khóa tìm kiếm
    const page = parseInt(req.query.page) || 1;             //Trang hiện tại
    const limit = 6;                                        //Số bài viết mỗi trang
    const offset = (page - 1) * limit;                      //Vị trí bắt đầu lấy

    //Lấy dữ liệu song song
    const [totalNews, listNews, categories, websiteInfo] = await Promise.all([
      newsModel.countNews(keyword, catId),                  //Đếm tổng bài viết
      newsModel.getNewsPaginated(keyword, catId, offset, limit), //Lấy bài viết theo trang
      newsModel.getAllCategories(),
      websiteModel.getWebsiteInfo(),
    ]);

    const totalPages = Math.ceil(totalNews / limit);        //Tính tổng số trang

    res.render("./client/client-layout", {
      content: "pages/category",
      listNews: listNews,
      categories: categories,
      websiteInfo: websiteInfo,
      currentPage: page,
      totalPages: totalPages,
      totalNews: totalNews,
      keyword: keyword,
      catId: catId,
    });
  } catch (e) {
    console.log("Lỗi trang tin tức:", e);
    next(e);
  }
}

// =============================================
// CONTROLLER TRANG LIÊN HỆ
// =============================================

async function getContactPage(req, res, next) {
  try {
    const [categories, websiteInfo] = await Promise.all([
      newsModel.getAllCategories(),
      websiteModel.getWebsiteInfo(),
    ]);

    res.render("./client/client-layout", {
      content: "pages/contact",
      categories: categories,
      websiteInfo: websiteInfo,
      success: req.query.success || null,
    });
  } catch (e) {
    next(e);
  }
}

//Xử lý gửi form liên hệ
async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    await contactModel.createContact({ name, email, phone, subject, message });
    res.redirect("/lien-he?success=1");
  } catch (e) {
    console.log("Lỗi gửi liên hệ:", e);
    next(e);
  }
}

// =============================================
// CONTROLLER ĐĂNG KÝ NHẬN TIN (SUBSCRIBE)
// =============================================

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    //Kiểm tra email đã tồn tại chưa
    const existing = await subscriberModel.findByEmail(email);
    if (existing) {
      return res.json({ success: false, message: "Email đã được đăng ký!" });
    }
    await subscriberModel.createSubscriber(email);
    res.json({ success: true, message: "Đăng ký nhận tin thành công!" });
  } catch (e) {
    console.log("Lỗi đăng ký:", e);
    res.json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại!" });
  }
}

module.exports = { renderHomePage, getNewsPage, getContactPage, submitContact, subscribe };
