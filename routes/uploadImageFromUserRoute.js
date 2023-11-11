const express = require("express");
const {
  updateProductValidator,
} = require("../utils/validators/productValidateor");

const {
  uploadImage,
  deleteImages,
  deleteImage,
} = require("../config/cloudinary");

const {
  uploadImageFromUser,
  getImagesFromUser,
  uploadProductImages,
  // resizeProductImages,
  setImageToBody,
  deleteProduct,
} = require("../services/uploadImageFromUserService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/:id")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    uploadProductImages,
    // resizeProductImages,
    updateProductValidator,
    uploadImage("user"),
    uploadImageFromUser
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setImageToBody,
    deleteImage,
    deleteProduct
  );

router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    getImagesFromUser
  );

module.exports = router;
