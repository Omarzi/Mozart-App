const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  uploadImage,
  deleteImage,
  updateImage,
} = require("../config/cloudinary");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  // resizeImage,
  setImageToBody,
} = require("../services/categoryService");

const authService = require("../services/authService");

const subCategoriesRoute = require("./subCategoryRoute");
const productRoute = require("./productRoute");

const router = express.Router();

// Nested route
router.use("/:categoryId/subcategories", subCategoriesRoute);
router.use("/:categoryId/products", productRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    // resizeImage,
    createCategoryValidator,
    uploadImage('category'),
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    // resizeImage,
    updateCategoryValidator,
    setImageToBody,
    updateImage,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    setImageToBody,
    deleteImage,
    deleteCategory
  );

module.exports = router;
