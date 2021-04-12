const express = require("express");
const { sendMessage, getMessage, getConversation, getInbox } = require("../controllers/messagesController");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.use(checkAuth);

router.route('/')
      .get()
      .post(sendMessage);
router.route('/inbox')
      .get(getInbox)
router.route('/id/:id')
      .get(getMessage)
      .delete();
router.route('/:recipient')
      .get(getConversation)


module.exports = router;