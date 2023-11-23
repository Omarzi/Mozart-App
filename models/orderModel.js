const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      unique: true,
      type: Number,
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must be belongs to user"],
    },

    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],

    taxPrice: {
      type: Number,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    totalOrderPrice: {
      type: Number,
    },

    // shippingAddress: {
    //   details: String,
    //   phone: String,
    //   city: String,
    //   postalCode: String,
    // },

    branchId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Branch Name is required"],
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },

    managerId: mongoose.Schema.ObjectId,

    deliveredAt: Date,

    status: {
      type: String,
      enum: ["confirm", "in-progress", "declined"],
    },

    accepteddAt: Date,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone role address lat lng",
  })
    .populate({
      path: "cartItems.product",
      select: "title image",
    })
    .populate({
      path: "branchId",
      select: "name profileImg email phone role address lat lng",
    });

  next();
});

module.exports = mongoose.model("Order", orderSchema);
