const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

// 1- rules
// 2- middlewares => catch errors from rules if exist
// in file validator in utils

exports.signupUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept Egy and SA phone numbers"),

  check("profileImg").optional(),

  check("role").optional(),

  check("street").notEmpty().withMessage("Street address required"),

  check("apartment").notEmpty().withMessage("Apartment number required"),

  check("city").notEmpty().withMessage("City name required"),

  check("country").notEmpty().withMessage("Country name required"),

  check("zip").notEmpty().withMessage("Zip code required"),
  check("lat").notEmpty().withMessage("Lat is required"),
  check("lng").notEmpty().withMessage("Lng is required"),

  validatorMiddleware,
];

exports.loginUserValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];
