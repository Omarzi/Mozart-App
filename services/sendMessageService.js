const factory = require("./handlersFactory"),
  getAll = require("./getAll");

const SendMessage = require("../models/sendMessageModel");

// @desc    Create message
// @route   POST  /api/v1/sendMessage
// @access  Private
exports.createMessage = factory.createOne(SendMessage);

exports.getAllMessages = getAll.getAll(SendMessage);
