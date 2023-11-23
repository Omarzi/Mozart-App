const mongoose = require("mongoose");

const uploadImagesFromUserSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String, required: [true, "image url required"] },
      imageId: {
        type: String,
        required: [true, "image id required"],
      },
    },
    // image: {

    //   type: String,
    //   required: [true, "Image is required"],
    // },

    nameOfProduct: {
      type: String,
      required: [true, "Product Name is required"],
    },

    nameOfProductAr: {
      type: String,
      required: [true, "Product Name Ar is required"],
    },

    user: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// const setImageURL = (doc) => {
//   // return image baseurl + image name
//   if (doc.image) {
//     const imageUrl = `${process.env.BASE_URL}/images-from-user/${doc.image}`;
//     doc.image = imageUrl;
//   }
//   if (doc.images) {
//     const imageList = [];
//     doc.images.forEach((image) => {
//       const imageUrl = `${process.env.BASE_URL}/products/${image}`;
//       imageList.push(imageUrl);
//     });
//     doc.images = imageList;
//   }
// };

// Find All, Find One, Update
// uploadImagesFromUserSchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// Create
// uploadImagesFromUserSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

module.exports = mongoose.model(
  "UploadImageDromUser",
  uploadImagesFromUserSchema
);
