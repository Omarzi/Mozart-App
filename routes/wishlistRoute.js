const express = require("express");
// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandValidator");

const authService = require("../services/authService");

const {
  addProductToWishList,
  removeProductFromWishlist,
  getLoggedUserWishList,
} = require("../services/wishlistService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route('/').post(addProductToWishList).get(getLoggedUserWishList);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;
