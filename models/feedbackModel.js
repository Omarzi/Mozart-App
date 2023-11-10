// const mongoose = require("mongoose");

// const feedBackSchema = new mongoose.Schema(
//   {
//     feedback: {
//       type: String,
//       required: [true, "FeedBack Content is required"],
//       trim: true,
//     },
//     user: { type: mongoose.Schema.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// feedBackSchema.post("save", async (doc, next) => {
//   try {
//     await doc.populate("user").execPopulate();
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = mongoose.model("FeedBack", feedBackSchema);

const mongoose = require("mongoose");

const feedBackSchema = new mongoose.Schema(
  {
    feedback: {
      type: String,
      required: [true, "Feedback content is required"],
      trim: true,
    },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedBack", feedBackSchema);
