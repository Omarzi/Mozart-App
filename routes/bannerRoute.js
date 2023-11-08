const express = require("express");

const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  resizeBannerImage,
} = require("../services/bannerService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getBanners)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBannerImage,
    resizeBannerImage,
    createBanner
  );
router
  .route("/:id")
  .get(getBanner)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBannerImage,
    resizeBannerImage,
    updateBanner
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteBanner
  );

module.exports = router;
