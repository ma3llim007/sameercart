import mongoose, { isValidObjectId } from "mongoose";
import { Order } from "../../models/order.model.js";
import { ApiError, ApiResponse, asyncHandler, sendOrderStatusEmail } from "../../utils/index.js";
import { User } from "../../models/user.model.js";

// Get Orders
const getOrder = asyncHandler(async (req, res) => {
    try {
        const { orderStatus } = req.query;

        // Build match condition based on the query
        const matchCondition = {};
        if (orderStatus) {
            if (orderStatus === "Canceled") {
                matchCondition.orderStatus = { $in: ["CanceledByAdmin", "CanceledByUser"] };
            } else {
                matchCondition.orderStatus = orderStatus;
            }
        }
        const orders = await Order.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: 1,
                    shippingAddress: 1,
                    paymentStatus: 1,
                    orderStatus: 1,
                    paymentType: 1,
                    orderItems: 1,
                    orderDate: 1,
                    totalAmount: 1,
                    user: {
                        _id: "$user._id",
                        fullName: {
                            $concat: ["$user.firstName", " ", "$user.lastName"],
                        },
                    },
                },
            },
            {
                $sort: {
                    orderDate: -1,
                },
            },
        ]);

        if (!orders.length) {
            return res.status(200).json(new ApiResponse(200, {}, "No Product Found"));
        }

        return res.status(200).json(new ApiResponse(200, orders, "Order Fetch Successfully"));
    } catch (_error) {
        return res.status(200).json(new ApiError(200, "Something Went Wrong! While Fetch Order"));
    }
});

// View Order With OrderItem
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
            { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $set: {
                    user: {
                        $arrayElemAt: ["$user", 0],
                    },
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
                                                cond: { $eq: ["$$variant._id", "$orderItems.variantId"] },
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
                    user: { $first: "$user" },
                    shippingAddress: { $first: "$shippingAddress" },
                    paymentStatus: { $first: "$paymentStatus" },
                    orderStatus: { $first: "$orderStatus" },
                    paymentType: { $first: "$paymentType" },
                    totalAmount: { $first: "$totalAmount" },
                    orderDate: { $first: "$orderDate" },
                    additionalInformation: { $first: "$additionalInformation" },
                    orderShippingDate: { $first: "$orderShippingDate" },
                    orderCancelReason: { $first: "$orderCancelReason" },
                    completeOrderdate: { $first: "$completeOrderdate" },
                    orderItems: { $push: "$orderItems" },
                },
            },
            {
                $project: {
                    _id: 1,
                    user: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        username: 1,
                        phoneNumber: 1,
                    },
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

// New Order Actions
const newOrderAction = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(422).json(new ApiError(422, "Order ID is Required"));
    }

    if (!isValidObjectId(orderId)) {
        return res.status(404).json(new ApiError(404, "Invalid Order Id"));
    }

    try {
        const { orderStatus, orderShippingDate, orderCancelReason } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json(new ApiError(404, "Order Not Found"));
        }

        // Find User Email
        const user = await User.findById(order.userId).select("email");
        if (!user) {
            return res.status(404).json(new ApiError(404, "User Not Found Or Email Missing"));
        }

        // Check if at least one field is provided for update
        if (!orderStatus && !orderShippingDate && !orderCancelReason) {
            return res.status(400).json(new ApiError(400, "At least One Field (Order Status, Delivery Date, Or Cancellation Reason) is required for update"));
        }

        if (orderStatus) {
            order.orderStatus = orderStatus;
        }
        if (orderShippingDate) {
            order.orderShippingDate = orderShippingDate;
        }
        if (orderCancelReason) {
            order.orderCancelReason = orderCancelReason;
        }
        await order.save();

        // Send Email Notification
        try {
            if (orderStatus === "Shipping") {
                await sendOrderStatusEmail(user, order, {
                    title: "Your Order Has Been Start Shipping",
                    subtitle: "We're preparing your order for shipment. Stay tuned!",
                    emailSubject: "Order Accepted - SameerCart",
                });
            } else if (orderStatus === "CanceledByAdmin") {
                await sendOrderStatusEmail(user, order, {
                    title: "Your Order Has Been Canceled",
                    subtitle: `We're sorry, but your order has been canceled. Reason: ${orderCancelReason}`,
                    emailSubject: "Order Canceled - SameerCart",
                });
            }
        } catch (_emailError) {
            return res.status(200).json(new ApiResponse(200, { emailSent: false }, "Order Update Successfully, But Email Sending Failed"));
        }
        return res.status(200).json(new ApiResponse(200, order, "Order Update Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Updating The Order Actions"));
    }
});

// Shipping Order Actions
const shippingOrderAction = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(422).json(new ApiError(422, "Order ID is Required"));
    }

    if (!isValidObjectId(orderId)) {
        return res.status(404).json(new ApiError(404, "Invalid Order Id"));
    }

    try {
        const { orderStatus, completeOrderdate, paymentStatus } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json(new ApiError(404, "Order Not Found"));
        }

        // Find User Email
        const user = await User.findById(order.userId).select("email");
        if (!user) {
            return res.status(404).json(new ApiError(404, "User Not Found Or Email Missing"));
        }

        // Check if at least one field is provided for update
        if (!orderStatus && !completeOrderdate && !paymentStatus) {
            return res.status(400).json(new ApiError(400, "At Least One Field (Order Status, Complete Date Or Payment Status) Is Required For Update"));
        }

        if (orderStatus) {
            order.orderStatus = orderStatus;
        }
        if (completeOrderdate) {
            order.completeOrderdate = completeOrderdate;
        }
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        await order.save();
        try {
            await sendOrderStatusEmail(user, order, {
                title: "Your Order Successfully Delivered To You",
                subtitle: "We're preparing your order for shipment. Stay tuned!",
                emailSubject: "Order Completed - SameerCart",
            });
        } catch (_emailError) {
            return res.status(200).json(new ApiResponse(200, { emailSent: false }, "Order Update Successfully, But Email Sending Failed"));
        }
        return res.status(200).json(new ApiResponse(200, order, "Order Update Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Updating The Order Actions"));
    }
});

export { getOrder, viewOrder, newOrderAction, shippingOrderAction };
