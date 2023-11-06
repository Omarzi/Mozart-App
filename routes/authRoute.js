const express = require("express");
const {
  signupUserValidator,
  loginUserValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.post("/signup", signupUserValidator, signup);
router.post("/login", loginUserValidator, login);
router.post("/forgotPassword", forgetPassword);
router.post("/verifyResetCode", verifyPasswordResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
