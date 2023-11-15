const express = require("express");

const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrdersForLoggedUser,
  updateOrderToPay,
  updateOrderToDelivered,
  changeStatusOrder,
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
  "/",
  authService.allowedTo("admin", "manager", "user-wholesale", "user-normal"),
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
router.put(
  "/:id/changeOrderStatus",
  authService.allowedTo("admin", "manager"),
  changeStatusOrder 
);

module.exports = router;
