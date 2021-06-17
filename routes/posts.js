const express = require("express");
const { createPost, getPosts, deletePost, updatePost, getPost, addComment, likePost, userLikes, unlikePost } = require("../controllers/postsController");
const checkAuth = require("../middlewares/check-auth");
const extractFile = require("../middlewares/file");

const router = express.Router();

router.route('/')
      .get(getPosts)
      .post(checkAuth, extractFile, createPost);
router.route('/:id')
      .get(getPost)
      .put(checkAuth, extractFile, updatePost)
      .delete(checkAuth, deletePost);
router.route('/:id/comment')
      .patch(checkAuth, addComment)
router.route('/:id/like')
      .post(checkAuth, likePost)
router.route('/:id/unlike')
      .post(checkAuth, unlikePost)
router.route('/users/likes')
      .get(checkAuth, userLikes)
module.exports = router;