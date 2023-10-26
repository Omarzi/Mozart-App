const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// 1- rules
// 2- middlewares => catch errors from rules if exist
// in file validator in utils

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalide Subcategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name"),
  check("category").isMongoId().withMessage("Invalide Category id format")
    .validatorMiddleware,
];

// dry=> Don't repeat your self => ولكن هنا عادي لان لازم تعمل اتشكات

// exports.updateSubCategoryValidator = [
//   check("id").isMongoId().withMessage("Invalide SubCategory id format"),
//   validatorMiddleware,
// ];

// exports.deleteSubCategoryValidator = [
//   check("id").isMongoId().withMessage("Invalide Subcategory id format"),
//   validatorMiddleware,
// ];
