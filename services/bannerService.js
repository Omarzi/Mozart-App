const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlersFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

const Banner = require("../models/bannerModel");

exports.uploadBannerImage = uploadMixOfImages([
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeBannerImage = asyncHandler(async (req, res, next) => {
  //1- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `banner-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/banners/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
  //   if (req.files.images) {
  //     const imagesFileName = `banner-${uuidv4()}-${Date.now()}.jpeg`;

  //     await sharp(req.files.images[0].buffer)
  //       .resize(2000, 1333)
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 95 })
  //       .toFile(`uploads/banners/${imagesFileName}`);

  //     // Save image into our db
  //     req.body.images = imagesFileName;
  //   }
});

// @desc    Get list of banners
// @route   GET /api/v1/banners
// @access  Public
exports.getBanners = factory.getAll(Banner);

// @desc    Get specific banner by id
// @route   GET /api/v1/banners/:id
// @access  Public
exports.getBanner = factory.getOne(Banner);

// @desc    Create banner
// @route   POST  /api/v1/banners
// @access  Private
exports.createBanner = factory.createOne(Banner);
// @desc    Update specific banner
// @route   PUT /api/v1/banners/:id
// @access  Private
exports.updateBanner = factory.updateOne(Banner);

// @desc    Delete specific banner
// @route   DELETE /api/v1/banners/:id
// @access  Private
exports.deleteBanner = factory.deleteOne(Banner);
