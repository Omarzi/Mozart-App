const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
// const ApiError = require("../utils/apiError");
const SubCategory = require("../models/subCategoryModel");

// @desc    Create subcategory
// @route   POST /api/v1/subcategoris
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});
