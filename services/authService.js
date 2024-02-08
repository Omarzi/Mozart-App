const crypto = require("crypto");

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");
const { sanatizeUser } = require("../utils/sanatizeData");
const { sendSMS } = require("../config/sendSMS");

const User = require("../models/userModel");

// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
// exports.signup = asyncHandler(async (req, res, next) => {
//   // 1) Create User
//   if (req.body.role === "manager" || req.body.role === "admin") {
//     return next(new ApiError("You must be a manager or a admin.", 400));
//   }
//   const user = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     phone: req.body.phone,
//     profileImg: req.body.profileImg,
//     lat: req.body.lat,
//     lng: req.body.lng,
//     address: req.body.address,
//     role: req.body.role,
//   });

//   // Delete password from response
//   delete user._doc.password;

//   const payLoad = {
//     userId: user._id,
//     active: user.active,
//   };

//   //2) Generate token
//   const token = createToken(payLoad);

//   res.status(201).json({ data: sanatizeUser(user), token });
// });
exports.signup = asyncHandler(async (req, res, next) => {
  let active = false; // Default to false for wholesale users
  if (req.body.role === "manager" || req.body.role === "admin") {
    return next(new ApiError("You must be a manager or an admin.", 400));
  }

  // If the role is not "user-wholesale", set active to true
  if (req.body.role !== "user-wholesale") {
    active = true;
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    profileImg: req.body.profileImg,
    lat: req.body.lat,
    lng: req.body.lng,
    address: req.body.address,
    role: req.body.role,
    active: active,
  });

  // Delete password from response
  delete user._doc.password;

  const payLoad = {
    userId: user._id,
    active: user.active,
  };

  // Generate token
  const token = createToken(payLoad);

  res.status(201).json({ data: sanatizeUser(user), token });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)

  // 2) check if user exist & check password is correct
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const payLoad = {
    userId: user._id,
    active: user.active,
    // enablePermission: user.enablePermission,
  };

  // console.log(user.enablePermission);

  // 3) generate token
  const token = createToken(payLoad);

  // Delete password from response
  delete user._doc.password;

  // 4) send response to client side
  res.status(200).json({ data: sanatizeUser(user), token });
});

// @ desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exists, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, please login to get access  this route",
        401
      )
    );
  }

  // 2) verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong tp this token does no longer exist",
        401
      )
    );
  }

  if (decoded.active === false && currentUser.role === "user-wholesale") {
    return next(new ApiError("The user is not activated", 401));
  }

  // 4) check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  // 5) check if user activate or not activate
  if (currentUser.active === false) {
    return next(
      new ApiError(
        "User not active. please go to settings to activate your email..",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// (Clogars) ...roles => ['admin] or ['user']
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }

    // if (req.user.enablePermission === false && req.user.role === "manager") {
    //   return next(
    //     new ApiError(
    //       "The manager is not add any products or categories or some permissions",
    //       401
    //     )
    //   );
    // }
    next();
  });

// @desc    Forget Password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  if (!user) {
    return next(
      new ApiError(
        `There is no user with this email or this phone ${
          req.body.email || req.body.phone
        }`,
        404
      )
    );
  }

  // 2) If user is exist, Generate hsash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expriration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  user.save();

  const message = `Hi ${user.name},\nWe received a reset the password on your Mozart Account.\n${resetCode}\nEnter this code to complete your reset.\nThanks for helping us keep your account secure.\nThe Mozart Team`;

  if (req.body.phone) {
    await sendSMS(message, req.body.phone);
    res
      .status(200)
      .json({ status: "Success", message: "Rest code send to phone" });
  }

  // 3) Send the reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Rest code send to email" });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valide
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });
  if (!user) {
    return next(
      new ApiError(
        `There is no user with email or with phone ${
          req.body.email || req.body.phone
        }`,
        404
      )
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) If everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
