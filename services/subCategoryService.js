const factory = require("./handlersFactory");
const SubCategory = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET      /api/v1/categoris/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Create subcategory
// @route   POST /api/v1/subcategoris
// @access  Private/Admin
exports.createSubCategory = factory.createOne(SubCategory);

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc    Get sepecific subcategory by id
// @route   GET /api/v1/subcategory/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Update sepecific subcategory by id
// @route   Put /api/v1/subcategory/:id
// @access  Private/Admin
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete sepecific subcategory by id
// @route   DELETE /api/v1/subcategory/:id
// @access  Private/Admin
exports.deleteSubCategory = factory.deleteOne(SubCategory);
