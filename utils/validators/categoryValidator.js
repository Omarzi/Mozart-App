const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");

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
    .custom(async (name) => {
      const brandName = await CategoryModel.findOne({ name: name });
      if (brandName) {
        throw new Error("category already exists");
      }
      return true;
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("nameAr")
    .notEmpty()
    .withMessage("Category required")
    .custom(async (name) => {
      const brandName = await CategoryModel.findOne({ name: name });
      if (brandName) {
        throw new Error("category already exists");
      }
      return true;
    })
    .bail()
    .isLength({ min: 3 })
    .withMessage("Too short category nameAr")
    .isLength({ max: 32 })
    .withMessage("Too long category nameAr")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

// dry=> Don't repeat your self => ولكن هنا عادي لان لازم تعمل اتشكات

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalide category id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalide category id format"),
  validatorMiddleware,
];
