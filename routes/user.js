const express = require("express");
const { createUser, getUsers, getUser, loginUser, updateUser, deleteUser } = require("../controllers/usersController");

const router = express.Router();

router.route("/signup")
      .post(createUser)
router.route("/login")
      .post(loginUser)
router.route("/")
      .get(getUsers)
router.route("/:id")
      .get(getUser)
      .put(updateUser)
      .delete(deleteUser)

module.exports = router;