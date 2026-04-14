const express = require('express');
const router = express.Router();
const postController = require('../controller/post_controller');

router.get('/', postController.list);
router.get('/create', postController.createForm);
router.post('/create', postController.create);
router.get('/edit/:id', postController.editForm);
router.post('/edit/:id', postController.update);
router.get('/delete/:id', postController.delete);

module.exports = router;
