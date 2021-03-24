const express = require("express");
const { createPost, getPosts, deletePost, updatePost, getPost, imageUpload } = require("../controllers/postsController");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.route('/')
      .get(getPosts)
      .post(checkAuth, imageUpload, createPost);
router.route('/:id')
      .get(getPost)
      .put(checkAuth, updatePost)
      .delete(checkAuth, deletePost);
module.exports = router;