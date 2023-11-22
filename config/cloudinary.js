// Import the Cloudinary library
const path = require("path");

// eslint-disable-next-line import/no-extraneous-dependencies
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const DatauriParser = require("datauri/parser");
// const ApiError = require("../utils/ApiError");

const parser = new DatauriParser();

dotenv.config({ path: "../config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = (name) =>
  asyncHandler(async (req, res, next) => {
    if (req.file || req.files) {
      const file = req.file || req.files.image[0];
      const imageToUri = await parser.format(
        path.extname(file.originalname).toString(),
        file.buffer
      );

      const filename = `${name}-${uuidv4()}-${Date.now()}`;

      const uploadOptions = {
        folder: name,
        public_id: filename,
        allowed_formats: ["jpg", "jpeg", "png", "gif", "avif"],
        transformation: [
          { width: 600, height: 600, crop: "fit" },
          { quality: 95 },
        ],
      };
      const uploadedImage = await cloudinary.uploader.upload(
        imageToUri.content,
        uploadOptions
      );
      const url = uploadedImage.secure_url;
      const imageId = uploadedImage.public_id;
      const image = { url: url, imageId: imageId };
      req.body.image = image;
    }
    next();
  });

exports.updateImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const file = req.file;

    const imageToUri = await parser.format(
      path.extname(file.originalname).toString(),
      file.buffer
    );

    const uploadOptions = {
      public_id: req.image.imageId,
      allowed_formats: ["jpg", "jpeg", "png", "gif", "avif"],
      transformation: [
        { width: 600, height: 600, crop: "fit" },
        { quality: 90 },
      ],
      overwrite: true,
    };

    const uploadedImage = await cloudinary.uploader.upload(
      imageToUri.content,
      uploadOptions
    );
    const image = {
      url: uploadedImage.secure_url,
      imageId: uploadedImage.public_id,
    };
    req.body.image = image;
  }
  if (req.files) {
    if (req.files.image) {
      const file = req.files.image[0];

      const imageToUri = await parser.format(
        path.extname(file.originalname).toString(),
        file.buffer
      );

      const uploadOptions = {
        public_id: req.image.imageId,
        allowed_formats: ["jpg", "jpeg", "png", "gif", "avif"],
        transformation: [
          { width: 600, height: 600, crop: "fit" },
          { quality: 90 },
        ],
        overwrite: true,
      };

      const uploadedImage = await cloudinary.uploader.upload(
        imageToUri.content,
        uploadOptions
      );
      const image = {
        url: uploadedImage.secure_url,
        imageId: uploadedImage.public_id,
      };
      req.body.image = image;
    }
  }
  next();
});

exports.uploadImages = (name) =>
  asyncHandler(async (req, res, next) => {
    if (req.files) {
      const { images } = req.files;
      // console.log(images);
      const uploadedImages = [];

      // Use Promise.all to upload images in parallel
     await Promise.all(
        images.map(async (element) => {
          const imageToUri = await parser.format(
            path.extname(element.originalname).toString(),
            element.buffer
          );

          const filename = `${name}-${uuidv4()}-${Date.now()}`;

          const uploadOptions = {
            folder: name,
            public_id: filename,
            allowed_formats: ["jpg", "jpeg", "png", "gif", "avif"],
            transformation: [
              { width: 600, height: 600, crop: "fit" },
              // { width: 2000, height: 1333, crop: "fit" },
              { quality: 95 },
            ],
          };

          // Use await inside this Promise.all
          const uploadedImage = await cloudinary.uploader.upload(
            imageToUri.content,
            uploadOptions
          );
          const url = uploadedImage.secure_url;
          const imageId = uploadedImage.public_id;
          const image = { url: url, imageId: imageId };
          uploadedImages.push(image);
          console.log(uploadedImage)
        })
     );

      req.body.images = uploadedImages;
    }
    // console.log(req.body.images);
    next();
  });

exports.updateImages = (name) =>
  asyncHandler(async (req, res, next) => {
    const uploadedImages = [];
    if (req.imagesToAdd) {
      const images = req.imagesToAdd;

      // Use Promise.all to upload images in parallel
      await Promise.all(
        images.map(async (element) => {
          const imageToUri = await parser.format(
            path.extname(element.originalname).toString(),
            element.buffer
          );

          const filename = `${name}-${uuidv4()}-${Date.now()}`;

          const uploadOptions = {
            folder: name,
            public_id: filename,
            allowed_formats: ["jpg", "jpeg", "png", "gif", "avif"],
            transformation: [
              { width: 600, height: 600, crop: "fit" },
              { quality: 95 },
            ],
          };

          // Use await inside this Promise.all
          const uploadedImage = await cloudinary.uploader.upload(
            imageToUri.content,
            uploadOptions
          );
          const url = uploadedImage.secure_url;
          const imageId = uploadedImage.public_id;
          const image = { url: url, imageId: imageId };
          uploadedImages.push(image);
        })
      );
    }

    if (req.imagesToUpdate) {
      // images to update
      // image id
      await Promise.all(
        req.imagesToUpdate.map(async (item) => {
          const imageToUri = await parser.format(
            path.extname(item.image.originalname).toString(),
            item.image.buffer
          );

          const uploadOptions = {
            public_id: item.imageId,
            allowed_formats: ["jpg", "jpeg", "png", "gif", "avif"],
            transformation: [
              { width: 600, height: 600, crop: "fit" },
              { quality: 90 },
            ],
            overwrite: true,
          };

          const uploadedImage = await cloudinary.uploader.upload(
            imageToUri.content,
            uploadOptions
          );

          const image = {
            url: uploadedImage.secure_url,
            imageId: uploadedImage.public_id,
          };
          uploadedImages.push(image);
        })
      );
    }

    if (req.imagesToDelete) {
      await Promise.all(
        req.imagesToDelete.map(async (item) => {
          const publicId = item;
          const deleted = await cloudinary.uploader.destroy(publicId);
          await deleted;
        })
      );
      req.deleteImages = true;
    }
    req.imagesToStore = uploadedImages;
    req.updateImages = true;
    next();
  });

exports.deleteImage = asyncHandler(async (req, res, next) => {
  const publicId = req.image.imageId;
  const deleted = await cloudinary.uploader.destroy(publicId);
  await deleted;
  next();
});

exports.deleteImages = asyncHandler(async (req, res, next) => {
  await Promise.all(
    req.images.map(async (item) => {
      const publicId = item.imageId;
      const deleted = await cloudinary.uploader.destroy(publicId);
      await deleted;
    })
  );
  next();
});
