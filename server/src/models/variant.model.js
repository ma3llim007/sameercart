import mongoose, { Schema } from "mongoose";

const variantSchema = new Schema(
    {
        sku: {
            type: String,
            unique: true,
            required: [true,"sku Is Required"],
            lowercase: true,
            trim: true,
        },
        priceAdjustment: {
            type: Number,
            required: [true,"priceAdjustment Is Required"],
            default: 0,
        },
        stockQty: {
            type: Number,
            required: [true,"stockQty Is Required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        images: {
            type: [String],
            required: [true,"Images Is Required"],
        },
        attributes: {
            type: Map,
            of: String,
            default: {},
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true,"addedBy Is Required"],
        },
    },
    { timestamps: true }
);

export const Variant = mongoose.model("Variant", variantSchema);
