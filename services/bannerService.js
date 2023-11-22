const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ApiFeatures = require("../utils/apiFeatures");

const factory = require("./handlersFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

const Banner = require("../models/bannerModel");

exports.uploadBannerImage = uploadMixOfImages([
  {
    name: "images",
    maxCount: 7,
  },
]);

exports.setImageToBody = factory.setImageToBody(Banner);

// exports.resizeBannerImage = asyncHandler(async (req, res, next) => {
//   //1- Image processing for images
//   if (req.files.images) {
//     req.body.images = [];
//     await Promise.all(
//       req.files.images.map(async (img, index) => {
//         const imageName = `banner-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

//         await sharp(img.buffer)
//           .resize(2000, 1333)
//           .toFormat("jpeg")
//           .jpeg({ quality: 95 })
//           .toFile(`uploads/banners/${imageName}`);

//         // Save image into our db
//         req.body.images.push(imageName);
//       })
//     );

//     next();
//   }
//   //   if (req.files.images) {
//   //     const imagesFileName = `banner-${uuidv4()}-${Date.now()}.jpeg`;

//   //     await sharp(req.files.images[0].buffer)
//   //       .resize(2000, 1333)
//   //       .toFormat("jpeg")
//   //       .jpeg({ quality: 95 })
//   //       .toFile(`uploads/banners/${imagesFileName}`);

//   //     // Save image into our db
//   //     req.body.images = imagesFileName;
//   //   }
// });

// @desc    Get list of banners
// @route   GET /api/v1/banners
// @access  Public
// exports.getBanners = factory.getAll(Banner);
// let result = {};
//     for(let index = 0 ; index < documents.length ; index++) {
//       result[data._id] = {

//       }
//     }

// exports.getBanners = asyncHandler(async (req, res, next) => {
//   let filter = {};
//   if (req.filterObj) {
//     filter = req.filterObj;
//   }
//   // Build query
//   const documentsCounts = await Banner.countDocuments();
//   const apiFeatures = new ApiFeatures(Banner.find(filter), req.query)
//     .paginate(documentsCounts)
//     .filter()
//     .limitFields()
//     .sort();

//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const documents = await mongooseQuery;

//   if (documents.length > 0) {
//     const { _id, images } = documents[0];

//     const data = {
//       id: _id,
//       images: images.map((image, index) => ({
//         // [`banner${index + 1}`]: {
//         url: image.url,
//         imageId: image.imageId,
//         // },
//       })),
//     };

//       res.status(200).json({ results: 1, paginationResult, data });
//   } else {
//     res.status(200).json({ results: 0, paginationResult, data: {} });
//   }
// });

exports.getBanners = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }
  // Build query
  const documentsCounts = await Banner.countDocuments();
  const apiFeatures = new ApiFeatures(Banner.find(filter), req.query)
    .paginate(documentsCounts)
    .filter()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  // Check if documents length is greater than 0
  if (documents.length > 0) {
    // Return the first document as an object
    const data = documents;

    res.status(200).json({ results: 1, paginationResult, data });
  } else {
    res.status(200).json({ results: 0, paginationResult, data: {} });
  }
});

// @desc    Get specific banner by id
// @route   GET /api/v1/banners/:id
// @access  Public
exports.getBanner = factory.getOne(Banner);

// @desc    Create banner
// @route   POST  /api/v1/banners
// @access  Private
// exports.createBanner = factory.createOne(Banner);
exports.createBanner = async (req, res) => {
  try {
    const images = req.body.images.map((file) => ({
      url: file.url,
      imageId: file.imageId,
    }));

    const banner = new Banner({ images });
    await banner.save();

    res.status(201).json({ message: "Banner created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create banner" });
  }
};
// @desc    Update specific banner
// @route   PUT /api/v1/banners/:id
// @access  Private
exports.updateBanner = factory.updateOne(Banner);

// @desc    Delete specific banner
// @route   DELETE /api/v1/banners/:id
// @access  Private
exports.deleteBanner = factory.deleteOne(Banner);
