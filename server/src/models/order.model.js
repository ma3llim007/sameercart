import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User Is Required"],
        },
        orderDate: {
            type: Date,
            default: Date.now,
            required: [true, "Order Date Is Required"],
        },
        shippingAddress: {
            street: {
                type: String,
                required: [true, "Street is required"],
                trim: true,
            },
            city: {
                type: String,
                required: [true, "City is required"],
                trim: true,
            },
            state: {
                type: String,
                required: [true, "State is required"],
                trim: true,
            },
            country: {
                type: String,
                required: [true, "Country is required"],
                trim: true,
            },
            zip_code: {
                type: String,
                required: [true, "Zip Code is required"],
            },
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            default: "Pending",
        },
        orderStatus: {
            type: String,
            enum: ["Pending", "Shipped", "Delivery", "Canceled"],
            default: "Pending",
        },
        paymentType: {
            type: String,
            enum: ["COD", "PayNow"],
            required: [true, "Payment Type Is Required"],
        },
        totalAmount: {
            type: Number,
            required: [true, "Total Amount is required"],
        },
        completeOrderdate: {
            type: Date,
        },
        orderItems: [
            {
                type: Schema.Types.ObjectId,
                ref: "OrderItem",
                required: [true, "Order Items Is Required"],
            },
        ],
        additionalInformation: {
            type: String,
            default: null,
        },
        razorPayOrderId: {
            type: String,
            default: null,
        },
        razorPayPaymentId: {
            type: String,
            default: null,
        },
        razorPaySignature: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
