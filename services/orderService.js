/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const ApiErrot = require("../utils/apiFeatures");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const User = require("../models/userModel");

// @desc    Create cash order
// @route   POST /api/v1/orders/:cartId
// @access  Prived/Protected/User
// exports.createCashOrder = asyncHandler(async (req, res, next) => {
//   // App settings (Admin make this data)
//   const taxPrice = 0;
//   const shippingPrice = 0;

//   // 1) Get cart depend on cartId
//   const cart = await Cart.findById(req.params.cartId);

//   if (!cart) {
//     return next(
//       new ApiError(`There is no cart with id ${req.params.cartId}`, 404)
//     );
//   }

//   // 2) Get order price depend on cart price "If coupon applied"
//   const cartPrice = cart.totalPriceAfterDiscount
//     ? cart.totalPriceAfterDiscount
//     : cart.totalCartPrice;

//   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

//   const allCart = await Order.find();
//   let number = allCart[allCart.length - 1].orderNumber;

//   number += 1;

//   // 3) Create order with default payment method "cash"
//   if (req.user.role === "user-wholesale") {
//     req.body.status = "confirm";
//   } else if (req.user.role === "user-normal") {
//     req.body.status = "in-progress";
//   } else {
//     req.body.status = "declined";
//   }
//   const order = await Order.create({
//     orderNumber: number,
//     user: req.user,
//     cartItems: cart.cartItems,
//     // shippingAddress: req.body.shippingAddress,
//     branchId: req.body.branchId,
//     totalOrderPrice,
//     status: req.body.status,
//   });

//   // 4) After creating order, decrement product quantity, icreament product sold
//   if (order) {
//     const bulkOption = cart.cartItems.map((item) => ({
//       updateOne: {
//         filter: { _id: item.product },
//         update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
//       },
//     }));
//     await Product.bulkWrite(bulkOption, {});

//     // 5) Clear cart depend on cartId
//     await Cart.findByIdAndDelete(req.params.cartId);
//   }

//   res.status(201).json({ status: "success", data: order });
// });
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

  // 3) Get the order number
  const allCart = await Order.find();
  let number = 1; // Default value if allCart is empty
  if (allCart.length > 0) {
    number = allCart[allCart.length - 1].orderNumber + 1;
  }

  // 4) Create order with default payment method "cash"
  let status;
  if (req.user.role === "user-wholesale") {
    status = "confirm";
  } else if (req.user.role === "user-normal") {
    status = "in-progress";
  } else {
    status = "declined";
  }
  const order = await Order.create({
    orderNumber: number,
    user: req.user,
    cartItems: cart.cartItems,
    // shippingAddress: req.body.shippingAddress,
    branchId: req.body.branchId,
    totalOrderPrice,
    status,
  });

  // 5) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 6) Clear cart based on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

// Filter Object
// exports.filterOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
//   //   if (req.params === "user-wholesale" || req.params === "user-normal")
//   //     req.userType = req.params;
//   //   next();
//   // });
//   const roleParam = req.query.role;
//   if (
//     roleParam &&
//     (roleParam === "user-wholesale" || roleParam === "user-normal")
//   ) {
//     req.filterObj = { "user.role": roleParam }; // Assuming user is a field in your Order model
//   } else if (
//     req.user.role === "user-wholesale" ||
//     req.user.role === "user-normal"
//   ) {
//     req.filterObj = { "user.role": req.user.role };
//   }

//   next();
// });
// @desc    Get all order
// @route   POST /api/v1/orders
// @access  Prived/Protected/User-Admin-Manager
// exports.findAllOrders = factory.getAll(Order);
// exports.findAllOrdersInOneBranch = asyncHandler(async (req, res, next) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const type = req.query.role;
//     const branchId = req.query.branchId;

//     const order = await Order.find();
//     let filtered;
//     console.log(req.query);
//     if (type || branchId) {
//       // eslint-disable-next-line no-shadow
//       filtered = order.filter((order) => order.user.role === type && order.branchId._id.toString() === branchId);
//     }

//     // console.log(order[0].branchId._id);
//     // if (branchId) {
//     //   // eslint-disable-next-line no-shadow
//     //   filtered = order.filter((order) => order.branchId._id.toString() === branchId);
//     // }

//     return res.status(200).json({ success: true, data: filtered || order });
//   } catch (e) {
//     throw e;
//   }
// });
exports.findAllOrdersInOneBranch = asyncHandler(async (req, res, next) => {
  try {
    const type = req.query.role;
    const branchId = req.query.branchId;

    const orders = await Order.find()
      .populate({
        path: "user",
        select: "name profileImg email phone role address lat lng",
      })
      .populate({
        path: "cartItems.product",
        select: "title titleAr image",
      })
      .populate({
        path: "branchId",
        select: "name profileImg email phone role address lat lng",
      })
      .sort({ createdAt: -1 }); // Sort by createdAt field in descending order

    let filtered;
    if (type || branchId) {
      filtered = orders.filter(
        (order) =>
          order.user.role === type && order.branchId._id.toString() === branchId
      );
    }

    return res.status(200).json({ success: true, data: filtered || orders });
  } catch (error) {
    return next(error);
  }
});

// exports.findAllOrdersInAdmin = asyncHandler(async (req, res, next) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const type = req.query.role;

//     const order = await Order.find();
//     let filtered;
//     console.log(req.query);
//     if (type) {
//       // eslint-disable-next-line no-shadow
//       filtered = order.filter((order) => order.user.role === type);
//     }

//     // console.log(order[0].branchId._id);
//     // if (branchId) {
//     //   // eslint-disable-next-line no-shadow
//     //   filtered = order.filter((order) => order.branchId._id.toString() === branchId);
//     // }

//     return res.status(200).json({ success: true, data: filtered || order });
//   } catch (e) {
//     throw e;
//   }
// });

exports.findAllOrdersInAdmin = asyncHandler(async (req, res, next) => {
  try {
    const type = req.query.role;

    const orders = await Order.find()
      .populate({
        path: "user",
        select: "name profileImg email phone role address lat lng",
      })
      .populate({
        path: "cartItems.product",
        select: "title titleAr image",
      })
      .populate({
        path: "branchId",
        select: "name profileImg email phone role address lat lng",
      })
      .sort({ createdAt: -1 }); // Sort by createdAt field in descending order

    let filtered;
    if (type) {
      filtered = orders.filter((order) => order.user.role === type);
    }

    return res.status(200).json({ success: true, data: filtered || orders });
  } catch (error) {
    return next(error);
  }
});

exports.findUserOrder = asyncHandler(async (req, res, next) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const userId = req.user.id;
    const order = await Order.find({ user: userId });

    return res.status(200).json({ success: true, data: order });
  } catch (e) {
    throw e;
  }
});

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

// @desc    Update order delivered status
// @route   PUT /api/v1/order/:id/changeOrderStatus
// @access  Prived/Protected/Admin-Manager
exports.changeStatusOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id :${req.params.id}`,
        404
      )
    );
  }

  order.status = "confirm";
  order.accepteddAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});
