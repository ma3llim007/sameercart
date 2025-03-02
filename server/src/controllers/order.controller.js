import mongoose, { isValidObjectId } from "mongoose";
import { ApiError, ApiResponse, asyncHandler, sendOrderConfirmationEmail } from "../utils/index.js";
import { User } from "../models/user.model.js";
import { OrderItem } from "../models/orderItem.model.js";
import { Order } from "../models/order.model.js";
import RazorpayInstance from "../config/razorpayInstance.js";
import crypto from "crypto";

// Create Order By Cash On Delivery
const createOrder = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    if (!isValidObjectId(userId)) {
        return res.status(404).json(new ApiError(404, "Invalid User Id"));
    }

    const userData = await User.findById(userId);
    if (!userData) {
        return res.status(404).json(new ApiError(404, "User Not Found"));
    }
    try {
        const { paymentStatus, orderStatus, paymentType, totalAmount, additionalInformation } = req.body;
        const shippingAddress = JSON.parse(req.body.shippingAddress);
        const orderItems = JSON.parse(req.body.orderItems);

        if (!userId || !shippingAddress || !paymentStatus || !orderStatus || orderItems.length === 0) {
            return res.status(404).json(new ApiError(404, "Missing Required Fields"));
        }

        // Create Order Items
        const savedOrderItems = await Promise.all(
            orderItems.map(async (item) => {
                return await OrderItem.create({
                    productName: item.productName,
                    price: item.price,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    productId: item.productId,
                    variantId: item.variantId || null,
                });
            })
        );
        const orderItemIds = savedOrderItems.map((orderItems) => orderItems._id);

        // Create & Save Order
        const newOrder = await Order.create({
            userId,
            shippingAddress,
            paymentStatus,
            orderStatus,
            paymentType,
            totalAmount,
            orderItems: orderItemIds,
            additionalInformation,
        });

        try {
            await sendOrderConfirmationEmail(userData, newOrder, shippingAddress, paymentStatus);
        } catch (_emailError) {
            return res.status(200).json(new ApiResponse(200, { emailSent: false }, "Order Created, but Email Sending Failed"));
        }

        return res.status(200).json(new ApiResponse(200, {}, "Order Created Successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});

// Creating the Create Order
const createOrderRazorPay = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    if (!isValidObjectId(userId)) {
        return res.status(404).json(new ApiError(404, "Invalid User Id"));
    }

    const userData = await User.findById(userId);
    if (!userData) {
        return res.status(404).json(new ApiError(404, "User Not Found"));
    }

    const { totalAmount } = req.body;
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json(new ApiError(400, "Invalid or Missing Amount"));
    }

    try {
        // Prepare Razorpay order options
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `order_rcptid_${userId}`,
        };
        const razorpayOrder = await RazorpayInstance.orders.create(options);
        if (!razorpayOrder) {
            return res.status(500).json(new ApiError(500, "Failed To Create Razorpay Order"));
        }

        return res.status(200).json(new ApiResponse(200, razorpayOrder, "Razorpay Order Created Successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Something Went Wrong While Generating Razorpay Order"));
    }
});

// Verify Payment
const verifyRazorPayPayment = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { paymentStatus, orderStatus, paymentType, totalAmount, additionalInformation, razorPayOrderId, razorPayPaymentId, razorPaySignature } = req.body;
    const shippingAddress = JSON.parse(req.body.shippingAddress);
    const orderItems = JSON.parse(req.body.orderItems);
    // Creating HMAC Object
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorPayOrderId}|${razorPayPaymentId}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorPaySignature) {
        return res.status(400).json(new ApiError(400, "Payment Not Verified"));
    }

    // Create Order Items
    let savedOrderItems;
    try {
        savedOrderItems = await Promise.all(
            orderItems.map(async (item) => {
                return await OrderItem.create({
                    productName: item.productName,
                    price: item.price,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    productId: item.productId,
                    variantId: item.variantId || null,
                });
            })
        );
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Failed To Create Order Items"));
    }
    const orderItemIds = savedOrderItems.map((orderItems) => orderItems._id);

    // Create & Save Order
    let newOrder;
    try {
        newOrder = await Order.create({
            userId,
            shippingAddress,
            paymentStatus,
            orderStatus,
            paymentType,
            totalAmount,
            orderItems: orderItemIds,
            additionalInformation,
            razorPayOrderId,
            razorPayPaymentId,
            razorPaySignature,
        });
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Failed To Create Order"));
    }
    // Send Order Confirmation Email

    try {
        await sendOrderConfirmationEmail(req.user, newOrder, shippingAddress, paymentStatus);
    } catch (_emailError) {
        return res.status(200).json(new ApiResponse(200, { emailSent: false }, "Order Created, But Email Sending Failed"));
    }

    return res.status(200).json(new ApiResponse(200, {}, "Order Created Successfully"));
});

