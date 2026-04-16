const postModel = require("../../models/postModel");
const categoryModel = require("../../models/categoryModel");
const commentModel = require("../../models/commentModel");
const { isValidEmail } = require("../../utils/validation");
const { buildPublicNewsFilterQuery } = require("../../utils/filterQuery");

/**
 * Gom dữ liệu trang chi tiết để dùng lại ở cả:
 * - GET chi tiết bài viết
 * - POST thêm bình luận (khi cần render lỗi)
 */
async function getDetailPageData(postId, post) {
  const [comments, related] = await Promise.all([
    commentModel.listByPost(postId),
    postModel.findRelated(post.category_id, postId, 4),
  ]);
  return { comments, related };
}

function renderDetailPage(res, post, extras) {
  res.render("layout", {
    content: "single",
    pageTitle: `${post.title} | BizNews`,
    metaDescription: post.summary || post.title,
    post,
    commentError: null,
    ...extras,
  });
}

async function list(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const keyword = req.query.keyword || "";
    const categoryId = req.query.category_id || "";
    const dateFrom = req.query.date_from || "";
    const dateTo = req.query.date_to || "";

    const { rows, total, pageSize } = await postModel.findPublishedList({
      keyword,
      categoryId: categoryId || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      pageSize: 9,
    });

    const categories = await categoryModel.findActive();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const filterQueryPrefix = buildPublicNewsFilterQuery({
      keyword,
      categoryId,
      dateFrom,
      dateTo,
    });

    res.render("layout", {
      content: "news-list",
      pageTitle: "Tin tức | BizNews",
      metaDescription: `Danh sách tin tức — ${total} kết quả.`,
      posts: rows,
      total,
      page,
      pageSize,
      totalPages,
      keyword,
      categoryId,
      dateFrom,
      dateTo,
      filterQueryPrefix,
      categories,
    });
  } catch (e) {
    next(e);
  }
}

async function detail(req, res, next) {
  try {
    const id = req.params.id;
    const post = await postModel.findPublishedById(id);
    if (!post) {
      return res.status(404).render("layout", {
        content: "error-404",
        pageTitle: "Không tìm thấy | BizNews",
        metaDescription: "Bài viết không tồn tại.",
      });
    }

    await postModel.incrementViews(id);
    post.views = (post.views || 0) + 1;

    const { comments, related } = await getDetailPageData(id, post);
    renderDetailPage(res, post, { comments, related });
  } catch (e) {
    next(e);
  }
}

async function addComment(req, res, next) {
  try {
    const id = req.params.id;
    const post = await postModel.findPublishedById(id);
    if (!post) return res.status(404).send("Not found");

    const email = (req.body.email || "").trim();
    const content = (req.body.content || "").trim();

    const { comments, related } = await getDetailPageData(id, post);

    if (!isValidEmail(email)) {
      return renderDetailPage(res, post, {
        comments,
        related,
        commentError: "Vui lòng nhập email hợp lệ.",
      });
    }
    if (!content) {
      return renderDetailPage(res, post, {
        comments,
        related,
        commentError: "Nội dung bình luận không được để trống.",
      });
    }

    await commentModel.create({ post_id: id, email, content });
    res.redirect(`/bai-viet/${id}#binh-luan`);
  } catch (e) {
    next(e);
  }
}

module.exports = { list, detail, addComment };
