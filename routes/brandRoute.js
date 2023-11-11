const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  uploadImage,
  uploadImages,
  deleteImages,
  deleteImage,
  updateImage,
  updateImages,
} = require("../config/cloudinary");

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  setImageToBody,
  // resizeImage,
} = require("../services/brandService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    // resizeImage,
    createBrandValidator,
    uploadImage('brand'),
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    // resizeImage,
    updateBrandValidator,
    setImageToBody,
    updateImage,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteBrandValidator,
    setImageToBody,
    deleteImage,
    deleteBrand
  );

module.exports = router;
