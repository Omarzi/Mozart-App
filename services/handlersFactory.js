/* eslint-disable no-shadow */
const asyncHandler = require("express-async-handler");
const { Model } = require("mongoose");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const User = require('../models/userModel')

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
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

//************************************************************************************************
exports.uploadImage = (Model) => async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user data based on the user ID
    const user = await User.findById(userId).select('name phone email'); // Add other fields as needed

    req.body.user = userId;

    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        image: newDoc.image,
        nameOfProduct: newDoc.nameOfProduct,
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
    const documents = await mongooseQuery.populate('user', 'name phone email');

    // Replace 'user' field with 'userdata'
    const updatedDocuments = documents.map(doc => {
      const { _id, image, nameOfProduct, user, createdAt, updatedAt } = doc;
      const userdata = user ? { name: user.name, phone: user.phone, email: user.email } : null;
      return { _id, image, nameOfProduct, userdata, createdAt, updatedAt };
    });

    res
      .status(200)
      .json({ results: updatedDocuments.length, paginationResult, data: updatedDocuments });
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
