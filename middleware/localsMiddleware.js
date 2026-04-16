const categoryModel = require("../models/categoryModel");
const websiteModel = require("../models/websiteModel");

async function loadPublicLocals(req, res, next) {
  try {
    const [allCategories, websiteInfo] = await Promise.all([
      categoryModel.findActive(),
      websiteModel.getInfo(),
    ]);
    res.locals.allCategories = allCategories;
    res.locals.websiteInfo = websiteInfo;
    next();
  } catch (err) {
    console.error("localsMiddleware:", err);
    res.locals.allCategories = [];
    res.locals.websiteInfo = {};
    next();
  }
}

module.exports = { loadPublicLocals };
