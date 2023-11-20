const factory = require("./handlersFactory"),
  getAll = require("./getAll");
const Coupon = require("../models/couponModel");

// @desc    Get list of coupon
// @route   GET /api/v1/coupons
// @access  Private/Admin-Manager
exports.getCoupons = getAll.getAll(Coupon);

// @desc    Get sepecific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Public
exports.getCoupon = factory.getOne(Coupon);

// @desc    Create coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin-Manager
exports.createCoupon = factory.createOne(Coupon);

// @desc    Update sepecific coupon by id
// @route   Put /api/v1/coupons/:id
// @access  Private/Admin-Manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc    Delete sepecific coupon by id
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = factory.deleteOne(Coupon);
