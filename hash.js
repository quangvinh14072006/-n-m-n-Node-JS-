const bcrypt = require("bcryptjs");
//Tạo mã băm cho mật khẩu 123456
bcrypt.hash("123456", 10, function (err, hash) {
  if (err) console.log(err);
  console.log("CHUỖI MÃ HÓA");
  console.log(hash);
});
