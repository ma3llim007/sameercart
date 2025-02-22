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
<<<<<<< HEAD
            enum: ["Order", "Shipping", "Delivery", "CanceledByUser", "CanceledByAdmin"],
            default: "Order",
=======
            enum: ["Pending", "Shipped", "Delivery", "CanceledByUser", "CanceledByAdmin"],
            default: "Pending",
>>>>>>> 334d90f (Don With RazarPay Payment Integration)
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
        orderCancelReason: {
            type: String,
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
