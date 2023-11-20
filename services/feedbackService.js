const express = require("express");
const User = require("../models/userModel");

const router = express.Router();
const FeedBack = require("../models/feedbackModel");
const authService = require("./authService");

const getUserData = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = await User.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    req.userData = userData;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/// Create Feedback from user (User)
router.post(
  "/:id",
  authService.protect,
  authService.allowedTo("user-wholesale", "user-normal"),
  getUserData,
  async (req, res) => {
    try {
      const { feedback } = req.body;
      const user = req.userData;

      const newFeedback = new FeedBack({
        feedback,
        user: user._id,
      });

      const savedFeedback = await newFeedback.save();

      return res.status(201).json({
        success: true,
        message: "Feedback created successfully",
        userData: user,
        feedbackData: savedFeedback,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

/// Get All Feedbacks (Admin - Manager)
router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("manager", "admin"),
    async (req, res) => {
      try {
        // Fetch all feedbacks from the database
        const allFeedbacks = await FeedBack.find().populate("user");

        // Return the feedbacks in the response
        res.status(200).json({
          success: true,
          data: allFeedbacks,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }
    }
  );

module.exports = router;
