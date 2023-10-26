const express = require("express");

const { createSubCategory } = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router();

router.route("/").post(createSubCategoryValidator, createSubCategory);

module.exports = router;
