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
            enum: ["Order", "Shipped", "Delivery", "CanceledByUser", "CanceledByAdmin"],
            default: "Order",
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
        orderShippingDate: {
            type: Date,
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
        },
        razorPayOrderId: {
            type: String,
        },
        razorPayPaymentId: {
            type: String,
        },
        razorPaySignature: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
