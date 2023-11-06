const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const ApiErrot = require("../utils/apiFeatures");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const ApiError = require("../utils/apiError");

// @desc    Create cash order
// @route   POST /api/v1/orders/:cartId
// @access  Prived/Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // App settings (Admin make this data)
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(
      new ApiError(`There is no cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "If coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method "cash"
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, icreament product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

// Filter Object
exports.filterOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc    Get all order
// @route   POST /api/v1/orders
// @access  Prived/Protected/User-Admin-Manager
exports.findAllOrders = factory.getAll(Order);

// @desc    Get specific order
// @route   POST /api/v1/order/:orderId
// @access  Prived/Protected/User-Admin-Manager
exports.findSpecificOrder = factory.getOne(Order);

// @desc    Update order paid status to paid
// @route   PUT /api/v1/order/:id/pay
// @access  Prived/Protected/Admin-Manager
exports.updateOrderToPay = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id :${req.params.id}`,
        404
      )
    );
  }

  // Update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/order/:id/deliverer
// @access  Prived/Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(
        new ApiError(
          `There is no such a order with this id :${req.params.id}`,
          404
        )
      );
    }
  
    // Update order to paid
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  
    const updatedOrder = await order.save();
  
    res.status(200).json({ status: "success", data: updatedOrder });
  });
  
