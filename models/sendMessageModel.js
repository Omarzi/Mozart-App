const mongoose = require("mongoose");

const sendMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    messageContent: {
      type: String,
      required: [true, "Message   Content is required"],
      trim: true,
    },

    user: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SendMessage", sendMessageSchema);
