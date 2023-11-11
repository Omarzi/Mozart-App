const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minLength: [3, "Too short brand name"],
      maxLength: [32, "Too long brand name"],
    },
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
  { timestamps: true }
);

// const setImageURL = (doc) => {
//   // return image baseurl + image name
//   if (doc.image) {
//     const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
//     doc.image = imageUrl;
//   }
// };

// // Find All, Find One, Update
// brandSchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// // Create
// brandSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

module.exports = mongoose.model("Brand", brandSchema);
