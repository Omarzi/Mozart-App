const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minLength: [2, "To short SubCategory name"],
      maxLength: [32, "to long SubCategory name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to parent category"],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
