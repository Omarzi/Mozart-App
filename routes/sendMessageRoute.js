const express = require("express");

const {
  createMessage,
  getAllMessages,
} = require("../services/sendMessageService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("manager", "admin"),
    getAllMessages
  )
  
router.route('/:id').post(authService.protect, authService.allowedTo("user"), createMessage);

module.exports = router;
