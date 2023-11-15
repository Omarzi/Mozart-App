const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

// 1- rules
// 2- middlewares => catch errors from rules if exist
// in file validator in utils

exports.createUserValidator = [
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

  check("lat").notEmpty().withMessage("Lat required"),
  check("lng").notEmpty().withMessage("Lng required"),
  check("address").notEmpty().withMessage("address required"),


  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalide User id format"),
  validatorMiddleware,
];

// dry=> Don't repeat your self => ولكن هنا عادي لان لازم تعمل اتشكات

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalide User id format"),
  body("name")
    .optional()
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

  check("phone").notEmpty()
  .withMessage("Phone number required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept Egy and SA phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),

  check("street").notEmpty().withMessage("Street address required"),

  check("apartment").notEmpty().withMessage("Apartment number required"),

  check("zip").notEmpty().withMessage("Zip code required"),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalide User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),

  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      //2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalide User id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("name")
    .optional()
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

  check("phone").notEmpty()
  .withMessage("Phone number required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept Egy and SA phone numbers"),

  check("profileImg").optional(),

  check("street").notEmpty().withMessage("Street address required"),

  check("apartment").notEmpty().withMessage("Apartment number required"),

  check("zip").notEmpty().withMessage("Zip code required"),

  validatorMiddleware,
];