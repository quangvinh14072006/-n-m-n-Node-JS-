const newsModel = require("../../models/newsModel");
async function RenderHome(req, res, next) {
  try {
    const [allNews, lastNews] = await Promise.all([
      newsModel.getAllNews(),
      newsModel.getLatestNews(6),
    ]);
    res.render("./client/client-layout", {
      content: "./client/pages/index",
      title: "Trang chủ",
      allNews: allNews,
      lastNews: lastNews,
    });
  } catch (e) {
    next(e);
  }
}


module.exports = { RenderHome };
