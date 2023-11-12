const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find().populate("product", "title image images");
  const revier = await Review.find();
  console.log(revier);
  const responseData = reviews.map((review) => ({
    _id: review._id,
    title: review.product.title,
    image: review.product.image.url,
    ratings: review.ratings,
    user: review.user,
    product: review.product,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }));

  const response = {
    results: reviews.length,
    paginationResult: {
      currentPage: 1,
      limit: 50,
      numberOfPages: 1,
    },
    data: reviews,
  };

  res.status(200).json(response);
});
// exports.getReviews = factory.getAll(Review);

// @desc    Get sepecific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// Nested route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
// exports.createReview = factory.createOne(Review);
exports.createReview = asyncHandler(async (req, res, next) => {
  const userId = req.body.user;
  const _id = req.body.product;

  const product = await Product.findById(_id);
  const hasreview = await Review.find({ user: userId });
  if (!product && hasreview) {
    res.status(404).json({ message: "Product not found or you have a review" });
  } else {
    const newDoc = await Review.create(req.body);
    res.status(201).json({ data: newDoc });
  }
});

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);
