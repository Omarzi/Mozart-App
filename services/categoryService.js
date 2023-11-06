// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Category = require("../models/categoryModel");

// Upload Single Image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    // Save image into our db
    // req.body.image = req.hostname+filename  => if you save link of image
    req.body.image = filename;
  }

  next();
});

// @desc    Get list of categories
// @route   GET /api/v1/categoris
// @access  Public
exports.getCategories = factory.getAll(Category);

// @desc    Get sepecific category by id
// @route   GET /api/v1/categoris/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST /api/v1/categoris
// @access  Private/Admin
exports.createCategory = factory.createOne(Category);

// @desc    Update sepecific category by id
// @route   Put /api/v1/categoris/:id
// @access  Private/Admin
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete sepecific category by id
// @route   DELETE /api/v1/categoris/:id
// @access  Private/Admin
exports.deleteCategory = factory.deleteOne(Category);
