const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc    Create product to wish
// @route   POST /api/v1/wishlist
// @access  Protected/User
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // Add to set => add productId to wish list array if productId not exist
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

// @desc    Remove product to wish
// @route   POST /api/v1/wishlist
// @access  Protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // Add to set => remove productId from wish list array if productId exist
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist",
    data: user.wishlist,
  });
});

// @desc    Get logged user wish
// @route   GET /api/v1/wishlist
// @access  Protected/User
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({ status: "Success", results: user.wishlist.length, data: user.wishlist });
});
