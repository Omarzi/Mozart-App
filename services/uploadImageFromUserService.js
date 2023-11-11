const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const UploadImageDromUser = require("../models/uploadImagesFromUserModel");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "image",
    maxCount: 1,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for image
  if (req.files.image) {
    const imageFileName = `product-${uuidv4()}-${Date.now()}-from-user.jpeg`;

    await sharp(req.files.image[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/uploadImageFromUser/${imageFileName}`);

    // Save image into our db
    req.body.image = imageFileName;
    next();
  }
});

exports.uploadImageFromUser = factory.uploadImage(UploadImageDromUser);

exports.getImagesFromUser = factory.getAllImages(UploadImageDromUser);