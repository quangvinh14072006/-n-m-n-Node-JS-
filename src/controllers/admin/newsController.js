const newsModel = require("../../models/newsModel");
const categoryModel = require("../../models/categoryModel");

// =============================================
// CONTROLLER QUẢN LÝ BÀI VIẾT (ADMIN)
// =============================================

//Hiển thị danh sách bài viết (có tìm kiếm, lọc, phân trang)
async function listNews(req, res, next) {
  try {
    const keyword = req.query.keyword || "";
    const categoryId = req.query.category_id || "";
    const status = req.query.status !== undefined ? req.query.status : "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const [totalNews, newsList, categories] = await Promise.all([
      newsModel.countAllNewsAdmin(keyword, categoryId, status),
      newsModel.getAllNewsAdmin(keyword, categoryId, status, offset, limit),
      categoryModel.getAllCategories(),
    ]);

    const totalPages = Math.ceil(totalNews / limit);

    res.render("admin/admin-layout", {
      content: "pages/news-list",
      user: req.session.user,
      newsList: newsList,
      categories: categories,
      currentPage: page,
      totalPages: totalPages,
      totalNews: totalNews,
      keyword: keyword,
      categoryId: categoryId,
      status: status,
    });
  } catch (e) {
    console.log("Lỗi danh sách bài viết:", e);
    next(e);
  }
}

//Hiển thị form thêm bài viết
async function addNewsForm(req, res, next) {
  try {
    const categories = await categoryModel.getAllCategories();
    res.render("admin/admin-layout", {
      content: "pages/news-add",
      user: req.session.user,
      categories: categories,
    });
  } catch (e) {
    next(e);
  }
}

//Xử lý thêm bài viết mới
async function addNewsProcess(req, res, next) {
  try {
    const { title, summary, content, category_id, author, status } = req.body;
    const image = req.file ? req.file.filename : "news-700x435-4.jpg"; //Ảnh mặc định nếu không upload

    await newsModel.createNews({
      title, summary, content, image, category_id, author, status
    });

    res.redirect("/admin/bai-viet?success=add");
  } catch (e) {
    console.log("Lỗi thêm bài viết:", e);
    next(e);
  }
}

//Hiển thị form sửa bài viết
async function editNewsForm(req, res, next) {
  try {
    const id = req.params.id;
    const [news, categories] = await Promise.all([
      newsModel.getNewsById(id),
      categoryModel.getAllCategories(),
    ]);

    if (!news) {
      return res.redirect("/admin/bai-viet");
    }

    res.render("admin/admin-layout", {
      content: "pages/news-edit",
      user: req.session.user,
      news: news,
      categories: categories,
    });
  } catch (e) {
    next(e);
  }
}

//Xử lý cập nhật bài viết
async function editNewsProcess(req, res, next) {
  try {
    const id = req.params.id;
    const { title, summary, content, category_id, author, status } = req.body;
    const image = req.file ? req.file.filename : null;

    await newsModel.updateNews(id, {
      title, summary, content, image, category_id, author, status
    });

    res.redirect("/admin/bai-viet?success=edit");
  } catch (e) {
    console.log("Lỗi sửa bài viết:", e);
    next(e);
  }
}

//Cập nhật trạng thái bài viết (ẩn/hiện)
async function toggleStatus(req, res, next) {
  try {
    const id = req.params.id;
    const { status } = req.body;
    await newsModel.updateNewsStatus(id, status);
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, message: "Lỗi cập nhật trạng thái" });
  }
}

//Xóa bài viết
async function deleteNews(req, res, next) {
  try {
    const id = req.params.id;
    await newsModel.deleteNews(id);
    res.redirect("/admin/bai-viet?success=delete");
  } catch (e) {
    console.log("Lỗi xóa bài viết:", e);
    next(e);
  }
}

module.exports = {
  listNews,
  addNewsForm,
  addNewsProcess,
  editNewsForm,
  editNewsProcess,
  toggleStatus,
  deleteNews,
};
