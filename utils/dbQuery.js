/**
 * Biến pool.query (callback) thành hàm trả về Promise — gọi await query(...) trong controller/model.
 */
const util = require("util");
const pool = require("../config/db");

const query = util.promisify(pool.query).bind(pool);

module.exports = query;
