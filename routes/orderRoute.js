const express = require("express");

const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrdersForLoggedUser,
  updateOrderToPay,
  updateOrderToDelivered,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);
router.get(
  "/",
  authService.allowedTo("admin", "manager", "user"),
  filterOrdersForLoggedUser,
  findAllOrders
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

module.exports = router;
