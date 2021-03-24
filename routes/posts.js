const express = require("express");
const { createPost, getPosts, deletePost, updatePost, getPost } = require("../controllers/postsController");

const router = express.Router();

router.route('/')
      .get(getPosts)
      .post(createPost)
router.route('/:id')
      .get(getPost)
      .put(updatePost)
      .delete(deletePost)

module.exports = router;