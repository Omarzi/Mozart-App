const express = require("express");
const {
    updateProductValidator,
  } = require('../utils/validators/productValidateor');

const {
  uploadImageFromUser,
  uploadProductImages,
  resizeProductImages,
} = require("../services/uploadImageFromUserService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/:id")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    uploadImageFromUser
  );

module.exports = router;
