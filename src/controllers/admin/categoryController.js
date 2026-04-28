const categoryModel = require("../../models/categoryModel");

// =============================================
// CONTROLLER QUẢN LÝ CHUYÊN MỤC (ADMIN)
// =============================================

//Hiển thị danh sách chuyên mục
async function listCategories(req, res, next) {
  try {
    const categories = await categoryModel.getAllCategories();

    res.render("admin/admin-layout", {
      content: "pages/category-list",
      user: req.session.user,
      categories: categories,
      success: req.query.success || null,
    });
  } catch (e) {
    next(e);
  }
}

//Xử lý thêm chuyên mục mới
async function addCategory(req, res, next) {
  try {
    const { name, slug } = req.body;
    await categoryModel.createCategory({ name, slug });
    res.redirect("/admin/chuyen-muc?success=add");
  } catch (e) {
    console.log("Lỗi thêm chuyên mục:", e);
    next(e);
  }
}

//Hiển thị form sửa chuyên mục
async function editCategoryForm(req, res, next) {
  try {
    const id = req.params.id;
    const [category, categories] = await Promise.all([
      categoryModel.getCategoryById(id),
      categoryModel.getAllCategories(),
    ]);

    if (!category) {
      return res.redirect("/admin/chuyen-muc");
    }

    res.render("admin/admin-layout", {
      content: "pages/category-list",
      user: req.session.user,
      categories: categories,
      editCategory: category,
      success: null,
    });
  } catch (e) {
    next(e);
  }
}

//Xử lý cập nhật chuyên mục
async function updateCategory(req, res, next) {
  try {
    const id = req.params.id;
    const { name, slug } = req.body;
    await categoryModel.updateCategory(id, { name, slug });
    res.redirect("/admin/chuyen-muc?success=edit");
  } catch (e) {
    console.log("Lỗi cập nhật chuyên mục:", e);
    next(e);
  }
}

//Xóa chuyên mục (kiểm tra trước khi xóa)
async function deleteCategory(req, res, next) {
  try {
    const id = req.params.id;

    //Kiểm tra có bài viết nào thuộc chuyên mục này không
    const count = await categoryModel.countNewsByCategory(id);
    if (count > 0) {
      return res.redirect("/admin/chuyen-muc?success=error_has_news");
    }

    await categoryModel.deleteCategory(id);
    res.redirect("/admin/chuyen-muc?success=delete");
  } catch (e) {
    console.log("Lỗi xóa chuyên mục:", e);
    next(e);
  }
}

module.exports = {
  listCategories,
  addCategory,
  editCategoryForm,
  updateCategory,
  deleteCategory,
};
