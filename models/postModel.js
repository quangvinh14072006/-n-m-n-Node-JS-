/**
 * Model bài viết: các câu SQL đọc/ghi bảng `posts`.
 * Phần "đã đăng" (status) chỉ áp dụng nếu CSDL đã chạy migration có cột status.
 */
const query = require("../utils/dbQuery");

const baseSelect = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug,
         u.fullname AS author_name, u.userid AS author_id
  FROM posts p
  INNER JOIN categories c ON p.category_id = c.id
  INNER JOIN users u ON p.user_id = u.userid
`;

/** null = chưa kiểm tra; true/false = đã biết */
let postsHasStatusColumn = null;

/**
 * Kiểm tra một lần xem bảng posts có cột status không.
 * Nếu chưa có: website vẫn chạy, chỉ không lọc nháp/đăng.
 */
async function hasPostStatusColumn() {
  if (postsHasStatusColumn !== null) return postsHasStatusColumn;
  try {
    await query("SELECT status FROM posts LIMIT 1");
    postsHasStatusColumn = true;
  } catch (e) {
    if (e.code === "ER_BAD_FIELD_ERROR") {
      postsHasStatusColumn = false;
      console.warn(
        "[postModel] Bảng posts chưa có cột status. Chạy database/migration_extend.sql để có bản nháp/đăng.",
      );
    } else {
      throw e;
    }
  }
  return postsHasStatusColumn;
}

/** Điều kiện SQL: chỉ bài đã đăng (nếu có cột status) */
async function sqlPublishedPostPrefix() {
  const hasStatus = await hasPostStatusColumn();
  return hasStatus ? "p.status = 1 AND " : "";
}

async function findPublishedList(filters = {}) {
  const publishedStatusPrefix = await sqlPublishedPostPrefix();
  const {
    keyword,
    categoryId,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 9,
    orderBy = "p.created_at DESC",
  } = filters;

  const whereConditions = [`${publishedStatusPrefix}c.status = 1`];
  const queryParams = [];

  if (keyword) {
    whereConditions.push("(p.title LIKE ? OR p.summary LIKE ?)");
    const keywordLike = `%${keyword}%`;
    queryParams.push(keywordLike, keywordLike);
  }
  if (categoryId) {
    whereConditions.push("p.category_id = ?");
    queryParams.push(categoryId);
  }
  if (dateFrom) {
    whereConditions.push("DATE(p.created_at) >= ?");
    queryParams.push(dateFrom);
  }
  if (dateTo) {
    whereConditions.push("DATE(p.created_at) <= ?");
    queryParams.push(dateTo);
  }

  const whereSql = whereConditions.length
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";
  const offset = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const countRows = await query(
    `SELECT COUNT(*) AS total FROM posts p INNER JOIN categories c ON p.category_id = c.id ${whereSql}`,
    queryParams,
  );
  const total = countRows[0].total;

  const rows = await query(
    `${baseSelect} ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset],
  );

  return { rows, total, page: Number(page), pageSize: limit };
}

async function findPublishedById(id) {
  const publishedStatusPrefix = await sqlPublishedPostPrefix();
  const rows = await query(
    `${baseSelect} WHERE p.id = ? AND ${publishedStatusPrefix}c.status = 1`,
    [id],
  );
  return rows[0] || null;
}

async function incrementViews(id) {
  await query("UPDATE posts SET views = views + 1 WHERE id = ?", [id]);
}

async function findRelated(categoryId, excludeId, limit = 4) {
  const publishedStatusPrefix = await sqlPublishedPostPrefix();
  return query(
    `${baseSelect} WHERE p.category_id = ? AND p.id != ? AND ${publishedStatusPrefix}c.status = 1
     ORDER BY p.created_at DESC LIMIT ?`,
    [categoryId, excludeId, limit],
  );
}

async function findLatestPublished(limit) {
  const publishedStatusPrefix = await sqlPublishedPostPrefix();
  return query(
    `${baseSelect} WHERE ${publishedStatusPrefix}c.status = 1 ORDER BY p.created_at DESC LIMIT ?`,
    [limit],
  );
}

