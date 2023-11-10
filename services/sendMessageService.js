const factory = require("./handlersFactory");

const SendMessage = require("../models/sendMessageModel");

// @desc    Create message
// @route   POST  /api/v1/sendMessage
// @access  Private
exports.createMessage = factory.createOne(SendMessage);

exports.getAllMessages = factory.getAll(SendMessage);