const express = require('express');
const authMiddleware = require('../middlewares/Auth-middleware');
const {getPosts, getPost, createPost, updatePost, deletePost} = require('../controllers/postController');
const extractFile = require('../middlewares/multer-middleware');

const router = express.Router();
    

  
router.get('/', getPosts);

router.get('/:id',authMiddleware, getPost)

router.post('/' ,authMiddleware, extractFile, createPost);

router.put('/:id', authMiddleware, extractFile, updatePost);

router.delete('/:id', authMiddleware, deletePost);

module.exports = router;