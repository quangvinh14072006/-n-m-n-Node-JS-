const express = require('express');
const router = express.Router();
const categoryController = require('../controller/create_controller');

router.get('/', categoryController.getList);
router.post('/create', categoryController.create);

router.get('/edit/:id', categoryController.getEditForm);
router.post('/edit/:id', categoryController.update);

// HTML form không hỗ trợ method DELETE trực tiếp, nên dùng POST để mô phỏng
router.post('/delete/:id', categoryController.delete);

module.exports = router;