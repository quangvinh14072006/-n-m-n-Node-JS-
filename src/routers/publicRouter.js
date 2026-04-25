const express = require("express");
const router = express.Router();
const homeController = require("../controllers/client/homeController");

//Trang chủ
router.get("/", homeController.RenderHome);

module.exports=router;
