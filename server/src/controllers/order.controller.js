import { isValidObjectId } from "mongoose";
import { ApiError, ApiResponse, asyncHandler, sendOrderConfirmationEmail } from "../utils/index.js";
import { User } from "../models/user.model.js";
import { OrderItem } from "../models/orderItem.model.js";
import { Order } from "../models/order.model.js";

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
        const { paymentStatus, orderStatus, paymentType, totalAmount, additionalInformation, razorPayOrderId, razorPayPaymentId, razorPaySignature } = req.body;
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
            razorPayOrderId,
            razorPayPaymentId,
            razorPaySignature,
        });

        try {
            await sendOrderConfirmationEmail(userData, newOrder, shippingAddress, paymentStatus);
        } catch (emailError) {
            console.error("❌ Email Sending Failed:", emailError);
            return res.status(200).json(new ApiResponse(200, { emailSent: false }, "Order Created, but Email Sending Failed"));
        }

        return res.status(200).json(new ApiResponse(200, {}, "Order Created Successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});

export { createOrder };
