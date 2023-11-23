const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    
    titleAr: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product titleAr"],
      maxlength: [100, "Too long product titleAr"],
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    
    descriptionAr: {
      type: String,
      required: [true, "Product descriptionAr is required"],
      minlength: [20, "Too short product descriptionAr"],
    },
    
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    
    sold: {
      type: Number,
      default: 0,
    },
    
    priceNormal: {
      type: Number,
      required: [true, "Product priceNormal is required"],
      trim: true,
      max: [200000, "Too long product priceNormal"],
    },

    priceWholesale: {
      type: Number,
      required: [true, "Product priceWholesale is required"],
      trim: true,
      max: [800000, "Too long product priceWholesale"],
    },
    
    priceAfterDiscount: {
      type: Number,
    },
    
    colors: [String],

    // imageCover: {
    //   type: String,
    //   required: [true, "Product Image cover is required"],
    // },
    image: {
      url: { type: String, required: [true, "image url required"] },
      imageId: {
        type: String,
        required: [true, "image id required"],
      },
    },

    // images: [String],
    images: [
      {
        _id: false,
        url: { type: String },
        imageId: {
          type: String,
        },
      },
    ],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // To enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// This Lines similar => reviews: [{
//   type: mongoose.Schema.ObjectId,
//   ref: "Review
// }]
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

// const setImageURL = (doc) => {
//   // return image baseurl + image name
//   if (doc.imageCover) {
//     const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
//     doc.imageCover = imageUrl;
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

// // Find All, Find One, Update
// productSchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// // Create
// productSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

module.exports = mongoose.model("Product", productSchema);
