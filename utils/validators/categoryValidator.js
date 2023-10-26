const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// 1- rules
// 2- middlewares => catch errors from rules if exist
// in file validator in utils

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalide category id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
  validatorMiddleware,
];

// dry=> Don't repeat your self => ولكن هنا عادي لان لازم تعمل اتشكات

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalide category id format"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalide category id format"),
  validatorMiddleware,
];
