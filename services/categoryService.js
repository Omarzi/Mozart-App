const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const Category = require("../models/categoryModel");

// @desc    Get list of categories
// @route   GET /api/v1/categoris
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await Category.find().skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc    Get sepecific category by id
// @route   GET /api/v1/categoris/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ dara: category });
});

// @desc    Create category
// @route   POST /api/v1/categoris
// @access  Private
exports.createCategories = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc    Update sepecific category by id
// @route   Put /api/v1/categoris/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Delete sepecific category by id
// @route   DELETE /api/v1/categoris/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(204).send();
});
