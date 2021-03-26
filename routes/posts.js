const express = require("express");
const { createPost, getPosts, deletePost, updatePost, getPost } = require("../controllers/postsController");
const checkAuth = require("../middlewares/check-auth");
const extractFile = require("../middlewares/file");

const router = express.Router();

router.route('/')
      .get(getPosts)
      .post(checkAuth, extractFile, createPost);
router.route('/:id')
      .get(getPost)
      .put(checkAuth, updatePost)
      .delete(checkAuth, deletePost);
module.exports = router;