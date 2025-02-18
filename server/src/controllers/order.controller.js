import { isValidObjectId } from "mongoose";
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
        const { paymentStatus, orderStatus, paymentType, totalAmount, additionalInformation, shippingAddress, orderItems } = req.body;
        // const shippingAddress = JSON.parse(req.body.shippingAddress);
        // const orderItems = JSON.parse(req.body.orderItems);

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
    if (!totalAmount) {
        return res.status(400).json(new ApiError(400, "Missing Required Fields"));
    }
    try {
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
    console.log(req.body);
    const { orderId, paymentId, signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Creating HMAC Object
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${orderId} | ${paymentId}`);
    const generateSignature = hmac.digest("hex");

    if (generateSignature === signature) {
        return res.status(200).json(new ApiResponse(200, {}, "Payment Verified"));
    } else {
        return res.status(400).json(new ApiResponse(400, "Payment Not Verified"));
    }
});

export { createOrder, createOrderRazorPay, verifyRazorPayPayment };