async function findPopularPublished(limit) {
  const publishedStatusPrefix = await sqlPublishedPostPrefix();
  return query(
    `${baseSelect} WHERE ${publishedStatusPrefix}c.status = 1 ORDER BY p.views DESC LIMIT ?`,
    [limit],
  );
}

async function findByCategoryPublished(categoryId, limit) {
  const publishedStatusPrefix = await sqlPublishedPostPrefix();
  return query(
    `${baseSelect} WHERE p.category_id = ? AND ${publishedStatusPrefix}c.status = 1
     ORDER BY p.created_at DESC LIMIT ?`,
    [categoryId, limit],
  );
}

async function adminList(filters = {}) {
  const hasStatusColumn = await hasPostStatusColumn();
  const {
    keyword,
    categoryId,
    dateFrom,
    dateTo,
    status,
    page = 1,
    pageSize = 10,
  } = filters;

  const whereConditions = ["1=1"];
  const queryParams = [];

  if (keyword) {
    whereConditions.push("(p.title LIKE ? OR p.summary LIKE ?)");
    const keywordLike = `%${keyword}%`;
    queryParams.push(keywordLike, keywordLike);
  }
  if (categoryId) {
    whereConditions.push("p.category_id = ?");
    queryParams.push(categoryId);
  }
  if (dateFrom) {
    whereConditions.push("DATE(p.created_at) >= ?");
    queryParams.push(dateFrom);
  }
  if (dateTo) {
    whereConditions.push("DATE(p.created_at) <= ?");
    queryParams.push(dateTo);
  }
  if (
    hasStatusColumn &&
    status !== undefined &&
    status !== "" &&
    status !== null
  ) {
    whereConditions.push("p.status = ?");
    queryParams.push(status);
  }

  const whereSql = `WHERE ${whereConditions.join(" AND ")}`;
  const offset = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const countRows = await query(
    `SELECT COUNT(*) AS total FROM posts p ${whereSql}`,
    queryParams,
  );
  const total = countRows[0].total;

  const rows = await query(
    `${baseSelect} ${whereSql} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset],
  );

  return { rows, total, page: Number(page), pageSize: limit };
}

async function findByIdAny(id) {
  const rows = await query(`${baseSelect} WHERE p.id = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const hasStatusColumn = await hasPostStatusColumn();
  const {
    title,
    summary,
    content,
    image,
    category_id,
    user_id,
    status = 1,
  } = data;
  if (hasStatusColumn) {
    const insertResult = await query(
      `INSERT INTO posts (title, summary, content, image, category_id, user_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, summary, content, image, category_id, user_id, status],
    );
    return insertResult.insertId;
  }
  const insertResult = await query(
    `INSERT INTO posts (title, summary, content, image, category_id, user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, summary, content, image, category_id, user_id],
  );
  return insertResult.insertId;
}

async function update(id, data) {
  const hasStatusColumn = await hasPostStatusColumn();
  const {
    title,
    summary,
    content,
    image,
    category_id,
    status,
  } = data;
  if (hasStatusColumn) {
    await query(
      `UPDATE posts SET title = ?, summary = ?, content = ?, image = ?, category_id = ?, status = ?
       WHERE id = ?`,
      [title, summary, content, image, category_id, status, id],
    );
    return;
  }
  await query(
    `UPDATE posts SET title = ?, summary = ?, content = ?, image = ?, category_id = ?
     WHERE id = ?`,
    [title, summary, content, image, category_id, id],
  );
}

async function remove(id) {
  await query("DELETE FROM posts WHERE id = ?", [id]);
}

module.exports = {
  findPublishedList,
  findPublishedById,
  incrementViews,
  findRelated,
  findLatestPublished,
  findPopularPublished,
  findByCategoryPublished,
  adminList,
  findByIdAny,
  create,
  update,
  remove,
};
