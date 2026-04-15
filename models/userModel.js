// Các câu lệnh SQL liên quan đến bảng users
const db = require("../config/database");
//Hàm kiểm tra tài khoản
const User = {
  findByUsernameAndPassword: (username, password, callback) => {
    //Dựa vào CSDL kiểm tra username , password
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  },
};

module.exports = User;
