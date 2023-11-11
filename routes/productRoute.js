const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidateor");

const {
  uploadImage,
  uploadImages,
  deleteImages,
  deleteImage,
  updateImage,
  updateImages,
} = require("../config/cloudinary");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  setImageToBody,
  // resizeProductImages,
} = require("../services/productService");
const authService = require("../services/authService");
const reviewsRoute = require("./reviewRoute");

const router = express.Router();

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
router.use("/:productId/reviews", reviewsRoute);

router.route("/").get(getProducts).post(
  authService.protect,
  authService.allowedTo("admin", "manager"),
  uploadProductImages,
  // (req, res, next) => {
  //   console.log(req.file);
  // },
  // resizeProductImages,
  createProductValidator,
  uploadImage("product"),
  uploadImages("product"),
  createProduct
);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    // resizeProductImages,
    updateProductValidator,
    // setImageToBody,
    updateImage,
    updateImages('product'),
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductValidator,
    setImageToBody,
    deleteImage,
    deleteImages,
    deleteProduct
  );

module.exports = router;
