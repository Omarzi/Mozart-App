const express = require("express");

const {
  createCashOrder,
  findAllOrdersInOneBranch,
  findSpecificOrder,
  // filterOrdersForLoggedUser,
  updateOrderToPay,
  updateOrderToDelivered,
  changeStatusOrder,
  findUserOrder,
  findAllOrdersInAdmin,
  findAllBranchOrders,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router
  .route("/:cartId")
  .post(
    authService.allowedTo("user-wholesale", "user-normal"),
    createCashOrder
  );
router.get(
  "/branch",
  authService.allowedTo("manager", "admin"),
  // filterOrdersForLoggedUser,
  findAllOrdersInOneBranch
);
router.get("/", authService.allowedTo("admin"), findAllOrdersInAdmin);

router.get(
  "/myOrders",
  authService.allowedTo("user-wholesale", "user-normal"),
  findUserOrder
);

router.get("/:id", findSpecificOrder);

router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPay
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);
router.put(
  "/:id/changeOrderStatus",
  authService.allowedTo("admin", "manager"),
  changeStatusOrder
);

module.exports = router;
