const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  activeLoggedUserData,
} = require("../services/userService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  uploadUserImage,
  resizeImage,
  updateLoggedUserPassword
);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);
router.post("/addMe", activeLoggedUserData);

// Admin
// router.use();
router
  .route("/")
  .get(getUsers, authService.allowedTo("user", "manager", "admin"))
  .post(uploadUserImage, resizeImage, createUserValidator, authService.allowedTo("admin", "manager"), createUser);
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  authService.allowedTo("admin", "manager"),
  changeUserPassword
);
router
  .route("/:id")
  .get(getUserValidator, authService.allowedTo("admin", "manager"), getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, authService.allowedTo("admin", "manager"), updateUser)
  .delete(deleteUserValidator, authService.allowedTo("admin", "manager"), deleteUser);

module.exports = router;
