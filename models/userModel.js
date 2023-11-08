const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  alias: String,
  details: String,
  phone: String,
  city: String,
  postalCode: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
    },

    profileImg: String,

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password should be at least 6 characters long"],
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },

    street: {
      type: String,
      required: [true, "Street is required"],
    },

    apartment: {
      type: String,
      required: [true, "Apartment is required"],
    },

    zip: {
      type: String,
      required: [true, "ZIP code is required"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
    },

    active: {
      type: Boolean,
      default: true,
    },

    // Child reference (one to many)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    addresses: [addressSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
