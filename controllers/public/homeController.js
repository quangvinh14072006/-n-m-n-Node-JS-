const postModel = require("../../models/postModel");
const categoryModel = require("../../models/categoryModel");

/**
 * Trang chủ: mới nhất + xem nhiều + theo từng danh mục (dữ liệu từ CSDL).
 * Promise.all chỉ để chạy song song cho nhanh; logic vẫn là "lấy list rồi gắn vào view".
 */
async function index(req, res, next) {
  try {
    const categories = await categoryModel.findActive();
    const [newestPosts, popularPosts] = await Promise.all([
      postModel.findLatestPublished(8),
      postModel.findPopularPublished(8),
    ]);

    const postsByCategory = await Promise.all(
      categories.map((c) => postModel.findByCategoryPublished(c.id, 4)),
    );

    const categoriesWithPosts = categories.map((category, index) => ({
      category,
      posts: postsByCategory[index] || [],
    }));

    res.render("layout", {
      content: "index",
      pageTitle: "Trang chủ | BizNews",
      metaDescription:
        "Tin tức mới nhất, xem nhiều và theo chủ đề — dữ liệu từ cơ sở dữ liệu.",
      newestPosts,
      popularPosts,
      categoriesWithPosts,
    });
  } catch (e) {
    next(e);
  }
}

async function categoriesIndex(req, res, next) {
  try {
    const categories = await categoryModel.findActive();
    res.render("layout", {
      content: "categories-list",
      pageTitle: "Danh sách danh mục | BizNews",
      metaDescription: "Tất cả chủ đề bài viết trên BizNews.",
      categories,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { index, categoriesIndex };
