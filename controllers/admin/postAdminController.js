const postModel = require("../../models/postModel");
const categoryModel = require("../../models/categoryModel");
const { buildAdminPostFilterQuery } = require("../../utils/filterQuery");

/** Trạng thái form select: "0" = nháp, còn lại = đã đăng */
function parsePostStatus(bodyStatus) {
  return bodyStatus === "0" ? 0 : 1;
}

/**
 * Ảnh đại diện: ưu tiên file upload, không thì URL trong form, không thì mặc định.
 */
function resolvePostImage(req, existingImage, defaultPath) {
  if (req.file) return `/uploads/${req.file.filename}`;
  const url = (req.body.image_url || "").trim();
  if (url) return url;
  return existingImage || defaultPath;
}

async function list(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const keyword = req.query.keyword || "";
    const categoryId = req.query.category_id || "";
    const dateFrom = req.query.date_from || "";
    const dateTo = req.query.date_to || "";
    const status = req.query.status;

    const { rows, total, pageSize } = await postModel.adminList({
      keyword,
      categoryId: categoryId || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      status: status === "" || status === undefined ? undefined : status,
      page,
      pageSize: 10,
    });

    const categories = await categoryModel.findAll();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const filterQueryPrefix = buildAdminPostFilterQuery({
      keyword,
      categoryId,
      dateFrom,
      dateTo,
      status:
        status === undefined || status === "" || status === null
          ? undefined
          : status,
    });

    res.render("admin/layout", {
      content: "posts/list",
      pageTitle: "Quản lý bài viết",
      posts: rows,
      total,
      page,
      pageSize,
      totalPages,
      keyword,
      categoryId,
      dateFrom,
      dateTo,
      status: status === undefined ? "" : String(status),
      filterQueryPrefix,
      categories,
      flash: req.session.flash,
    });
    delete req.session.flash;
  } catch (e) {
    next(e);
  }
}

async function createForm(req, res, next) {
  try {
    const categories = await categoryModel.findAll();
    res.render("admin/layout", {
      content: "posts/form",
      pageTitle: "Thêm bài viết",
      post: null,
      categories,
      error: null,
    });
  } catch (e) {
    next(e);
  }
}

async function createSubmit(req, res, next) {
  try {
    const { title, summary, content, category_id, status } = req.body;
    const image = resolvePostImage(
      req,
      null,
      "img/news-700x435-1.jpg",
    );

    if (!title || !summary || !content || !category_id) {
      const categories = await categoryModel.findAll();
      return res.render("admin/layout", {
        content: "posts/form",
        pageTitle: "Thêm bài viết",
        post: null,
        categories,
        error: "Điền đủ tiêu đề, tóm tắt, nội dung và danh mục.",
      });
    }

    await postModel.create({
      title,
      summary,
      content,
      image,
      category_id,
      user_id: req.session.user.userid,
      status: parsePostStatus(status),
    });
    req.session.flash = { type: "success", text: "Đã tạo bài viết." };
    res.redirect("/admin/posts");
  } catch (e) {
    next(e);
  }
}

async function editForm(req, res, next) {
  try {
    const post = await postModel.findByIdAny(req.params.id);
    if (!post) return res.status(404).send("Không tìm thấy");
    const categories = await categoryModel.findAll();
    res.render("admin/layout", {
      content: "posts/form",
      pageTitle: "Sửa bài viết",
      post,
      categories,
      error: null,
    });
  } catch (e) {
    next(e);
  }
}

async function editSubmit(req, res, next) {
  try {
    const id = req.params.id;
    const { title, summary, content, category_id, status } = req.body;
    const existing = await postModel.findByIdAny(id);
    if (!existing) return res.status(404).send("Không tìm thấy");

    const image = resolvePostImage(req, existing.image, existing.image);

    if (!title || !summary || !content || !category_id) {
      const categories = await categoryModel.findAll();
      return res.render("admin/layout", {
        content: "posts/form",
        pageTitle: "Sửa bài viết",
        post: { ...existing, title, summary, content, category_id, image },
        categories,
        error: "Điền đủ tiêu đề, tóm tắt, nội dung và danh mục.",
      });
    }

    await postModel.update(id, {
      title,
      summary,
      content,
      image,
      category_id,
      status: parsePostStatus(status),
    });
    req.session.flash = { type: "success", text: "Đã cập nhật bài viết." };
    res.redirect("/admin/posts");
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    await postModel.remove(req.params.id);
    req.session.flash = { type: "success", text: "Đã xóa bài viết." };
    res.redirect("/admin/posts");
  } catch (e) {
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
