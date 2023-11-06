const { check } = require("express-validator");
// eslint-disable-next-line import/no-extraneous-dependencies
const { similarity } = require("string-similarity");
const Address = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");


// exports.getAddressesValidator = [
//   check("id").isMongoId().withMessage("Invalide Address id format"),
//   validatorMiddleware,
// ];

exports.addAddressesValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Invalid Address alias")
    .custom(async (value, { req }) => {
      const existingAddresses = await Address.find();
      const similarAlias = existingAddresses.find(
        (address) => similarity(address.alias, value) > 0.8
      );
      if (similarAlias) {
        throw new Error("Alias is too similar to an existing address");
      }
      return true;
    }),
  check("details").notEmpty().withMessage("Invalid Address details"),
  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number. Only accept Egyptian and Saudi phone numbers"
    ),
  check("postalCode")
    .notEmpty()
    .withMessage("Postal code required")
    .custom((value, { req }) => {
      // Regular expression pattern for Egyptian postal code format
      const postalCodePattern = /^[1-9][0-9]{4}$/;
      if (!postalCodePattern.test(value)) {
        throw new Error("Invalid Egyptian postal code");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.removeAddressesValidator = [
  check("id").isMongoId().withMessage("Invalide Address id format"),
  validatorMiddleware,
];
