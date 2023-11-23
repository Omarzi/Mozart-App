const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    nameAr: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short category nameAr"],
      maxLength: [32, "Too long category nameAr"],
    },
    // A and  B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      url: { type: String, required: [true, "image url required"] },
      imageId: {
        type: String,
        required: [true, "image id required"],
      },
    },
  },
  // Created Two Fields Created at and Updated add
  { timestamps: true }
);

// const setImageURL = (doc) => {
//   // return image baseurl + image name
//   if (doc.image) {
//     const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
//     doc.image = imageUrl;
//   }
// };

// // Find All, Find One, Update
// categorySchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// // Create
// categorySchema.post("save", (doc) => {
//   setImageURL(doc);
// });

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