// Get Orders By User
const getOrderByUser = asyncHandler(async (req, res) => {
    try {
        const { _id: userId } = req.user;
        if (!isValidObjectId(userId)) {
            return res.status(404).json(new ApiError(404, "Invalid User Id"));
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json(new ApiError(404, "User Not Found"));
        }

        const orders = await Order.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "orderItems",
                    foreignField: "_id",
                    as: "orderItems",
                },
            },
            {
                $sort: {
                    orderDate: -1,
                },
            },
            {
                $project: {
                    _id: 1,
                    orderDate: 1,
                    orderStatus: 1,
                    totalAmount: 1,
                    orderItemCount: { $size: "$orderItems" },
                    paymentType: 1,
                    paymentStatus: 1,
                },
            },
        ]);

        return res.status(200).json(new ApiResponse(200, orders, "User Orders Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong While Fetching User Order"));
    }
});

// Get Order By Order ID
const viewOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId || orderId.trim() === "") {
            return res.status(422).json(new ApiError(422, "Order ID Is Required"));
        }

        if (!isValidObjectId(orderId)) {
            return res.status(400).json(new ApiError(400, "Invalid Order Id"));
        }

        const orderData = await Order.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(orderId),
                },
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "orderItems",
                    foreignField: "_id",
                    as: "orderItems",
                },
            },
            {
                $lookup: {
                    from: "variants",
                    localField: "orderItems.variantId",
                    foreignField: "_id",
                    as: "orderItemsVariants",
                },
            },
            {
                $unwind: {
                    path: "$orderItems",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $set: {
                    orderItems: {
                        $mergeObjects: [
                            "$orderItems",
                            {
                                variant: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$orderItemsVariants",
                                                as: "variant",
                                                cond: {
                                                    $eq: ["$$variant._id", "$orderItems.variantId"],
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                            },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: "$_id",
                    shippingAddress: {
                        $first: "$shippingAddress",
                    },
                    paymentStatus: { $first: "$paymentStatus" },
                    orderStatus: { $first: "$orderStatus" },
                    paymentType: { $first: "$paymentType" },
                    totalAmount: { $first: "$totalAmount" },
                    orderDate: { $first: "$orderDate" },
                    additionalInformation: {
                        $first: "$additionalInformation",
                    },
                    orderShippingDate: {
                        $first: "$orderShippingDate",
                    },
                    orderCancelReason: {
                        $first: "$orderCancelReason",
                    },
                    completeOrderdate: {
                        $first: "$completeOrderdate",
                    },
                    orderItems: { $push: "$orderItems" },
                },
            },
            {
                $project: {
                    _id: 1,
                    shippingAddress: 1,
                    paymentStatus: 1,
                    orderStatus: 1,
                    paymentType: 1,
                    totalAmount: 1,
                    orderDate: 1,
                    additionalInformation: 1,
                    orderShippingDate: 1,
                    orderCancelReason: 1,
                    completeOrderdate: 1,
                    orderItems: {
                        _id: 1,
                        productName: 1,
                        productId: 1,
                        price: 1,
                        quantity: 1,
                        totalPrice: 1,
                        variant: {
                            _id: 1,
                            sku: 1,
                            discountPrice: 1,
                            attributes: 1,
                        },
                        createdAt: 1,
                    },
                },
            },
        ]);

        return res.status(200).json(new ApiResponse(200, orderData[0], "Order Fetch Successfully."));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetch Order"));
    }
});

export { createOrder, createOrderRazorPay, verifyRazorPayPayment, getOrderByUser, viewOrder };
