const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    images: [String],
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  // return image baseurl + image name
  //   if (doc.images) {
  //     const imageUrl = `${process.env.BASE_URL}/banners/${doc.images}`;
  //     doc.images = imageUrl;
  //   }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/banners/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};

// Find All, Find One, Update
bannerSchema.post("init", (doc) => {
  setImageURL(doc);
});

// Create
bannerSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Banner", bannerSchema);
