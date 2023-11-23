/* eslint-disable no-shadow */
const asyncHandler = require("express-async-handler");
const { Model } = require("mongoose");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    // document.remove();
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update document
    // document.save();
    if (req.updateImages) {
      // Remove images with IDs from req.body.imagesIds
      if (req.body.imagesIds && req.body.imagesIds.length > 0) {
        document.images = document.images.filter(
          (image) => !req.body.imagesIds.includes(image.imageId)
        );
      }

      // Add new images using $addToSet to prevent duplicates
      if (req.imagesToStore && req.imagesToStore.length > 0) {
        document.images.push(...req.imagesToStore);
      }

      // Save the updated document
      await document.save();
    }

    if (req.deleteImages) {
      // Remove images with IDs from req.body.imagesIds
      if (req.body.imageIdsToDelete && req.body.imageIdsToDelete.length > 0) {
        document.images = document.images.filter(
          (image) => !req.body.imageIdsToDelete.includes(image.imageId)
        );
      }
      await document.save();
    }
    res.status(200).json({ data: document });
  });

/*
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update document
    document.save();

    

    res.status(200).json({ data: document });
  });
*/

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

//************** Create Product

exports.createProduct = (Model) =>
  asyncHandler(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

//************** Create Product

//************************************************************************************************
exports.uploadImage = (Model) => async (req, res, next) => {
  try {
    console.log(req);
    const userId = req.user.id;
    const _id = req.body.productId;

    // Fetch user data based on the user ID
    const user = await User.findById(userId).select("name phone email"); // Add other fields as needed
    const product = await Product.findById(_id); // Add other fields as needed

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      req.body.user = userId;
      req.body.product = _id;

      const newDoc = await Model.create(req.body);

      res.status(201).json({
        status: "success",
        data: {
          // image: newDoc.image,
          image: {
            url: req.body.image.url,
            imageId: req.body.image.imageId,
          },
          nameOfProduct: newDoc.nameOfProduct,
          nameOfProductAr: newDoc.nameOfProductAr,
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            // Add other user fields as needed
          },
          _id: newDoc._id,
          createdAt: newDoc.createdAt,
          updatedAt: newDoc.updatedAt,
          __v: newDoc.__v,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllImages = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query with population of the 'user' field
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery.populate("user", "name phone email");

    // Replace 'user' field with 'userdata'
    const updatedDocuments = documents.map((doc) => {
      const {
        _id,
        image,
        nameOfProductAr,
        nameOfProduct,
        user,
        createdAt,
        updatedAt,
      } = doc;
      const userdata = user
        ? { name: user.name, phone: user.phone, email: user.email }
        : null;
      return {
        _id,
        image,
        nameOfProductAr,
        nameOfProduct,
        userdata,
        createdAt,
        updatedAt,
      };
    });

    res.status(200).json({
      results: updatedDocuments.length,
      paginationResult,
      data: updatedDocuments,
    });
  });

//********************************

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 1) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });
exports.getproductOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 1) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

exports.getAllBanners = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    const images = documents.map((doc) => doc.images[0]); // Extract the first image URL from each document

    res.status(200).json({ images });
  });

// Cloudnary
exports.setImageToBody = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(`There is no document with this id ${req.params.id}`, 404)
      );
    }

    req.image = document.image;

    if (document.images) {
      req.images = document.images;
    }

    if (req.files || req.body.imagesIds || req.body.imageIdsToDelete) {
      const storedImages = document.images.map((obj) => obj.imageId) || 0;
      const newImages = req.files.images;
      const updateImages = req.body.imagesIds;
      const deleteImages = req.body.imageIdsToDelete;
      if (newImages && !updateImages) {
        if (newImages.length > 8 - storedImages.length) {
          return next(new ApiError("Max number of images is 8", 404));
        }
        req.imagesToAdd = newImages;
      }

      if (updateImages) {
        if (!newImages) {
          return next(new ApiError("there are no images to update", 404));
        }

        if (newImages.length < updateImages.length) {
          return next(
            new ApiError("provide an id for each image you want to update", 404)
          );
        }

        if (updateImages.length > storedImages.length) {
          return next(
            new ApiError("images exceeds the number of images stored", 404)
          );
        }

        const imagesIdsExists = storedImages.some(
          (imageId) => updateImages.indexOf(imageId) !== -1
        );

        if (!imagesIdsExists) {
          return next(new ApiError("images Ids dont exist", 404));
        }

        const imagesToUpdate = newImages.slice(0, updateImages.length);
        const imagesIdsToUpdate = updateImages;
        req.imagesToAdd = newImages.slice(updateImages.length);
        req.imagesToUpdate = imagesToUpdate.map((x, i) => ({
          image: x,
          imageId: imagesIdsToUpdate[i],
        }));
      }

      if (deleteImages) {
        if (updateImages) {
          const imagesIdsExistsInUpdateImages = deleteImages.some(
            (imageId) => updateImages.indexOf(imageId) !== -1
          );
          if (imagesIdsExistsInUpdateImages) {
            return next(
              new ApiError(
                "You can't update and delete an image at the same time",
                404
              )
            );
          }
        }

        if (deleteImages.length > storedImages.length) {
          return next(
            new ApiError("images exceeds the number of images stored", 404)
          );
        }

        const imagesIdsExists = storedImages.some(
          (imageId) => deleteImages.indexOf(imageId) !== -1
        );

        if (!imagesIdsExists) {
          return next(new ApiError("images Ids dont exist", 404));
        }
        req.imagesToDelete = deleteImages;
      }
    }
    next();
  });

// exports.updateImage = (
