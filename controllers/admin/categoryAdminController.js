const categoryModel = require("../../models/categoryModel");

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "danh-muc";
}

async function list(req, res, next) {
  try {
    const categories = await categoryModel.findAll();
    res.render("admin/layout", {
      content: "categories/list",
      pageTitle: "Danh mục bài viết",
      categories,
      flash: req.session.flash,
    });
    delete req.session.flash;
  } catch (e) {
    next(e);
  }
}

function createForm(req, res) {
  res.render("admin/layout", {
    content: "categories/form",
    pageTitle: "Thêm danh mục",
    category: null,
    error: null,
  });
}

async function createSubmit(req, res, next) {
  try {
    const { name, slug, status } = req.body;
    if (!name) {
      return res.render("admin/layout", {
        content: "categories/form",
        pageTitle: "Thêm danh mục",
        category: null,
        error: "Tên danh mục không được để trống.",
      });
    }
    const normalizedSlug = slug && slug.trim() ? slug.trim() : slugify(name);
    await categoryModel.create({
      name,
      slug: normalizedSlug,
      status: status === "0" ? 0 : 1,
    });
    req.session.flash = { type: "success", text: "Đã thêm danh mục." };
    res.redirect("/admin/categories");
  } catch (e) {
    next(e);
  }
}

async function editForm(req, res, next) {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) return res.status(404).send("Không tìm thấy");
    res.render("admin/layout", {
      content: "categories/form",
      pageTitle: "Sửa danh mục",
      category,
      error: null,
    });
  } catch (e) {
    next(e);
  }
}

async function editSubmit(req, res, next) {
  try {
    const id = req.params.id;
    const { name, slug, status } = req.body;
    if (!name) {
      const category = await categoryModel.findById(id);
      return res.render("admin/layout", {
        content: "categories/form",
        pageTitle: "Sửa danh mục",
        category,
        error: "Tên danh mục không được để trống.",
      });
    }
    const normalizedSlug = slug && slug.trim() ? slug.trim() : slugify(name);
    await categoryModel.update(id, {
      name,
      slug: normalizedSlug,
      status: status === "0" ? 0 : 1,
    });
    req.session.flash = { type: "success", text: "Đã cập nhật danh mục." };
    res.redirect("/admin/categories");
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    await categoryModel.remove(req.params.id);
    req.session.flash = { type: "success", text: "Đã xóa danh mục." };
    res.redirect("/admin/categories");
  } catch (e) {
    if (e.code === "ER_ROW_IS_REFERENCED_2" || e.errno === 1451) {
      req.session.flash = {
        type: "danger",
        text: "Không xóa được: còn bài viết thuộc danh mục này.",
      };
      return res.redirect("/admin/categories");
    }
    next(e);
  }
}

module.exports = {
  list,
  createForm,
  createSubmit,
  editForm,
  editSubmit,
  remove,
};
