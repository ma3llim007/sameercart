import mongoose, { isValidObjectId } from "mongoose";
import { Order } from "../../models/order.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";
import { OrderItem } from "../../models/orderItem.model.js";

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

// Delete Order
const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId || orderId.trim() === "") {
            return res.status(422).json(new ApiError(422, "Order ID Is Required"));
        }

        if (!isValidObjectId(orderId)) {
            return res.status(400).json(new ApiError(400, "Invalid Order Id"));
        }

        // Find Order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json(new ApiError(404, "Order Not Found"));
        }

        // Prevent deletion if payment is completed
        if (order === "PayNow") {
            return res.status(422).json(new ApiError(422, "This Order Cannot Be Deleted Because The Payment Has Already Been Made."));
        }

        // Delete Order Items
        await OrderItem.deleteMany({ _id: { $in: order.orderItems } });
        // Delete Order
        await Order.deleteOne({ _id: orderId });

        return res.status(200).json(new ApiResponse(200, {}, "Order and Associated Order Items Deleted Successfully."));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Delte Order"));
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
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(orderId),
                },
            },
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
                    orderItems: {
                        _id: 1,
                        productName: 1,
                        price: 1,
                        quantity: 1,
                        totalPrice: 1,
                        variant: {
                            $let: {
                                vars: {
                                    matchedVariantIndex: {
                                        $indexOfArray: ["$orderItemsVariants._id", "$orderItems.variantId"],
                                    },
                                },
                                in: {
                                    _id: {
                                        $arrayElemAt: ["$orderItemsVariants._id", "$$matchedVariantIndex"],
                                    },
                                    sku: {
                                        $arrayElemAt: ["$orderItemsVariants.sku", "$$matchedVariantIndex"],
                                    },
                                    discountPrice: {
                                        $arrayElemAt: ["$orderItemsVariants.discountPrice", "$$matchedVariantIndex"],
                                    },
                                    attributes: {
                                        $arrayElemAt: ["$orderItemsVariants.attributes", "$$matchedVariantIndex"],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);
        console.log(orderData[0]);
        
        return res.status(200).json(new ApiResponse(200, orderData[0], "Order Fetch Successfully."));
    } catch (_error) {
        return res.status(200).json(new ApiError(200, "Something Went Wrong! While Fetch Order"));
    }
});

export { getOrder, deleteOrder, viewOrder };
