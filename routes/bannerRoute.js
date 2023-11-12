const express = require("express");

const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  resizeBannerImage,
  setImageToBody,
} = require("../services/bannerService");

const { uploadImages, updateImage, updateImages, deleteImages } = require("../config/cloudinary");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getBanners)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBannerImage,
    // resizeBannerImage,
    uploadImages('banner'),
    createBanner
  );
router
  .route("/:id")
  .get(getBanner)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBannerImage,
    // resizeBannerImage,
    setImageToBody,
    updateImage,
    updateImages('banner'),
    updateBanner
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setImageToBody,
    deleteImages,
    deleteBanner
  );

module.exports = router;
