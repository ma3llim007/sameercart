import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "product Id Is Required"],
        },
        couponAmount: {
            type: Number,
            required: [true, "Coupon Amount Is Required"],
            default: 0,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true,"AddedBy Is Required"],
        },
    },
    { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
