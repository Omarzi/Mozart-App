const express = require("express");
const {
  updateProductValidator,
} = require("../utils/validators/productValidateor");

const {
  uploadImageFromUser,
  getImagesFromUser,
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

router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    getImagesFromUser
  );

module.exports = router;
